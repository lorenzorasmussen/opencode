#!/bin/bash

# Post-Commit Hook - Commit validation and gaming detection
# File: hooks/post_commit_hook.sh

set -euo pipefail

# Load dependencies
HOOK_DIR="$(dirname "${BASH_SOURCE[0]}")"
source "$HOOK_DIR/hook_integrity_guardian.sh"
source "$HOOK_DIR/hook_loop_guardian.sh"

# Configuration
HOOK_DIR="${HOOK_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)}"
COMMIT_AUDIT_LOG="${COMMIT_AUDIT_LOG:-$HOOK_DIR/../.hooks/commit_audit.log}"
mkdir -p "$(dirname "$COMMIT_AUDIT_LOG")"

# Commit audit logging
log_commit() {
    local commit_hash="$1"
    local author="$2"
    local email="$3"
    local file_count="$4"
    local message="$5"
    echo "$(date '+%Y-%m-%d %H:%M:%S')|$commit_hash|$author|$email|$file_count|$message" >> "$COMMIT_AUDIT_LOG"
}

# Verify hook execution sequence
verify_hook_execution_sequence() {
    # Check if pre-commit hook was executed (basic check)
    # This would need more sophisticated tracking in a real implementation
    return 0
}

# Validate commit
validate_commit() {
    local commit_hash
    commit_hash=$(git rev-parse HEAD)

    # Get commit info
    local author email message changed_files
    author=$(git log -1 --pretty=format:'%an')
    email=$(git log -1 --pretty=format:'%ae')
    message=$(git log -1 --pretty=format:'%s')
    changed_files=$(git diff-tree --no-commit-id --name-only -r "$commit_hash")

    # Log commit
    local file_count
    file_count=$(echo "$changed_files" | wc -l)
    log_commit "$commit_hash" "$author" "$email" "$file_count" "$message"

    # Check for gaming patterns in commit message
    local gaming_patterns=("temp" "temporary" "fix" "update" "change" "modify")
    for pattern in "${gaming_patterns[@]}"; do
        if echo "$message" | grep -qi "$pattern"; then
            log_audit "COMMIT_GAMING" "post_commit_hook" "Suspicious commit message: $message"
            send_alert "COMMIT GAMING DETECTED: $message"
        fi
    done

    # Detect feature deletion gaming
    detect_feature_deletion_gaming $changed_files

    # Detect suppression attempts in changed files
    for file in $changed_files; do
        if [[ -f "$file" ]]; then
            local diff_content
            diff_content=$(git show "$commit_hash:$file" 2>/dev/null || echo "")
            detect_suppression_attempts "$diff_content"
        fi
    done

    # Basic syntax check (for supported languages)
    for file in $changed_files; do
        if [[ "$file" =~ \.sh$ ]]; then
            if ! bash -n "$file" 2>/dev/null; then
                log_audit "SYNTAX_ERROR" "post_commit_hook" "Syntax error in $file"
                send_alert "SYNTAX ERROR in committed file: $file"
            fi
        elif [[ "$file" =~ \.js$|\.ts$ ]]; then
            # Basic check for Node.js files
            if command -v node >/dev/null 2>&1; then
                if ! node -c "$file" 2>/dev/null; then
                    log_audit "SYNTAX_ERROR" "post_commit_hook" "Syntax error in $file"
                    send_alert "SYNTAX ERROR in committed file: $file"
                fi
            fi
        fi
    done

    # Run tests if available (basic check)
    if [[ -f "package.json" ]] && command -v npm >/dev/null 2>&1; then
        if npm test --silent 2>/dev/null; then
            log_audit "TESTS_PASSED" "post_commit_hook" "Tests passed for commit $commit_hash"
        else
            log_audit "TESTS_FAILED" "post_commit_hook" "Tests failed for commit $commit_hash"
            send_alert "TESTS FAILED for commit $commit_hash"
        fi
    fi

complete_hook_execution "post_commit_hook"
}

# Main execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # Script called directly (for testing)
    validate_commit
else
    # Called as git hook
    validate_commit
fi