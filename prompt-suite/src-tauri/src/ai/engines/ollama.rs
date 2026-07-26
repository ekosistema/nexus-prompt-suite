use futures::StreamExt;

use super::super::engine::{DefaultAiEngine, MAX_STREAM_SIZE};
use super::super::types::Message;

impl DefaultAiEngine {
    pub async fn call_ollama(
        &self,
        endpoint: &str,
        model: &str,
        messages: Vec<Message>,
        temperature: f32,
        num_ctx: u32,
    ) -> Result<String, String> {
        let url = format!("{}/api/chat", endpoint.trim_end_matches('/'));
        let res = self
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
            }))
            .send()
            .await
            .map_err(|e| format!("Ollama connection error: {}", e))?;

        let json: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
        Ok(json["message"]["content"]
            .as_str()
            .unwrap_or("")
            .to_string())
    }

    pub async fn stream_ollama(
        &self,
        endpoint: &str,
        model: &str,
        messages: Vec<Message>,
        temperature: f32,
        num_ctx: u32,
    ) -> Result<String, String> {
        let url = format!("{}/api/chat", endpoint.trim_end_matches('/'));
        let res = self
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
            }))
            .send()
            .await
            .map_err(|e| format!("Ollama connection error: {}", e))?;

        let mut full_content = String::new();
        let mut stream = res.bytes_stream();

        while let Some(chunk) = stream.next().await {
            let bytes = chunk.map_err(|e| e.to_string())?;
            let text = String::from_utf8_lossy(&bytes);
            for line in text.lines() {
                if line.is_empty() {
                    continue;
                }
                if let Ok(json) = serde_json::from_str::<serde_json::Value>(line) {
                    if let Some(content) = json["message"]["content"].as_str() {
                        full_content.push_str(content);
                    }
                    if json["done"].as_bool() == Some(true) {
                        break;
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
}
