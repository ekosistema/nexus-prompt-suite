# 💬 Getting Help

Nexus Prompt Suite is a community-supported open-source project. Here's the quickest
way to get unstuck.

---

## 🧭 Where to go

| I need to… | Go here |
| :--- | :--- |
| Learn how Nexus works | [README](README.md) |
| Set it up, build it or understand the code | [DEVELOPMENT.md](DEVELOPMENT.md) |
| Fix a problem I ran into | [Troubleshooting](DEVELOPMENT.md#-troubleshooting) |
| Report a bug | [Bug report](https://github.com/ekosistema/nexus-prompt-suite/issues/new?template=bug_report.md) |
| Suggest an idea | [Feature request](https://github.com/ekosistema/nexus-prompt-suite/issues/new?template=feature_request.md) |
| Report a security problem | [SECURITY.md](SECURITY.md) — **please don't use public issues** |
| Contribute | [CONTRIBUTING.md](CONTRIBUTING.md) |
| Reach the team | [info@celerolab.com](mailto:info@celerolab.com) |

A good bug report includes your **Nexus version** (bottom of the sidebar), your
**operating system**, the **provider and model** you used, and the steps to reproduce.
Never include an API key.

---

## ❓ FAQ

### Is Nexus free?

Yes. Nexus is open source under the MIT license. Hosted AI providers charge for their
own API usage; local options such as Ollama are free.

### Does Nexus send my data anywhere?

Only to the AI provider **you** choose, and only when you generate a prompt with AI.
In **No AI** mode, or with a local provider such as Ollama, nothing leaves your
computer. Nexus has no telemetry, analytics or servers of its own.

### Where are my API keys kept?

In your operating system's keychain. The Nexus interface can save or delete a key but
can never read it back. See [SECURITY.md](SECURITY.md).

### Which providers are supported?

Twelve: Ollama, OpenAI, OpenRouter, Groq, LM Studio, OpenWebUI, vLLM, Together AI,
Anthropic, Google Gemini, OpenCode Zen and OpenCode Go.

### Can I use a custom OpenAI-compatible endpoint?

Yes, with a self-hosted provider such as **vLLM**, **LM Studio** or **OpenWebUI**. Hosted
providers (OpenAI, Anthropic and so on) only accept their official address. That's a
deliberate safeguard so your key can't be redirected to another server.

### Why does a prompt come out without AI polish?

Either the **No AI** mode is on, or the model couldn't be reached. In both cases
you still get the base prompt, ready to copy. Check your provider in *Settings*.

### Where did my history go?

History is stored encrypted on your computer with a key kept in your keychain. If you
reset your keychain, old entries can't be decrypted. You can export your history as
JSON from the history panel to keep a backup.

### How do I keep my prompts completely private?

Pick **Ollama** (or another local provider) and, if you like, switch to **No AI** mode.

### Can I contribute?

Please do! Start with [CONTRIBUTING.md](CONTRIBUTING.md).

---

<div align="center">

**Nexus Prompt Suite** · built by [CeleroLab](https://celerolab.com)

</div>
