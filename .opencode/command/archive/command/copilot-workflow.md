---
description: "Copilot CLI Workflow for Zsh Configuration Management"
agent: copilot-assistant
---

# Copilot CLI Workflow for Zsh Configuration Management

## Overview
This document outlines the workflow for using GitHub Copilot CLI to manage zsh configuration tasks, including repository creation, git operations, and development assistance.

## Prerequisites
- GitHub CLI (`gh`) installed and authenticated
- Copilot CLI installed
- Zsh configuration repository initialized

## Key Workflows

### 1. Creating Remote Repositories

**Command Pattern:**
```bash
copilot -p "Help me create a private GitHub repository for my zsh configuration. Provide step-by-step instructions." --allow-all-tools
```

**What Copilot Does:**
- Checks current git status
- Verifies GitHub CLI authentication
- Creates private repository using `gh repo create`
- Configures git remote automatically
- Provides push instructions

**Example Output:**
```
✓ Create private GitHub repository for zsh config
$ gh repo create zsh-config --private --description "Personal zsh configuration and dotfiles" --source=.
✓ Verify remote repository configuration
$ git remote -v
✓ Push to remote repository
$ git push -u origin llm-work
```

### 2. Git Operations and Repository Management

**Adding Files and Committing:**
```bash
copilot -p "Help me add all files to git and create a comprehensive commit for my zsh configuration" --allow-all-tools
```

**Pushing Changes:**
```bash
copilot -p "Push my current branch to the remote repository" --allow-all-tools
```

### 3. Configuration Analysis and Debugging

**Analyzing Repository Structure:**
```bash
copilot -p "Analyze my zsh configuration directory structure and provide insights" --allow-all-tools
```

**Debugging Issues:**
```bash
copilot -p "Help me debug why my zsh configuration isn't loading properly" --allow-all-tools
```

## Copilot CLI Usage Patterns

### Interactive Mode
```bash
copilot --add-dir ~/.config/zsh/
# Then use interactive commands
```

### Direct Prompt Execution
```bash
copilot -p "Your prompt here" --allow-all-tools
```

### Model Selection
```bash
copilot -p "Task description" --model claude-sonnet-4.5 --allow-all-tools
```

## Tool Permissions

### Essential Permissions for Zsh Config Work
- `--allow-all-tools`: Full access for comprehensive tasks
- `--add-dir ~/.config/zsh/`: Directory access for config files
- `--add-dir ~/.config/zsh/hooks/`: Hook system access

### Selective Permissions
```bash
# Allow git operations but restrict file modifications
copilot --allow-tool 'shell(git:*)' --deny-tool 'write' -p "Git status check"
```

## Best Practices

### 1. Directory Access
Always add the zsh config directory:
```bash
copilot --add-dir ~/.config/zsh/
```

### 2. Authentication
Ensure GitHub CLI is authenticated:
```bash
gh auth status
```

### 3. Model Selection
Use appropriate models for different tasks:
- `claude-sonnet-4.5`: Complex reasoning and code generation
- `gpt-5`: General assistance and explanations

### 4. Permission Management
- Use `--allow-all-tools` for comprehensive tasks
- Use selective permissions for focused operations
- Review tool usage before granting broad permissions

## Common Use Cases

### Repository Setup
```bash
copilot -p "Set up a complete git workflow for my zsh configuration including remote repository" --allow-all-tools
```

### Configuration Optimization
```bash
copilot -p "Analyze and optimize my zsh startup time" --allow-all-tools
```

### Backup and Recovery
```bash
copilot -p "Help me create a robust backup system for my zsh configuration" --allow-all-tools
```

## Integration with Zsh Workflow

### Branch Management
- Use `llm-work` for development changes
- Use copilot to manage complex branching scenarios
- Automate branch creation and merging

### Hook System
- Copilot can help debug and optimize git hooks
- Generate new hook scripts for validation
- Test hook functionality

### Documentation
- Generate comprehensive documentation
- Update manuals and guides
- Create troubleshooting guides

## Troubleshooting

### Authentication Issues
```bash
# Check GitHub CLI status
gh auth status

# Re-authenticate if needed
gh auth login
```

### Permission Errors
```bash
# Grant full permissions for complex tasks
copilot --allow-all-tools -p "Task description"
```

### Directory Access
```bash
# Add necessary directories
copilot --add-dir ~/.config/zsh/ --add-dir ~/.config/zsh/hooks/ -p "Task"
```

## Advanced Features

### Session Management
```bash
# Resume previous sessions
copilot --resume

# Continue last session
copilot --continue
```

### MCP Server Integration
```bash
# Manage MCP servers
copilot /mcp show
copilot /mcp add server-name
```

### Logging and Debugging
```bash
# Enable debug logging
copilot --log-level debug -p "Debug task"

# View usage metrics
copilot /usage
```

This workflow demonstrates how Copilot CLI can significantly enhance zsh configuration management by providing AI-assisted automation, intelligent guidance, and comprehensive tool integration.