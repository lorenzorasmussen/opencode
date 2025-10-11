#!/bin/bash

# Hook Integrity Guardian - Enterprise-grade protection for LLM operations
# File: hooks/hook_integrity_guardian.sh

set -euo pipefail

# Configuration
HOOK_DIR="${HOOK_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)}"
HOOK_REGISTRY="${HOOK_REGISTRY:-$HOOK_DIR/../.hooks/registry.sha256}"
TEST_DIR="${TEST_DIR:-$HOOK_DIR/..}"
AUDIT_LOG="${AUDIT_LOG:-$HOOK_DIR/../.hooks/audit.log}"
ALERT_WEBHOOK="${ALERT_WEBHOOK:-}"  # Optional Slack webhook

# Ensure directories exist
mkdir -p "$(dirname "$HOOK_REGISTRY")"
mkdir -p "$(dirname "$AUDIT_LOG")"

# Logging function
log_audit() {
    local event_type="$1"
    local hook_name="$2"
    local details="${3:-}"
    echo "$(date '+%Y-%m-%d %H:%M:%S')|$event_type|$hook_name|$$|$USER|$details" >> "$AUDIT_LOG"
}

# Alert function
send_alert() {
    local message="$1"
    if [[ -n "$ALERT_WEBHOOK" ]]; then
        curl -s -X POST -H 'Content-type: application/json' --data "{\"text\":\"$message\"}" "$ALERT_WEBHOOK" || true
    fi
}

# Verify all hooks using SHA256 checksums
verify_all_hooks() {
    local registry_file="$HOOK_REGISTRY"
    local temp_registry="/tmp/hook_checksums_temp.sha256"
    local failed_hooks=()

    # Generate current checksums
    find "$HOOK_DIR" -name "*.sh" -type f -exec sha256sum {} \; > "$temp_registry"

    # Check against registry
    if [[ -f "$registry_file" ]]; then
        while IFS= read -r line; do
            local expected_checksum expected_file
            expected_checksum=$(echo "$line" | awk '{print $1}')
            expected_file=$(echo "$line" | awk '{print $2}')

            if [[ -f "$expected_file" ]]; then
                local current_checksum
                current_checksum=$(sha256sum "$expected_file" | awk '{print $1}')
                if [[ "$current_checksum" != "$expected_checksum" ]]; then
                    failed_hooks+=("$expected_file")
                    log_audit "HOOK_TAMPER" "hook_integrity_guardian" "Tampered hook: $expected_file"
                fi
            else
                failed_hooks+=("$expected_file")
                log_audit "HOOK_MISSING" "hook_integrity_guardian" "Missing hook: $expected_file"
            fi
        done < "$registry_file"
    else
        log_audit "REGISTRY_MISSING" "hook_integrity_guardian" "Hook registry not found, initializing"
        mv "$temp_registry" "$registry_file"
        return 0
    fi

    rm -f "$temp_registry"

    if [[ ${#failed_hooks[@]} -gt 0 ]]; then
        local alert_msg="HOOK INTEGRITY BREACH: ${failed_hooks[*]}"
        send_alert "$alert_msg"
        echo "ERROR: Hook integrity compromised. System lockdown initiated."
        exit 1
    fi

    return 0
}

# Register hook execution
register_hook_execution() {
    local hook_name="$1"
    log_audit "EXECUTION" "$hook_name" "Hook executed"
}

# Monitor test modifications
monitor_test_modifications() {
    local operation="$1"
    local target_file="$2"

    if [[ "$operation" == "rm" || "$operation" == "delete" ]] && [[ "$target_file" =~ \.test$ ]]; then
        log_audit "TEST_DELETION_ATTEMPT" "hook_integrity_guardian" "Attempted to delete test file: $target_file"
        send_alert "TEST FILE DELETION ATTEMPT: $target_file"
        echo "ERROR: Test file deletion blocked."
        exit 1
    fi
}

# Detect feature deletion gaming
detect_feature_deletion_gaming() {
    local changed_files=("$@")
    local gaming_patterns=("remove" "delete" "disable" "comment out" "TODO" "FIXME")

    for file in "${changed_files[@]}"; do
        if [[ -f "$file" ]]; then
            for pattern in "${gaming_patterns[@]}"; do
                if grep -qi "$pattern" "$file"; then
                    log_audit "GAMING_DETECTED" "hook_integrity_guardian" "Potential gaming in $file: $pattern"
                    send_alert "FEATURE DELETION GAMING DETECTED: $file contains '$pattern'"
                fi
            done
        fi
    done
}

# Intercept hook modifications
intercept_hook_modifications() {
    local operation="$1"
    local target_file="$2"

    if [[ "$target_file" =~ hooks/.*\.sh$ ]] && [[ "$operation" != "read" ]]; then
        log_audit "HOOK_MODIFICATION" "hook_integrity_guardian" "Attempted to modify hook: $target_file"
        send_alert "HOOK MODIFICATION ATTEMPT: $target_file"
        echo "ERROR: Hook modification blocked."
        exit 1
    fi
}

# Detect suppression attempts
detect_suppression_attempts() {
    local content="$1"
    local suppression_patterns=("# suppress" "# ignore" "# noqa" "# type: ignore" "// suppress" "// ignore")

    for pattern in "${suppression_patterns[@]}"; do
        if echo "$content" | grep -qi "$pattern"; then
            log_audit "SUPPRESSION_ATTEMPT" "hook_integrity_guardian" "Suppression pattern detected: $pattern"
            send_alert "WARNING SUPPRESSION ATTEMPT DETECTED: $pattern"
        fi
    done
}

# Parallel validation check
parallel_validation_check() {
    # Run validations in parallel
    verify_all_hooks &
    local verify_pid=$!

    # Other checks can be added here

    wait $verify_pid
}

# Main execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # Script called directly
    case "${1:-}" in
        verify)
            verify_all_hooks
            ;;
        register)
            register_hook_execution "${2:-unknown}"
            ;;
        *)
            echo "Usage: $0 {verify|register <hook_name>}"
            exit 1
            ;;
    esac
fi