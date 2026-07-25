#[cfg(test)]
mod tests {
    use crate::ai::{AiEngine, Message};

    /// Moch Engine para fase 3: Mocks (Evita usar red)
    pub struct MockAiEngine {
        pub should_fail: bool,
        pub mock_response: String,
        pub parse_error: bool,
    }

    impl MockAiEngine {
        pub fn new() -> Self {
            Self {
                should_fail: false,
                mock_response: "Mocked AI Response".to_string(),
                parse_error: false,
            }
        }
    }

    impl AiEngine for MockAiEngine {
        async fn call_ai(
            &self,
            provider: &str,
            _endpoint: &str,
            _model: &str,
            messages: Vec<Message>,
            _temperature: f32,
            _num_ctx: u32,
            api_key: Option<String>,
        ) -> Result<String, String> {
            if self.should_fail {
                return Err(format!("Mocked connection error for {}", provider));
            }

            if self.parse_error {
                return Err("Failed to parse JSON".to_string());
            }

            if messages.is_empty() {
                return Err("Messages array cannot be empty".to_string());
            }

            if provider != "ollama" && api_key.is_none() {
                return Err(format!("{} API key is required", provider));
            }

            Ok(self.mock_response.clone())
        }
    }

    // ── Phase 1: Happy Path Validation ──────────────────────────────────────
    #[tokio::test]
    async fn test_happy_path_valid_call() {
        let engine = MockAiEngine::new();
        let msgs = vec![Message { role: "user".into(), content: "Hello".into() }];
        
        let res = engine.call_ai(
            "openai", "https://mock.api", "gpt-4", msgs, 0.7, 2048, Some("sk-test123".into())
        ).await;
        
        assert!(res.is_ok(), "Happy path failed: {:?}", res);
        assert_eq!(res.unwrap(), "Mocked AI Response");
    }

    // ── Phase 2: Hostile Path (Edge Cases) ──────────────────────────────────
    #[tokio::test]
    async fn test_hostile_missing_api_key() {
        let engine = MockAiEngine::new();
        let msgs = vec![Message { role: "user".into(), content: "Hack".into() }];
        
        let res = engine.call_ai(
            "openrouter", "https://mock.api", "claude-3", msgs, 1.0, 2048, None
        ).await;
        
        assert!(res.is_err(), "Expected error when API key is missing");
        assert!(res.unwrap_err().contains("API key is required"));
    }

    #[tokio::test]
    async fn test_hostile_empty_messages() {
        let engine = MockAiEngine::new();
        let empty_msgs = vec![];
        
        let res = engine.call_ai(
            "ollama", "http://localhost:11434", "llama3", empty_msgs, 1.0, 2048, None
        ).await;
        
        assert!(res.is_err(), "Expected error on empty arrays");
        assert_eq!(res.unwrap_err(), "Messages array cannot be empty");
    }

    #[tokio::test]
    async fn test_hostile_network_timeout() {
        let mut engine = MockAiEngine::new();
        engine.should_fail = true; // Simulating connection failure
        let msgs = vec![Message { role: "user".into(), content: "Hey".into() }];

        let res = engine.call_ai(
            "ollama", "http://10.255.255.1", "llama3", msgs, 1.0, 2048, None
        ).await;

        assert!(res.is_err());
        assert!(res.unwrap_err().contains("Mocked connection error for ollama"));
    }

    // ── Phase 3: Performance & Memory Profile ───────────────────────────────
    #[tokio::test]
    async fn test_performance_massive_payload() {
        let engine = MockAiEngine::new();
        
        // Simular un request monstruoso de 100,000 caracteres (Stress Test)
        let huge_content = "A".repeat(100_000);
        let msgs = vec![Message { role: "user".into(), content: huge_content }];
        
        let start = std::time::Instant::now();
        let res = engine.call_ai(
            "openai", "https://mock", "gpt-4", msgs, 0.5, 4096, Some("sk-123".into())
        ).await;
        let elapsed = start.elapsed();

        assert!(res.is_ok());
        // El mock debería responder en < 50ms incluso con payloads gigantes
        assert!(elapsed.as_millis() < 50, "Performance threshold exceeded! Took {}ms", elapsed.as_millis());
    }
}
