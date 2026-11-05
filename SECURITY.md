# 🔒 Security Policy

Nexus Prompt Suite handles API keys and your prompts, so we take security seriously.
Thank you for helping keep it safe.

---

## 🚨 Reporting a vulnerability

**Please do not open a public issue for a security problem.**

Report it privately through either channel:

1. **GitHub private reporting:**
   [Report a vulnerability](https://github.com/ekosistema/nexus-prompt-suite/security/advisories/new)
2. **Email:** [security@celerolab.com](mailto:security@celerolab.com)

If you'd like to encrypt your report, ask for a public key in your first message
and we'll send one.

### What helps us most

- What the vulnerability is and what an attacker could do with it
- Steps to reproduce, or a small proof of concept
- The affected version and your operating system
- A suggested fix, if you have one

### What to expect

| When | What happens |
| :--- | :--- |
| Within 48 hours | We confirm we received your report |
| Within 7 days | We share an initial assessment and severity |
| Within 30 days | We aim to ship a fix for confirmed issues |
| After the fix | We agree on public disclosure with you |

With your permission, we'll credit you in the release notes.

---

## ✅ Supported versions

| Version | Supported |
| :--- | :--- |
| 1.3.x | ✅ Yes |
| Older | ❌ Please upgrade to the latest release |

---

## 🛡️ Security model

### What Nexus protects

| Concern | How it's handled |
| :--- | :--- |
| **API keys** | Stored in your OS keychain (Windows Credential Manager, macOS Keychain or Linux Secret Service). Never written to a file. |
| **Keys and the interface** | The interface can save or delete a key but **can never read it back**. Only the Rust backend uses it, when a request is made. |
| **Where keys are sent** | Hosted providers are only contacted at their official HTTPS address, and redirects are disabled, so a tampered setting can't send your key to another server. |
| **Key hygiene** | Keys are validated on save, never appear in error messages, and are redacted from console output. |
| **Local data** | History, custom templates and remembered values are encrypted (AES-GCM). The encryption key lives in the keychain. |
| **Privacy** | No telemetry, no analytics and no servers of our own. Prompts go only to the provider you choose. |
| **Network rules** | Remote endpoints must use HTTPS and cannot embed credentials. Local endpoints are limited to an allow-list of ports. |
| **Web content** | A strict content security policy. AI output is shown as plain text, never as HTML. |
| **Abuse and overload** | Rate limiting (30 requests per minute, 3 at a time) plus limits on message, response and file sizes. |
| **Error detail** | Release builds hide provider error bodies, which can echo request details. |

### What Nexus cannot protect

- **Someone with access to your computer.** An attacker with your unlocked session or
  administrator rights can use anything you can.
- **What your AI provider does with prompts.** Once a prompt leaves your machine, the
  provider's own policy applies. Use a local provider such as Ollama for maximum privacy.
- **Compromised dependencies.** We run `cargo audit` and `npm audit`, but we can't
  fully prevent supply-chain attacks.

---

## 🧑‍💻 Tips for users

1. **Use Ollama** when your prompts are sensitive. They never leave your computer.
2. **Keep your OS updated.** Nexus relies on your system keychain.
3. **Read your provider's privacy policy** before sending confidential data to the cloud.
4. **Use separate API keys per tool** and set spending limits where your provider allows it.
5. **Download Nexus only** from [nexus.celerolab.com](https://nexus.celerolab.com)
   or this repository's releases.

---

**Security contact:** [security@celerolab.com](mailto:security@celerolab.com)
