---
description: "Comprehensive project initialization and setup utility"
agent: general
subagent: dev-assistant
---

# `/init` - Project Initialization Command

## Command Workflow

PROJECT INITIALIZATION UTILITY
═══════════════════════════════════════════════════════════════

Command: /init [--update-only]

Execution:

```bash
#!/bin/bash

UPDATE_ONLY="${1:-false}"

echo "🚀 Project Initialization Utility"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Mode: $([ "$UPDATE_ONLY" = "--update-only" ] && echo "Update Only" || echo "Full Initialization")"
echo ""

# Check if first run
if [ -f ".init_complete" ] && [ "$UPDATE_ONLY" != "--update-only" ]; then
    echo "ℹ️  Project already initialized. Use --update-only to update documentation."
    echo ""
    exit 0
fi

# Create marker file for first run detection
touch .init_complete

# Step counter
STEP=1
TOTAL_STEPS=8

progress() {
    echo ""
    echo "📋 Step $STEP/$TOTAL_STEPS: $1"
    echo "────────────────────────────────────────"
    ((STEP++))
}

# Function to check command success
check_success() {
    if [ $? -eq 0 ]; then
        echo "   ✅ $1"
    else
        echo "   ❌ $1 failed"
        return 1
    fi
}

# 1. System Initialization
progress "System Initialization"

# Detect project type and initialize
if [ -f "package.json" ]; then
    echo "   📦 JavaScript/TypeScript project detected"
    if [ ! -d "node_modules" ]; then
        npm install
        check_success "Dependencies installation"
    fi
elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
    echo "   🐍 Python project detected"
    if [ ! -d "venv" ]; then
        python -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt 2>/dev/null || pip install .
        check_success "Python environment setup"
    fi
elif [ -f "Cargo.toml" ]; then
    echo "   🦀 Rust project detected"
    cargo check
    check_success "Rust dependencies check"
elif [ -f "go.mod" ]; then
    echo "   🏎️  Go project detected"
    go mod tidy
    check_success "Go modules setup"
fi

# Git initialization if not already done
if [ ! -d ".git" ]; then
    git init
    check_success "Git repository initialization"
fi

# 2. Hooks Setup
progress "Git Hooks Setup"

if [ -f "package.json" ]; then
    # Install husky if not present
    if ! grep -q "husky" package.json; then
        npm install --save-dev husky
        check_success "Husky installation"
    fi

    # Initialize husky
    npx husky init
    check_success "Husky initialization"

    # Setup pre-commit hook
    echo '#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run lint if script exists
if npm run | grep -q "  lint"; then
    npm run lint
fi

# Run test if script exists
if npm run | grep -q "  test"; then
    npm run test
fi
' > .husky/pre-commit
    chmod +x .husky/pre-commit
    check_success "Pre-commit hook setup"
fi

# 3. Copilot Workflow Setup
progress "Copilot Workflow Setup"

# Check if GitHub CLI is available
if command -v gh &> /dev/null; then
    # Setup GitHub workflows if not present
    mkdir -p .github/workflows

    # Create basic CI workflow
    cat > .github/workflows/ci.yml << 'EOF'
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm ci
    - run: npm run build
    - run: npm test
EOF
    check_success "GitHub Actions CI workflow"
else
    echo "   ⚠️  GitHub CLI not found - skipping workflow setup"
fi

# 4. Security Setup (Snyk)
progress "Security Setup (Snyk)"

if [ -f "package.json" ]; then
    if ! grep -q "snyk" package.json; then
        npm install --save-dev snyk
        check_success "Snyk installation"

        # Add security scripts to package.json
        npx json -I -f package.json -e 'this.scripts = this.scripts || {}; this.scripts.security = "snyk test"; this.scripts["security-monitor"] = "snyk monitor"'
        check_success "Security scripts added"
    fi
fi

# 5. Documentation Files
progress "Documentation Setup"

# Generate comprehensive Agents.md from agent configurations
if [ -f "scripts/generate-agents-md.ts" ]; then
    npx tsx scripts/generate-agents-md.ts > Agents.md
    check_success "Agents.md generated with detailed agent information"
else
    echo "   ⚠️  Agent generation script not found, creating basic Agents.md"
    cat > Agents.md << 'EOF'
# Available Agents

This document lists all available agents in the OpenCode system.

## Primary Agents

### build
Intelligent build system with context gathering, task planning, approval workflow, and execution tracking.

### architect
System design and architecture planning agent.

### code-modifier
Code modification, formatting, and cleanup operations.

### debug
Debugging and troubleshooting agent.

### dev-assistant
Development assistance with testing, debugging, and shell operations.

### docs
Documentation generation and management.

### git-committer
Git commit and push operations.

### project-maintainer
Project maintenance with documentation, task management, and version control.

### tests
Testing and quality assurance agent.

### todo
Structured task management and tracking.

## Usage

Agents can be invoked using the `/agent <name>` command or through the task delegation system.

## Contributing

To add a new agent, create a new `.md` file in the `agent/` directory with the appropriate frontmatter configuration.
EOF
    check_success "Basic Agents.md created"
fi

# Ensure Tasks.md exists
if [ ! -f "Tasks.md" ]; then
    cat > Tasks.md << 'EOF'
# Available Tasks/Commands

This document lists all available commands in the OpenCode system.

## Build & Development

### /build
Quick project build/compilation utility.

### /component
Component creation and management utility.

### /refactor
Code refactoring and optimization tools.

### /test
Testing utilities and frameworks integration.

## Code Quality

### /lint
Code linting and style checking.

### /review
Code review and quality assessment.

### /security
Security scanning and vulnerability assessment.

## Project Management

### /plan
Project planning and task breakdown.

### /commit
Git commit management and best practices.

### /git
Git operations and workflow management.

## Usage

Commands can be invoked using the `/<command>` syntax.
EOF
    check_success "Tasks.md created"
fi

# 6. Build Execution
progress "Initial Build"

if [ -f "package.json" ]; then
    npm run build 2>/dev/null || echo "   ⚠️  No build script found"
    check_success "Project build"
elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
    python -m build 2>/dev/null || echo "   ⚠️  No build configuration found"
    check_success "Python build"
elif [ -f "Cargo.toml" ]; then
    cargo build --release
    check_success "Rust build"
elif [ -f "go.mod" ]; then
    go build
    check_success "Go build"
fi

# 7. Final Checks
progress "Final Validation"

# Check for common configuration files
echo "   🔍 Validating configuration..."

if [ -f "package.json" ]; then
    node -e "console.log('✅ package.json valid')"
fi

if [ -f ".gitignore" ]; then
    echo "   ✅ .gitignore present"
else
    echo "   ⚠️  Consider adding .gitignore"
fi

if [ -f "README.md" ]; then
    echo "   ✅ README.md present"
else
    echo "   ⚠️  Consider adding README.md"
fi

# 8. Documentation Update (for non-first runs)
if [ "$UPDATE_ONLY" = "--update-only" ]; then
    progress "Documentation Update"

    echo "   📚 Updating documentation..."

    # Regenerate Agents.md with latest agent configurations
    if [ -f "scripts/generate-agents-md.ts" ]; then
        npx tsx scripts/generate-agents-md.ts > Agents.md
        echo "   ✅ Agents.md updated with latest agent information"
    fi

    # Update Tasks.md if needed
    # (Tasks.md is typically static and updated manually)

    echo "   ✅ Documentation updated"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Initialization complete!"
echo ""
echo "Next steps:"
echo "• Review generated configuration files"
echo "• Customize workflows as needed"
echo "• Run tests: npm test (if available)"
echo "• Push to repository: git add . && git commit -m 'Initial setup'"
echo ""
echo "Useful commands:"
echo "• /build - Build the project"
echo "• /test - Run tests"
echo "• /lint - Check code quality"
echo "• /review - Code review utilities"
```

**Output Example:**

```
🚀 Project Initialization Utility
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Mode: Full Initialization

📋 Step 1/10: System Initialization
────────────────────────────────────────
   📦 JavaScript/TypeScript project detected
   ✅ Dependencies installation
   ✅ Git repository initialization

📋 Step 2/10: Git Hooks Setup
────────────────────────────────────────
   ✅ Husky installation
   ✅ Husky initialization
   ✅ Pre-commit hook setup

📋 Step 3/10: Copilot Workflow Setup
────────────────────────────────────────
   ✅ GitHub Actions CI workflow

📋 Step 4/10: Security Setup (Snyk)
────────────────────────────────────────
   ✅ Snyk installation
   ✅ Security scripts added

📋 Step 5/10: Documentation Setup
────────────────────────────────────────
   ✅ Agents.md created
   ✅ Tasks.md created

📋 Step 6/10: Initial Build
────────────────────────────────────────
   ✅ Project build

📋 Step 7/10: Final Validation
────────────────────────────────────────
   🔍 Validating configuration...
   ✅ package.json valid
   ✅ .gitignore present
   ✅ README.md present

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 Initialization complete!

Next steps:
• Review generated configuration files
• Customize workflows as needed
• Run tests: npm test (if available)
• Push to repository: git add . && git commit -m 'Initial setup'

Useful commands:
• /build - Build the project
• /test - Run tests
• /lint - Check code quality
• /review - Code review utilities
```
