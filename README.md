# OpenCode

The AI coding agent built for the terminal.

## Overview

OpenCode is a fully open source AI coding agent that helps you write and run code directly from the terminal. With over 26,000 GitHub stars and 200,000+ monthly developers, OpenCode provides:

- **Native TUI** - Responsive, themeable terminal interface
- **LSP enabled** - Automatic language server protocol support
- **Multi-session** - Run multiple agents in parallel
- **Share links** - Share sessions for reference and debugging
- **Any model** - 75+ LLM providers through Models.dev
- **Any editor** - Works with any IDE
- **Privacy first** - Zero code storage for sensitive environments
- **Comprehensive Testing** - 166+ tests with 100% pass rate
- **CI/CD Pipeline** - Automated testing, quality checks, and deployment

## Quick Start

### Installation

```bash
curl -fsSL https://opencode.ai/install | bash
```

Or use your preferred package manager:

- `npm install -g @opencode-ai/opencode`
- `bun install -g @opencode-ai/opencode`
- `brew install opencode`

### Basic Usage

```bash
# Start OpenCode
opencode

# Show available models
opencode models

# Show help
opencode --help
```

## Documentation

### Core Documentation

- **[Agent Guidelines](./AGENTS.md)** - Agent configuration and development
- **[Model Guide](./MODELS.md)** - Available models and pricing
- **[Configuration](./opencode.json)** - Project configuration
- **[MCP Usage Guide](./MCP_USAGE_GUIDE.md)** - Model Context Protocol integration
- **[Rube Tools Reference](./RUBE_TOOLS_REFERENCE.md)** - Complete Rube MCP server toolkit reference

### Consolidated Agent and Command System

OpenCode uses a streamlined agent and command system optimized for efficiency:

#### Primary Agents (4)

- **build** - Full development workflow (implementation, testing, version control)
- **plan** - Strategic planning and analysis (read-only)
- **orchestrator** - Task coordination and system architecture design
- **researcher** - Deep investigation and research

#### Subagents (6)

- **code-modifier** - File editing, formatting, and cleanup
- **code-searcher** - Advanced code and semantic search
- **dev-assistant** - Testing, debugging, and shell operations
- **project-maintainer** - Documentation, task management, and git operations
- **idea-helper** - Ideation, specification, and general assistance
- **code-reviewer** - Code quality review

#### Commands (11)

- **code-review** - Comprehensive code review utility
- **test** - Comprehensive testing and coverage analysis
- **debug** - Comprehensive debugging and defect resolution
- **build** - Comprehensive building and code implementation
- **plan** - Comprehensive project planning and estimation
- **search** - Comprehensive code and semantic search with reranking
- **edit** - Comprehensive file editing, formatting, and cleanup
- **git** - Comprehensive Git workflow automation and commit management
- **docs** - Comprehensive documentation and task management
- **shell** - Comprehensive shell configuration, zsh setup, and Git hooks management
- **security** - Comprehensive security analysis and spec-driven documentation

All commands spawn child sessions with appropriate agents and reference only the consolidated agent names.

### Rube MCP Server Integration

OpenCode includes comprehensive integration documentation for the Rube MCP server, providing access to 333+ tools across 14 service categories:

#### Available Toolkits (14)
- **Database & Backend**: Supabase (81 tools) - Complete database operations and management
- **File Storage**: Google Drive (51 tools) - File operations, sharing, and collaboration
- **Calendar**: Google Calendar (29 tools) - Event management and scheduling
- **Memory**: Mem0 (43 tools) - Knowledge management and semantic search
- **Platform**: Composio (21 tools) - Multi-tool orchestration and automation
- **Messaging**: Telegram (17 tools) - Bot operations and notifications
- **Web Automation**: Browserbase (10 tools) - Browser session management
- **Code Execution**: CodeInterpreter (5 tools) - Sandboxed code execution
- **AI Models**: Gemini (8 tools) - Google AI model access
- **Multi-Model AI**: OpenRouter (7 tools) - Cross-provider AI orchestration
- **Social Media**: LinkedIn (4 tools) - Professional networking
- **AI Search**: PerplexityAI (1 tool) - AI-powered research and analysis

#### Integration Documentation
Each toolkit includes:
- Complete parameter specifications and required fields
- Authentication requirements and rate limits
- Helper functions for common operations
- Real-world usage examples and patterns
- Error handling and optimization strategies

**Documentation Location**: See individual integration files in the root directory (e.g., `supabase-rube-integration.md`, `googledrive-rube-integration.md`, etc.)

### Key Topics

#### Agent Configuration

OpenCode supports multiple agent configuration formats:

- **Markdown files** with YAML frontmatter (recommended)
- **JSON configuration** in `opencode.json`
- **YAML commands** for slash commands

See [AGENTS.md](./AGENTS.md) for complete documentation.

#### Models

OpenCode Zen provides curated, tested models optimized for coding:

- **Free models**: Grok Code Fast 1, Code Supernova (beta)
- **Premium models**: Claude Sonnet 4.5, GPT 5 Codex, and more
- **Pay-as-you-go**: Transparent pricing with no markup

See [MODELS.md](./MODELS.md) for detailed comparison.

## Development

### Prerequisites

- Node.js 18+ or Bun
- TypeScript

### Setup

```bash
# Clone repository
git clone https://github.com/sst/opencode.git
cd opencode

# Install dependencies (including dev dependencies)
bun install

# Build project
bun run build

# Run tests (166+ tests)
bun test

# Run specific test suites
bun run test:unit
bun run test:integration
bun run test:e2e

# Type checking
bun run typecheck

# Lint and format
bun run lint
bun run format
```

### Project Structure

```
opencode/
├── .github/           # CI/CD workflows and actions
│   ├── workflows/     # GitHub Actions pipelines
│   └── actions/       # Reusable actions
├── agent/             # Agent definitions (.md files)
├── command/           # Command definitions (.md files)
├── packages/          # Core packages
│   ├── opencode/      # Main application
│   │   ├── src/       # Source code
│   │   ├── test/      # Comprehensive test suite
│   │   └── ...
│   ├── console/       # Console interface
│   ├── desktop/       # Desktop app
│   └── ...
├── script/            # Build and utility scripts
├── docs/              # Documentation
├── AGENTS.md          # Agent configuration guide
├── MODELS.md          # Model comparison guide
├── PROJECT_SUMMARY.md # Comprehensive overview
└── opencode.json      # Project configuration
```

### Code Style

- **Runtime**: Bun with TypeScript ESM modules
- **Formatting**: Prettier (no semicolons, 120 char width)
- **Imports**: Relative imports, named imports preferred
- **Types**: Zod schemas for validation, TypeScript interfaces
- **Naming**: camelCase variables, PascalCase classes

## Testing

OpenCode includes a comprehensive test suite with 166+ tests covering:

- **Unit Tests** - Core functionality and utilities
- **Integration Tests** - Module interactions and workflows
- **E2E Tests** - Complete user workflows
- **Configuration Validation** - Standards compliance checks

### Running Tests

```bash
# Run all tests
bun test

# Run specific test suites
bun run test:unit
bun run test:integration
bun run test:e2e

# Run with coverage (experimental)
bun run test:coverage
```

### CI/CD Pipeline

Automated testing and quality checks run on every push/PR via GitHub Actions:

- **Test Execution** - All test suites with caching
- **Code Quality** - ESLint, Prettier, CSpell, documentation sync
- **Coverage Tracking** - Experimental coverage reporting
- **Quality Reports** - Automated PR comments and artifact uploads

## Configuration

### Basic Configuration

Create `opencode.json` in your project root:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "edit": "allow"
  },
  "disabled_providers": ["anthropic", "openai"],
  "agent": {
    "build": {
      "description": "Implements features and runs tests",
      "mode": "primary",
      "model": "opencode/code-supernova",
      "tools": {
        "write": true,
        "edit": true,
        "bash": true
      }
    }
  }
}
```

### Agent Definition (Markdown)

Create `agent/my-agent.md`:

```markdown
---
description: "Custom agent for specific tasks"
mode: subagent
model: "opencode/code-supernova"
temperature: 0.1
permission:
  edit: allow
  bash: ask
---

Your agent instructions go here...
```

### Command Definition (Markdown)

Create `command/my-command.md`:

```markdown
---
description: "Custom command for specific tasks"
agent: build
template: "Execute $ARGUMENTS"
---

Command instructions go here...
```

## OpenCode Zen

OpenCode Zen provides curated models optimized for coding agents:

### Getting Started

1. Sign up at [opencode.ai/auth](https://opencode.ai/auth)
2. Add $20 balance (+$1.23 processing fee)
3. Copy your API key
4. Run `opencode auth login` and select opencode provider

### Model Recommendations

- **Code Implementation**: Claude Sonnet 4.5, GPT 5 Codex
- **Code Review**: Claude Sonnet 4, Claude Haiku 4.5
- **Budget Options**: Claude Haiku 3.5, Qwen3 Coder 480B
- **Free Options**: Grok Code Fast 1, Code Supernova

See [MODELS.md](./MODELS.md) for complete pricing and capabilities.

## Community

- **GitHub**: [github.com/sst/opencode](https://github.com/sst/opencode)
- **Discord**: [opencode.ai/discord](https://opencode.ai/discord)
- **Documentation**: [opencode.ai/docs](https://opencode.ai/docs)

## License

OpenCode is open source. See [LICENSE](./LICENSE) for details.

---

## Documentation Suite

- **[AGENTS.md](./AGENTS.md)** - Agent configuration and development guide
- **[MODELS.md](./MODELS.md)** - Model comparison and selection guide
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Comprehensive project overview
- **[Testing Guide](./packages/opencode/test/)** - Test suite documentation
- **[CI/CD Guide](./.github/workflows/)** - Pipeline and automation documentation

_For detailed documentation, see the complete documentation suite above._
