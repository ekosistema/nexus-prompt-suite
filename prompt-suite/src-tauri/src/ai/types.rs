use serde::{Deserialize, Serialize};
use std::fmt;
use std::str::FromStr;

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
    pub docs_url: String,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
pub enum Provider {
    Ollama,
    OpenAI,
    OpenRouter,
    Groq,
    LmStudio,
    OpenWebUI,
    Vllm,
    Together,
    Anthropic,
    Gemini,
    OpenCodeZen,
    OpenCodeGo,
}

impl Provider {
    pub fn as_str(&self) -> &'static str {
        match self {
            Provider::Ollama => "ollama",
            Provider::OpenAI => "openai",
            Provider::OpenRouter => "openrouter",
            Provider::Groq => "groq",
            Provider::LmStudio => "lm_studio",
            Provider::OpenWebUI => "openwebui",
            Provider::Vllm => "vllm",
            Provider::Together => "together",
            Provider::Anthropic => "anthropic",
            Provider::Gemini => "gemini",
            Provider::OpenCodeZen => "opencode_zen",
            Provider::OpenCodeGo => "opencode_go",
        }
    }
}

impl fmt::Display for Provider {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.as_str())
    }
}

impl FromStr for Provider {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "ollama" => Ok(Provider::Ollama),
            "openai" => Ok(Provider::OpenAI),
            "openrouter" => Ok(Provider::OpenRouter),
            "groq" => Ok(Provider::Groq),
            "lm_studio" => Ok(Provider::LmStudio),
            "openwebui" => Ok(Provider::OpenWebUI),
            "vllm" => Ok(Provider::Vllm),
            "together" => Ok(Provider::Together),
            "anthropic" => Ok(Provider::Anthropic),
            "gemini" => Ok(Provider::Gemini),
            "opencode_zen" => Ok(Provider::OpenCodeZen),
            "opencode_go" => Ok(Provider::OpenCodeGo),
            _ => Err(format!("Unknown provider: {}", s)),
        }
    }
}
