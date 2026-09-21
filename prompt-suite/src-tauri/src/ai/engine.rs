use std::str::FromStr;

use futures::StreamExt;
use keyring::Entry;
use serde_json;

use super::providers::get_provider_info;
use super::types::{Message, Provider};

pub const AI_REQUEST_TIMEOUT_SECS: u64 = 300;
pub(crate) const ANTHROPIC_MAX_TOKENS: u32 = 8192;
pub(crate) const MAX_STREAM_SIZE: usize = 262_144;

#[allow(async_fn_in_trait, clippy::too_many_arguments)]
pub trait AiEngine: Send + Sync {
    async fn call_ai(
        &self,
        provider: &str,
        endpoint: &str,
        model: &str,
        messages: Vec<Message>,
        temperature: f32,
        num_ctx: u32,
        api_key: Option<String>,
    ) -> Result<String, String>;

    async fn call_ai_stream(
        &self,
        provider: &str,
        endpoint: &str,
        model: &str,
        messages: Vec<Message>,
        temperature: f32,
        num_ctx: u32,
        api_key: Option<String>,
    ) -> Result<String, String>;

    async fn stream_tokens(
        &self,
        provider: &str,
        endpoint: &str,
        model: &str,
        messages: Vec<Message>,
        temperature: f32,
        num_ctx: u32,
        api_key: Option<String>,
        on_token: impl FnMut(&str) + Send + 'static,
    ) -> Result<(), String>;
}

pub struct DefaultAiEngine {
    pub client: reqwest::Client,
}

impl Default for DefaultAiEngine {
    fn default() -> Self {
        Self::new()
    }
}

impl DefaultAiEngine {
    pub fn new() -> Self {
        Self {
            client: reqwest::Client::builder()
                .timeout(std::time::Duration::from_secs(AI_REQUEST_TIMEOUT_SECS))
                .redirect(reqwest::redirect::Policy::none())
                .build()
                .expect("Failed to create HTTP client"),
        }
    }

    pub async fn resolve_api_key(
        &self,
        provider: &str,
        api_key: Option<String>,
        required: bool,
    ) -> Result<Option<String>, String> {
        if let Some(key) = api_key {
            if !key.is_empty() {
                return Ok(Some(key));
            }
        }

        let info = get_provider_info(provider);
        let info = match info {
            Some(i) => i,
            None => {
                if required {
                    return Err(format!("Unknown provider: {}", provider));
                }
                return Ok(None);
            }
        };

        if info.keyring_suffix.is_empty() {
            if required && info.needs_api_key {
                return Err(format!("{} API key is required", info.name));
            }
            return Ok(None);
        }

        let service = format!("prompt-suite-ia:{}", info.keyring_suffix);
        let entry = Entry::new(&service, "api_key").map_err(|e| e.to_string())?;
        let password = tokio::task::spawn_blocking(move || entry.get_password())
            .await
            .map_err(|e| e.to_string())?
            .ok();

        if required && password.is_none() {
            return Err(format!("{} API key is required", info.name));
        }

        Ok(password)
    }

    pub async fn resolve_api_key_or_empty(
        &self,
        provider: &str,
        api_key: Option<String>,
        default_empty: bool,
    ) -> String {
        match self.resolve_api_key(provider, api_key, false).await {
            Ok(Some(key)) => key,
            _ if default_empty => String::new(),
            _ => String::new(),
        }
    }

    pub(crate) fn sanitize_error(status: reqwest::StatusCode, body: String) -> String {
        if cfg!(debug_assertions) {
            format!("API error {}: {}", status.as_u16(), body)
        } else {
            format!(
                "API error {}. Check your API key and model configuration.",
                status.as_u16()
            )
        }
    }

    #[allow(dead_code)] // kept for non-incremental SSE accumulation; streaming uses engine-level parsers
    pub(crate) async fn parse_sse_stream(
        &self,
        res: reqwest::Response,
        content_field: &[&str],
    ) -> Result<String, String> {
        let mut full_content = String::new();
        let mut stream = res.bytes_stream();

        while let Some(chunk) = stream.next().await {
            let bytes = chunk.map_err(|e| e.to_string())?;
            let text = String::from_utf8_lossy(&bytes);
            for line in text.lines() {
                let line = line.trim();
                if line.is_empty() || line == "data: [DONE]" {
                    continue;
                }
                if let Some(data) = line.strip_prefix("data: ") {
                    if let Ok(json) = serde_json::from_str::<serde_json::Value>(data) {
                        let mut value = &json;
                        for field in content_field {
                            value = match value.get(*field) {
                                Some(v) => v,
                                None => break,
                            };
                        }
                        if let Some(text) = value.as_str() {
                            full_content.push_str(text);
                        }
                    }
                }
            }
            if full_content.len() > MAX_STREAM_SIZE {
                return Err(format!(
                    "Stream response exceeds maximum size of {} chars (CWE-400 mitigation)",
                    MAX_STREAM_SIZE
                ));
            }
        }
        Ok(full_content)
    }

    pub fn validate_provider(&self, provider_str: &str) -> Result<Provider, String> {
        Provider::from_str(provider_str).map_err(|e| format!("{}: {}", e, provider_str))
    }
}

impl AiEngine for DefaultAiEngine {
    async fn call_ai(
        &self,
        provider: &str,
        endpoint: &str,
        model: &str,
        messages: Vec<Message>,
        temperature: f32,
        num_ctx: u32,
        api_key: Option<String>,
    ) -> Result<String, String> {
        let provider_enum = self.validate_provider(provider)?;
        match provider_enum {
            Provider::Ollama => {
                self.call_ollama(endpoint, model, messages, temperature, num_ctx, api_key)
                    .await
            }
            Provider::Anthropic => {
                self.call_anthropic(endpoint, model, messages, temperature, api_key)
                    .await
            }
            Provider::Gemini => {
                self.call_gemini(model, messages, temperature, api_key)
                    .await
            }
            _ => {
                let info = get_provider_info(provider)
                    .ok_or_else(|| format!("Unknown provider: {}", provider))?;
                self.call_openai_compatible(
                    provider,
                    endpoint,
                    model,
                    messages,
                    temperature,
                    api_key,
                    &info.api_path,
                )
                .await
            }
        }
    }

    async fn call_ai_stream(
        &self,
        provider: &str,
        endpoint: &str,
        model: &str,
        messages: Vec<Message>,
        temperature: f32,
        num_ctx: u32,
        api_key: Option<String>,
    ) -> Result<String, String> {
        let provider_enum = self.validate_provider(provider)?;
        match provider_enum {
            Provider::Ollama => {
                self.stream_ollama(endpoint, model, messages, temperature, num_ctx, api_key)
                    .await
            }
            Provider::Anthropic | Provider::Gemini => {
                self.call_ai(
                    provider,
                    endpoint,
                    model,
                    messages,
                    temperature,
                    num_ctx,
                    api_key,
                )
                .await
            }
            _ => {
                let info = get_provider_info(provider)
                    .ok_or_else(|| format!("Unknown provider: {}", provider))?;
                self.stream_openai_compatible(
                    provider,
                    endpoint,
                    model,
                    messages,
                    temperature,
                    api_key,
                    &info.api_path,
                )
                .await
            }
        }
    }

    async fn stream_tokens(
        &self,
        provider: &str,
        endpoint: &str,
        model: &str,
        messages: Vec<Message>,
        temperature: f32,
        num_ctx: u32,
        api_key: Option<String>,
        mut on_token: impl FnMut(&str) + Send + 'static,
    ) -> Result<(), String> {
        let provider_enum = self.validate_provider(provider)?;
        match provider_enum {
            Provider::Ollama => {
                self.stream_ollama_tokens(
                    endpoint,
                    model,
                    messages,
                    temperature,
                    num_ctx,
                    api_key,
                    &mut on_token,
                )
                .await
            }
            Provider::Anthropic | Provider::Gemini => {
                let text = self
                    .call_ai(
                        provider,
                        endpoint,
                        model,
                        messages,
                        temperature,
                        num_ctx,
                        api_key,
                    )
                    .await?;
                on_token(&text);
                Ok(())
            }
            _ => {
                let info = get_provider_info(provider)
                    .ok_or_else(|| format!("Unknown provider: {}", provider))?;
                self.stream_openai_compatible_tokens(
                    provider,
                    endpoint,
                    model,
                    messages,
                    temperature,
                    api_key,
                    &info.api_path,
                    &mut on_token,
                )
                .await
            }
        }
    }
}
