# Contributing to Nexus Prompt Suite

Thank you for your interest in contributing. This document outlines the processes and conventions for contributing to the project.

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [info@celerolab.com](mailto:info@celerolab.com).

## How Can I Contribute?

### Reporting Bugs

1. Search the [existing issues](https://github.com/ekosistema/nexus-prompt-suite/issues) to avoid duplicates.
2. Open a new issue using the **Bug Report** template.
3. Include:
   - **Version** of Nexus Prompt Suite (`Help > About` or `VERSION` file).
   - **Operating system** and architecture.
   - **AI provider** and model used.
   - **Steps to reproduce** the error.
   - **Expected vs. observed behavior**.
   - Screenshots or logs if applicable.

### Suggesting Features

1. Search [existing feature requests](https://github.com/ekosistema/nexus-prompt-suite/issues?q=is%3Aissue+label%3Aenhancement).
2. Open a new issue using the **Feature Request** template.
3. Describe:
   - The problem your proposal solves.
   - The use case it targets.
   - Any relevant context (workflows, integrations, etc.).
   - Mockups or examples if applicable.

### Pull Requests

1. **Fork** the repository and create your branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. **Make your changes** following the code standards below.
3. **Test thoroughly** — run the full validation chain:
   ```bash
   npm test                   # Frontend (Vitest)
   cargo test                 # Backend (Rust)
   npx tsc --noEmit           # TypeScript typecheck
   cargo clippy -- -D warnings
   cargo fmt --check
   ```
4. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat(suite): add new template category
   fix: resolve race condition in get_settings
   docs: update API reference examples
   test: add integration tests for code auditor
   ```
5. **Push** to your fork and open a Pull Request against `main`.
6. Ensure all **CI checks pass** before requesting review.

## Development Setup

See [DEVELOPMENT.md](./DEVELOPMENT.md) for a complete guide on setting up the local environment, project architecture, and data flow.

Quick start:
```bash
cd prompt-suite
npm install --legacy-peer-deps
npm run tauri dev
```

## Code Standards

- **Rust**: RustDoc with `# Arguments`, `# Returns`, `# Errors` sections. No `unsafe` blocks without explicit justification.
- **TypeScript**: JSDoc with `@param`, `@returns`, `@throws` annotations. Full strict mode (`strict: true`).
- See [`docs/INLINE_STANDARDS.md`](./docs/INLINE_STANDARDS.md) for detailed conventions.

## Commit Convention

| Prefix | Usage |
| :--- | :--- |
| `feat:` | New feature or suite workspace |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `refactor:` | Code restructuring without behavior changes |
| `test:` | Adding or updating tests |
| `chore:` | Build, CI, or tooling changes |
| `style:` | Formatting, linting (no logic changes) |

## Community

- **GitHub Discussions**: Coming soon for Q&A and general topics.
- **Issues**: Bug reports and feature requests.
- **Security**: See [SECURITY.md](./SECURITY.md) for responsible disclosure.

---

**Nexus Prompt Suite** is maintained by [CeleroLab](https://celerolab.com?utm_source=github&utm_medium=contributing&utm_campaign=nexus-prompt-suite). We appreciate every contribution, from fixing a typo to architecting a new feature.
