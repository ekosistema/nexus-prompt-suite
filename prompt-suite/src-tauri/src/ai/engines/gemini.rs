use super::super::engine::DefaultAiEngine;
use super::super::types::Message;

impl DefaultAiEngine {
    pub async fn call_gemini(
        &self,
        model: &str,
        messages: Vec<Message>,
        temperature: f32,
        api_key: Option<String>,
    ) -> Result<String, String> {
        let key = self
            .resolve_api_key("gemini", api_key, true)
            .await?
            .ok_or("Gemini API key is required")?;

        let model_name = if model.contains('/') {
            model.split('/').next_back().unwrap_or(model)
        } else {
            model
        };

        // Validate model_name to prevent path injection (CWE-22 / CWE-73)
        if model_name
            .chars()
            .any(|c| !c.is_alphanumeric() && c != '-' && c != '.' && c != '_')
        {
            return Err("Invalid model name format: only alphanumeric, hyphens, dots and underscores are allowed".into());
        }

        let url = format!(
            "https://generativelanguage.googleapis.com/v1beta/models/{}:generateContent",
            model_name
        );

        let contents: Vec<serde_json::Value> = messages
            .iter()
            .filter(|m| m.role != "system")
            .map(|m| {
                let role = if m.role == "assistant" {
                    "model"
                } else {
                    "user"
                };
                serde_json::json!({
                    "role": role,
                    "parts": [{"text": m.content}]
                })
            })
            .collect();

        let system_instruction = messages
            .iter()
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

        let res = self
            .client
            .post(&url)
            .header("x-goog-api-key", &key)
            .json(&body)
            .send()
            .await
            .map_err(|e| format!("Gemini connection error: {}", e))?;

        if !res.status().is_success() {
            return Err(Self::sanitize_error(
                res.status(),
                res.text().await.unwrap_or_default(),
            ));
        }

        let json: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
        Ok(json["candidates"][0]["content"]["parts"][0]["text"]
            .as_str()
            .unwrap_or("")
            .to_string())
    }
}
