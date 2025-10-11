#!/bin/bash

# Naming Convention Enforcer - Comprehensive naming validation system
# File: hooks/naming_convention_enforcer.sh

set -euo pipefail

# Configuration
HOOK_DIR="${HOOK_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)}"
PROJECT_ROOT="${PROJECT_ROOT:-$HOOK_DIR/..}"
ANALYSIS_CACHE="${ANALYSIS_CACHE:-$HOOK_DIR/../.hooks/naming_cache.json}"
LOG_FILE="${LOG_FILE:-$HOOK_DIR/../.hooks/naming_enforcer.log}"

# Forbidden words list
FORBIDDEN_WORDS=(
    "enhanced" "improved" "better" "new" "updated" "modified" "final" "final2"
    "really_final" "temp" "temporary" "tmp" "test123" "asdf" "foo" "bar"
    "untitled" "copy" "backup"
)

# Ensure directories exist
mkdir -p "$(dirname "$LOG_FILE")"

# Logging function
log_naming() {
    local event="$1"
    local details="${2:-}"
    echo "$(date '+%Y-%m-%d %H:%M:%S')|$event|$details" >> "$LOG_FILE"
}

# Detect naming conventions in project
detect_naming_conventions() {
    local cache_file="$ANALYSIS_CACHE"

    if [[ -f "$cache_file" ]] && [[ $(find "$cache_file" -mmin -60 2>/dev/null) ]]; then
        # Cache is fresh (less than 1 hour old)
        cat "$cache_file"
        return
    fi

    local conventions="{}"

    # Analyze file extensions and naming patterns
    local extensions
    extensions=$(find "$PROJECT_ROOT" -type f -name "*.?*" | sed 's/.*\.//' | sort | uniq -c | sort -nr | head -10)

    # Simple convention detection (can be extended)
    conventions=$(jq -n --arg extensions "$extensions" '{"file_extensions": $extensions}')

    echo "$conventions" > "$cache_file"
    echo "$conventions"
}

# Validate filename against conventions and forbidden words
validate_filename() {
    local filename="$1"
    local basename
    basename=$(basename "$filename")

    # Check forbidden words
    for word in "${FORBIDDEN_WORDS[@]}"; do
        if echo "$basename" | grep -qi "$word"; then
            log_naming "FORBIDDEN_WORD" "Filename '$basename' contains forbidden word '$word'"
            echo "ERROR: Filename contains forbidden word '$word'"
            return 1
        fi
    done

    # Check for duplicates (simple check)
    if [[ -f "$filename" ]]; then
        local similar_files
        similar_files=$(find "$PROJECT_ROOT" -name "*${basename%.*}*" -type f | wc -l)
        if [[ $similar_files -gt 1 ]]; then
            log_naming "DUPLICATE_DETECTED" "Potential duplicate file: $basename"
            echo "WARNING: Potential duplicate file detected"
        fi
    fi

    # Check naming conventions (basic checks)
    if [[ "$basename" =~ ^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$ ]]; then
        log_naming "VALID" "Filename '$basename' is valid"
        return 0
    else
        log_naming "INVALID_FORMAT" "Filename '$basename' has invalid format"
        echo "ERROR: Invalid filename format"
        return 1
    fi
}

# Check convention compliance
check_convention_compliance() {
    local filename="$1"
    local conventions
    conventions=$(detect_naming_conventions)

    # Basic compliance check (extend as needed)
    if validate_filename "$filename"; then
        return 0
    else
        return 1
    fi
}

# Convert to convention (auto-fix if possible)
convert_to_convention() {
    local filename="$1"
    local new_name="$filename"

    # Remove forbidden words
    for word in "${FORBIDDEN_WORDS[@]}"; do
        new_name=$(echo "$new_name" | sed "s/$word//gi" | sed 's/__*/_/g' | sed 's/^_\|_$//g')
    done

    # Basic cleanup
    new_name=$(echo "$new_name" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-zA-Z0-9._-]/_/g')

    if [[ "$new_name" != "$filename" ]]; then
        echo "Suggested name: $new_name"
        return 0
    else
        return 1
    fi
}

# Suggest versioned name
suggest_versioned_name() {
    local base_name="$1"
    local counter=1

    while [[ -f "${base_name}_v${counter}" ]] || [[ -f "${base_name}_v${counter}.sh" ]]; do
        ((counter++))
    done

    echo "${base_name}_v${counter}"
}

# Enforce naming on operation
enforce_naming_on_operation() {
    local operation="$1"
    local target_file="$2"

    case "$operation" in
        create|add|new)
            if ! check_convention_compliance "$target_file"; then
                echo "Naming convention violation for: $target_file"
                if convert_to_convention "$target_file"; then
                    echo "Use suggested name or fix manually."
                fi
                exit 1
            fi
            ;;
        *)
            # For other operations, just validate if file exists
            if [[ -f "$target_file" ]]; then
                validate_filename "$target_file" || exit 1
            fi
            ;;
    esac
}

# Main execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # Script called directly
    case "${1:-}" in
        validate)
            validate_filename "${2:-}"
            ;;
        detect)
            detect_naming_conventions
            ;;
        convert)
            convert_to_convention "${2:-}"
            ;;
        enforce)
            enforce_naming_on_operation "${2:-}" "${3:-}"
            ;;
        *)
            echo "Usage: $0 {validate <filename>|detect|convert <filename>|enforce <operation> <filename>}"
            exit 1
            ;;
    esac
fi