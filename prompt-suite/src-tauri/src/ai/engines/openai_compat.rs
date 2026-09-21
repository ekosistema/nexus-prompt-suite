use super::super::engine::{DefaultAiEngine, MAX_STREAM_SIZE};
use super::super::providers::get_provider_info;
use super::super::types::{Message, Provider};
use futures::StreamExt;
use std::str::FromStr;

struct OpenAiCompatRequest {
    url: String,
    body: serde_json::Value,
    provider_name: String,
    key: String,
    info_name: String,
}

impl DefaultAiEngine {
    #[allow(clippy::too_many_arguments)]
    async fn build_openai_compat_request(
        &self,
        provider_name: &str,
        endpoint: &str,
        model: &str,
        messages: Vec<Message>,
        temperature: f32,
        api_key: Option<String>,
        api_path: &str,
        stream: bool,
    ) -> Result<OpenAiCompatRequest, String> {
        let info = get_provider_info(provider_name)
            .ok_or_else(|| format!("Unknown provider: {}", provider_name))?;

        let key = if info.needs_api_key {
            self.resolve_api_key(provider_name, api_key.clone(), true)
                .await?
                .unwrap_or_default()
        } else if info.supports_api_key {
            self.resolve_api_key_or_empty(provider_name, api_key.clone(), true)
                .await
        } else {
            String::new()
        };

        let base = if endpoint.is_empty() || !endpoint.starts_with("http") {
            info.default_url.clone()
        } else {
            endpoint.trim_end_matches('/').to_string()
        };

        let mut body = serde_json::json!({
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "stream": stream
        });

        if provider_name == "openwebui" {
            body["options"] = serde_json::json!({ "temperature": temperature });
        }

        Ok(OpenAiCompatRequest {
            url: format!("{}{}", base, api_path),
            body,
            provider_name: provider_name.to_string(),
            key,
            info_name: info.name.clone(),
        })
    }

    fn apply_auth_headers(
        &self,
        req: reqwest::RequestBuilder,
        request: &OpenAiCompatRequest,
    ) -> reqwest::RequestBuilder {
        if request.key.is_empty() {
            return req;
        }
        let provider = Provider::from_str(&request.provider_name).ok();
        if provider == Some(Provider::OpenRouter) {
            req.bearer_auth(&request.key)
                .header("HTTP-Referer", "https://celerolab.com")
                .header("X-Title", "Prompt Suite")
        } else {
            req.bearer_auth(&request.key)
        }
    }

    #[allow(clippy::too_many_arguments)]
    pub async fn call_openai_compatible(
        &self,
        provider_name: &str,
        endpoint: &str,
        model: &str,
        messages: Vec<Message>,
        temperature: f32,
        api_key: Option<String>,
        api_path: &str,
    ) -> Result<String, String> {
        let request = self
            .build_openai_compat_request(
                provider_name,
                endpoint,
                model,
                messages,
                temperature,
                api_key,
                api_path,
                false,
            )
            .await?;

        let req = self.apply_auth_headers(self.client.post(&request.url), &request);

        let res = req
            .json(&request.body)
            .send()
            .await
            .map_err(|e| format!("{} connection error: {}", request.info_name, e))?;

        if !res.status().is_success() {
            return Err(Self::sanitize_error(
                res.status(),
                res.text().await.unwrap_or_default(),
            ));
        }

        let json: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
        Ok(json["choices"][0]["message"]["content"]
            .as_str()
            .unwrap_or("")
            .to_string())
    }

    #[allow(clippy::too_many_arguments)]
    pub async fn stream_openai_compatible(
        &self,
        provider_name: &str,
        endpoint: &str,
        model: &str,
        messages: Vec<Message>,
        temperature: f32,
        api_key: Option<String>,
        api_path: &str,
    ) -> Result<String, String> {
        let mut full_content = String::new();
        self.stream_openai_compatible_tokens(
            provider_name,
            endpoint,
            model,
            messages,
            temperature,
            api_key,
            api_path,
            &mut |content| full_content.push_str(content),
        )
        .await?;
        Ok(full_content)
    }

    /// Streams SSE deltas from an OpenAI-compatible provider, invoking `on_token`
    /// for each `choices[0].delta.content` fragment as it arrives.
    #[allow(clippy::too_many_arguments)]
    pub(crate) async fn stream_openai_compatible_tokens(
        &self,
        provider_name: &str,
        endpoint: &str,
        model: &str,
        messages: Vec<Message>,
        temperature: f32,
        api_key: Option<String>,
        api_path: &str,
        on_token: &mut (dyn FnMut(&str) + Send),
    ) -> Result<(), String> {
        let request = self
            .build_openai_compat_request(
                provider_name,
                endpoint,
                model,
                messages,
                temperature,
                api_key,
                api_path,
                true,
            )
            .await?;

        let req = self.apply_auth_headers(self.client.post(&request.url), &request);

        let res = req
            .json(&request.body)
            .send()
            .await
            .map_err(|e| format!("{} connection error: {}", request.info_name, e))?;

        if !res.status().is_success() {
            return Err(Self::sanitize_error(
                res.status(),
                res.text().await.unwrap_or_default(),
            ));
        }

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
                        if let Some(content) = json["choices"][0]["delta"]["content"].as_str() {
                            full_content.push_str(content);
                            on_token(content);
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
        Ok(())
    }
}
