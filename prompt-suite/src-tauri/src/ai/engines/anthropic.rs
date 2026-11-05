use super::super::engine::{rejects_temperature, DefaultAiEngine, ANTHROPIC_MAX_TOKENS};
use super::super::providers::{get_provider_info, resolve_base_url};
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

        let info = get_provider_info("anthropic").ok_or("Unknown provider: anthropic")?;
        let base = resolve_base_url(&info, endpoint)?;
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

        // Anthropic accepts temperature in [0, 1] only; the app slider goes up to 2.
        let mut body = serde_json::json!({
            "model": model,
            "messages": anthropic_messages,
            "temperature": temperature.clamp(0.0, 1.0),
            "max_tokens": ANTHROPIC_MAX_TOKENS
        });
        if !system_msg.is_empty() {
            body["system"] = serde_json::Value::String(system_msg);
        }

        let send = |b: &serde_json::Value| {
            self.client
                .post(&url)
                .header("x-api-key", &key)
                .header("anthropic-version", "2023-06-01")
                .header("content-type", "application/json")
                .json(b)
                .send()
        };

        let mut res = send(&body)
            .await
            .map_err(|e| format!("Anthropic connection error: {}", e))?;

        if !res.status().is_success() {
            let status = res.status();
            let text = res.text().await.unwrap_or_default();
            // Some newer models no longer accept sampling parameters: retry once without it.
            if !rejects_temperature(status, &text) {
                return Err(Self::sanitize_error(status, text));
            }
            if let Some(obj) = body.as_object_mut() {
                obj.remove("temperature");
            }
            res = send(&body)
                .await
                .map_err(|e| format!("Anthropic connection error: {}", e))?;
            if !res.status().is_success() {
                let st = res.status();
                return Err(Self::sanitize_error(st, res.text().await.unwrap_or_default()));
            }
        }

        let json: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
        // The reply may start with non-text blocks (e.g. thinking); join every text block.
        let text = json["content"]
            .as_array()
            .map(|blocks| {
                blocks
                    .iter()
                    .filter(|b| b["type"].as_str() == Some("text"))
                    .filter_map(|b| b["text"].as_str())
                    .collect::<Vec<_>>()
                    .join("")
            })
            .unwrap_or_default();
        Ok(text)
    }
}
