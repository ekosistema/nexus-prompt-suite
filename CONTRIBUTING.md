# 🤝 Contributing to Nexus Prompt Suite

Thanks for wanting to make Nexus better! Whether you're fixing a typo, polishing a
template, adding a provider or building a whole new workspace, you're welcome here.

By taking part you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## 🗺️ Ways to help

| I want to… | Start here |
| :--- | :--- |
| 🐛 Report a bug | [Open a bug report](https://github.com/ekosistema/nexus-prompt-suite/issues/new?template=bug_report.md) |
| 💡 Suggest a feature | [Open a feature request](https://github.com/ekosistema/nexus-prompt-suite/issues/new?template=feature_request.md) |
| 📝 Improve or add a template | [Extending Nexus → Add a template](DEVELOPMENT.md#add-a-template) |
| 🔌 Add an AI provider | [Extending Nexus → Add a provider](DEVELOPMENT.md#add-a-provider) |
| 🔒 Report a vulnerability | **Not** in public. See [SECURITY.md](SECURITY.md) |
| ❓ Ask a question | See [SUPPORT.md](SUPPORT.md) |

---

## 🐛 Reporting a bug

1. Search the [existing issues](https://github.com/ekosistema/nexus-prompt-suite/issues) first.
2. Open a new one with the **Bug Report** template and include:
   - **Nexus version.** It's shown at the bottom of the sidebar.
   - **Operating system** and architecture.
   - **AI provider and model** you were using.
   - **Steps to reproduce**, and what you expected versus what happened.
   - Screenshots or logs, if you have them.

> ⚠️ Never paste an API key into an issue. If a log contains one, remove it first.

## 💡 Suggesting a feature

Tell us the **problem** you're trying to solve before the solution you have in mind.
The best requests describe a real workflow and who it helps. Mockups are welcome.

One thing to know up front: Nexus prefers **short forms**. A feature that adds many
optional fields usually makes prompts worse, so we'll often ask whether it can be
simpler.

---

## 🔧 Sending a pull request

### 1. Set up

```bash
git clone https://github.com/<your-username>/nexus-prompt-suite.git
cd nexus-prompt-suite/prompt-suite
npm install
npm run tauri dev
```

The full guide is in [DEVELOPMENT.md](DEVELOPMENT.md).

### 2. Make your change

```bash
git checkout -b feat/short-description
```

- Keep the pull request focused: one idea per PR.
- Follow the [inline documentation standards](docs/INLINE_STANDARDS.md).
- Add or update tests for behavior you change.
- If you change what users see, update the documentation and any translations
  (`src/renderer/src/lib/i18n.ts` holds both Spanish and English).

### 3. Check it

```bash
# from prompt-suite/
npm test
npx tsc --noEmit

# from prompt-suite/src-tauri/
cargo test
cargo clippy
cargo fmt --check
```

> ℹ️ There's no automated CI on pull requests yet. Please run the checks above
> yourself and say so in the PR.

### 4. Commit

We use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Use for |
| :--- | :--- |
| `feat:` | A new feature or workspace |
| `fix:` | A bug fix |
| `docs:` | Documentation only |
| `refactor:` | Restructuring without behavior change |
| `test:` | Adding or fixing tests |
| `chore:` | Build, tooling or dependencies |
| `style:` | Formatting only |

```
feat(templates): add a code review template
fix: keep form values when switching views
docs: clarify the release checklist
```

### 5. Open the pull request

Push your branch and open a PR against `main`. The template will walk you through
the checklist. Screenshots help a lot for anything visual.

---

## 📐 Code standards

- **Rust:** RustDoc on public items. No `unsafe` without a written justification.
- **TypeScript:** `strict` mode, no `any` unless unavoidable, JSDoc where it helps a reader.
- **Security:** never log or return API keys, and never read one from the UI side.
  Details in [SECURITY.md](SECURITY.md).
- **Templates:** write both Spanish and English, with the same variables in each.

---

## 💬 Community

- **Issues** are the place for bugs and feature requests.
- **GitHub Discussions** will open for questions and ideas soon.

Nexus is maintained by [CeleroLab](https://celerolab.com). Every contribution,
from a one-word fix to a new feature, is appreciated. 💜
