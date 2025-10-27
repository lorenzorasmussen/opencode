# OpenCode Neovim Plugin

A Neovim plugin that integrates OpenCode, the AI-powered coding assistant, directly into your Neovim workflow.

## Features

- Run OpenCode in a Neovim terminal
- Send current file references to OpenCode
- Automatic port management and connection testing
- Customizable keymaps and commands

## Installation

### Using vim-plug

```vim
Plug 'sst/opencode', { 'rtp': 'packages/neovim' }
```

### Using packer.nvim

```lua
use {
  'sst/opencode',
  rtp = 'packages/neovim'
}
```

### Manual Installation

1. Clone the repository
2. Copy `packages/neovim` to your Neovim plugin directory (e.g., `~/.config/nvim/plugin/opencode`)

## Configuration

Add to your `init.lua`:

```lua
require('opencode').setup({
  port = 8080, -- Optional: specify port (random if not set)
  command = "opencode", -- Command to run OpenCode
  auto_start = false, -- Auto-start server on plugin load
  keymap = "<leader>oc" -- Keymap to open OpenCode
})
```

## Usage

### Commands

- `:OpenCode` - Start the OpenCode server in a terminal
- `:OpenCodeFile` - Send the current file reference to OpenCode

### Keymaps

- `<leader>oc` - Open OpenCode (configurable)
- `<leader>ocf` - Send current file to OpenCode

### Workflow

1. Run `:OpenCode` to start the server
2. Use `<leader>ocf` to send the current file context
3. Interact with OpenCode in the terminal buffer

## Requirements

- Neovim 0.5+
- OpenCode binary installed and available in PATH
- curl (for HTTP communication)

## License

MIT
