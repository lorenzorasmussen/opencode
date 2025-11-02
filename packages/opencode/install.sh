#!/bin/bash

# OpenCode Installation Script
# This script installs opencode globally and adds it to PATH

set -e

echo "🚀 Installing OpenCode..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OPENCODE_DIR="$SCRIPT_DIR"

# Create bin directory if it doesn't exist
BIN_DIR="$HOME/.local/bin"
mkdir -p "$BIN_DIR"

# Create symlink to opencode binary
if [ -f "$OPENCODE_DIR/bin/opencode" ]; then
    ln -sf "$OPENCODE_DIR/bin/opencode" "$BIN_DIR/opencode"
    echo "✅ Created symlink: $BIN_DIR/opencode -> $OPENCODE_DIR/bin/opencode"
else
    echo "❌ Error: opencode binary not found at $OPENCODE_DIR/bin/opencode"
    exit 1
fi

# Add to PATH if not already there
SHELL_RC=""
case "$SHELL" in
    bash)
        SHELL_RC="$HOME/.bashrc"
        ;;
    zsh)
        SHELL_RC="$HOME/.zshrc"
        ;;
    fish)
        SHELL_RC="$HOME/.config/fish/config.fish"
        ;;
    *)
        echo "⚠️  Unsupported shell: $SHELL"
        echo "Please manually add $BIN_DIR to your PATH"
        exit 1
        ;;
esac

# Check if PATH already includes the bin directory
if echo "$PATH" | grep -q "$BIN_DIR"; then
    echo "✅ $BIN_DIR is already in PATH"
else
    echo "📝 Adding $BIN_DIR to PATH in $SHELL_RC"
    echo "" >> "$SHELL_RC"
    echo "# OpenCode PATH addition" >> "$SHELL_RC"
    echo "export PATH=\"\$PATH:$BIN_DIR\"" >> "$SHELL_RC"
fi

echo ""
echo "🎉 OpenCode installation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Restart your terminal or run: source $SHELL_RC"
echo "2. Verify installation: opencode --help"
echo ""
echo "💡 If you still get 'command not found', try:"
echo "   export PATH=\"\$PATH:$BIN_DIR\""
echo "   opencode --help"