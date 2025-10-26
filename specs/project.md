## project

goal is to let a single instance of opencode be able to run sessions for
multiple projects and different worktrees per project

### Agent Configuration Standards (OpenCode 2025)

**Agent Definition Format:**

- Agents are defined using Markdown files with YAML frontmatter
- Location: `.opencode/agent/<name>.md` (project-specific) or `~/.config/opencode/agent/<name>.md` (global)
- File naming: The Markdown file name becomes the agent name (e.g., `review.md` → `review` agent)

**YAML Frontmatter Structure:**

```yaml
---
description: "Brief description of agent purpose"
mode: "primary|subagent"
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
  todowrite: true
  todoread: true
permission:
  edit: "allow|deny|ask"
  bash: "allow|deny|ask"
  webfetch: "allow|deny|ask"
disable: false
---
Agent prompt and instructions...
```

**Key Standards:**

- All agent variables come from YAML frontmatter only (not settings files)
- 32 agents currently defined in `.opencode/agent/`
- Agents can be invoked with `@` mentions and switched during sessions
- Supports primary agents (full capabilities) and subagents (specialized helpers)
- Tool permissions use allow/deny/ask levels for security

### Current Project Environment

**Technology Stack:**

- Runtime: Bun with TypeScript ESM modules
- Build System: Bun-based build pipeline
- Package Manager: Bun (bun.lock)
- Code Formatting: Prettier (no semicolons, 120 char width)
- Linting: ESLint with custom configuration
- Version Control: Git with pre-commit hooks

**Project Structure:**

- Core packages: console, desktop, web, opencode, plugin, etc.
- Agent definitions: `.opencode/agent/` (32 agents)
- Command definitions: `.opencode/command/` (removed from JSON config)
- Documentation: `.opencode/docs/`, `specs/`, `README.md`
- Build artifacts: `.turbo/` cache, `node_modules/`

**Agent Architecture:**

- 32 agents defined in `.opencode/agent/`
- All use YAML frontmatter for configuration
- Support for todowrite/todoread tools across agents
- Primary agents: plan, build, research, creative
- Subagents: specifier, architect, debug, documentation, etc.
- Tool permissions: Granular allow/deny/ask controls

**Development Workflow:**

- Install: `bun install`
- Build: `bun run build`
- Test: `bun test`
- Typecheck: `bun run typecheck`
- Format: `./script/format.ts`
- Lint: `eslint`

### api

```
GET /project -> Project[]

POST /project/init -> Project


GET /project/:projectID/session -> Session[]

GET /project/:projectID/session/:sessionID -> Session

POST /project/:projectID/session -> Session
{
  id?: string
  parentID?: string
  directory: string
}

DELETE /project/:projectID/session/:sessionID

POST /project/:projectID/session/:sessionID/init

POST /project/:projectID/session/:sessionID/abort

POST /project/:projectID/session/:sessionID/share

DELETE /project/:projectID/session/:sessionID/share

POST /project/:projectID/session/:sessionID/compact

GET /project/:projectID/session/:sessionID/message -> { info: Message, parts: Part[] }[]

GET /project/:projectID/session/:sessionID/message/:messageID -> { info: Message, parts: Part[] }

POST /project/:projectID/session/:sessionID/message -> { info: Message, parts: Part[] }

POST /project/:projectID/session/:sessionID/revert -> Session

POST /project/:projectID/session/:sessionID/unrevert -> Session

POST /project/:projectID/session/:sessionID/permission/:permissionID -> Session

GET /project/:projectID/session/:sessionID/find/file -> string[]

GET /project/:projectID/session/:sessionID/file -> { type: "raw" | "patch", content: string }

GET /project/:projectID/session/:sessionID/file/status -> File[]

POST /log

// These are awkward

GET /provider?directory=<resolve path> -> Provider
GET /config?directory=<resolve path> -> Config // think only tui uses this?

GET /project/:projectID/agent?directory=<resolve path> -> Agent
GET /project/:projectID/find/file?directory=<resolve path> -> File

```
