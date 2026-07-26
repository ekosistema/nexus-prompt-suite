use super::super::engine::{DefaultAiEngine, ANTHROPIC_MAX_TOKENS};
use super::super::types::Message;

impl DefaultAiEngine {
    pub async fn call_anthropic(
        &self,
        endpoint: &str,
        model: &str,
        messages: Vec<Message>,
        temperature: f32,
        api_key: Option<String>,
    ) -> Result<String, String> {
        let key = self
            .resolve_api_key("anthropic", api_key, true)
            .await?
            .ok_or("Anthropic API key is required")?;

        let base = if endpoint.is_empty() || !endpoint.starts_with("http") {
            "https://api.anthropic.com".to_string()
        } else {
            endpoint.trim_end_matches('/').to_string()
        };
        let url = format!("{}/v1/messages", base);

        let system_msg = messages
            .iter()
            .find(|m| m.role == "system")
            .map(|m| m.content.clone())
            .unwrap_or_default();

        let anthropic_messages: Vec<serde_json::Value> = messages
            .iter()
            .filter(|m| m.role != "system")
            .map(|m| {
                serde_json::json!({
                    "role": if m.role == "assistant" { "assistant" } else { "user" },
                    "content": m.content
                })
            })
            .collect();

        let res = self
            .client
            .post(&url)
            .header("x-api-key", &key)
            .header("anthropic-version", "2023-06-01")
            .header("content-type", "application/json")
            .json(&serde_json::json!({
                "model": model,
                "messages": anthropic_messages,
                "system": system_msg,
                "temperature": temperature,
                "max_tokens": ANTHROPIC_MAX_TOKENS
            }))
            .send()
            .await
            .map_err(|e| format!("Anthropic connection error: {}", e))?;

        if !res.status().is_success() {
            return Err(Self::sanitize_error(
                res.status(),
                res.text().await.unwrap_or_default(),
            ));
        }

        let json: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
        Ok(json["content"][0]["text"]
            .as_str()
            .unwrap_or("")
            .to_string())
    }
}
