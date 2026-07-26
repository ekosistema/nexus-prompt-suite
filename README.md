# ⚡ Nexus Prompt Suite

> **Your local-first command center for professional AI prompt engineering.** Build structured, secure, and surgically precise prompts that maximize the performance of any LLM — all from a native desktop app with zero telemetry.

<p align="center">
  <img src="https://img.shields.io/badge/build-passing-brightgreen?style=flat-square" alt="Build Status" />
  <img src="https://img.shields.io/badge/coverage-94%25-brightgreen?style=flat-square" alt="Coverage" />
  <img src="https://img.shields.io/badge/version-v1.0.1-blue?style=flat-square" alt="Version" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey?style=flat-square" alt="Platform" />
  <img src="https://img.shields.io/badge/rust-1.77%2B-orange?style=flat-square" alt="Rust Version" />
  <img src="https://img.shields.io/badge/tauri-v2.11-24C8A8?style=flat-square" alt="Tauri" />
  <img src="https://img.shields.io/badge/react-18-61DAFB?style=flat-square" alt="React" />
</p>

---

## 💡 About

**Nexus Prompt Suite** is a high-performance desktop application built on **Tauri v2**, **Rust**, and **React** that transforms how you interact with any large language model. Instead of crafting prompts manually and iterating through trial-and-error, Nexus provides structured, domain-specific workspaces that compose context-rich, constraint-aware prompts — guaranteeing precise, reproducible, and auditable LLM outputs.

Unlike web-based prompt tools that route your data through third-party servers, Nexus operates **100% locally**. Your prompts, preferences, API keys, and response history never leave your machine. API keys are encrypted at rest using the OS-native credential manager (**macOS Keychain**, **Windows Credential Manager**, **Linux Secret Service**), not stored in plain-text configuration files.

### ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 🔒 **Zero-Trust Privacy** | No servers, no telemetry, no analytics. API keys encrypted in OS-native keychain via `keyring-rs`. AES-GCM encrypted local storage. Prompt content and response history never exfiltrated. |
| 🧬 **Genesis Lab** | Universal creative prompt generator with 7 ideation techniques — SCAMPER, Mash-up, First Principles, Blue Ocean, Six Thinking Hats — and 4 prompting modes (Direct, Chain-of-Thought, Zero-shot CoT, Tree of Thought). |
| 💻 **Software Architect** | High-density technical prompt compiler. Supports 9 project types, multiple tech stacks, 6 strategic focus areas (Performance, Security, Scalability, Testing, DX, Accessibility), and auto-injects OWASP constraints and structured output formats. |
| 🛡️ **Code Auditor** | Security-focused code auditing with 8 scan types — SAST, SCA, Secrets, OWASP Top 10, Input Validation, Auth, Error Handling, and Dependency Analysis — aligned with SOC 2, ISO 27001, PCI-DSS, HIPAA, and GDPR compliance frameworks. |
| 🎨 **Content Studio** | Transform concepts into 15 content formats — blog posts, whitepapers, podcasts, infographics, email sequences, video scripts. Includes audience profiles, mental frameworks (First Principles, Feynman, Pareto), and SEO optimization directives. |
| 📱 **Social Strategist** | Multi-channel campaign builder with high-engagement hooks, psychological triggers (Social Proof, Scarcity, Authority), persuasive frameworks (PAS, AIDA, Storytelling), and a visual brief generator for AI image models. |
| 📋 **Template Library** | 60+ bilingual templates (ES/EN) across DevOps, Security, Writing, Business, Social Media, and Creative categories. Supports custom variable interpolation and user-defined templates. |
| 🌐 **12 AI Providers** | Native support for Ollama (local), OpenAI, OpenRouter, Groq, LM Studio, OpenWebUI, vLLM, Together AI, Anthropic, Google Gemini, OpenCode Zen, and OpenCode Go. Both streaming and non-streaming inference via SSE. |
| 🌍 **Bilingual Interface** | Full Spanish (ES) and English (EN) localization with hot-swap language switching. All suites, templates, and UI elements translated. |
| ⚡ **Rate-Limited Safety** | Built-in rate limiter — 30 requests per 60 seconds, 3 concurrent AI requests max — preventing runaway costs and resource exhaustion. |

---

## 🚀 Quick Start

Get Nexus Prompt Suite running in **under 2 minutes**:

### 1️⃣ Download the installer

Grab the latest binary from the [Releases page](https://github.com/ekosistema/nexus-prompt-suite/releases):

| Platform | Format |
| :--- | :--- |
| 🪟 **Windows** | `.exe` / `.msi` |
| 🍎 **macOS** | `.dmg` (Apple Silicon + Intel) |
| 🐧 **Linux** | `.deb` / `.AppImage` / `.rpm` |

### 2️⃣ Install and launch

Run the downloaded installer. On macOS, if Gatekeeper blocks the unsigned app:

```bash
# Right-click → Open in the Applications folder
# Or from terminal:
sudo xattr -cr /Applications/Nexus\ Prompt\ Suite.app
```

### 3️⃣ Configure your AI provider

Open the app, navigate to **Settings** (⚙️), and select your provider:

- **Ollama** (recommended for full privacy): models run entirely on your hardware — no internet required.
- **OpenAI / Anthropic / Gemini / OpenRouter**: enter your API key and pick a model.
- **LM Studio / OpenWebUI / vLLM**: point to your self-hosted endpoint.

✅ You're ready. Pick a suite, configure your parameters, and generate a professional-grade prompt.

---

## ⚙️ Installation (from source)

### Prerequisites

| Tool | Minimum Version | Install |
| :--- | :--- | :--- |
| **Node.js** | ≥ 20.0.0 | [nodejs.org](https://nodejs.org) |
| **Rust** | ≥ 1.77.2 | [rustup.rs](https://rustup.rs) |
| **Git** | ≥ 2.30 | [git-scm.com](https://git-scm.com) |

#### System dependencies

**Linux (Ubuntu/Debian):**
```bash
sudo apt update && sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  libssl-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

**macOS:**
```bash
xcode-select --install
```

**Windows:** WebView2 (preinstalled on Windows 10/11). Microsoft Visual Studio C++ Build Tools.

### Build steps

```bash
# 1. Clone the repository
git clone https://github.com/ekosistema/nexus-prompt-suite.git
cd nexus-prompt-suite/prompt-suite

# 2. Install frontend dependencies
npm install --legacy-peer-deps

# 3. Start the development server with hot-reload
npm run tauri dev

# 4. Create a production build
npm run tauri build
```

The production binary will be located at `prompt-suite/src-tauri/target/release/bundle/`.

### Environment variables

| Variable | Description | Required |
| :--- | :--- | :--- |
| `TAURI_SIGNING_PRIVATE_KEY` | Private key for code signing (CI/release only) | No |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | Password for the signing key | No |

> ⚠️ **Important:** API keys are managed exclusively through the in-app **Settings Dashboard** and stored encrypted in the OS-native keychain via `keyring-rs`. Do **not** place API keys in `.env` files, environment variables, or shell profiles.

---

## 💻 Usage

### Application workflow

The app offers **3 interchangeable view modes**:

| Mode | Description |
| :--- | :--- |
| **Form Mode** | Guided construction via dynamic forms with contextual field validation. |
| **Prompt Mode** | Direct raw prompt editor with syntax highlighting and a live preview of the structured output. |
| **Split Mode** | Side-by-side view — form on the left, generated prompt on the right in real time. |

```
┌──────────────────────────────────────────────────────┐
│  🎯 Choose Suite  →  📝 Configure  →  ⚡ Generate    │
│                            │                         │
│                    ┌───────┴────────┐                │
│                    ▼                ▼                │
│              🤖 Auto-Execute   📋 Copy/Export        │
│                    │                                 │
│                    ▼                                 │
│              🔍 Evaluate & Refine                    │
└──────────────────────────────────────────────────────┘
```

### Example: generate a microservices architecture prompt

```typescript
// The Software Architect suite composes a structured prompt
// with the following configuration via the form UI:

const config = {
  projectType: "web",
  architecture: "microservices",
  focus: ["performance", "security"],
  backendStack: "rust",
  frontendStack: "react",
  database: "postgresql",
  deployment: "aws",
  testing: "e2e",
  granularity: "detailed"
};

// Generated prompt includes:
//   ✓ Chain-of-Thought reasoning steps
//   ✓ Role definition for the LLM
//   ✓ OWASP Top 10 security constraints
//   ✓ Performance SLOs (p95 < 100ms)
//   ✓ Structured Markdown output format
```

### Example: invoking AI inference programmatically

```typescript
import { aiService } from './services/ai';

const response = await aiService.generate({
  provider: 'openai',
  endpoint: 'https://api.openai.com',
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: 'You are a senior software architect.' },
    { role: 'user', content: 'Design a rate-limiting middleware for a REST API.' }
  ],
  temperature: 0.7,
  numCtx: 8192,
  stream: true  // SSE streaming enabled
});
```

### User configuration

Application preferences are persisted locally at:

| Platform | Path |
| :--- | :--- |
| **macOS** | `~/Library/Application Support/com.celerolab.nexus/.nexus_preferences.json` |
| **Linux** | `~/.local/share/com.celerolab.nexus/.nexus_preferences.json` |
| **Windows** | `%APPDATA%\com.celerolab.nexus\.nexus_preferences.json` |

The preferences file stores UI state, language selection, and model preferences — but **never** contains API keys. Keys are stored exclusively in the native OS keychain.

---

## 🏗️ Project Structure

```
nexus-prompt-suite/
├── .github/
│   └── workflows/
│       └── build-and-release.yml    # CI/CD — multi-platform matrix builds + SBOM
├── docs/
│   ├── INLINE_STANDARDS.md          # RustDoc + JSDoc conventions
│   └── screenshots/                 # Application screenshots
├── VERSION                          # Semantic version (1.0.1)
├── LICENSE                          # MIT License
├── DEVELOPMENT.md                   # Architecture deep-dive and dev guide
└── prompt-suite/                    # ⚡ Main workspace
    ├── index.html                   # HTML shell with strict CSP headers
    ├── vite.config.ts               # Vite + Vitest configuration
    ├── tsconfig.json                # TypeScript strict mode
    ├── tailwind.config.cjs          # Tailwind with HSL design tokens
    ├── resources/
    │   └── icon.png                 # Application icon
    ├── src/
    │   └── renderer/                # ⚛️ Frontend — React 18 + TypeScript
    │       └── src/
    │           ├── main.tsx          # React entry point
    │           ├── App.tsx           # Root component with tab routing
    │           ├── index.css         # Tailwind + dark theme + CSS custom properties
    │           ├── components/       # Reusable UI components
    │           │   ├── Layout.tsx
    │           │   ├── Sidebar.tsx
    │           │   ├── SettingsDashboard.tsx
    │           │   └── ui/          # Primitive components (DynamicForm, PromptViewerPanel, etc.)
    │           ├── features/
    │           │   ├── suite/        # Suite workspaces (Genesis, Dev, Audit, Studio, Social, Chat)
    │           │   └── matrix/       # Alternative prompt matrix
    │           ├── contexts/
    │           │   └── AppContext.tsx # Global state (settings, i18n, models)
    │           ├── hooks/
    │           │   ├── useAIInference.ts      # Core AI inference hook
    │           │   ├── usePromptGenerator.ts  # Prompt state management
    │           │   └── useDebounce.ts         # Generic debounce utility
    │           ├── lib/
    │           │   ├── i18n.ts               # Full ES/EN translations (447 lines)
    │           │   ├── utils.ts              # cn(), safeLog(), sanitizeAIOutput()
    │           │   └── secureStorage.ts      # AES-GCM encrypted localStorage
    │           └── services/
    │               └── ai.ts                 # IPC abstraction layer for AI operations
    └── src-tauri/                   # 🦀 Backend — Rust + Tauri v2
        ├── Cargo.toml               # Rust dependencies
        ├── tauri.conf.json          # Tauri v2 application configuration
        ├── capabilities/
        │   └── default.json         # Permission manifest
        ├── icons/                   # Platform-specific app icons
        └── src/
            ├── main.rs              # Entry point
            ├── lib.rs               # IPC bridge — 15 Tauri commands (501 lines)
            ├── rate_limiter.rs      # Rate limiting (30 req/60s, 3 concurrent)
            ├── tests.rs             # 10 unit tests with MockAiEngine
            └── ai/
                ├── mod.rs           # Module re-exports
                ├── engine.rs        # AiEngine trait + DefaultAiEngine
                ├── providers.rs     # 12 AI provider definitions
                ├── types.rs         # Core types (Message, Provider, ProviderInfo)
                └── engines/
                    ├── ollama.rs         # Ollama inference + streaming
                    ├── anthropic.rs      # Anthropic Claude API
                    ├── gemini.rs         # Google Gemini API
                    └── openai_compat.rs  # OpenAI-compatible providers (8 implementations)
```

### Architecture diagram

```
┌──────────────────────────────────────────────────────────┐
│                    ⚛️  Frontend                          │
│  React 18  ·  TypeScript  ·  Tailwind CSS  ·  Vite      │
│                                                          │
│  AppContext  →  Hooks (useAIInference)  →  Services      │
└──────────────────────┬───────────────────────────────────┘
                       │  Tauri IPC (invoke)
┌──────────────────────┴───────────────────────────────────┐
│                    🔗  IPC Bridge                        │
│  15 typed Tauri commands — serialize/deserialize         │
└──────────────────────┬───────────────────────────────────┘
                       │
┌──────────────────────┴───────────────────────────────────┐
│                    🦀  Backend (Rust)                    │
│                                                          │
│  lib.rs  ─── Rate Limiter  ─── AiEngine Trait           │
│    │                              │                      │
│    ├── Settings (get/save)        ├── Ollama (local)     │
│    ├── Secure Storage (AES-GCM)   ├── Anthropic          │
│    └── API Keys → OS Keychain     ├── Gemini             │
│                                   ├── OpenAI-compat (8)  │
│                                   └── SSE Streaming      │
└──────────────────────────────────────────────────────────┘
```

---

## 📡 API Reference

Nexus exposes a set of Tauri IPC commands accessible from the frontend via `invoke()`. Below is the reference for the primary commands available through the `aiService` abstraction layer.

| Endpoint | Parameters | Returns | Description |
| :--- | :--- | :--- | :--- |
| `call_ai` | `provider: string`<br/>`endpoint: string`<br/>`model: string`<br/>`messages: Message[]`<br/>`temperature: number`<br/>`numCtx: number` | `string` | Sends a non-streaming inference request to the configured AI provider. Returns the full LLM response as a single string. |
| `call_ai_stream` | `provider: string`<br/>`endpoint: string`<br/>`model: string`<br/>`messages: Message[]`<br/>`temperature: number`<br/>`numCtx: number` | `string` | Sends a streaming inference request via SSE. Returns the accumulated response once the stream completes. |
| `get_available_providers` | — | `ProviderInfo[]` | Returns metadata for all 12 supported AI providers — including default models, endpoint URLs, authentication requirements, and cost tiers. |
| `list_provider_models` | `provider: string`<br/>`endpoint: string`<br/>`apiKey?: string` | `string[]` | Fetches the available model list from the remote provider's API. Timeout: 10 seconds. |
| `list_ollama_models` | `endpoint: string` | `string[]` | Queries a local Ollama instance for installed models via `/api/tags`. |
| `get_settings` | — | `serde_json::Value` | Reads application preferences from the local preferences file. Returns `{ "lang": "es" }` if no file exists. |
| `save_settings` | `settings: serde_json::Value` | `bool` | Persists application preferences. API keys are automatically stripped before write (CWE-312 mitigation). |
| `save_provider_api_key` | `provider: string`<br/>`key: string` | `bool` | Stores an API key in the OS-native credential manager with provider-specific keychain suffix. |
| `get_provider_api_key` | `provider: string` | `string` | Retrieves the stored API key from the OS-native credential manager for a specific provider. |
| `secure_storage_set` / `secure_storage_get` / `secure_storage_remove` | `key: string`<br/>`value: string` | `bool` / `string` | AES-GCM encrypted localStorage with encryption keys stored in the OS keychain. |

### Type definitions

```typescript
interface Message {
    role: "system" | "user" | "assistant";
    content: string;
}

interface ProviderInfo {
    id: string;             // e.g. "openai", "ollama", "anthropic"
    name: string;           // e.g. "OpenAI", "Ollama (Local)"
    icon: string;           // Emoji icon
    default_url: string;    // API base URL
    default_models: string[];
    needs_api_key: boolean;
    supports_api_key: boolean;
    keyring_suffix: string;
    api_path: string;       // e.g. "/v1/chat/completions"
    models_endpoint: string; // e.g. "/v1/models"
    is_openai_compat: boolean;
    description: string;
    cost_tier: "$" | "$$" | "$$$" | "free";
    docs_url: string;
}
```

### Security constraints

| Constraint | Value |
| :--- | :--- |
| Max messages per request | 200 |
| Max message content size | 128 KB |
| Max settings file size | 1 MB |
| Max stream buffer | 256 KB |
| Temperature range | 0.0 – 2.0 |
| Model fetch timeout | 10 seconds |
| Rate limit | 30 requests / 60 seconds |
| Concurrent AI requests | 3 maximum |
| Allowed remote hosts | OpenAI, OpenRouter, Groq, Together, Anthropic, Gemini, OpenCode |

---

## 🤝 Contributing

We welcome contributions from the community. Whether it's a bug report, a feature proposal, a translation improvement, or a pull request — your input makes Nexus better.

### Reporting bugs

1. Check the [existing issues](https://github.com/ekosistema/nexus-prompt-suite/issues) to avoid duplicates.
2. Open a new issue using the **Bug Report** template.
3. Include: your OS and version, steps to reproduce, expected vs actual behavior, and any relevant logs.

### Feature requests

1. Open a **Feature Request** issue.
2. Describe the problem your proposal solves and the use case it targets.
3. If applicable, include mockups or examples of the desired behavior.

### Development workflow

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/nexus-prompt-suite.git
cd nexus-prompt-suite/prompt-suite

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Create a feature branch
git checkout -b feat/your-feature-name

# 4. Run dev mode
npm run tauri dev

# 5. Run tests before committing
npm test                     # Frontend (Vitest)
cargo test --manifest-path src-tauri/Cargo.toml  # Backend (Rust)

# 6. Commit using Conventional Commits
git commit -m "feat(suite): add new template category"
```

### Commit conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Usage |
| :--- | :--- |
| `feat:` | New feature or suite workspace |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `refactor:` | Code restructuring without behavior changes |
| `test:` | Adding or updating tests |
| `chore:` | Build, CI, or tooling changes |
| `style:` | Formatting, linting (no logic changes) |

### Pull Request process

1. Ensure your branch is up to date with `main`.
2. Run the full test suite — both frontend (`npm test`) and backend (`cargo test`).
3. Run `cargo clippy` and `cargo fmt` for Rust, and `npx tsc --noEmit` for TypeScript.
4. Update documentation if your change affects the public API or user-facing behavior.
5. Open a PR against `main` with a clear description and a reference to the related issue.
6. All CI checks must pass before merging.

---

## 🧪 Testing

Nexus Prompt Suite uses **Vitest** for frontend testing and Rust's built-in test framework for backend testing.

### Frontend (React + TypeScript)

```bash
npm test
```

| Tool | Purpose |
| :--- | :--- |
| **Vitest** | Test runner (Vite-native, fast) |
| **happy-dom** | Lightweight DOM environment |
| **@testing-library/react** | Component rendering and queries |
| **@testing-library/user-event** | Simulated user interactions |

Test files are co-located with their implementation (e.g., `useAIInference.test.tsx` beside `useAIInference.ts`).

### Backend (Rust)

```bash
cargo test --manifest-path prompt-suite/src-tauri/Cargo.toml
```

The Rust test suite covers four phases:

| Phase | Scope |
| :--- | :--- |
| **1 — Happy path** | Valid AI inference, settings persistence, provider queries |
| **2 — Hostile path** | Missing API keys, empty messages, simulated network timeouts |
| **3 — Security** | Localhost validation, allowed endpoint matching, bypass attempts |
| **4 — Performance** | 100K character payload processed in < 50ms |

Tests use a `MockAiEngine` that implements the `AiEngine` trait, enabling isolated verification without hitting real APIs.

### Full CI validation

```bash
# Frontend
npm test                   # Vitest suite

# Backend
cargo test                 # Rust unit tests
cargo clippy               # Lint
cargo fmt --check          # Format check

# TypeScript
npx tsc --noEmit           # Type checking

# Security
cargo audit                # Dependency vulnerability scan
npm audit                  # Frontend dependency audit
```

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 CeleroLab

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

See the full license text in [LICENSE](LICENSE).

---

## 🙏 Credits & Acknowledgements

Nexus Prompt Suite is built on the shoulders of extraordinary open-source projects:

| Technology | Role in Nexus |
| :--- | :--- |
| [**Tauri v2**](https://v2.tauri.app) | Cross-platform desktop framework — the Rust-to-web bridge enabling native performance with a web UI |
| [**Rust**](https://www.rust-lang.org) | Core language — memory safety, zero-cost abstractions, and fearless concurrency |
| [**React 18**](https://react.dev) | UI library — declarative component architecture with concurrent rendering |
| [**TypeScript**](https://www.typescriptlang.org) | Type-safe frontend — `strict: true` across the entire codebase |
| [**Vite**](https://vitejs.dev) | Build tool — instant HMR and optimized production bundles |
| [**Tailwind CSS**](https://tailwindcss.com) | Utility CSS framework — dark theme with HSL design token system |
| [**reqwest**](https://docs.rs/reqwest) | Async HTTP client in Rust — handles all AI provider communication and SSE streaming |
| [**keyring-rs**](https://crates.io/crates/keyring) | Native cryptographic storage — macOS Keychain, Windows Credential Manager, Linux Secret Service |
| [**Vitest**](https://vitest.dev) | Frontend testing — Vite-compatible, fast, and feature-complete |
| [**Lucide React**](https://lucide.dev) | Consistent, minimalist open-source icon library |
| [**serde**](https://serde.rs) | High-performance serialization/deserialization framework for Rust |
| [**tokio**](https://tokio.rs) | Async runtime powering all concurrent AI inference operations |
| [**DOMPurify**](https://github.com/cure53/DOMPurify) | HTML/Markdown sanitization — prevents XSS in rendered AI outputs |

Special thanks to the **OpenAI**, **Anthropic**, **Google Gemini**, **Ollama**, and **OpenRouter** teams for their APIs and the broader AI community for advancing the field of prompt engineering.

---

<p align="center">
  <strong>⚡ Nexus Prompt Suite</strong><br />
  <em>Potentiating human intelligence with AI — privately, locally, precisely.</em><br /><br />
  Built with passion by <a href="https://celerolab.com?utm_source=github&utm_medium=readme&utm_campaign=nexus-prompt-suite"><strong>CeleroLab</strong></a><br />
  Copyright © 2026 &nbsp;|&nbsp;
  <a href="https://celerolab.com?utm_source=github&utm_medium=readme&utm_campaign=nexus-prompt-suite">celerolab.com</a> &nbsp;|&nbsp;
  <a href="https://github.com/ekosistema/nexus-prompt-suite">GitHub</a> &nbsp;|&nbsp;
  <a href="mailto:info@celerolab.com">Technical Support</a>
</p>
