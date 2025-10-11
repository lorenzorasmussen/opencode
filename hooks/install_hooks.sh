#!/bin/bash
# hooks/install_hooks.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OPENCODE_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "╔════════════════════════════════════════════════════╗"
echo "║    OpenCode LLM Hook System Installation          ║"
echo "╚════════════════════════════════════════════════════╝"
echo

# Create directory structure
echo "→ Creating directory structure..."
mkdir -p "${SCRIPT_DIR}/core"
mkdir -p "${SCRIPT_DIR}/existing"
mkdir -p "${SCRIPT_DIR}/config"
mkdir -p "${SCRIPT_DIR}/lib"
mkdir -p "${SCRIPT_DIR}/tests"
mkdir -p "${SCRIPT_DIR}/logs"
mkdir -p "${SCRIPT_DIR}/logs/loop_state"

# Set permissions
echo "→ Setting permissions..."
find "${SCRIPT_DIR}" -type f -name "*.sh" -exec chmod +x {} \;

# Create forbidden words list
echo "→ Creating naming configuration..."
cat > "${SCRIPT_DIR}/config/forbidden_words.txt" <<'EOF'
enhanced
improved
better
new
updated
modified
fixed
final
final2
really_final
temp
temporary
tmp
test123
asdf
foo
bar
untitled
copy
backup
EOF

# Initialize hook registry
echo "→ Initializing hook integrity registry..."
find "${SCRIPT_DIR}" -type f -name "*.sh" -path "*/core/*" -o -path "*/existing/*" | \
    xargs sha256sum > "${SCRIPT_DIR}/config/hook_registry.sha256" 2>/dev/null || true

# Create naming conventions cache
echo "→ Creating naming conventions cache..."
cat > "${SCRIPT_DIR}/config/naming_conventions.json" <<EOF
{
  "default_convention": "snake_case",
  "versioning_style": "underscore_v",
  "last_updated": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "confidence": 1.0
}
EOF

# Set up logging
echo "→ Setting up logging..."
touch "${SCRIPT_DIR}/logs/hook_execution.log"
touch "${SCRIPT_DIR}/logs/security_audit.log"
touch "${SCRIPT_DIR}/logs/naming_violations.log"
touch "${SCRIPT_DIR}/logs/immutable_audit.log"

# Make immutable audit truly immutable (Linux only)
if command -v chattr > /dev/null 2>&1; then
    sudo chattr +a "${SCRIPT_DIR}/logs/immutable_audit.log" 2>/dev/null || true
fi

# Link to git hooks (optional)
read -p "Link to .git/hooks? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    GIT_HOOKS="${OPENCODE_ROOT}/.git/hooks"
    if [[ -d "$GIT_HOOKS" ]]; then
        echo "→ Creating git hook symlinks..."
        ln -sf "${SCRIPT_DIR}/existing/git_hooks.sh" "${GIT_HOOKS}/pre-commit"
        ln -sf "${SCRIPT_DIR}/existing/post_commit_hook.sh" "${GIT_HOOKS}/post-commit"
        echo "  Git hooks linked ✓"
    fi
fi

# Run tests
read -p "Run test suite? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "→ Running tests..."
    "${SCRIPT_DIR}/tests/run_all_tests.sh" || true
fi

echo
echo "╔════════════════════════════════════════════════════╗"
echo "║         Installation Complete ✓                    ║"
echo "╚════════════════════════════════════════════════════╝"
echo
echo "NEXT STEPS:"
echo "1. Review configuration:"
echo "   ${SCRIPT_DIR}/config/hook_config.sh"
echo
echo "2. Move your existing hooks to:"
echo "   ${SCRIPT_DIR}/existing/"
echo
echo "3. Test the system:"
echo "   ${SCRIPT_DIR}/hook_orchestrator.sh pre_agent"
echo
echo "4. Integration with LLM tools:"
echo "   export LLM_AGENT_SESSION=\$(uuidgen)"
echo "   ${SCRIPT_DIR}/hook_orchestrator.sh full"
echo
echo "5. View logs:"
echo "   tail -f ${SCRIPT_DIR}/logs/hook_execution.log"
echo