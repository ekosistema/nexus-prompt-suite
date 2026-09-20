use tauri::Manager;

/// Retrieves the application settings from the app-managed config directory.
///
/// # Returns
/// * `Ok(serde_json::Value)` - The parsed settings JSON object.
/// * `Ok(json!({"lang": "es"}))` - Default settings if file is missing.
///
/// # Errors
/// * `Err(String)` - If file read fails or file size exceeds 1MB (CWE-400 mitigation).
#[tauri::command]
fn get_settings(app: tauri::AppHandle) -> Result<serde_json::Value, String> {
    let mut path = app.path().app_config_dir().map_err(|e| e.to_string())?;
    path.push(".nexus_preferences.json");
    if path.exists() {
        let metadata = std::fs::metadata(&path).map_err(|e| e.to_string())?;
        if metadata.len() > MAX_SETTINGS_FILE_SIZE {
            return Err(
                "El archivo de preferencias excede 1MB. Posible desbordamiento interceptado."
                    .into(),
            );
        }

        let content = std::fs::read_to_string(path).map_err(|e| e.to_string())?;
        let json: serde_json::Value = serde_json::from_str(&content).map_err(|e| e.to_string())?;
        Ok(json)
    } else {
        Ok(serde_json::json!({ "lang": "es" }))
    }
}

/// Persists the application settings to the local JSON file in the app config directory.
#[tauri::command]
fn save_settings(app: tauri::AppHandle, mut settings: serde_json::Value) -> Result<bool, String> {
    let mut path = app.path().app_config_dir().map_err(|e| e.to_string())?;
    path.push(".nexus_preferences.json");

    // [CWE-312] Clean API keys from plain JSON
    if let Some(obj) = settings.as_object_mut() {
        obj.remove("apiKey");
    }

    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }

    let content = serde_json::to_string_pretty(&settings).map_err(|e| e.to_string())?;
    std::fs::write(path, content).map_err(|e| e.to_string())?;
    Ok(true)
}

/// Securely stores an API key in the OS-native credential manager (legacy).
#[tauri::command]
fn save_api_key_secure(key: String) -> Result<bool, String> {
    let entry =
        keyring::Entry::new("prompt-suite-ia", "user_api_key").map_err(|e| e.to_string())?;
    entry.set_password(&key).map_err(|e| e.to_string())?;
    Ok(true)
}

/// Retrieves the stored API key from the OS-native credential manager (legacy).
#[tauri::command]
fn get_api_key_secure() -> Result<String, String> {
    let entry =
        keyring::Entry::new("prompt-suite-ia", "user_api_key").map_err(|e| e.to_string())?;
    match entry.get_password() {
        Ok(pw) => Ok(pw),
        Err(_) => Ok("".to_string()),
    }
}

/// Saves an API key for a specific provider in the OS keyring.
#[tauri::command]
fn save_provider_api_key(provider: String, key: String) -> Result<bool, String> {
    let info = crate::ai::get_provider_info(&provider)
        .ok_or_else(|| format!("Unknown provider: {}", provider))?;

    if info.keyring_suffix.is_empty() {
        return Ok(true); // Provider doesn't need a key
    }

    let service = format!("prompt-suite-ia:{}", info.keyring_suffix);
    let entry = keyring::Entry::new(&service, "api_key").map_err(|e| e.to_string())?;
    if key.is_empty() {
        let _ = entry.delete_credential();
    } else {
        entry.set_password(&key).map_err(|e| e.to_string())?;
    }
    Ok(true)
}

/// Retrieves the API key for a specific provider from the OS keyring.
/// Falls back to legacy key for backward compatibility.
#[tauri::command]
fn get_provider_api_key(provider: String) -> Result<String, String> {
    let info = crate::ai::get_provider_info(&provider);

    if let Some(info) = info {
        if !info.keyring_suffix.is_empty() {
            let service = format!("prompt-suite-ia:{}", info.keyring_suffix);
            if let Ok(entry) = keyring::Entry::new(&service, "api_key") {
                if let Ok(pw) = entry.get_password() {
                    return Ok(pw);
                }
            }
        }
    }

    // Fallback to legacy key for backward compatibility
    let entry =
        keyring::Entry::new("prompt-suite-ia", "user_api_key").map_err(|e| e.to_string())?;
    match entry.get_password() {
        Ok(pw) => Ok(pw),
        Err(_) => Ok("".to_string()),
    }
}

/// Securely stores a value in the OS keyring under a given key.
#[tauri::command]
fn secure_storage_set(key: String, value: String) -> Result<bool, String> {
    let entry =
        keyring::Entry::new("prompt-suite-secure-storage", &key).map_err(|e| e.to_string())?;
    entry.set_password(&value).map_err(|e| e.to_string())?;
    Ok(true)
}

/// Retrieves a value from the OS keyring by key.
#[tauri::command]
fn secure_storage_get(key: String) -> Result<String, String> {
    let entry =
        keyring::Entry::new("prompt-suite-secure-storage", &key).map_err(|e| e.to_string())?;
    match entry.get_password() {
        Ok(pw) => Ok(pw),
        Err(_) => Ok(String::new()),
    }
}

/// Removes a value from the OS keyring by key.
#[tauri::command]
fn secure_storage_remove(key: String) -> Result<bool, String> {
    let entry =
        keyring::Entry::new("prompt-suite-secure-storage", &key).map_err(|e| e.to_string())?;
    let _ = entry.delete_credential();
    Ok(true)
}

/// Returns all available AI providers with their metadata.
#[tauri::command]
fn get_available_providers() -> Result<Vec<crate::ai::ProviderInfo>, String> {
    Ok(crate::ai::all_providers())
}

/// Lists models available from a provider.
#[tauri::command]
async fn list_provider_models(
    provider: String,
    endpoint: String,
    api_key: Option<String>,
) -> Result<Vec<String>, String> {
    let info = crate::ai::get_provider_info(&provider)
        .ok_or_else(|| format!("Unknown provider: {}", provider))?;

    if !endpoint.is_empty() && !endpoint.starts_with("http://") && !endpoint.starts_with("https://")
    {
        return Err("Endpoint must start with http:// or https://".into());
    }
    if !endpoint.is_empty() && !is_allowed_endpoint(&endpoint) {
        return Err(format!(
            "Endpoint host is not in the allowed list. Allowed hosts: localhost, {}",
            ALLOWED_REMOTE_HOSTS.join(", ")
        ));
    }

    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(MODELS_FETCH_TIMEOUT_SECS))
        .build()
        .map_err(|e| e.to_string())?;

    let base = if endpoint.is_empty() {
        info.default_url.clone()
    } else {
        endpoint.trim_end_matches('/').to_string()
    };

    let engine = crate::ai::DefaultAiEngine::new();

    // Resolve the key from the keyring when not provided by the caller,
    // so a saved key is never silently ignored.
    let resolved_key = engine.resolve_api_key(&provider, api_key, false).await?;

    if matches!(Provider::from_str(&provider), Ok(Provider::Ollama)) {
        let url = format!("{}{}", base, info.models_endpoint);
        let mut req = client.get(&url);
        if let Some(key) = &resolved_key {
            req = req.bearer_auth(key);
        }
        let res = req
            .send()
            .await
            .map_err(|e| format!("Cannot connect to {}: {}", info.name, e))?;

        if !res.status().is_success() {
            let status = res.status();
            let body = res.text().await.unwrap_or_default();
            return Err(format!("API error {}: {}", status.as_u16(), body));
        }

        let json: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
        let models = json["models"]
            .as_array()
            .unwrap_or(&vec![])
            .iter()
            .filter_map(|m| m["name"].as_str().map(|s| s.to_string()))
            .collect::<Vec<String>>();
        return Ok(models);
    }

    if provider == "gemini" {
        let url = format!("{}{}", base, info.models_endpoint);
        let key = resolved_key.ok_or_else(|| {
            format!("{} API key is required. Add it in Settings.", info.name)
        })?;
        let res = client
            .get(&url)
            .header("x-goog-api-key", &key)
            .send()
            .await
            .map_err(|e| format!("Cannot connect to {}: {}", info.name, e))?;

        if !res.status().is_success() {
            let status = res.status();
            let body = res.text().await.unwrap_or_default();
            return Err(format!("API error {}: {}", status.as_u16(), body));
        }

        let json: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
        let models = json["models"]
            .as_array()
            .unwrap_or(&vec![])
            .iter()
            .filter_map(|m| m["name"].as_str())
            .filter_map(|name| name.strip_prefix("models/").map(|s| s.to_string()))
            .collect::<Vec<String>>();
        return Ok(models);
    }

    if info.models_endpoint.is_empty() {
        // Provider doesn't expose a public models endpoint (Anthropic)
        return Ok(info.default_models.clone());
    }

    let url = format!("{}{}", base, info.models_endpoint);
    let mut req = client.get(&url);

    if info.needs_api_key {
        match &resolved_key {
            Some(k) => {
                req = req.bearer_auth(k);
            }
            None => {
                return Err(format!(
                    "{} API key is required. Add it in Settings.",
                    info.name
                ))
            }
        }
    } else if info.supports_api_key {
        // Optional API key - use if available, but don't require it
        if let Some(key) = &resolved_key {
            req = req.bearer_auth(key);
        }
    }

    let res = req
        .send()
        .await
        .map_err(|e| format!("Cannot connect to {}: {}", info.name, e))?;

    if !res.status().is_success() {
        let status = res.status();
        let body = res.text().await.unwrap_or_default();
        return Err(format!("API error {}: {}", status.as_u16(), body));
    }

    let json: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;

    // Parse different model list formats
    let models = if let Some(data) = json.get("data").and_then(|d| d.as_array()) {
        data.iter()
            .filter_map(|m| {
                m.get("id")
                    .and_then(|id| id.as_str())
                    .map(|s| s.to_string())
            })
            .collect::<Vec<String>>()
    } else if let Some(models) = json.get("models").and_then(|m| m.as_array()) {
        models
            .iter()
            .filter_map(|m| {
                m.get("name")
                    .and_then(|n| n.as_str())
                    .or_else(|| m.get("id").and_then(|id| id.as_str()))
            })
            .map(|s| s.to_string())
            .collect::<Vec<String>>()
    } else {
        info.default_models.clone()
    };

    Ok(models)
}

/// Lists all models available in the local Ollama instance (legacy, kept for compatibility).
#[tauri::command]
async fn list_ollama_models(endpoint: String) -> Result<Vec<String>, String> {
    list_provider_models("ollama".into(), endpoint, None).await
}

pub mod ai;
pub mod rate_limiter;
#[cfg(test)]
pub mod tests;

use crate::ai::{AiEngine, DefaultAiEngine, Message, Provider};
use std::str::FromStr;

const MAX_SETTINGS_FILE_SIZE: u64 = 1_048_576;
const MAX_MESSAGES: usize = 200;
const MAX_MESSAGE_CONTENT_SIZE: usize = 131_072;
const MAX_CONTEXT_SIZE: u32 = 1_048_576;
const MIN_TEMPERATURE: f32 = 0.0;
const MAX_TEMPERATURE: f32 = 2.0;
const MODELS_FETCH_TIMEOUT_SECS: u64 = 10;

const ALLOWED_REMOTE_HOSTS: &[&str] = &[
    "api.openai.com",
    "openrouter.ai",
    "api.groq.com",
    "api.together.xyz",
    "api.anthropic.com",
    "generativelanguage.googleapis.com",
    "opencode.ai",
];

pub(crate) fn is_localhost(endpoint: &str) -> bool {
    if endpoint.is_empty() {
        return true;
    }
    if let Ok(parsed) = url::Url::parse(endpoint) {
        if let Some(host) = parsed.host_str() {
            return host == "localhost"
                || host == "127.0.0.1"
                || host == "::1"
                || host.ends_with(".local");
        }
    }
    false
}

pub(crate) fn is_allowed_endpoint(endpoint: &str) -> bool {
    if endpoint.is_empty() {
        return true;
    }

    if is_localhost(endpoint) {
        return true;
    }

    if let Ok(parsed) = url::Url::parse(endpoint) {
        if let Some(host) = parsed.host_str() {
            return ALLOWED_REMOTE_HOSTS
                .iter()
                .any(|allowed| host == *allowed || host.ends_with(&format!(".{}", allowed)));
        }
    }

    false
}

fn validate_endpoint_url(endpoint: &str) -> Result<(), String> {
    if endpoint.is_empty() {
        return Ok(());
    }
    let parsed = url::Url::parse(endpoint).map_err(|e| format!("Invalid endpoint URL: {}", e))?;

    let scheme = parsed.scheme();
    if scheme != "http" && scheme != "https" {
        return Err("Endpoint scheme must be http or https".into());
    }

    if parsed.username() != "" || parsed.password().is_some() {
        return Err("Endpoint URL must not contain credentials".into());
    }

    if !is_localhost(endpoint) && scheme != "https" {
        return Err("Remote endpoints must use HTTPS. HTTP is only allowed for localhost.".into());
    }

    let full_url = parsed.to_string();
    if !is_allowed_endpoint(&full_url) {
        return Err(format!(
            "Endpoint host is not in the allowed list. Allowed hosts: localhost, {}",
            ALLOWED_REMOTE_HOSTS.join(", ")
        ));
    }
    Ok(())
}

fn validate_ai_params(
    provider: &str,
    endpoint: &str,
    model: &str,
    messages: &[Message],
    temperature: f32,
    num_ctx: u32,
) -> Result<(), String> {
    if provider.is_empty() {
        return Err("Provider cannot be empty".into());
    }
    Provider::from_str(provider).map_err(|e| format!("Invalid provider: {}", e))?;
    validate_endpoint_url(endpoint)?;
    if model.is_empty() {
        return Err("Model cannot be empty".into());
    }
    if messages.is_empty() {
        return Err("Messages array cannot be empty".into());
    }
    if messages.len() > MAX_MESSAGES {
        return Err(format!(
            "Messages array exceeds maximum of {} items",
            MAX_MESSAGES
        ));
    }
    for msg in messages {
        if msg.content.len() > MAX_MESSAGE_CONTENT_SIZE {
            return Err(format!(
                "Message content exceeds maximum of {} chars (CWE-400 mitigation)",
                MAX_MESSAGE_CONTENT_SIZE
            ));
        }
    }
    if !(MIN_TEMPERATURE..=MAX_TEMPERATURE).contains(&temperature) {
        return Err(format!(
            "Temperature must be between {} and {}",
            MIN_TEMPERATURE, MAX_TEMPERATURE
        ));
    }
    if num_ctx > MAX_CONTEXT_SIZE {
        return Err(format!(
            "Context size exceeds maximum of {}",
            MAX_CONTEXT_SIZE
        ));
    }
    Ok(())
}

/// Orchestrates an AI inference call across different providers.
#[tauri::command]
async fn call_ai(
    provider: String,
    endpoint: String,
    model: String,
    messages: Vec<Message>,
    temperature: f32,
    num_ctx: u32,
    api_key: Option<String>,
) -> Result<String, String> {
    validate_ai_params(
        &provider,
        &endpoint,
        &model,
        &messages,
        temperature,
        num_ctx,
    )?;
    let _guard = crate::rate_limiter::RateLimitGuard::acquire("call_ai")?;
    let engine = DefaultAiEngine::new();
    engine
        .call_ai(
            &provider,
            &endpoint,
            &model,
            messages,
            temperature,
            num_ctx,
            api_key,
        )
        .await
}

/// Orchestrates a streaming AI inference call.
#[tauri::command]
async fn call_ai_stream(
    provider: String,
    endpoint: String,
    model: String,
    messages: Vec<Message>,
    temperature: f32,
    num_ctx: u32,
    api_key: Option<String>,
) -> Result<String, String> {
    validate_ai_params(
        &provider,
        &endpoint,
        &model,
        &messages,
        temperature,
        num_ctx,
    )?;
    let _guard = crate::rate_limiter::RateLimitGuard::acquire("call_ai_stream")?;
    let engine = DefaultAiEngine::new();
    engine
        .call_ai_stream(
            &provider,
            &endpoint,
            &model,
            messages,
            temperature,
            num_ctx,
            api_key,
        )
        .await
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            app.handle().plugin(tauri_plugin_shell::init())?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_settings,
            save_settings,
            call_ai,
            call_ai_stream,
            list_ollama_models,
            list_provider_models,
            get_available_providers,
            save_api_key_secure,
            get_api_key_secure,
            save_provider_api_key,
            get_provider_api_key,
            secure_storage_set,
            secure_storage_get,
            secure_storage_remove
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
