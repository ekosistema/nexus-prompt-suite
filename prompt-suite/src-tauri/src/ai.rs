#![allow(dead_code)]

use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Deserialize, Serialize, PartialEq)]
pub struct Message {
    pub role: String,
    pub content: String,
}

#[derive(Clone, Debug, Serialize)]
pub struct ProviderInfo {
    pub id: String,
    pub name: String,
    pub icon: String,
    pub default_url: String,
    pub default_models: Vec<String>,
    pub needs_api_key: bool,
    pub supports_api_key: bool,
    pub keyring_suffix: String,
    pub api_path: String,
    pub models_endpoint: String,
    pub is_openai_compat: bool,
    pub description: String,
    pub cost_tier: String,
}

pub fn all_providers() -> Vec<ProviderInfo> {
    vec![
        ProviderInfo {
            id: "ollama".into(),
            name: "Ollama (Local)".into(),
            icon: "🖥️".into(),
            default_url: "http://localhost:11434".into(),
            default_models: vec!["llama3".into()],
            needs_api_key: false,
            supports_api_key: false,
            keyring_suffix: "".into(),
            api_path: "/api/chat".into(),
            models_endpoint: "/api/tags".into(),
            is_openai_compat: false,
            description: "100% local, private, no API key needed".into(),
            cost_tier: "free".into(),
        },
        ProviderInfo {
            id: "openai".into(),
            name: "OpenAI".into(),
            icon: "🌐".into(),
            default_url: "https://api.openai.com".into(),
            default_models: vec!["gpt-4o".into(), "gpt-4o-mini".into(), "o1".into()],
            needs_api_key: true,
            supports_api_key: true,
            keyring_suffix: "openai_key".into(),
            api_path: "/v1/chat/completions".into(),
            models_endpoint: "/v1/models".into(),
            is_openai_compat: true,
            description: "Official GPT-4o, o1 models".into(),
            cost_tier: "$$$".into(),
        },
        ProviderInfo {
            id: "openrouter".into(),
            name: "OpenRouter".into(),
            icon: "🔀".into(),
            default_url: "https://openrouter.ai".into(),
            default_models: vec!["openai/gpt-4o".into(), "anthropic/claude-3.5-sonnet".into()],
            needs_api_key: true,
            supports_api_key: true,
            keyring_suffix: "openrouter_key".into(),
            api_path: "/api/v1/chat/completions".into(),
            models_endpoint: "/api/v1/models".into(),
            is_openai_compat: true,
            description: "200+ models, multi-provider hub".into(),
            cost_tier: "$$".into(),
        },
        ProviderInfo {
            id: "groq".into(),
            name: "Groq".into(),
            icon: "⚡".into(),
            default_url: "https://api.groq.com/openai".into(),
            default_models: vec!["llama-3.1-70b-versatile".into(), "llama-3.1-8b-instant".into(), "mixtral-8x7b-32768".into()],
            needs_api_key: true,
            supports_api_key: true,
            keyring_suffix: "groq_key".into(),
            api_path: "/v1/chat/completions".into(),
            models_endpoint: "/openai/v1/models".into(),
            is_openai_compat: true,
            description: "Ultra-fast inference, LPU-powered".into(),
            cost_tier: "$".into(),
        },
        ProviderInfo {
            id: "lm_studio".into(),
            name: "LM Studio".into(),
            icon: "🎬".into(),
            default_url: "http://localhost:1234".into(),
            default_models: vec![],
            needs_api_key: false,
            supports_api_key: false,
            keyring_suffix: "".into(),
            api_path: "/v1/chat/completions".into(),
            models_endpoint: "/v1/models".into(),
            is_openai_compat: true,
            description: "Local models via OpenAI-compatible API".into(),
            cost_tier: "free".into(),
        },
        ProviderInfo {
            id: "openwebui".into(),
            name: "OpenWebUI".into(),
            icon: "🌊".into(),
            default_url: "http://localhost:8080".into(),
            default_models: vec![],
            needs_api_key: false,
            supports_api_key: false,
            keyring_suffix: "".into(),
            api_path: "/v1/chat/completions".into(),
            models_endpoint: "/v1/models".into(),
            is_openai_compat: true,
            description: "Self-hosted OpenAI-compatible UI".into(),
            cost_tier: "free".into(),
        },
        ProviderInfo {
            id: "vllm".into(),
            name: "vLLM".into(),
            icon: "🚀".into(),
            default_url: "http://localhost:8000".into(),
            default_models: vec![],
            needs_api_key: false,
            supports_api_key: false,
            keyring_suffix: "".into(),
            api_path: "/v1/chat/completions".into(),
            models_endpoint: "/v1/models".into(),
            is_openai_compat: true,
            description: "High-throughput LLM serving engine".into(),
            cost_tier: "free".into(),
        },
        ProviderInfo {
            id: "together".into(),
            name: "Together AI".into(),
            icon: "🤝".into(),
            default_url: "https://api.together.xyz".into(),
            default_models: vec!["meta-llama/Llama-3.1-70B-Instruct-Turbo".into(), "mistralai/Mixtral-8x7B-Instruct-v0.1".into()],
            needs_api_key: true,
            supports_api_key: true,
            keyring_suffix: "together_key".into(),
            api_path: "/v1/chat/completions".into(),
            models_endpoint: "/v1/models".into(),
            is_openai_compat: true,
            description: "Open-source models at scale".into(),
            cost_tier: "$".into(),
        },
        ProviderInfo {
            id: "anthropic".into(),
            name: "Anthropic (Claude)".into(),
            icon: "🧠".into(),
            default_url: "https://api.anthropic.com".into(),
            default_models: vec!["claude-sonnet-4-20250514".into(), "claude-opus-4-20250514".into(), "claude-3-5-haiku-20241022".into()],
            needs_api_key: true,
            supports_api_key: true,
            keyring_suffix: "anthropic_key".into(),
            api_path: "/v1/messages".into(),
            models_endpoint: "".into(),
            is_openai_compat: false,
            description: "Claude Sonnet, Opus, Haiku".into(),
            cost_tier: "$$$".into(),
        },
        ProviderInfo {
            id: "gemini".into(),
            name: "Google Gemini".into(),
            icon: "💎".into(),
            default_url: "https://generativelanguage.googleapis.com".into(),
            default_models: vec!["gemini-2.0-flash".into(), "gemini-2.5-pro".into()],
            needs_api_key: true,
            supports_api_key: true,
            keyring_suffix: "gemini_key".into(),
            api_path: "/v1beta/models/{model}:generateContent".into(),
            models_endpoint: "".into(),
            is_openai_compat: false,
            description: "Gemini Flash & Pro models".into(),
            cost_tier: "$$".into(),
        },
        ProviderInfo {
            id: "opencode_zen".into(),
            name: "OpenCode Zen".into(),
            icon: "⌨️".into(),
            default_url: "https://opencode.ai/zen".into(),
            default_models: vec![
                "big-pickle".into(),
                "deepseek-v4-flash-free".into(),
                "mimo-v2.5-free".into(),
                "laguna-s-2.1-free".into(),
                "nemotron-3-ultra-free".into(),
                "north-mini-code-free".into(),
                "ling-3.0-flash-free".into(),
            ],
            needs_api_key: true,
            supports_api_key: true,
            keyring_suffix: "opencode_zen_key".into(),
            api_path: "/v1/chat/completions".into(),
            models_endpoint: "/v1/models".into(),
            is_openai_compat: true,
            description: "OpenCode Zen — modelos gratuitos y de pago optimizados para coding (pay-as-you-go)".into(),
            cost_tier: "free".into(),
        },
        ProviderInfo {
            id: "opencode_go".into(),
            name: "OpenCode Go".into(),
            icon: "🏃".into(),
            default_url: "https://opencode.ai/zen/go".into(),
            default_models: vec![
                "grok-4.5".into(),
                "kimi-k3".into(),
                "glm-5.2".into(),
                "qwen3.7-max".into(),
                "kimi-k2.7-code".into(),
                "minimax-m3".into(),
                "mimo-v2.5-pro".into(),
                "deepseek-v4-pro".into(),
                "qwen3.7-plus".into(),
                "hy3".into(),
            ],
            needs_api_key: true,
            supports_api_key: true,
            keyring_suffix: "opencode_go_key".into(),
            api_path: "/v1/chat/completions".into(),
            models_endpoint: "/v1/models".into(),
            is_openai_compat: true,
            description: "OpenCode Go — suscripción $10/mes con modelos open-source premium".into(),
            cost_tier: "$".into(),
        },
    ]
}

pub fn get_provider_info(id: &str) -> Option<ProviderInfo> {
    all_providers().into_iter().find(|p| p.id == id)
}

pub fn get_all_provider_ids() -> Vec<String> {
    all_providers().iter().map(|p| p.id.clone()).collect()
}

/// Core trait to abstract the AI Network layer.
#[allow(async_fn_in_trait)]
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
}

pub struct DefaultAiEngine {
    client: reqwest::Client,
}

impl DefaultAiEngine {
    pub fn new() -> Self {
        Self {
            client: reqwest::Client::builder()
                .timeout(std::time::Duration::from_secs(300))
                .build()
                .unwrap_or_default(),
        }
    }

    fn resolve_api_key(&self, provider: &str, api_key: Option<String>) -> Option<String> {
        if let Some(key) = api_key {
            if !key.is_empty() {
                return Some(key);
            }
        }
        let info = get_provider_info(provider)?;
        if info.keyring_suffix.is_empty() {
            return None;
        }
        let service = format!("prompt-suite-ia:{}", info.keyring_suffix);
        keyring::Entry::new(&service, "api_key")
            .and_then(|entry| entry.get_password())
            .ok()
    }

    fn resolve_api_key_optional(&self, provider: &str, api_key: Option<String>) -> Option<String> {
        // First try passed key
        if let Some(key) = api_key {
            if !key.is_empty() {
                return Some(key);
            }
        }
        // Then try keyring
        let info = get_provider_info(provider)?;
        if info.keyring_suffix.is_empty() {
            return None;
        }
        let service = format!("prompt-suite-ia:{}", info.keyring_suffix);
        keyring::Entry::new(&service, "api_key")
            .and_then(|entry| entry.get_password())
            .ok()
    }

    async fn call_ollama(&self, endpoint: &str, model: &str, messages: Vec<Message>, temperature: f32, num_ctx: u32) -> Result<String, String> {
        let url = format!("{}/api/chat", endpoint.trim_end_matches('/'));
        let res = self.client
            .post(&url)
            .json(&serde_json::json!({
                "model": model,
                "messages": messages,
                "stream": false,
                "options": {
                    "temperature": temperature,
                    "num_ctx": num_ctx
                }
            }))
            .send()
            .await
            .map_err(|e| format!("Ollama connection error: {}", e))?;

        let json: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
        Ok(json["message"]["content"].as_str().unwrap_or("").to_string())
    }

    async fn call_openai_compatible(
        &self,
        provider_name: &str,
        endpoint: &str,
        model: &str,
        messages: Vec<Message>,
        temperature: f32,
        api_key: Option<String>,
        api_path: &str,
    ) -> Result<String, String> {
        let info = get_provider_info(provider_name)
            .ok_or_else(|| format!("Unknown provider: {}", provider_name))?;

        let key = if info.needs_api_key {
            self.resolve_api_key(provider_name, api_key.clone())
                .ok_or_else(|| format!("{} API key is required", info.name))?
        } else if info.supports_api_key {
            self.resolve_api_key_optional(provider_name, api_key.clone())
                .unwrap_or_default()
        } else {
            String::new()
        };

        let base = if endpoint.is_empty() || !endpoint.starts_with("http") {
            info.default_url.clone()
        } else {
            endpoint.trim_end_matches('/').to_string()
        };
        let url = format!("{}{}", base, api_path);

        let mut req = self.client.post(&url);

        if !key.is_empty() {
            if provider_name == "openrouter" {
                req = req.bearer_auth(&key)
                    .header("HTTP-Referer", "https://celerolab.com")
                    .header("X-Title", "Prompt Suite");
            } else if provider_name == "together" {
                req = req.bearer_auth(&key);
            } else {
                req = req.bearer_auth(&key);
            }
        }

        let mut body = serde_json::json!({
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "stream": false
        });

        // Ollama via OpenWebUI needs special options
        if provider_name == "openwebui" {
            body["options"] = serde_json::json!({
                "temperature": temperature
            });
        }

        let res = req
            .json(&body)
            .send()
            .await
            .map_err(|e| format!("{} connection error: {}", info.name, e))?;

        if !res.status().is_success() {
            return Err(format!("{} error {}: {}", info.name, res.status(), res.text().await.unwrap_or_default()));
        }

        let json: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
        Ok(json["choices"][0]["message"]["content"].as_str().unwrap_or("").to_string())
    }

    async fn call_anthropic(
        &self,
        endpoint: &str,
        model: &str,
        messages: Vec<Message>,
        temperature: f32,
        api_key: Option<String>,
    ) -> Result<String, String> {
        let key = self.resolve_api_key("anthropic", api_key)
            .ok_or("Anthropic API key is required")?;

        let base = if endpoint.is_empty() || !endpoint.starts_with("http") {
            "https://api.anthropic.com".to_string()
        } else {
            endpoint.trim_end_matches('/').to_string()
        };
        let url = format!("{}/v1/messages", base);

        // Extract system message and convert to Anthropic format
        let system_msg = messages.iter()
            .find(|m| m.role == "system")
            .map(|m| m.content.clone())
            .unwrap_or_default();

        let anthropic_messages: Vec<serde_json::Value> = messages.iter()
            .filter(|m| m.role != "system")
            .map(|m| serde_json::json!({
                "role": if m.role == "assistant" { "assistant" } else { "user" },
                "content": m.content
            }))
            .collect();

        let res = self.client
            .post(&url)
            .header("x-api-key", &key)
            .header("anthropic-version", "2023-06-01")
            .header("content-type", "application/json")
            .json(&serde_json::json!({
                "model": model,
                "messages": anthropic_messages,
                "system": system_msg,
                "temperature": temperature,
                "max_tokens": 8192
            }))
            .send()
            .await
            .map_err(|e| format!("Anthropic connection error: {}", e))?;

        if !res.status().is_success() {
            return Err(format!("Anthropic error {}: {}", res.status(), res.text().await.unwrap_or_default()));
        }

        let json: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
        Ok(json["content"][0]["text"].as_str().unwrap_or("").to_string())
    }

    async fn call_gemini(
        &self,
        model: &str,
        messages: Vec<Message>,
        temperature: f32,
        api_key: Option<String>,
    ) -> Result<String, String> {
        let key = self.resolve_api_key("gemini", api_key)
            .ok_or("Gemini API key is required")?;

        let model_name = if model.contains('/') {
            model.split('/').last().unwrap_or(model)
        } else {
            model
        };

        let url = format!(
            "https://generativelanguage.googleapis.com/v1beta/models/{}:generateContent?key={}",
            model_name, key
        );

        // Convert messages to Gemini format
        let contents: Vec<serde_json::Value> = messages.iter()
            .filter(|m| m.role != "system")
            .map(|m| {
                let role = if m.role == "assistant" { "model" } else { "user" };
                serde_json::json!({
                    "role": role,
                    "parts": [{"text": m.content}]
                })
            })
            .collect();

        let system_instruction = messages.iter()
            .find(|m| m.role == "system")
            .map(|m| serde_json::json!({"parts": [{"text": m.content}]}));

        let mut body = serde_json::json!({
            "contents": contents,
            "generationConfig": {
                "temperature": temperature
            }
        });

        if let Some(sys) = system_instruction {
            body["systemInstruction"] = sys;
        }

        let res = self.client
            .post(&url)
            .json(&body)
            .send()
            .await
            .map_err(|e| format!("Gemini connection error: {}", e))?;

        if !res.status().is_success() {
            return Err(format!("Gemini error {}: {}", res.status(), res.text().await.unwrap_or_default()));
        }

        let json: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
        Ok(json["candidates"][0]["content"]["parts"][0]["text"].as_str().unwrap_or("").to_string())
    }

    async fn stream_ollama(&self, endpoint: &str, model: &str, messages: Vec<Message>, temperature: f32, num_ctx: u32) -> Result<String, String> {
        let url = format!("{}/api/chat", endpoint.trim_end_matches('/'));
        let res = self.client
            .post(&url)
            .json(&serde_json::json!({
                "model": model,
                "messages": messages,
                "stream": true,
                "options": {
                    "temperature": temperature,
                    "num_ctx": num_ctx
                }
            }))
            .send()
            .await
            .map_err(|e| format!("Ollama connection error: {}", e))?;

        let mut full_content = String::new();
        let mut stream = res.bytes_stream();
        use futures::StreamExt;
        while let Some(chunk) = stream.next().await {
            let bytes = chunk.map_err(|e| e.to_string())?;
            let text = String::from_utf8_lossy(&bytes);
            for line in text.lines() {
                if line.is_empty() { continue; }
                if let Ok(json) = serde_json::from_str::<serde_json::Value>(line) {
                    if let Some(content) = json["message"]["content"].as_str() {
                        full_content.push_str(content);
                    }
                    if json["done"].as_bool() == Some(true) {
                        break;
                    }
                }
            }
        }
        Ok(full_content)
    }

    async fn stream_openai_compatible(
        &self,
        provider_name: &str,
        endpoint: &str,
        model: &str,
        messages: Vec<Message>,
        temperature: f32,
        api_key: Option<String>,
        api_path: &str,
    ) -> Result<String, String> {
        let info = get_provider_info(provider_name)
            .ok_or_else(|| format!("Unknown provider: {}", provider_name))?;

        let key = if info.needs_api_key {
            self.resolve_api_key(provider_name, api_key.clone())
                .ok_or_else(|| format!("{} API key is required", info.name))?
        } else if info.supports_api_key {
            self.resolve_api_key_optional(provider_name, api_key.clone())
                .unwrap_or_default()
        } else {
            String::new()
        };

        let base = if endpoint.is_empty() || !endpoint.starts_with("http") {
            info.default_url.clone()
        } else {
            endpoint.trim_end_matches('/').to_string()
        };
        let url = format!("{}{}", base, api_path);

        let mut req = self.client.post(&url);
        if !key.is_empty() {
            req = req.bearer_auth(&key);
        }

        let res = req
            .json(&serde_json::json!({
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "stream": true
            }))
            .send()
            .await
            .map_err(|e| format!("{} connection error: {}", info.name, e))?;

        if !res.status().is_success() {
            return Err(format!("{} error {}: {}", info.name, res.status(), res.text().await.unwrap_or_default()));
        }

        let mut full_content = String::new();
        let mut stream = res.bytes_stream();
        use futures::StreamExt;
        while let Some(chunk) = stream.next().await {
            let bytes = chunk.map_err(|e| e.to_string())?;
            let text = String::from_utf8_lossy(&bytes);
            for line in text.lines() {
                let line = line.trim();
                if line.is_empty() || line == "data: [DONE]" { continue; }
                if let Some(data) = line.strip_prefix("data: ") {
                    if let Ok(json) = serde_json::from_str::<serde_json::Value>(data) {
                        if let Some(delta) = json["choices"][0]["delta"]["content"].as_str() {
                            full_content.push_str(delta);
                        }
                    }
                }
            }
        }
        Ok(full_content)
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
        match provider {
            "ollama" => self.call_ollama(endpoint, model, messages, temperature, num_ctx).await,
            "anthropic" => self.call_anthropic(endpoint, model, messages, temperature, api_key).await,
            "gemini" => self.call_gemini(model, messages, temperature, api_key).await,
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
                ).await
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
        match provider {
            "ollama" => self.stream_ollama(endpoint, model, messages, temperature, num_ctx).await,
            "anthropic" | "gemini" => {
                // Fall back to non-streaming for providers with different streaming formats
                self.call_ai(provider, endpoint, model, messages, temperature, num_ctx, api_key).await
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
                ).await
            }
        }
    }
}
