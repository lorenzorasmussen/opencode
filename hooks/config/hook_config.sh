#!/bin/bash
# hooks/config/hook_config.sh
# Central configuration for entire hook system

set -euo pipefail

# ============================================================================
# PROJECT PATHS
# ============================================================================
export OPENCODE_ROOT="/Users/lorenzorasmussen/projects/opencode"
export HOOKS_DIR="${OPENCODE_ROOT}/hooks"
export HOOKS_CORE="${HOOKS_DIR}/core"
export HOOKS_EXISTING="${HOOKS_DIR}/existing"
export HOOKS_CONFIG="${HOOKS_DIR}/config"
export HOOKS_LIB="${HOOKS_DIR}/lib"
export HOOKS_LOGS="${HOOKS_DIR}/logs"
export HOOKS_TESTS="${HOOKS_DIR}/tests"

# ============================================================================
# SECURITY & INTEGRITY
# ============================================================================
export HOOK_REGISTRY="${HOOKS_CONFIG}/hook_registry.sha256"
export AUDIT_LOG="${HOOKS_LOGS}/security_audit.log"
export IMMUTABLE_AUDIT="${HOOKS_LOGS}/immutable_audit.log"
export SECURITY_WEBHOOK="${SECURITY_WEBHOOK:-}"

# ============================================================================
# LOOP PREVENTION
# ============================================================================
export MAX_RECURSION_DEPTH=10
export MAX_HOOK_CALLS_PER_SESSION=100
export MAX_SAME_HOOK_CONSECUTIVE=3
export HOOK_COOLDOWN=1
export LOOP_STATE_DIR="${HOOKS_LOGS}/loop_state"

# ============================================================================
# NAMING CONVENTIONS
# ============================================================================
export FORBIDDEN_WORDS_FILE="${HOOKS_CONFIG}/forbidden_words.txt"
export NAMING_CACHE="${HOOKS_CONFIG}/naming_conventions.json"
export ENFORCE_NAMING=true

# ============================================================================
# LLM DETECTION
# ============================================================================
export LLM_AGENT_SESSION="${LLM_AGENT_SESSION:-}"
export AI_TOOL_ACTIVE="${AI_TOOL_ACTIVE:-}"
export HOOK_SESSION_ID="${HOOK_SESSION_ID:-$$}"

# ============================================================================
# FEATURE FLAGS
# ============================================================================
export ENABLE_HOOK_INTEGRITY=true
export ENABLE_LOOP_GUARDIAN=true
export ENABLE_NAMING_ENFORCEMENT=true
export ENABLE_TEST_PROTECTION=true
export ENABLE_OUTPUT_VALIDATION=true
export ENABLE_INPUT_SANITIZATION=true
export ENABLE_AUDIT_LOGGING=true

# ============================================================================
# LOGGING
# ============================================================================
export LOG_LEVEL="${LOG_LEVEL:-INFO}"
export LOG_TO_STDOUT=true
export LOG_TO_FILE=true
export LOG_FILE="${HOOKS_LOGS}/hook_execution.log"

# ============================================================================
# NOTIFICATIONS
# ============================================================================
export SLACK_WEBHOOK="${SLACK_WEBHOOK:-}"
export ALERT_EMAIL="${ALERT_EMAIL:-}"
export ENABLE_NOTIFICATIONS=true

# ============================================================================
# PERFORMANCE
# ============================================================================
export HOOK_TIMEOUT=30  # seconds
export ENABLE_PERFORMANCE_TRACKING=true

# ============================================================================
# VALIDATION
# ============================================================================
readonly HOOK_CONFIG_VERSION="1.0.0"
echo "Hook configuration loaded: v${HOOK_CONFIG_VERSION}"