# Agent Guidelines

## Build/Test Commands

- **Install**: `bun install`
- **Build**: `bun run build` (packages/opencode)
- **Test all**: `bun test`
- **Single test**: `bun test packages/opencode/test/specific.test.ts`
- **Typecheck**: `bun run typecheck`
- **Format**: `./script/format.ts`
- **Lint**: `eslint` (config in script/js/eslint.config.js)

## Code Style

- **Runtime**: Bun with TypeScript ESM modules
- **Formatting**: Prettier (no semicolons, 120 char width), EditorConfig (2 spaces, 80 max line)
- **Imports**: Relative imports for local modules, named imports preferred
- **Types**: Zod schemas for validation, TypeScript interfaces for structure
- **Naming**: camelCase variables/functions, PascalCase classes/namespaces
- **Error handling**: Result patterns, avoid throwing exceptions in tools
- **Rules**: Avoid unnecessary destructuring, else statements, try/catch, any type, let statements
- **Variables**: Prefer single word names where possible
- **APIs**: Use Bun APIs like Bun.file() extensively

## Architecture

- **Tools**: Implement Tool.Info interface with execute() method
- **Context**: Pass sessionID in tool context, use App.provide() for DI
- **Validation**: All inputs validated with Zod schemas
- **Logging**: Use Log.create({ service: "name" }) pattern
- **Storage**: The `Storage` namespace, backed by a SQLite database, is used for persistence.

## Configuration Format

OpenCode agents are defined using **Markdown files with YAML frontmatter** placed in the `agent/` directory. This is the official, standards-compliant way to define agents for OpenCode 2025.

### Agent File Structure

**Location:**

- Global: `~/.config/opencode/agent/<name>.md`
- Project-specific: `.opencode/agent/<name>.md`

**File Naming:** The Markdown file name becomes the agent name (e.g., `review.md` → `review` agent)

### YAML Frontmatter Schema

```yaml
---
description: "Brief description of agent purpose"
mode: "primary|subagent"
model: "provider/model-name"
temperature: 0.1
top_p: 0.95
tools:
  read: true
  write: true
  edit: true
  bash: true
  grep: true
  glob: true
  list: true
  mcp: true
permission:
  edit: "allow|deny|ask"
  bash: "allow|deny|ask"
  webfetch: "allow|deny|ask"
disable: false
---
Agent prompt and instructions go here...
```

### Agent Properties

- **description** (required): Brief, clear description of what the agent does and when to use it
- **mode** (required): `"primary"` for main agents, `"subagent"` for specialized helpers
- **model** (required): AI model identifier (e.g., `"opencode/code-supernova"`)
- **temperature** (optional): Controls LLM randomness (0.0-1.0, default varies by agent type)
- **top_p** (optional): Nucleus sampling parameter (default 0.95)
- **tools** (optional): Object defining enabled/disabled tools
- **permission** (optional): Tool-level permission control (`allow`, `deny`, `ask`)
- **disable** (optional): Set to `true` to disable the agent

### Template Example

```markdown
---
description: "Reviews code for quality and best practices"
mode: subagent
model: "anthropic/claude-sonnet-4-20250514"
temperature: 0.1
tools:
  write: false
  edit: false
  bash: false
permission:
  edit: deny
  bash: ask
  webfetch: deny
disable: false
---

You are in code review mode. Focus on:

- Code quality and best practices
- Potential bugs and edge cases
- Performance implications
- Security considerations

Provide constructive feedback without making direct changes.
```

### Key Notes

- **All agent variables come from YAML frontmatter only** - not from settings files
- **No JSON configuration needed** for agent definitions
- **Agent placement**: Subagents in `agent/` directory, distinguished by `mode` variable
- **Standards compliant**: This format matches official OpenCode 2025 documentation

### Available Tools

- **write**: File creation and overwriting
- **edit**: File modification and editing
- **bash**: Command execution and shell operations
- **read**: File reading (typically available to all agents)
- **search**: Code and file search capabilities

### Example Configuration

```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "build": {
      "description": "Implements features, runs tests, and manages version control",
      "mode": "primary",
      "model": "anthropic/claude-sonnet-4-20250514",
      "prompt": { "file": "./prompts/build.txt" },
      "tools": {
        "write": true,
        "edit": true,
        "bash": true
      }
    },
    "plan": {
      "description": "Creates strategic plans and technical specifications",
      "mode": "primary",
      "model": "anthropic/claude-haiku-4-20250514",
      "tools": {
        "write": false,
        "edit": false,
        "bash": false
      }
    },
    "code-reviewer": {
      "description": "Reviews code for best practices and potential issues",
      "mode": "subagent",
      "model": "anthropic/claude-sonnet-4-20250514",
      "prompt": "You are a code reviewer. Focus on security, performance, and maintainability.",
      "tools": {
        "write": false,
        "edit": false
      }
    }
  }
}
```

### Best Practices

1. **Principle of Least Privilege**: Only enable tools that an agent actually needs
2. **Model Selection**: Use faster/cheaper models (like Haiku) for simple tasks, more capable models (like Sonnet) for complex work
3. **File Organization**: Store prompts in separate files for better maintainability
4. **Clear Descriptions**: Provide meaningful descriptions that explain what the agent does and when to use it
5. **Tool Restrictions**: Subagents typically have restricted tool access compared to primary agents
6. **Required Fields**: Always include `description` as it's a required configuration option

## Configuration Format Differences

### JSON vs Markdown Permissions

**JSON Configuration** (`opencode.json`):

- Uses `tools` field with boolean values
- Simple true/false permissions
- Example: `"tools": { "write": true, "edit": false }`

**Markdown Configuration** (`.md` files):

- Uses `permission` field with granular control
- Three permission levels: `allow`, `deny`, `ask`
- Example: `"permission": { "edit": "deny", "bash": "ask" }`

### Design Decisions

- **JSON**: Designed for simple, static configurations where tools are either enabled or disabled
- **Markdown**: Designed for interactive agents where user consent may be required for certain operations
- **Permission Levels**: The `ask` level in Markdown allows for dynamic permission requests during agent execution
- **Tool Names**: Markdown supports additional tools like `webfetch` that may not be available in JSON format

### Migration Notes

When converting between formats:

- JSON `true` → Markdown `allow`
- JSON `false` → Markdown `deny`
- Consider using `ask` for potentially destructive operations in Markdown agents

## Prompt Configuration

Specify a custom system prompt file for this agent with the prompt config. The prompt file should contain instructions specific to the agent's purpose.

### File Reference Format

```json
{
  "agent": {
    "review": {
      "prompt": { "file": "./prompts/code-review.txt" }
    }
  }
}
```

### Path Resolution

The path is relative to where the config file is located. This works for both:

- **Global OpenCode config** (`~/.config/opencode/opencode.json`)
- **Project-specific config** (`./opencode.json`)

### Example Directory Structure

```
project/
├── opencode.json
└── prompts/
    ├── code-review.txt
    ├── build.txt
    └── plan.txt
```

### Inline vs File Prompts

You can also use inline prompts directly in the configuration:

```json
{
  "agent": {
    "review": {
      "prompt": "You are a code reviewer. Focus on security, performance, and maintainability."
    }
  }
}
```

For file-based prompts, use the object format:

```json
{
  "agent": {
    "review": {
      "prompt": { "file": "./prompts/code-review.txt" }
    }
  }
}
```

### Prompt File Content

Prompt files should contain:

- Clear role definition
- Specific instructions for the agent's purpose
- Guidelines for behavior and output format
- Any constraints or limitations

Example `prompts/code-review.txt`:

```
You are a senior code reviewer with expertise in security, performance, and maintainability.

When reviewing code:
1. Check for security vulnerabilities and best practices
2. Analyze performance implications
3. Assess code maintainability and readability
4. Suggest improvements without being overly critical
5. Provide specific, actionable feedback

Focus on education and improvement rather than just finding faults.
```

## Command Format (YAML)

OpenCode also supports a YAML-based command format for defining agents and their behavior. This format is commonly used for slash commands and specialized agent configurations.

### Schema

```yaml
---
description: Brief description of agent purpose
mode: primary|subagent
model: provider/model-name
temperature: number
tools:
  write: boolean
  edit: boolean
  bash: boolean
---
Agent prompt and instructions go here...
```

### YAML Properties

- **description** (optional): Human-readable description of the agent's purpose
- **mode** (optional): `"primary"` for main agents, `"subagent"` for specialized helpers
- **model** (optional): AI model identifier (e.g., `"anthropic/claude-sonnet-4-20250514"`)
- **temperature** (optional): Sampling temperature (0.0-1.0, lower for more deterministic responses)
- **tools** (optional): Object defining which tools the agent can access

### Example Command Configuration

```yaml
---
description: Reviews code for quality and best practices
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
tools:
  write: false
  edit: false
  bash: false
---

You are in code review mode. Focus on:

- Code quality and best practices
- Potential bugs and edge cases
- Performance implications
- Security considerations

Provide constructive feedback without making direct changes.
```

### Usage Guidelines

1. **Front Matter**: YAML configuration must be enclosed between `---` markers
2. **Temperature Settings**: Use lower temperatures (0.0-0.3) for analytical tasks like code review
3. **Tool Restrictions**: Set tools to `false` for read-only agents like reviewers
4. **Mode Selection**: Use `"subagent"` for specialized, single-purpose agents
5. **Prompt Content**: Agent instructions go after the closing `---` marker

### Common Patterns

- **Code Review**: Low temperature, no write/edit tools, focused on analysis
- **Implementation**: Higher temperature (0.7), full tool access, creative problem-solving
- **Planning**: Medium temperature (0.5), limited tools, structured thinking
- **Debugging**: Low temperature, bash access for investigation, analytical approach

## Markdown File Format

You can also define agents using markdown files. Place them in:

- **Global**: `~/.config/opencode/agent/`
- **Per-project**: `.opencode/agent/`

### Temperature Control

Control the randomness and creativity of the LLM's responses with the temperature config.

Lower values make responses more focused and deterministic, while higher values increase creativity and variability.

### Temperature Guidelines

- **0.0-0.3**: Analytical tasks, code review, debugging, fact-based responses
- **0.4-0.6**: Planning, structured problem-solving, balanced creativity
- **0.7-1.0**: Creative writing, brainstorming, exploratory tasks

### Markdown Agent Structure

```markdown
---
description: Brief description of agent purpose
mode: primary|subagent
model: provider/model-name
temperature: 0.5
permission:
  write: allow|deny|ask
  edit: allow|deny|ask
  bash: allow|deny|ask
  webfetch: allow|deny|ask
---

Agent prompt and instructions go here...

You can use markdown formatting in the prompt content.
```

### Permission Levels

- **allow**: Agent can use the tool without restriction
- **deny**: Agent cannot use the tool
- **ask**: Agent must request permission before using the tool

### Example Markdown Agent

```markdown
---
description: Code review without edits
mode: subagent
permission:
  edit: deny
  bash: ask
  webfetch: deny
---

Only analyze code and suggest changes.
```

### File Naming

Agent files should use descriptive names that reflect their purpose:

- `code-reviewer.md`
- `feature-implementer.md`
- `debug-assistant.md`
- `documentation-writer.md`

## Model Discovery & Documentation

Verified OpenCode Zen models and created comprehensive model comparison documentation in `MODELS.md`. Key findings:

- **Free Models**: Grok Code Fast 1 and Code Supernova are currently free (limited time beta)
- **Premium Models**: Claude Sonnet 4.5 ($3-6/M input), GPT 5 Codex ($1.25/M input), and others
- **Pricing**: Pay-as-you-go with transparent pricing, no markup beyond processing fees
- **Privacy**: US-hosted with zero-retention policies (some exceptions for beta models)

### Model Selection Guidelines

Created detailed recommendations for different use cases:

- **Code Implementation**: Claude Sonnet 4.5, GPT 5 Codex
- **Code Review**: Claude Sonnet 4, Claude Haiku 4.5
- **Budget Options**: Claude Haiku 3.5, Qwen3 Coder 480B
- **Free Options**: Grok Code Fast 1, Code Supernova

### Next Steps

- Test agent configurations with different models
- Refine model selection based on real-world performance
- Update agent configurations as new models become available

The documentation now provides a complete reference for OpenCode agent configuration and model selection across all supported formats.

## Current Consolidated Agent System

The OpenCode project uses a consolidated agent system optimized for efficiency and maintainability:

### Primary Agents (4)

1. **build** - Full development workflow (implementation, testing, version control)
   - Mode: primary
   - Model: opencode/code-supernova
   - Tools: Full access (read, write, edit, bash, etc.)

2. **plan** - Strategic planning and analysis (read-only)
   - Mode: primary
   - Model: opencode/code-supernova
   - Tools: Limited (read, list, grep, glob)

3. **orchestrator** - Task coordination and system architecture design
   - Mode: primary
   - Model: opencode/code-supernova
   - Tools: Full access for coordination

4. **researcher** - Deep investigation and research
   - Mode: primary
   - Model: opencode/code-supernova
   - Tools: Read and web access for research

### Subagents (6)

1. **code-modifier** - File editing, formatting, and cleanup
   - Mode: subagent
   - Model: opencode/code-supernova
   - Tools: edit, bash, read, write

2. **code-searcher** - Advanced code and semantic search
   - Mode: subagent
   - Model: opencode/code-supernova
   - Tools: grep, glob, webfetch

3. **dev-assistant** - Testing, debugging, and shell operations
   - Mode: subagent
   - Model: opencode/code-supernova
   - Tools: Full access for development tasks

4. **project-maintainer** - Documentation, task management, and git operations
   - Mode: subagent
   - Model: opencode/code-supernova
   - Tools: write, edit, bash, git operations

5. **idea-helper** - Ideation, specification, and general assistance
   - Mode: subagent
   - Model: opencode/code-supernova
   - Tools: Full access for creative and planning tasks

6. **code-reviewer** - Code quality review
   - Mode: subagent
   - Model: opencode/code-supernova
   - Tools: read only (no write/edit)

All agents follow the principle of least privilege with appropriate tool permissions and are configured for optimal performance with the opencode/code-supernova model.

---

## Documentation Status

This document is part of a comprehensive documentation suite:

- **[README.md](./README.md)** - Project overview and quick start guide
- **[MODELS.md](./MODELS.md)** - Complete model comparison and selection guide
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Comprehensive project overview
- **[opencode.json](./opencode.json)** - Project configuration file

All documentation is actively maintained and reflects the current state of the OpenCode project.
