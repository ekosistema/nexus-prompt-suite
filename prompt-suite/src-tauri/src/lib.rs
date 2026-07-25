use tauri::Manager;

/// Retrieves the application settings from the documents directory.
/// 
/// # Returns
/// * `Ok(serde_json::Value)` - The parsed settings JSON object.
/// * `Ok(json!({"lang": "es"}))` - Default settings if file is missing.
/// 
/// # Errors
/// * `Err(String)` - If file read fails or file size exceeds 1MB (CWE-400 mitigation).
#[tauri::command]
fn get_settings(app: tauri::AppHandle) -> Result<serde_json::Value, String> {
    let mut path = app.path().document_dir().map_err(|e| e.to_string())?;
    path.push(".nexus_preferences.json");
    if path.exists() {
        let metadata = std::fs::metadata(&path).map_err(|e| e.to_string())?;
        if metadata.len() > 1_048_576 {
            return Err("El archivo de preferencias excede 1MB. Posible desbordamiento interceptado.".into());
        }

        let content = std::fs::read_to_string(path).map_err(|e| e.to_string())?;
        let json: serde_json::Value = serde_json::from_str(&content).map_err(|e| e.to_string())?;
        Ok(json)
    } else {
        Ok(serde_json::json!({ "lang": "es" }))
    }
}

/// Persists the application settings to the local JSON file.
#[tauri::command]
fn save_settings(app: tauri::AppHandle, mut settings: serde_json::Value) -> Result<bool, String> {
    let mut path = app.path().document_dir().map_err(|e| e.to_string())?;
    path.push(".nexus_preferences.json");
    
    // [CWE-312] Clean API keys from plain JSON
    if let Some(obj) = settings.as_object_mut() {
        obj.remove("apiKey");
    }

    let content = serde_json::to_string_pretty(&settings).map_err(|e| e.to_string())?;
    std::fs::write(path, content).map_err(|e| e.to_string())?;
    Ok(true)
}

/// Securely stores an API key in the OS-native credential manager (legacy).
#[tauri::command]
fn save_api_key_secure(key: String) -> Result<bool, String> {
    let entry = keyring::Entry::new("prompt-suite-ia", "user_api_key").map_err(|e| e.to_string())?;
    entry.set_password(&key).map_err(|e| e.to_string())?;
    Ok(true)
}

/// Retrieves the stored API key from the OS-native credential manager (legacy).
#[tauri::command]
fn get_api_key_secure() -> Result<String, String> {
    let entry = keyring::Entry::new("prompt-suite-ia", "user_api_key").map_err(|e| e.to_string())?;
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
        entry.delete_credential().ok();
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
    let entry = keyring::Entry::new("prompt-suite-ia", "user_api_key").map_err(|e| e.to_string())?;
    match entry.get_password() {
        Ok(pw) => Ok(pw),
        Err(_) => Ok("".to_string()),
    }
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

    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(10))
        .build()
        .map_err(|e| e.to_string())?;

    let base = if endpoint.is_empty() || !endpoint.starts_with("http") {
        info.default_url.clone()
    } else {
        endpoint.trim_end_matches('/').to_string()
    };

    if provider == "ollama" {
        let url = format!("{}{}", base, info.models_endpoint);
        let res = client.get(&url).send().await
            .map_err(|e| format!("Cannot connect to {}: {}", info.name, e))?;
        let json: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
        let models = json["models"]
            .as_array()
            .unwrap_or(&vec![])
            .iter()
            .filter_map(|m| m["name"].as_str().map(|s| s.to_string()))
            .collect::<Vec<String>>();
        return Ok(models);
    }

    if info.models_endpoint.is_empty() {
        // Provider doesn't have a models endpoint (Anthropic, Gemini)
        return Ok(info.default_models.clone());
    }

    let url = format!("{}{}", base, info.models_endpoint);
    let mut req = client.get(&url);

    if info.needs_api_key {
        let key = api_key.filter(|k| !k.is_empty());
        if let Some(k) = key {
            req = req.bearer_auth(&k);
        } else {
            return Ok(info.default_models.clone());
        }
    } else if info.supports_api_key {
        // Optional API key - use if available, but don't require it
        if let Some(key) = api_key.filter(|k| !k.is_empty()) {
            req = req.bearer_auth(&key);
        }
    }

    let res = req.send().await
        .map_err(|e| format!("Cannot connect to {}: {}", info.name, e))?;

    if !res.status().is_success() {
        return Ok(info.default_models.clone());
    }

    let json: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;

    // Parse different model list formats
    let models = if let Some(data) = json.get("data").and_then(|d| d.as_array()) {
        data.iter()
            .filter_map(|m| m.get("id").and_then(|id| id.as_str()).map(|s| s.to_string()))
            .collect::<Vec<String>>()
    } else if let Some(models) = json.get("models").and_then(|m| m.as_array()) {
        models.iter()
            .filter_map(|m| m.get("name").and_then(|n| n.as_str())
                .or_else(|| m.get("id").and_then(|id| id.as_str())))
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
#[cfg(test)]
pub mod tests;

use crate::ai::{AiEngine, DefaultAiEngine, Message};

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
    let engine = DefaultAiEngine::new();
    engine.call_ai(
        &provider,
        &endpoint,
        &model,
        messages,
        temperature,
        num_ctx,
        api_key,
    ).await
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
    let engine = DefaultAiEngine::new();
    engine.call_ai_stream(
        &provider,
        &endpoint,
        &model,
        messages,
        temperature,
        num_ctx,
        api_key,
    ).await
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
            get_provider_api_key
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
