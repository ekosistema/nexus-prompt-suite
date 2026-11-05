# 📐 Inline Documentation Standards

Good comments save the next person, often future you, from guessing. This page
explains how we document code in Nexus.

**The rule of thumb:** explain *why* and *what to watch out for*. Don't repeat what
the code already says.

---

## 🦀 Rust (RustDoc)

Use `///` on public functions, structs and enums, and on any command exposed to the UI.

### Structure

1. **Summary:** one sentence on what it does.
2. **`# Arguments`:** inputs and their constraints (when not obvious).
3. **`# Returns`:** what a successful call gives back.
4. **`# Errors`:** what can go wrong, and why.

### Example

```rust
/// Reports whether a provider has an API key stored in the OS keychain.
///
/// The key itself never leaves the Rust process; the interface only learns
/// whether one exists.
///
/// # Arguments
/// * `provider` - A provider id such as `"openai"`. Unknown ids return `false`.
///
/// # Returns
/// * `Ok(true)` - A non-empty key is stored.
/// * `Ok(false)` - No key is stored, or the provider doesn't need one.
///
/// # Errors
/// * `Err(String)` - The keychain entry could not be created.
#[tauri::command]
fn has_provider_api_key(provider: String) -> Result<bool, String> {
    // ...
}
```

### Also

- Mark security-relevant limits with the reason (for example `// Redirects are disabled:
  reqwest only strips Authorization, not x-api-key`).
- Never write `unsafe` without a comment explaining why it is sound.
- Never put real keys or tokens in examples. Use obvious placeholders.

---

## ⚛️ TypeScript (JSDoc)

Use `/** … */` on services, hooks and utilities that others will call.

### Structure

1. **Summary:** what it does and when to use it.
2. **`@param`:** each argument and its meaning.
3. **`@returns`:** what comes back.
4. **`@throws`:** only errors the caller is expected to handle.

### Example

```typescript
/**
 * Asks the backend for the models a provider currently offers.
 *
 * The API key is resolved inside Rust from the OS keychain; it is never
 * passed from the interface.
 *
 * @param provider - A provider id such as `"anthropic"`.
 * @param endpoint - Optional custom endpoint; empty uses the provider default.
 * @returns The model ids, or the provider's built-in defaults if none are found.
 * @throws {Error} If the provider can't be reached or rejects the request.
 */
export async function listProviderModels(provider: string, endpoint: string): Promise<string[]> {
    // ...
}
```

### Also

- With TypeScript `strict` on, skip types in JSDoc: they're already in the signature.
- Comment non-obvious decisions, such as why state lives outside a component.

---

## 🌐 Language

- **Code comments and documentation:** English.
- **User-facing text:** goes in `src/renderer/src/lib/i18n.ts` with both **Spanish and
  English** entries. Never hard-code visible text in a component.

---

Questions? See [CONTRIBUTING.md](../CONTRIBUTING.md).
