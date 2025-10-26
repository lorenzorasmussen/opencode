# Enhanced Git Server Tools Guide

The Git MCP server provides **12 comprehensive tools** for complete Git workflow management.

## 🛠️ Available Git Tools

### 1. **git_status** - Repository Status
```bash
opencode run "check git status"
opencode run "show repository status"
```
**Returns**: Current branch, staged/unstaged changes, untracked files

### 2. **git_log** - Commit History
```bash
opencode run "show recent commits"
opencode run "show last 10 commits"
opencode run "show commits from last week"
opencode run "show commits by author John"
```
**Parameters**: `limit`, `since`, `until`, `author`

### 3. **git_diff** - Changes Between Commits
```bash
opencode run "show diff between HEAD and HEAD~1"
opencode run "show changes in last commit"
opencode run "compare branch main with feature-branch"
opencode run "show diff for specific file"
```
**Parameters**: `from`, `to`, `paths`

### 4. **git_show** - Detailed Commit Info
```bash
opencode run "show details for commit abc123"
opencode run "show what changed in commit HEAD"
```
**Parameters**: `commit`

### 5. **git_branch** - Branch Management
```bash
opencode run "list all branches"
opencode run "create new branch feature-x"
opencode run "delete branch old-feature"
opencode run "show current branch"
```
**Parameters**: `action` ("list", "create", "delete"), `name`

### 6. **git_checkout** - Branch Switching
```bash
opencode run "switch to branch main"
opencode run "switch to branch feature-x"
opencode run "create and switch to new branch hotfix"
```
**Parameters**: `target`, `create`

### 7. **git_add** - Stage Files
```bash
opencode run "stage all changed files"
opencode run "stage file README.md"
opencode run "stage files in src directory"
```
**Parameters**: `paths` (array)

### 8. **git_commit** - Create Commits
```bash
opencode run "commit with message 'Updated feature'"
opencode run "commit staged changes with message 'Fixed bug'"
```
**Parameters**: `message`, `author`

### 9. **git_push** - Push to Remote
```bash
opencode run "push changes to origin"
opencode run "push branch feature-x to origin"
```
**Parameters**: `remote`, `branch`

### 10. **git_pull** - Pull from Remote
```bash
opencode run "pull changes from origin"
opencode run "pull from upstream main"
```
**Parameters**: `remote`, `branch`

### 11. **git_clone** - Clone Repository
```bash
opencode run "clone repository https://github.com/user/repo.git"
opencode run "clone repo to specific directory"
```
**Parameters**: `url`, `path`

### 12. **git_init** - Initialize Repository
```bash
opencode run "initialize git repository here"
opencode run "init git in project directory"
```
**Parameters**: `path`

## 🎯 Practical Git Workflows

### Daily Development Workflow
```bash
# Start day - check status
opencode run "check git status"

# Make changes and stage
opencode run "stage all changed files"

# Commit work
opencode run "commit with message 'Implemented user authentication'"

# Push to remote
opencode run "push changes to origin"
```

### Feature Branch Workflow
```bash
# Create feature branch
opencode run "create new branch feature-login"

# Switch to it
opencode run "switch to branch feature-login"

# Work and commit
opencode run "stage all changed files"
opencode run "commit with message 'Added login form'"

# Push feature branch
opencode run "push branch feature-login to origin"

# Later: merge back to main
opencode run "switch to branch main"
opencode run "pull changes from origin"
```

### Code Review Workflow
```bash
# Check what changed
opencode run "show diff between main and feature-branch"

# Review commit history
opencode run "show commits in feature-branch not in main"

# See detailed changes
opencode run "show details for commit abc123"
```

### Repository Analysis
```bash
# Recent activity
opencode run "show last 20 commits"

# Author contributions
opencode run "show commits by author Alice in last month"

# Branch overview
opencode run "list all branches"

# File changes
opencode run "show what files changed in last commit"
```

## 🔍 Advanced Git Operations

### Time-based Queries
```bash
opencode run "show commits from yesterday"
opencode run "show commits since 2024-01-01"
opencode run "show commits between 2024-01-01 and 2024-01-31"
```

### Author Filtering
```bash
opencode run "show commits by John"
opencode run "show commits by john@example.com"
opencode run "show my commits from today"
```

### Path-specific Operations
```bash
opencode run "show changes to src directory"
opencode run "show commits that modified package.json"
opencode run "stage only TypeScript files"
```

### Branch Comparisons
```bash
opencode run "compare main with develop"
opencode run "show differences between v1.0 and v2.0"
opencode run "what changed between last release and now"
```

## 🚀 Integration Examples

### With Other MCP Servers
```bash
# Use Git + Filesystem
opencode run "check git status and show changed files"

# Use Git + GitHub
opencode run "push changes and create pull request"

# Use Git + SQLite
opencode run "commit database schema changes"
```

### Automated Workflows
```bash
# Daily standup
opencode run "show my commits from yesterday and current status"

# Release preparation
opencode run "create release branch and push to origin"

# Code review
opencode run "show diff and list changed files"
```

## 📊 Git Server Capabilities Summary

| Category | Tools | Use Cases |
|----------|-------|-----------|
| **Status** | `git_status` | Current repo state |
| **History** | `git_log`, `git_show` | Commit browsing |
| **Changes** | `git_diff` | Code review, comparisons |
| **Branches** | `git_branch`, `git_checkout` | Branch management |
| **Staging** | `git_add` | File staging |
| **Commits** | `git_commit` | Change persistence |
| **Sync** | `git_push`, `git_pull` | Remote collaboration |
| **Setup** | `git_clone`, `git_init` | Repository creation |

**Total: 12 powerful Git tools for complete version control workflow management**

This enhanced Git server provides everything needed for professional Git workflow management, from basic commits to complex branch strategies and repository analysis.</content>
</xai:function_call"> 

<xai:function_call name="write">
<parameter name="filePath">/Users/lorenzorasmussen/.config/opencode/COMPREHENSIVE_MCP_TOOLS.md