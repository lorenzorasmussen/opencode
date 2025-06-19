<p align="center">
  <a href="https://opencode.ai">
    <picture>
      <source srcset="packages/web/src/assets/logo-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/web/src/assets/logo-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/web/src/assets/logo-light.svg" alt="opencode logo">
    </picture>
  </a>
</p>
<p align="center">
  <a href="https://opencode.ai/docs"><img alt="view docs" src="https://img.shields.io/badge/View-Docs-blue?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/opencode-ai"><img alt="npm" src="https://img.shields.io/npm/v/opencode-ai?style=flat-square" /></a>
  <a href="https://github.com/sst/opencode/actions/workflows/publish.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/sst/opencode/publish.yml?style=flat-square&branch=dev" /></a>
</p>

---

AI coding agent, built for the terminal.

[![opencode Terminal UI](packages/web/src/assets/themes/opencode.png)](https://opencode.ai)

### Installation

```bash
# YOLO
curl -fsSL https://opencode.ai/install | bash

# Package managers
npm i -g opencode-ai@latest        # or bun/pnpm/yarn
brew install sst/tap/opencode      # macOS
paru -S opencode-bin               # Arch Linux
```

> **Note:** Remove versions older than 0.1.x before installing

### Documentation

For more info on how to configure opencode [**head over to our docs**](https://opencode.ai/docs).

### Contributing

To run opencode locally you need.

- Bun
- Golang 1.24.x

And run.

```bash
$ bun install
$ bun run packages/opencode/src/index.ts
```

### FAQ

#### How do I use this with OpenRouter?

OpenRouter is not in the Models.dev database yet, but you can configure it manually.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "openrouter": {
      "npm": "@openrouter/ai-sdk-provider",
      "name": "OpenRouter",
      "options": {},
      "models": {
        "anthropic/claude-3.5-sonnet": {
          "name": "Claude 3.5 Sonnet"
        }
      }
    }
  }
}
```

And then to configure an api key you can do `opencode auth login` and select "Other -> 'openrouter'"

#### How is this different than Claude Code?

It's very similar to Claude Code in terms of capability. Here are the key differences:

- 100% open source
- Not coupled to any provider. Although Anthropic is recommended, opencode can be used with OpenAI, Google or even local models. As models evolve the gaps between them will close and pricing will drop so being provider agnostic is important.
- A focus on TUI. opencode is built by neovim users and the creators of [terminal.shop](https://terminal.shop); we are going to push the limits of what's possible in the terminal.
- A client/server architecture. This for example can allow opencode to run on your computer, while you can drive it remotely from a mobile app. Meaning that the TUI frontend is just one of the possible clients.

#### What about Windows support?

There are some minor problems blocking opencode from working on windows. We are working on on them now. You'll need to use WSL for now.

#### What's the other repo?

The other confusingly named repo has no relation to this one. You can [read the story behind it here](https://x.com/thdxr/status/1933561254481666466).

---

**Join our community** [YouTube](https://www.youtube.com/c/sst-dev) | [X.com](https://x.com/SST_dev)
