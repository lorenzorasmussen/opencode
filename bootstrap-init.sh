#!/bin/bash

# OpenCode Bootstrap Init Script
# Implements the bootstrap logic from OPENCODE_BOOTSTRAP_PLAN.md

set -e

PROJECT_DIR="$(pwd)"
GLOBAL_CONFIG_DIR="$HOME/.config/opencode"

echo "OpenCode Bootstrap Init"
echo "Project Directory: $PROJECT_DIR"
echo "Global Config: $GLOBAL_CONFIG_DIR"
echo

# 1. Check if .opencode/ exists; create if not
if [ ! -d ".opencode" ]; then
    echo "Creating .opencode/ directory structure..."
    mkdir -p .opencode/agent .opencode/command .opencode/instructions .opencode/mcp
    echo "✓ Created .opencode/ with subdirectories"
else
    echo "✓ .opencode/ already exists"
fi

# 2. Copy default templates from global if not already present
echo "Copying default templates from global config..."

# Copy agent templates
if [ -d "$GLOBAL_CONFIG_DIR/agent" ]; then
    for template in "$GLOBAL_CONFIG_DIR/agent"/*.md; do
        if [ -f "$template" ]; then
            filename=$(basename "$template")
            if [ ! -f ".opencode/agent/$filename" ]; then
                cp "$template" ".opencode/agent/"
                echo "  Copied agent template: $filename"
            fi
        fi
    done
fi

# Copy command templates
if [ -d "$GLOBAL_CONFIG_DIR/command" ]; then
    for template in "$GLOBAL_CONFIG_DIR/command"/*.md; do
        if [ -f "$template" ]; then
            filename=$(basename "$template")
            if [ ! -f ".opencode/command/$filename" ]; then
                cp "$template" ".opencode/command/"
                echo "  Copied command template: $filename"
            fi
        fi
    done
fi

echo "✓ Template copying complete"

# 3. Generate fresh opencode.json with project-specific settings
if [ ! -f "opencode.json" ] || [ ! -s "opencode.json" ]; then
    echo "Generating fresh opencode.json..."

    # Start with global defaults if they exist
    if [ -f "$GLOBAL_CONFIG_DIR/opencode.json" ]; then
        cp "$GLOBAL_CONFIG_DIR/opencode.json" "opencode.json"
        echo "  Based on global config"
    else
        # Create minimal config
        cat > opencode.json << 'EOF'
{
  "$schema": "https://opencode.ai/config.json",
  "model": "opencode/big-pickle",
  "small_model": "opencode/big-pickle",
  "username": "User",
  "share": "manual",
  "snapshot": false,
  "autoupdate": false,
  "permission": {
    "edit": "allow",
    "bash": "ask",
    "webfetch": "allow"
  },
  "tools": {
    "bash": true,
    "webfetch": true,
    "mcp": true
  }
}
EOF
        echo "  Created minimal config"
    fi

    # Add project-specific overrides
    # This could be enhanced to detect project type and add relevant configs
    echo "✓ Generated opencode.json"
else
    echo "✓ opencode.json already exists"
fi

# 4. Verify required npm/node assets
echo "Verifying npm/node assets..."

if [ -f "package.json" ]; then
    echo "✓ package.json found"

    # Check if node_modules exists
    if [ -d "node_modules" ]; then
        echo "✓ node_modules directory exists"
    else
        echo "! node_modules not found - consider running npm/bun install"
    fi

    # Check for forbidden global node_modules
    if [ -d "$GLOBAL_CONFIG_DIR/node_modules" ]; then
        echo "⚠ WARNING: Found node_modules in global config directory"
        echo "  This violates the bootstrap plan - global should not have executable code"
    fi
else
    echo "! package.json not found - this may be okay for non-Node.js projects"
fi

# 5. Lint for duplicate/ambiguous configs
echo "Linting for config conflicts..."

# Check for agent/command name collisions
if [ -d ".opencode/agent" ] && [ -d "$GLOBAL_CONFIG_DIR/agent" ]; then
    for agent_file in ".opencode/agent"/*.md; do
        if [ -f "$agent_file" ]; then
            filename=$(basename "$agent_file")
            if [ -f "$GLOBAL_CONFIG_DIR/agent/$filename" ]; then
                echo "⚠ Agent name collision: $filename exists in both project and global"
            fi
        fi
    done
fi

if [ -d ".opencode/command" ] && [ -d "$GLOBAL_CONFIG_DIR/command" ]; then
    for cmd_file in ".opencode/command"/*.md; do
        if [ -f "$cmd_file" ]; then
            filename=$(basename "$cmd_file")
            if [ -f "$GLOBAL_CONFIG_DIR/command/$filename" ]; then
                echo "⚠ Command name collision: $filename exists in both project and global"
            fi
        fi
    done
fi

echo "✓ Config linting complete"
echo
echo "Bootstrap initialization complete!"
echo "Your OpenCode project is ready."
echo
echo "Next steps:"
echo "1. Review and customize opencode.json"
echo "2. Add project-specific agents/commands to .opencode/"
echo "3. Run npm/bun install if needed"
echo "4. Test your setup with 'opencode /run <agent>'"