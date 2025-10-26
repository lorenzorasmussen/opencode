# OpenCode Directory Interaction

This document explains the roles of the OpenCode global settings directory and the project directory, and how they interact.

## 1. Global Settings Directory (`~/.config/opencode`)

This directory, located at `/Users/lorenzorasmussen/.config/opencode`, stores your personal and global OpenCode configurations. These settings are applied every time you run `opencode`, regardless of the project you are working in.

Key files and directories:

- **`opencode.json`**: The main configuration file. It contains your user preferences, API keys, and default permissions for tools.
- **`agent/`**: This directory holds the definitions of your custom, globally available agents. Any agent defined here can be invoked from any project.
- **`command/`**: Similar to the `agent/` directory, this is where you define your custom, global commands.
- **`README.md`, `Tasks.md`, etc.**: You can use Markdown files in this directory for your own notes and documentation.

This directory should only contain your personal settings and configurations. It should not contain development files, build artifacts, or project-specific code.

## 2. Project Directory (e.g., `~/projects/opencode`)

This is the directory of the specific project you are working on. You run the `opencode` command from within this directory.

Key files and directories:

- **Your Project's Code**: All the source code, documentation, and other files related to your project.
- **`AGENTS.md`**: As described in the OpenCode documentation, this file is created by the `/init` command and contains project-specific agent definitions. These agents are only available when you are working within this project.

## Interaction Model

When you run `opencode` from a project directory, it follows this loading order:

1.  **Global Settings**: OpenCode first loads the configurations from the global settings directory (`~/.config/opencode`). This includes your global agents, commands, and preferences from `opencode.json`.
2.  **Project Settings**: It then loads the project-specific configurations from the current directory. This includes project-specific agents from `AGENTS.md`.

This model allows you to have a set of global tools and configurations that are always available, while also allowing for project-specific customizations.
