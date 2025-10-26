# OpenCode Project Overview

This directory contains the global configuration and development hooks for the OpenCode system. It's a core component for managing agents, commands, and ensuring code quality and security within the OpenCode development ecosystem.

## Project Purpose

The primary purpose of this project is to:
- Define and manage OpenCode agents and commands.
- Enforce code quality standards using tools like ESLint.
- Implement security scanning for secrets using TruffleHog.
- Automate development workflows through Git hooks (Husky).
- Provide a flexible and extensible command-line interface for various development tasks.

## Main Technologies

- **Bun**: JavaScript runtime.
- **TypeScript**: For type-safe code.
- **Husky**: For Git hooks.
- **ESLint**: For code quality and linting.
- **YAML Frontmatter**: For defining agent and command metadata.
- **Shell Scripting (Bash/Zsh)**: For command execution and automation.

## Architecture Highlights

- **Agent and Command System**: OpenCode utilizes a system of agents (primary and subagents) and commands, defined in Markdown files with YAML frontmatter, to orchestrate complex development tasks.
- **Modular Configuration**: Configuration files and scripts are organized to promote modularity and maintainability.
- **Security-First Approach**: Integrates tools like TruffleHog for secret detection and enforces validation for file writes.
- **Dynamic Input Handling**: Commands can accept dynamic user input via the `$ARGUMENTS` placeholder.
- **Subagent Delegation**: Primary agents can delegate tasks to specialized subagents using the `@` syntax within their prompts.

## Building and Running

### Dependencies

Install project dependencies using Bun:
```bash
bun install
```

### Environment Variables

Create a `.env` file by copying `.env.example` and populate it with your API keys:
```bash
cp .env.example .env
# Edit .env with your actual API keys
```
Required keys include `PERPLEXITY_API_KEY` and `OPENROUTER_API_KEY`.

### Initialization

Run the initialization command to set up Git hooks, CI workflows, security tools, and generate documentation:
```bash
/init
```

### Available Commands

The following commands are available for various development tasks:

- **`/build`**: Builds the project. Supports arguments like `--dev`, `--prod`, `--watch`, and `--clean`.
- **`/test`**: Runs tests and performs type checking.
- **`/lint`**: Executes code linting.
- **`/agent`**: Manages agents.
- **`/init`**: Initializes the project (as described above).

## Development Conventions

- **XDG Base Directory Specification**: User preferences indicate that dotfiles are organized according to this specification.
- **Agent/Command Definitions**: Agents and commands are defined in Markdown files (`.md`) within the `agent/` and `command/` directories, respectively. These files include YAML frontmatter for metadata such as `description`, `mode` (for agents: `primary`, `subagent`), `agent` (for commands: specifying the executing agent), and `subtask` (for commands: `true` to run in subagent invocation mode).
- **Dynamic Input (`$ARGUMENTS`)**: Command prompt templates use `$ARGUMENTS` as a placeholder for dynamic user input.
- **Subagent Delegation (`@subagent-name`)**: Primary agents delegate tasks to subagents using the `@` symbol followed by the subagent's name.
- **Security Practices**: TruffleHog is used for secret scanning, model configurations are locked, and all file writes are validated.
- **Code Style**: ESLint is used to enforce code quality for JavaScript/TypeScript files.
