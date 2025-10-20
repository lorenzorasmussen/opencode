# OpenCode Project Summary

## Project Overview

OpenCode is a fully open source AI coding agent built for the terminal, with over 26,000 GitHub stars and 200,000+ monthly active developers. The project provides a native TUI interface, LSP support, multi-session capabilities, integration with 75+ LLM providers, comprehensive testing (166+ tests), and automated CI/CD pipelines.

## Current State

### Repository Structure

```
opencode/
├── .github/           # GitHub workflows and actions (CI/CD pipelines)
├── .husky/            # Git hooks (pre-commit, pre-push)
├── .specify/          # Specification templates
├── .vscode/           # VS Code settings
├── agent/             # Agent definitions (12 agents with YAML frontmatter)
├── command/           # Command definitions (2 commands with YAML frontmatter)
├── infra/             # Infrastructure code (app, console, desktop, stage)
├── node_modules/      # Dependencies (installed via Bun)
├── packages/          # Core packages (15+ packages)
│   ├── console/       # Console interface
│   ├── css/           # CSS utilities
│   ├── desktop/       # Desktop application
│   ├── function/      # Function utilities
│   ├── github/        # GitHub integration
│   ├── identity/      # Identity management
│   ├── mcp-superassistant/ # MCP integration
│   ├── neovim/        # Neovim integration
│   ├── opencode/      # Main application (166+ tests)
│   ├── plugin/        # Plugin system
│   ├── script/        # Script utilities
│   ├── sdk/           # SDK
│   ├── sdks/          # SDK implementations
│   ├── slack/         # Slack integration
│   ├── tests/         # Test utilities
│   ├── tui/           # Terminal UI
│   ├── ui/            # UI components
│   └── web/           # Web interface
├── patches/           # Package patches
├── script/            # Build and utility scripts
├── sdks/              # External SDKs
├── specs/             # Specifications
├── AGENTS.md          # Agent configuration guide
├── MODELS.md          # Model comparison guide
├── PROJECT_SUMMARY.md # Comprehensive overview
├── README.md          # Project documentation
├── opencode.json      # Project configuration (disabled providers)
└── package.json       # Package configuration (Bun-based scripts)
```

### Technology Stack

- **Runtime**: Bun with TypeScript ESM modules
- **Package Manager**: Bun 1.3.0
- **Build System**: Turbo for monorepo management
- **Frontend**: SolidJS for UI components
- **Backend**: Hono for API endpoints
- **Validation**: Zod schemas
- **Formatting**: Prettier (no semicolons, 120 char width)
- **Linting**: ESLint with custom configuration
- **Testing**: Bun test runner
- **Git Hooks**: Husky for pre-commit validation

### Key Features

1. **Native TUI** - Responsive, themeable terminal interface
2. **LSP Enabled** - Automatic language server protocol support
3. **Multi-Session** - Run multiple agents in parallel
4. **Share Links** - Share sessions for reference and debugging
5. **Any Model Support** - 75+ LLM providers through Models.dev
6. **Editor Agnostic** - Works with any IDE
7. **Privacy First** - Zero code storage for sensitive environments
8. **Comprehensive Testing** - 166+ tests with 100% pass rate
9. **CI/CD Pipeline** - Automated testing, quality checks, and deployment
10. **Standards Compliance** - YAML frontmatter validation for agents/commands

## Documentation Status

### Completed Documentation

#### AGENTS.md

- Comprehensive agent configuration guide
- Multiple format support (Markdown, JSON, YAML)
- Tool permission system
- Prompt configuration options
- Best practices and examples

#### MODELS.md

- Complete OpenCode Zen model catalog
- Pricing comparison table
- Model selection guidelines by use case
- Performance tiers and recommendations
- API endpoint information
- Privacy and data retention details
- Team features and cost optimization

#### README.md

- Project overview and quick start guide
- Updated with current statistics, testing, and CI/CD information
- Installation and development setup instructions
- Configuration examples and standards

#### Testing Documentation

- Comprehensive test suite documentation in `packages/opencode/test/`
- Unit, integration, and E2E test coverage
- CI/CD pipeline documentation in `.github/workflows/`
- Quality assurance processes and automation

#### Configuration Standards

- Agent and command YAML frontmatter validation
- Provider configuration and disabling
- Standards compliance testing
- Installation instructions
- Basic usage examples
- Development setup guide
- Configuration examples
- Community links and resources

#### PROJECT_SUMMARY.md

- Comprehensive project overview
- Current repository structure
- Technology stack details
- Feature documentation
- Documentation status tracking

### Configuration Files

#### opencode.json

- Complete agent configuration with all required fields
- 12 primary and subagent definitions
- Proper tool permissions following principle of least privilege
- Model assignments for different use cases

#### Agent Definitions

- 15+ agent files in `agent/` directory
- 10+ subagent files in `subagent/` directory
- All agents properly configured with YAML frontmatter
- Missing `template-subagent.md` created

## Agent System

### Consolidated Agent Structure

Following OpenCode best practices, the agent system has been consolidated to reduce redundancy and improve maintainability.

### Primary Agents (4)

1. **build** - Full development workflow (implementation, testing, version control)
2. **plan** - Strategic planning and analysis (read-only)
3. **orchestrator** - Task coordination and system architecture design
4. **researcher** - Deep investigation and research

### Subagents (6)

1. **code-modifier** - File editing, formatting, and cleanup (merged from file-editor, edit, format, clean-directory)
2. **code-searcher** - Advanced code and semantic search (merged from search, semantic-search)
3. **dev-assistant** - Testing, debugging, and shell operations (merged from tests, debug, shell-expert)
4. **project-maintainer** - Documentation, task management, and git operations (merged from docs, todo, git-committer)
5. **idea-helper** - Ideation, specification, and general assistance (merged from creative, specifier, general)
6. **code-reviewer** - Code quality review (unchanged)

## Command System

### Consolidated Commands (11)

1. **code-review** - Comprehensive code review utility
2. **test** - Comprehensive testing and coverage analysis
3. **debug** - Comprehensive debugging and defect resolution
4. **build** - Comprehensive building and code implementation
5. **plan** - Comprehensive project planning and estimation
6. **search** - Comprehensive code and semantic search with reranking
7. **edit** - Comprehensive file editing, formatting, and cleanup
8. **git** - Comprehensive Git workflow automation and commit management
9. **docs** - Comprehensive documentation and task management
10. **shell** - Comprehensive shell configuration, zsh setup, and Git hooks management
11. **security** - Comprehensive security analysis and spec-driven documentation

All commands are configured to spawn child sessions with appropriate agents and reference only the consolidated agent names.

## Model Integration

### OpenCode Zen Models

- **Free Models**: Grok Code Fast 1, Code Supernova (beta)
- **Premium Models**: Claude Sonnet 4.5, GPT 5 Codex, Claude Haiku series
- **Pricing**: Transparent pay-as-you-go with no markup
- **Privacy**: US-hosted with zero-retention policies

### Model Selection Guidelines

- **Code Implementation**: Claude Sonnet 4.5, GPT 5 Codex
- **Code Review**: Claude Sonnet 4, Claude Haiku 4.5
- **Budget Options**: Claude Haiku 3.5, Qwen3 Coder 480B
- **Free Options**: Grok Code Fast 1, Code Supernova

## Development Workflow

### Build Commands

```bash
bun install          # Install dependencies
bun run build         # Build project
bun test              # Run all tests
bun run typecheck     # Type checking
./script/format.ts    # Format code
eslint                # Lint code
```

### Code Style Guidelines

- **Runtime**: Bun with TypeScript ESM modules
- **Formatting**: Prettier (no semicolons, 120 char width)
- **Imports**: Relative imports, named imports preferred
- **Types**: Zod schemas for validation, TypeScript interfaces
- **Naming**: camelCase variables, PascalCase classes
- **Error Handling**: Result patterns, avoid exceptions
- **APIs**: Use Bun APIs like Bun.file() extensively

## Architecture Patterns

### Tool Implementation

- Implement `Tool.Info` interface with `execute()` method
- Pass sessionID in tool context
- Use `App.provide()` for dependency injection
- Validate all inputs with Zod schemas
- Use `Log.create({ service: "name" })` pattern for logging
- Use Storage namespace, backed by a SQLite database, for persistence

### Agent Configuration

- **Markdown Format**: YAML frontmatter with agent instructions
- **JSON Format**: Structured configuration in opencode.json
- **YAML Format**: Command-based configuration
- **Permission System**: Granular tool access control
- **Model Assignment**: Appropriate model selection per agent

## Community and Ecosystem

### Repository Statistics

- **GitHub Stars**: 26,000+
- **Contributors**: 188
- **Commits**: 3,000+
- **Monthly Users**: 200,000+

### Integration Points

- **GitHub**: Full integration with actions and workflows
- **Slack**: Team collaboration features
- **Neovim**: Editor integration
- **VS Code**: Extension support through sdks/
- **Desktop**: Native desktop application

## Next Steps and Recommendations

### Immediate Actions

1. **Test Agent Configurations**: Validate all agent configurations with different models
2. **Performance Testing**: Benchmark model performance for different use cases
3. **Documentation Review**: Ensure all documentation is accurate and complete
4. **Community Feedback**: Gather user feedback on agent effectiveness

### Medium-term Goals

1. **Model Optimization**: Refine model selection based on real-world usage
2. **Agent Enhancement**: Improve agent capabilities based on user needs
3. **Feature Development**: Add requested features from community
4. **Performance Improvements**: Optimize for speed and resource usage

### Long-term Vision

1. **AI Agent Ecosystem**: Build comprehensive agent marketplace
2. **Enterprise Features**: Add advanced team and security features
3. **Model Innovation**: Continue model research and optimization
4. **Community Growth**: Expand user base and contributor community

## Quality Assurance

### Testing Strategy

- **Unit Tests**: Component-level testing with Bun test runner
- **Integration Tests**: Cross-component functionality testing
- **E2E Tests**: End-to-end user workflow testing
- **Performance Tests**: Load and stress testing
- **Security Tests**: Vulnerability and penetration testing

### Code Quality

- **TypeScript**: Strict type checking throughout codebase
- **ESLint**: Custom linting rules for code consistency
- **Prettier**: Automated code formatting
- **Husky**: Pre-commit hooks for quality gates
- **Turbo**: Optimized build and caching

---

_This summary reflects the current state of the OpenCode project as of October 2025. The project is actively developed with regular updates and community contributions._
