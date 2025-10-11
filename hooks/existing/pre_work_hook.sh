#!/bin/bash

# Pre-Work Hook - Documentation enforcement and work validation
# File: hooks/pre_work_hook.sh

set -euo pipefail

# Load dependencies
HOOK_DIR="$(dirname "${BASH_SOURCE[0]}")"
source "$HOOK_DIR/../core/hook_integrity_guardian.sh"
source "$HOOK_DIR/../core/hook_loop_guardian.sh"

# Configuration
HOOK_DIR="${HOOK_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)}"
WORK_LOG="${WORK_LOG:-$HOOK_DIR/../.hooks/work_log.log}"
LAST_DOC_READ="${LAST_DOC_READ:-$HOOK_DIR/../.hooks/last_doc_read.timestamp}"
DOC_FILES=("README.md" "AGENTS.md" "CONTRIBUTING.md" "docs/" "*.md")
REQUIRED_DOC_READ_INTERVAL=86400  # 24 hours in seconds

# Ensure directories exist
mkdir -p "$(dirname "$WORK_LOG")"

# Log work session
log_work() {
    local action="$1"
    local details="${2:-}"
    echo "$(date '+%Y-%m-%d %H:%M:%S')|$action|$USER|$$|$details" >> "$WORK_LOG"
}

# Check documentation reading requirement
check_doc_reading() {
    local current_time
    current_time=$(date +%s)

    if [[ -f "$LAST_DOC_READ" ]]; then
        local last_read
        last_read=$(cat "$LAST_DOC_READ")
        local time_diff=$((current_time - last_read))

        if [[ $time_diff -gt $REQUIRED_DOC_READ_INTERVAL ]]; then
            echo "Documentation reading required. Please read the following files:"
            for doc in "${DOC_FILES[@]}"; do
                if [[ -f "$doc" ]] || [[ -d "$doc" ]]; then
                    echo "  - $doc"
                fi
            done
            echo ""
            echo "After reading, run: touch $LAST_DOC_READ"
            log_work "DOC_READ_REQUIRED" "Documentation reading overdue by $time_diff seconds"
            exit 1
        fi
    else
        echo "First time setup: Please read the project documentation."
        echo "After reading, run: echo $(date +%s) > $LAST_DOC_READ"
        log_work "DOC_READ_REQUIRED" "Initial documentation reading required"
        exit 1
    fi
}

# Validate work environment
validate_work_environment() {
    # Check if in correct directory
    if [[ ! -f "package.json" ]] && [[ ! -f "README.md" ]]; then
        echo "ERROR: Not in project root directory"
        log_work "INVALID_ENVIRONMENT" "Not in project root"
        exit 1
    fi

    # Check for required tools
    local required_tools=("git" "node" "npm")
    for tool in "${required_tools[@]}"; do
        if ! command -v "$tool" >/dev/null 2>&1; then
            echo "ERROR: Required tool '$tool' not found"
            log_work "MISSING_TOOL" "$tool not available"
            exit 1
        fi
    done

    # Check git status
    if ! git status >/dev/null 2>&1; then
        echo "ERROR: Not a git repository"
        log_work "INVALID_REPO" "Not a git repository"
        exit 1
    fi
}

# Timestamp-based access control
check_access_time() {
    local current_hour
    current_hour=$(date +%H)

    # Example: Restrict work to business hours (9 AM - 6 PM)
    if [[ $current_hour -lt 9 ]] || [[ $current_hour -gt 18 ]]; then
        echo "Work access restricted to business hours (9 AM - 6 PM)"
        log_work "ACCESS_DENIED" "Outside business hours: ${current_hour}:00"
        exit 1
    fi
}

# Main pre-work validation
pre_work_validation() {
    # Verify hook integrity
    verify_all_hooks

    # Register execution
register_hook_execution "pre_work_hook"

guard_hook_execution "pre_work_hook" || exit 1

# Check documentation reading
    check_doc_reading

    # Validate environment
    validate_work_environment

    # Check access time
    check_access_time

    # Log successful validation
    log_work "WORK_STARTED" "Work session validated and started"

    echo "Work environment validated. Proceeding..."

complete_hook_execution "pre_work_hook"
}

# Main execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # Script called directly
    pre_work_validation
fi