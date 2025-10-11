#!/bin/bash
# hooks/lib/validation.sh
# Shared validation functions

set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/logging.sh"

# ============================================================================
# LLM DETECTION
# ============================================================================

function is_llm_operation() {
    [[ -n "${LLM_AGENT_SESSION:-}" ]] || \
    [[ -n "${AI_TOOL_ACTIVE:-}" ]] || \
    pgrep -f "aider|cursor|copilot|grok" > /dev/null 2>&1
}

# ============================================================================
# FILE VALIDATION
# ============================================================================

function file_exists_or_error() {
    local file="$1"
    local error_msg="${2:-File not found: $file}"

    if [[ ! -f "$file" ]]; then
        log_error "$error_msg"
        return 1
    fi
    return 0
}

function is_readable_or_error() {
    local file="$1"

    if [[ ! -r "$file" ]]; then
        log_error "File not readable: $file"
        return 1
    fi
    return 0
}

# ============================================================================
# GIT VALIDATION
# ============================================================================

function is_git_repo() {
    git rev-parse --git-dir > /dev/null 2>&1
}

function has_uncommitted_changes() {
    ! git diff-index --quiet HEAD --
}

function get_current_branch() {
    git rev-parse --abbrev-ref HEAD
}

# ============================================================================
# PERMISSION VALIDATION
# ============================================================================

function require_permission() {
    local operation="$1"
    local user="${USER:-unknown}"

    # Implement your permission logic here
    log_info "Permission check: $user attempting $operation"
    return 0
}