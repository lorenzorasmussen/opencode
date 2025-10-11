#!/bin/bash

# Tool Launcher - Safe execution wrapper with pre-validation
# File: hooks/tool_launcher.sh

set -euo pipefail

# Load dependencies
HOOK_DIR="$(dirname "${BASH_SOURCE[0]}")"
source "$HOOK_DIR/pre_tool_hook.sh"

# Main launcher function
launch_tool() {
    if [[ $# -lt 1 ]]; then
        echo "Usage: $0 <tool_command> [args...]"
        echo "Example: $0 git status"
        echo "Example: $0 rm dangerous_file.txt"
        exit 1
    fi

    local tool="$1"
    shift
    local args="$*"

    echo "Launching tool: $tool $args"

    # Run pre-tool validation
    pre_tool_validation "$tool" "$@"

    # Execute the tool
    echo "Executing: $tool $@"
    exec "$tool" "$@"
}

# Main execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    launch_tool "$@"
fi