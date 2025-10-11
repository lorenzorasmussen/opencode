#!/bin/bash

# Pre-Tool Hook - Risk-based tool authorization and integrity checks
# File: hooks/pre_tool_hook.sh

set -euo pipefail

# Load dependencies
HOOK_DIR="$(dirname "${BASH_SOURCE[0]}")"
source "$HOOK_DIR/../core/hook_integrity_guardian.sh"
source "$HOOK_DIR/../core/naming_convention_enforcer.sh"
source "$HOOK_DIR/../core/hook_loop_guardian.sh"

# Configuration
TOOL_AUDIT_LOG="${TOOL_AUDIT_LOG:-$HOOK_DIR/../.hooks/tool_audit.log}"
mkdir -p "$(dirname "$TOOL_AUDIT_LOG")"

# Risk classifications
HIGH_RISK_TOOLS=("rm" "chmod" "sudo" "git" "reset" "deploy" "kubectl" "docker" "systemctl")
MEDIUM_RISK_TOOLS=("git" "push" "git" "merge" "npm" "publish" "yarn" "publish")

# Tool audit logging
log_tool_usage() {
    local user="$1"
    local tool_name="$2"
    local arguments="$3"
    local risk_level="$4"
    local action="$5"
    echo "$(date '+%Y-%m-%d %H:%M:%S')|$user|$tool_name|$arguments|$risk_level|$action" >> "$TOOL_AUDIT_LOG"
}

# Determine risk level
get_risk_level() {
    local tool="$1"
    local args="$2"

    for high_risk in "${HIGH_RISK_TOOLS[@]}"; do
        if [[ "$tool" == "$high_risk" ]]; then
            # Check for dangerous combinations
            if [[ "$tool" == "git" ]] && [[ "$args" =~ --hard|--reset ]]; then
                echo "HIGH"
                return
            elif [[ "$tool" == "rm" ]] && [[ "$args" =~ -rf ]]; then
                echo "HIGH"
                return
            fi
        fi
    done

    for medium_risk in "${MEDIUM_RISK_TOOLS[@]}"; do
        if [[ "$tool" == "$medium_risk" ]]; then
            echo "MEDIUM"
            return
        fi
    done

    echo "LOW"
}

# Risk-based authorization
authorize_tool() {
    local tool="$1"
    local args="$2"
    local risk_level
    risk_level=$(get_risk_level "$tool" "$args")

    case "$risk_level" in
        HIGH)
            echo "HIGH RISK TOOL: $tool $args"
            echo "Requires explicit human approval."
            read -p "Do you want to proceed? (yes/no): " -r
            if [[ ! "$REPLY" =~ ^yes$ ]]; then
                log_tool_usage "$USER" "$tool" "$args" "$risk_level" "DENIED"
                echo "Operation denied."
                exit 1
            fi
            ;;
        MEDIUM)
            echo "MEDIUM RISK TOOL: $tool $args"
            echo "Proceeding with confirmation (default: no)"
            read -p "Confirm? (y/N): " -r -t 10
            if [[ ! "$REPLY" =~ ^[Yy]$ ]]; then
                log_tool_usage "$USER" "$tool" "$args" "$risk_level" "DENIED"
                echo "Operation denied."
                exit 1
            fi
            ;;
        LOW)
            # Automatic approval with logging
            ;;
    esac

    log_tool_usage "$USER" "$tool" "$args" "$risk_level" "APPROVED"
}

# Main pre-tool validation
pre_tool_validation() {
    local tool="$1"
    shift
    local args="$*"

    # Verify hook integrity
    verify_all_hooks

    # Register execution
register_hook_execution "pre_tool_hook"

guard_hook_execution "pre_tool_hook" "$tool" || exit 1

# Authorize tool
    authorize_tool "$tool" "$args"

    # Integrity checks for file operations
    for arg in "$@"; do
        if [[ -f "$arg" ]] || [[ "$arg" =~ \. ]]; then
            intercept_hook_modifications "$tool" "$arg"
            monitor_test_modifications "$tool" "$arg"
            local actual_op="tool"
            case "$tool" in
                touch|mkdir|cp)
                    actual_op="create"
                    ;;
                rm|mv)
                    actual_op="delete"
                    ;;
            esac
            enforce_naming_on_operation "$actual_op" "$arg"
        fi
    done

    # Additional validations can be added here
}

# Main execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # Script called directly
    if [[ $# -lt 1 ]]; then
        echo "Usage: $0 <tool_command> [args...]"
        exit 1
    fi

    pre_tool_validation "$@"
fi