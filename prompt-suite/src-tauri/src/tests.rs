#[cfg(test)]
mod tests {
    use std::sync::Arc;

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
            let text = self
                .call_ai_stream(
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
    }

    // ── Phase 1: Happy Path Validation ──────────────────────────────────────
    #[tokio::test]
    async fn test_happy_path_valid_call() {
        let engine = MockAiEngine::new();
        let msgs = vec![Message {
            role: "user".into(),
            content: "Hello".into(),
        }];

        let res = engine
            .call_ai(
                "openai",
                "https://mock.api",
                "gpt-4",
                msgs,
                0.7,
                2048,
                Some("sk-test123".into()),
            )
            .await;

        assert!(res.is_ok(), "Happy path failed: {:?}", res);
        assert_eq!(res.unwrap(), "Mocked AI Response");
    }

    // ── Phase 1b: stream_tokens trait compiles & falls back to call_ai_stream ──
    #[tokio::test]
    async fn test_stream_tokens_dispatch_and_emit() {
        let engine = MockAiEngine::new();
        let msgs = vec![Message {
            role: "user".into(),
            content: "Hello".into(),
        }];

        let received = std::sync::Arc::new(std::sync::Mutex::new(String::new()));
        let callback = {
            let received = Arc::clone(&received);
            move |tok: &str| {
                received.lock().unwrap().push_str(tok);
            }
        };

        let res = engine
            .stream_tokens(
                "openai",
                "https://mock.api",
                "gpt-4",
                msgs,
                0.7,
                2048,
                Some("sk-test123".into()),
                callback,
            )
            .await;

        assert!(res.is_ok(), "stream_tokens failed: {:?}", res);
        assert_eq!(*received.lock().unwrap(), "Mocked AI Response");
    }

    #[tokio::test]
    async fn test_stream_tokens_emits_multiple_chunks() {
        let mut engine = MockAiEngine::new();
        engine.mock_response = "Hola mundo".to_string();
        let msgs = vec![Message {
            role: "user".into(),
            content: "Hello".into(),
        }];

        let chunks = std::sync::Arc::new(std::sync::Mutex::new(Vec::<String>::new()));
        let callback = {
            let chunks = Arc::clone(&chunks);
            move |tok: &str| {
                chunks.lock().unwrap().push(tok.to_string());
            }
        };

        let res = engine
            .stream_tokens(
                "openai",
                "https://mock.api",
                "gpt-4",
                msgs,
                0.7,
                2048,
                Some("sk-test123".into()),
                callback,
            )
            .await;

        assert!(res.is_ok(), "stream_tokens failed: {:?}", res);
        let chunks = chunks.lock().unwrap();
        assert_eq!(chunks.join(""), "Hola mundo");
        assert_eq!(chunks.len(), 1);
    }

    // ── Phase 2: Hostile Path (Edge Cases) ──────────────────────────────────
    #[tokio::test]
    async fn test_hostile_missing_api_key() {
        let engine = MockAiEngine::new();
        let msgs = vec![Message {
            role: "user".into(),
            content: "Hack".into(),
        }];

        let res = engine
            .call_ai(
                "openrouter",
                "https://mock.api",
                "claude-3",
                msgs,
                1.0,
                2048,
                None,
            )
            .await;

        assert!(res.is_err(), "Expected error when API key is missing");
        assert!(res.unwrap_err().contains("API key is required"));
    }

    #[tokio::test]
    async fn test_hostile_empty_messages() {
        let engine = MockAiEngine::new();
        let empty_msgs = vec![];

        let res = engine
            .call_ai(
                "ollama",
                "http://localhost:11434",
                "llama3",
                empty_msgs,
                1.0,
                2048,
                None,
            )
            .await;

        assert!(res.is_err(), "Expected error on empty arrays");
        assert_eq!(res.unwrap_err(), "Messages array cannot be empty");
    }

    #[tokio::test]
    async fn test_hostile_network_timeout() {
        let mut engine = MockAiEngine::new();
        engine.should_fail = true; // Simulating connection failure
        let msgs = vec![Message {
            role: "user".into(),
            content: "Hey".into(),
        }];

        let res = engine
            .call_ai(
                "ollama",
                "http://10.255.255.1",
                "llama3",
                msgs,
                1.0,
                2048,
                None,
            )
            .await;

        assert!(res.is_err());
        assert!(res
            .unwrap_err()
            .contains("Mocked connection error for ollama"));
    }

    // ── Phase 3: Endpoint Security Validation ─────────────────────────────
    #[test]
    fn test_is_localhost_accepted() {
        assert!(crate::is_localhost(""));
        assert!(crate::is_localhost("http://localhost:11434"));
        assert!(crate::is_localhost("https://127.0.0.1:8080"));
        // Note: IPv6 literal [::1] parsing depends on url crate version; tested manually
        // *.local hosts are no longer treated as localhost (intentional behavior change)
        assert!(!crate::is_localhost("http://myserver.local"));
    }

    #[test]
    fn test_is_localhost_rejected() {
        assert!(!crate::is_localhost("https://api.openai.com"));
        assert!(!crate::is_localhost("http://evil.com"));
    }

    #[test]
    fn test_validate_endpoint_accepts_custom_remote_https() {
        // Any remote host over HTTPS is valid (allowlist removed).
        assert!(crate::validate_endpoint_url(
            "https://custom.vllm.ejemplo:8000/v1"
        )
        .is_ok());
        assert!(crate::validate_endpoint_url(
            "https://mi-servidor.ejemplo:8000/v1"
        )
        .is_ok());
        assert!(crate::validate_endpoint_url("https://lmstudio.home.arpa/v1").is_ok());
    }

    #[test]
    fn test_validate_endpoint_rejects_remote_http() {
        // Remote endpoints MUST use HTTPS (API key protection).
        let err = crate::validate_endpoint_url("http://custom.ejemplo/v1")
            .expect_err("Remote HTTP endpoint should be rejected");
        assert!(err.contains("HTTPS"));
    }

    #[test]
    fn test_validate_endpoint_accepts_localhost() {
        assert!(crate::validate_endpoint_url("http://localhost:1234/v1").is_ok());
        assert!(crate::validate_endpoint_url("https://127.0.0.1:8080").is_ok());
        assert!(crate::validate_endpoint_url("").is_ok());
    }

    #[test]
    fn test_validate_endpoint_rejects_bad_scheme() {
        assert!(crate::validate_endpoint_url("ftp://example.com/v1").is_err());
        assert!(crate::validate_endpoint_url("file:///etc/passwd").is_err());
    }

    #[test]
    fn test_validate_endpoint_rejects_embedded_credentials() {
        assert!(crate::validate_endpoint_url(
            "https://user:pass@custom.ejemplo/v1"
        )
        .is_err());
    }

    #[test]
    fn test_validate_endpoint_rejects_unallowed_local_port() {
        let err = crate::validate_endpoint_url("http://localhost:9999/v1")
            .expect_err("Local endpoint on unallowed port should be rejected");
        assert!(err.contains("port"));
    }

    // ── Phase 4: Performance & Memory Profile ───────────────────────────────
    #[tokio::test]
    async fn test_performance_massive_payload() {
        let engine = MockAiEngine::new();

        // Simular un request monstruoso de 100,000 caracteres (Stress Test)
        let huge_content = "A".repeat(100_000);
        let msgs = vec![Message {
            role: "user".into(),
            content: huge_content,
        }];

        let start = std::time::Instant::now();
        let res = engine
            .call_ai(
                "openai",
                "https://mock",
                "gpt-4",
                msgs,
                0.5,
                4096,
                Some("sk-123".into()),
            )
            .await;
        let elapsed = start.elapsed();

        assert!(res.is_ok());
        // El mock debería responder en < 50ms incluso con payloads gigantes
        assert!(
            elapsed.as_millis() < 50,
            "Performance threshold exceeded! Took {}ms",
            elapsed.as_millis()
        );
    }

    // ── Phase 5: Real OS keyring smoke test ────────────────────────────────
    #[tokio::test]
    #[ignore]
    async fn test_keyring_smoke() {
        // Ejecuta manualmente contra el keyring del SO real (no en CI)
        let result = tokio::task::spawn_blocking(|| -> Result<String, String> {
            let entry = keyring::Entry::new("prompt-suite-keyring-smoke", "smoke")
                .map_err(|e| e.to_string())?;
            entry
                .set_password("valor_secreto")
                .map_err(|e| e.to_string())?;
            entry.get_password().map_err(|e| e.to_string())
        })
        .await
        .map_err(|e| format!("spawn_blocking task panicked: {e}"));

        let cleanup = tokio::task::spawn_blocking(|| {
            if let Ok(entry) = keyring::Entry::new("prompt-suite-keyring-smoke", "smoke") {
                let _ = entry.delete_credential();
            }
        });

        match result {
            Ok(Ok(pw)) => assert_eq!(pw, "valor_secreto"),
            Ok(Err(e)) => panic!("Keyring smoke test failed: {e}"),
            Err(e) => panic!("{e}"),
        }

        cleanup.await.unwrap();
    }
}
