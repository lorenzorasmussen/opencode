#!/bin/bash
# hooks/lib/logging.sh
# Centralized logging for all hooks

set -euo pipefail

# Source config if not already loaded
if [[ -z "${HOOKS_CONFIG:-}" ]]; then
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
    source "${SCRIPT_DIR}/config/hook_config.sh"
fi

# ============================================================================
# LOGGING FUNCTIONS
# ============================================================================

function log_debug() {
    [[ "${LOG_LEVEL}" == "DEBUG" ]] || return 0
    local message="$*"
    _log "DEBUG" "$message"
}

function log_info() {
    [[ "${LOG_LEVEL}" =~ ^(DEBUG|INFO)$ ]] || return 0
    local message="$*"
    _log "INFO" "$message"
}

function log_warning() {
    [[ "${LOG_LEVEL}" =~ ^(DEBUG|INFO|WARNING)$ ]] || return 0
    local message="$*"
    _log "WARNING" "$message"
}

function log_error() {
    local message="$*"
    _log "ERROR" "$message" >&2
}

function log_critical() {
    local message="$*"
    _log "CRITICAL" "$message" >&2

    # Send notification on critical
    if [[ "${ENABLE_NOTIFICATIONS}" == "true" ]]; then
        send_alert "CRITICAL: $message"
    fi
}

function _log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local caller="${BASH_SOURCE##*/}:${BASH_LINENO}"
    local session="${HOOK_SESSION_ID:-unknown}"

    local log_entry="[$timestamp] [$level] [$session] [$caller] $message"

    # Log to stdout/stderr
    if [[ "${LOG_TO_STDOUT}" == "true" ]]; then
        echo "$log_entry"
    fi

    # Log to file
    if [[ "${LOG_TO_FILE}" == "true" ]] && [[ -n "${LOG_FILE:-}" ]]; then
        echo "$log_entry" >> "$LOG_FILE"
    fi

    # Immutable audit for critical/security events
    if [[ "$level" =~ ^(CRITICAL|ERROR)$ ]]; then
        echo "$log_entry" >> "${IMMUTABLE_AUDIT}"
    fi
}

function send_alert() {
    local message="$1"

    if [[ -n "${SLACK_WEBHOOK:-}" ]]; then
        curl -X POST "$SLACK_WEBHOOK" \
            -H "Content-Type: application/json" \
            -d "{\"text\":\"🚨 OpenCode Hook Alert: $message\"}" \
            2>/dev/null || true
    fi
}