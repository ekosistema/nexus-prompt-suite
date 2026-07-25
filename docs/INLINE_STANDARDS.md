# Inline Documentation Standards

**Objective**: Ensure code maintainability and high-density technical context across the Prompt Suite ecosystem.

---

## 🦀 Rust Backend (RustDoc)

Use triple forward slashes `///` for public functions, structs, and enums.

### RustDoc Structure

1. **Summary**: A one-sentence description of the function's purpose.
2. **# Arguments**: Bullet list of inputs and their constraints.
3. **# Returns**: The successful data type or value.
4. **# Errors**: Common error scenarios and their causes.

### RustDoc Example

```rust
/// Securely retrieves the user's API key from the OS Keychain.
///
/// # Returns
/// * `Ok(String)` - The decrypted API key if found.
/// * `Ok(String::new())` - An empty string if no key is stored.
///
/// # Errors
/// * `Err(String)` - If the Keyring service is unavailable.
#[tauri::command]
fn get_api_key_secure() -> Result<String, String> {
    // ...
}
```

---

## ⚛️ Frontend / TypeScript (JSDoc)

Use standard JSDoc `/** */` blocks for services, utilities, and hooks.

### JSDoc Structure

1. **Summary**: Clear description of the method.
2. **@param**: Argument name and description.
3. **@returns**: Return type and description.
4. **@throws**: Error types if explicitly handled.

### JSDoc Example

```typescript
/**
 * Invokes the AI inference command via the Tauri IPC bridge.
 * 
 * @param {string} provider - The AI provider (ollama, openai, openrouter).
 * @param {Message[]} messages - Formal prompt structure.
 * @returns {Promise<string>} The generated AI text.
 * @throws {Error} If the backend returns a non-zero status.
 */
export async function callAI(provider: string, messages: Message[]): Promise<string> {
    // ...
}
```

---

🚀 **Prompt Suite Architecture Standards** | [Support](mailto:tech@celerolab.com)
