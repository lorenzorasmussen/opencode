#!/bin/bash
# Check cyclomatic complexity
# Warns about complex functions (doesn't block)
#

echo "  -  Analyzing code complexity..."

# Get staged JS/TS files
FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|ts|jsx|tsx)$')

if [ -z "$FILES" ]; then
    echo "    ✓ No JS/TS files to check"
    exit 0
fi

# Run ESLint complexity check
OUTPUT=$(npx eslint \
    --rule 'complexity: ["warn", {"max": 15}]' \
    --no-eslintrc \
    $FILES 2>&1)

if echo "$OUTPUT" | grep -q "warning"; then
    echo ""
    echo "    ⚠️  High complexity detected (not blocking):"
    echo "$OUTPUT" | grep "complexity"
    echo ""
    echo "    Consider refactoring complex functions"
    echo ""
fi

# Always exit 0 (warning only, don't block commit)
exit 0