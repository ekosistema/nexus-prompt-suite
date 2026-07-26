# Security Policy

## Reporting a Vulnerability

The Nexus Prompt Suite team takes security seriously. We appreciate your efforts to responsibly disclose vulnerabilities.

### Responsible Disclosure

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, send an encrypted report to **[security@celerolab.com](mailto:security@celerolab.com)**.

If you prefer encrypted communication, use our PGP key:

```
-----BEGIN PGP PUBLIC KEY BLOCK-----
(Contact security@celerolab.com to obtain the current public key)
-----END PGP PUBLIC KEY BLOCK-----
```

### What to Include

- A clear description of the vulnerability and its potential impact.
- Steps to reproduce the issue (proof-of-concept code, screenshots, or videos).
- Affected versions.
- Any suggested mitigations or fixes.

### What to Expect

| Timeline | Action |
| :--- | :--- |
| Within 48 hours | Acknowledgment of receipt |
| Within 7 days | Initial assessment and severity classification |
| Within 30 days | Patch release for confirmed vulnerabilities |
| After fix | Public disclosure coordinated with the reporter |

We follow a coordinated disclosure process and will keep you informed throughout.

## Supported Versions

| Version | Supported |
| :--- | :--- |
| 1.0.x | ✅ Active support |
| < 1.0.0 | ❌ Not supported |

## Security Model

### What Nexus Already Protects

| Concern | Mitigation |
| :--- | :--- |
| **API key storage** | Encrypted in OS-native credential manager (`keyring-rs`) — macOS Keychain, Windows Credential Manager, Linux Secret Service. Never in plain-text files. |
| **Prompt privacy** | All data stored locally. Zero telemetry, zero servers, zero external logging. API keys redacted from console output via `safeLog()`. |
| **SSRF prevention** | Endpoint URL whitelist (7 allowed remote hosts). HTTPS enforced for remote endpoints. Credential-free URL enforcement. |
| **Resource exhaustion** | 1MB file read cap, 128KB message size limit, 256KB stream buffer, 200 messages per request limit. |
| **XSS prevention** | Strict Content Security Policy (CSP) headers. AI outputs sanitized via DOMPurify before rendering. |
| **Rate limiting** | 30 requests per 60 seconds. Max 3 concurrent AI requests. RAII guard pattern for automatic release. |
| **Local storage encryption** | AES-GCM encrypted localStorage with encryption keys stored in OS keychain. |

### What Nexus Does NOT Protect

- **Local machine access**: An attacker with physical or root access to your machine can access any data stored on it, including the Nexus preferences file and keychain entries.
- **AI provider data handling**: Once a prompt leaves your machine, the AI provider's privacy policy applies. Nexus cannot control how providers handle your data.
- **Compromised dependencies**: While we audit dependencies (`cargo audit`, `npm audit`), supply chain attacks on third-party packages are outside our control.

## Security Best Practices for Users

1. **Use Ollama locally** for the highest privacy guarantee — prompts never leave your machine.
2. **Keep your system updated** — OS security patches protect the keychain Nexus depends on.
3. **Review API provider privacy policies** before sending sensitive data to cloud providers.
4. **Verify binary integrity** — check SHA-256 checksums published with each release.

## Acknowledgments

We maintain a hall of fame for security researchers who responsibly disclose vulnerabilities. With permission, we will publicly thank you in the release notes and on this page.

---

**Security contact**: [security@celerolab.com](mailto:security@celerolab.com)
