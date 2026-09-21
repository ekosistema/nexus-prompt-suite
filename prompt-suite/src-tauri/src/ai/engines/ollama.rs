use futures::StreamExt;

use super::super::engine::{DefaultAiEngine, MAX_STREAM_SIZE};
use super::super::types::Message;

impl DefaultAiEngine {
    #[allow(clippy::too_many_arguments)]
    pub async fn call_ollama(
        &self,
        endpoint: &str,
        model: &str,
        messages: Vec<Message>,
        temperature: f32,
        num_ctx: u32,
        api_key: Option<String>,
    ) -> Result<String, String> {
        let key = self.resolve_api_key("ollama", api_key, false).await?;

        let url = format!("{}/api/chat", endpoint.trim_end_matches('/'));
        let mut req = self
            .client
            .post(&url)
            .json(&serde_json::json!({
                "model": model,
                "messages": messages,
                "stream": false,
                "options": {
                    "temperature": temperature,
                    "num_ctx": num_ctx
                }
            }));
        if let Some(k) = key {
            req = req.header("Authorization", format!("Bearer {}", k));
        }

        let res = req
            .send()
            .await
            .map_err(|e| format!("Ollama connection error: {}", e))?;

        if !res.status().is_success() {
            return Err(Self::sanitize_error(
                res.status(),
                res.text().await.unwrap_or_default(),
            ));
        }

        let json: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
        Ok(json["message"]["content"]
            .as_str()
            .unwrap_or("")
            .to_string())
    }

    #[allow(clippy::too_many_arguments)]
    pub async fn stream_ollama(
        &self,
        endpoint: &str,
        model: &str,
        messages: Vec<Message>,
        temperature: f32,
        num_ctx: u32,
        api_key: Option<String>,
    ) -> Result<String, String> {
        let mut full_content = String::new();
        self.stream_ollama_tokens(
            endpoint,
            model,
            messages,
            temperature,
            num_ctx,
            api_key,
            &mut |content| full_content.push_str(content),
        )
        .await?;
        Ok(full_content)
    }

    /// Streams Ollama chat chunks, invoking `on_token` for each
    /// `message.content` fragment and stopping when `done` is true.
    #[allow(clippy::too_many_arguments)]
    pub(crate) async fn stream_ollama_tokens(
        &self,
        endpoint: &str,
        model: &str,
        messages: Vec<Message>,
        temperature: f32,
        num_ctx: u32,
        api_key: Option<String>,
        on_token: &mut (dyn FnMut(&str) + Send),
    ) -> Result<(), String> {
        let key = self.resolve_api_key("ollama", api_key, false).await?;

        let url = format!("{}/api/chat", endpoint.trim_end_matches('/'));
        let mut req = self
            .client
            .post(&url)
            .json(&serde_json::json!({
                "model": model,
                "messages": messages,
                "stream": true,
                "options": {
                    "temperature": temperature,
                    "num_ctx": num_ctx
                }
            }));
        if let Some(k) = key {
            req = req.header("Authorization", format!("Bearer {}", k));
        }

        let res = req
            .send()
            .await
            .map_err(|e| format!("Ollama connection error: {}", e))?;

        if !res.status().is_success() {
            return Err(Self::sanitize_error(
                res.status(),
                res.text().await.unwrap_or_default(),
            ));
        }

        let mut full_content = String::new();
        let mut stream = res.bytes_stream();

        'chunks: while let Some(chunk) = stream.next().await {
            let bytes = chunk.map_err(|e| e.to_string())?;
            let text = String::from_utf8_lossy(&bytes);
            for line in text.lines() {
                if line.is_empty() {
                    continue;
                }
                if let Ok(json) = serde_json::from_str::<serde_json::Value>(line) {
                    if let Some(content) = json["message"]["content"].as_str() {
                        full_content.push_str(content);
                        on_token(content);
                    }
                    if json["done"].as_bool() == Some(true) {
                        break 'chunks;
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
