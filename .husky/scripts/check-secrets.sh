#!/bin/bash
# Prevent committing secrets, API keys, tokens
# Blocks commit if secrets detected
#

echo "  -  Checking for secrets..."

# Define patterns to detect
PATTERNS=(
    # API Keys
    "sk-[a-zA-Z0-9]{32,}"                    # OpenAI
    "AIza[0-9A-Za-z\\-_]{35}"                # Google
    "ghp_[a-zA-Z0-9]{36}"                    # GitHub tokens
    "gho_[a-zA-Z0-9]{36}"                    # GitHub OAuth
    "sk_live_[a-zA-Z0-9]{24,}"               # Stripe live
    "sk_test_[a-zA-Z0-9]{24,}"               # Stripe test

    # AWS credentials
    "AKIA[0-9A-Z]{16}"                       # AWS Access Key
    "aws_access_key_id"
    "aws_secret_access_key"

    # Private keys
    "-----BEGIN (RSA |DSA |EC )?PRIVATE KEY-----"
    "private_key"

    # Database credentials
    "mysql://.*:.*@"
    "postgresql://.*:.*@"
    "mongodb+srv://.*:.*@"

    # Generic secrets
    "password\s*=\s*['\"][^'\"]{8,}"
    "api[_-]?key\s*=\s*['\"][^'\"]{16,}"
    "secret\s*=\s*['\"][^'\"]{16,}"
)

# Check staged files
FOUND_SECRET=false
FILES=$(git diff --cached --name-only --diff-filter=ACM)

for file in $FILES; do
    # Skip if file doesn't exist (deleted)
    [ ! -f "$file" ] && continue

    # Skip binary files
    file "$file" | grep -q "text" || continue

    # Check against patterns
    for pattern in "${PATTERNS[@]}"; do
        if grep -qE "$pattern" "$file" 2>/dev/null; then
            if [ "$FOUND_SECRET" = false ]; then
                echo ""
                echo "    ❌ SECRETS DETECTED! Commit blocked."
                echo ""
                FOUND_SECRET=true
            fi

            echo "       File: $file"
            echo "       Pattern: ${pattern:0:30}..."
            echo ""
        fi
    done
done

if [ "$FOUND_SECRET" = true ]; then
    echo "    Solutions:"
    echo "      1. Remove secrets from code"
    echo "      2. Use environment variables"
    echo "      3. Add to .gitignore"
    echo "      4. Use secrets manager (Vault, AWS Secrets)"
    echo ""
    exit 1
fi

echo "    ✓ No secrets detected"