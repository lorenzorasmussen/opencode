# Slash Commands Guide

**NO FUCKING CODE IN SLASH COMMANDS**!!!!!

This guide explains how to use slash commands in the OpenCode TUI.

## Directory Structure

Custom slash commands are loaded from `.opencode/command/` in the project root. Create this directory and add `.md` files containing the prompt content (no frontmatter or code required).

## What are Slash Commands?

Slash commands are built-in shortcuts for common actions. They appear in the TUI command completion when you type `/`.

## Built-in Commands

- `/init` - Initialize project and create AGENTS.md
- `/undo` - Undo the last change
- `/redo` - Redo the last undone change
- `/share` - Share the current conversation
- `/help` - Show help information

## How to Use

1. In the TUI, type `/` to see available commands
2. Type the command name or scroll to select it
3. Press Enter to execute

## Custom Commands

You can create custom slash commands by defining them in `opencode.json` or using `.md` files in `.opencode/command/` with frontmatter.

### Using Markdown Files

Create .opencode/command/example.md with frontmatter containing description and agent, followed by the prompt content. Then /example will be available in the TUI.

### Using JSON Config

Add command definitions to opencode.json with template, description, and agent properties.

Custom commands provide quick access to specialized prompts without typing them each time.
