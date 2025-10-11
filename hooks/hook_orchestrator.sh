#!/bin/bash
# hooks/hook_orchestrator.sh
# Main coordinator for all hook execution

set -euo pipefail

# ============================================================================
# INITIALIZATION
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/config/hook_config.sh"
source "${SCRIPT_DIR}/lib/logging.sh"
source "${SCRIPT_DIR}/lib/validation.sh"

# Set session ID if not set
export HOOK_SESSION_ID="${HOOK_SESSION_ID:-$$}"

log_info "Hook Orchestrator starting - Session: $HOOK_SESSION_ID"

# ============================================================================
# PRE-AGENT PHASE
# ============================================================================

function execute_pre_agent_phase() {
    log_info "════════════════════════════════════════════════════"
    log_info "PRE-AGENT PHASE - Session: $HOOK_SESSION_ID"
    log_info "════════════════════════════════════════════════════"

    local hooks=(
        # 1. Initialize loop detection
        "${HOOKS_CORE}/hook_loop_guardian.sh:initialize"

        # 2. Verify hook integrity (prevents tampering)
        "${HOOKS_CORE}/hook_integrity_guardian.sh:verify_all_hooks"

        # 3. Documentation requirement
        "${HOOKS_EXISTING}/pre_work_hook.sh"

        # 4. Input sanitization (prompt injection, PII)
        "${HOOKS_CORE}/pre_agent_input_sanitizer.sh"

        # 5. Security audit
        "${HOOKS_EXISTING}/security_audit.sh"

        # 6. Load context
        "${HOOKS_CORE}/pre_agent_context_loader.sh"

        # 7. Directory structure validation
        "${HOOKS_EXISTING}/directory_hooks.sh"

        # 8. Module dependencies
        "${HOOKS_EXISTING}/module_hooks.sh"
    )

    for hook_spec in "${hooks[@]}"; do
        local hook_path="${hook_spec%%:*}"
        local hook_func="${hook_spec#*:}"
        local hook_name=$(basename "$hook_path")

        if [[ ! -f "$hook_path" ]]; then
            log_warning "Hook not found: $hook_path (skipping)"
            continue
        fi

        log_info "→ Executing: $hook_name"

        # Guard with loop detection
        source "${HOOKS_CORE}/hook_loop_guardian.sh"
        if ! guard_hook_execution "$hook_name" "pre_agent"; then
            log_error "Loop guardian blocked: $hook_name"
            return 1
        fi

        # Execute hook
        if [[ "$hook_func" != "$hook_path" ]]; then
            source "$hook_path"
            if ! $hook_func; then
                log_error "Pre-agent hook failed: $hook_name::$hook_func"
                complete_hook_execution "$hook_name"
                return 1
            fi
        else
            if ! "$hook_path"; then
                log_error "Pre-agent hook failed: $hook_name"
                complete_hook_execution "$hook_name"
                return 1
            fi
        fi

        complete_hook_execution "$hook_name"
        log_info "✓ Completed: $hook_name"
    done

    log_info "PRE-AGENT PHASE COMPLETE ✓"
    return 0
}

# ============================================================================
# PRE-MODEL PHASE
# ============================================================================

function execute_pre_model_phase() {
    log_info "════════════════════════════════════════════════════"
    log_info "PRE-MODEL PHASE"
    log_info "════════════════════════════════════════════════════"

    local hooks=(
        "${HOOKS_EXISTING}/prompt_hooks.sh"
        "${HOOKS_EXISTING}/completion_hooks.sh"
    )

    for hook_path in "${hooks[@]}"; do
        local hook_name=$(basename "$hook_path")

        if [[ ! -f "$hook_path" ]]; then
            log_warning "Hook not found: $hook_path (skipping)"
            continue
        fi

        log_info "→ Executing: $hook_name"

        # These hooks can modify but not block
        "$hook_path" || log_warning "Pre-model hook warning: $hook_name"

        log_info "✓ Completed: $hook_name"
    done

    log_info "PRE-MODEL PHASE COMPLETE ✓"
}

# ============================================================================
# TOOL CALL PHASE
# ============================================================================

function execute_pre_tool_phase() {
    local tool_name="$1"
    local target_file="${2:-}"
    local operation="${3:-execute}"

    log_info "════════════════════════════════════════════════════"
    log_info "PRE-TOOL PHASE: $tool_name"
    log_info "Target: $target_file"
    log_info "════════════════════════════════════════════════════"

    # Guard with loop detection
    source "${HOOKS_CORE}/hook_loop_guardian.sh"
    if ! guard_hook_execution "tool_$tool_name" "$target_file"; then
        log_error "Loop guardian blocked tool: $tool_name"
        return 1
    fi

    local hooks=(
        "${HOOKS_EXISTING}/pre_tool_hook.sh"
        "${HOOKS_CORE}/tool_call_permission_gate.sh"
    )

    # Add naming enforcement for file operations
    if [[ "$tool_name" =~ file_create|file_write|file_rename|file_move ]]; then
        hooks+=("${HOOKS_CORE}/naming_convention_enforcer.sh")
    fi

    # Add approval for high-risk operations
    if [[ "$tool_name" =~ delete|deploy|execute|commit ]]; then
        hooks+=("${HOOKS_EXISTING}/approve_changes.sh")
    fi

    for hook_path in "${hooks[@]}"; do
        local hook_name=$(basename "$hook_path")

        if [[ ! -f "$hook_path" ]]; then
            log_warning "Hook not found: $hook_path (skipping)"
            continue
        fi

        log_info "→ Executing: $hook_name"

        if ! "$hook_path" "$tool_name" "$target_file" "$operation"; then
            log_error "Pre-tool hook failed: $hook_name"
            complete_hook_execution "tool_$tool_name"
            return 1
        fi

        log_info "✓ Completed: $hook_name"
    done

    complete_hook_execution "tool_$tool_name"
    log_info "PRE-TOOL PHASE COMPLETE ✓"
    return 0
}

function execute_post_tool_phase() {
    local tool_name="$1"
    local target_file="${2:-}"
    local tool_result="${3:-}"

    log_info "POST-TOOL PHASE: $tool_name"

    # Cache results if applicable
    if [[ "$tool_name" =~ file_read|file_edit ]]; then
        "${HOOKS_EXISTING}/cache_edit.sh" "$target_file" "$tool_result" || true
    fi

    log_info "POST-TOOL PHASE COMPLETE ✓"
}

# ============================================================================
# LANGUAGE HOOKS (CONDITIONAL)
# ============================================================================

function check_language_hooks() {
    local operation_type="$1"
    local context="$2"

    log_info "Checking language hooks for: $operation_type"

    # Calculator hook (if math detected)
    if echo "$context" | grep -qE '[0-9]+\s*[\+\-\*\/\^]\s*[0-9]+'; then
        log_info "→ Triggering calculator_correction_hook"
        "${HOOKS_CORE}/calculator_correction_hook.sh" "$context" || true
    fi

    # Knowledge retrieval (if question detected)
    if echo "$context" | grep -qiE '\b(what|how|why|when|where|who|explain|describe)\b'; then
        log_info "→ Triggering knowledge_retrieval_hook"
        "${HOOKS_CORE}/knowledge_retrieval_hook.sh" "$context" || true
    fi
}

# ============================================================================
# POST-MODEL PHASE
# ============================================================================

function execute_post_model_phase() {
    local model_output="$1"

    log_info "════════════════════════════════════════════════════"
    log_info "POST-MODEL PHASE"
    log_info "════════════════════════════════════════════════════"

    local hooks=(
        "${HOOKS_CORE}/calculator_correction_hook.sh"
        "${HOOKS_CORE}/post_agent_output_validator.sh"
    )

    for hook_path in "${hooks[@]}"; do
        local hook_name=$(basename "$hook_path")

        if [[ ! -f "$hook_path" ]]; then
            log_warning "Hook not found: $hook_path (skipping)"
            continue
        fi

        log_info "→ Executing: $hook_name"

        if ! "$hook_path" "$model_output"; then
            log_error "Post-model validation failed: $hook_name"
            return 1
        fi

        log_info "✓ Completed: $hook_name"
    done

    log_info "POST-MODEL PHASE COMPLETE ✓"
}

# ============================================================================
# POST-AGENT PHASE
# ============================================================================

function execute_post_agent_phase() {
    log_info "════════════════════════════════════════════════════"
    log_info "POST-AGENT PHASE (Cleanup & Audit)"
    log_info "════════════════════════════════════════════════════"

    local hooks=(
        "${HOOKS_CORE}/hook_integrity_guardian.sh:verify_all_hooks"
        "${HOOKS_EXISTING}/test_hooks.sh"
        "${HOOKS_EXISTING}/post_commit_hook.sh"
        "${HOOKS_EXISTING}/post_change_summary_hook.sh"
        "${HOOKS_EXISTING}/update_documentation.sh"
        "${HOOKS_EXISTING}/performance_monitor.sh"
        "${HOOKS_EXISTING}/optimization_hooks.sh"
        "${HOOKS_CORE}/post_agent_audit_logger.sh"
        "${HOOKS_CORE}/hook_loop_guardian.sh:cleanup_session"
    )

    # Execute in reverse order (symmetric cleanup)
    for ((i=${#hooks[@]}-1; i>=0; i--)); do
        local hook_spec="${hooks[$i]}"
        local hook_path="${hook_spec%%:*}"
        local hook_func="${hook_spec#*:}"
        local hook_name=$(basename "$hook_path")

        if [[ ! -f "$hook_path" ]]; then
            log_warning "Hook not found: $hook_path (skipping)"
            continue
        fi

        log_info "→ Executing: $hook_name"

        # Post-agent hooks are non-blocking (log warnings only)
        if [[ "$hook_func" != "$hook_path" ]]; then
            source "$hook_path"
            $hook_func || log_warning "Post-agent hook warning: $hook_name::$hook_func"
        else
            "$hook_path" || log_warning "Post-agent hook warning: $hook_name"
        fi

        log_info "✓ Completed: $hook_name"
    done

    log_info "POST-AGENT PHASE COMPLETE ✓"
}

# ============================================================================
# FULL LIFECYCLE
# ============================================================================

function execute_full_lifecycle() {
    log_info "╔════════════════════════════════════════════════════╗"
    log_info "║         FULL HOOK LIFECYCLE EXECUTION              ║"
    log_info "║         Session: $HOOK_SESSION_ID                  ║"
    log_info "╚════════════════════════════════════════════════════╝"

    # Pre-agent
    if ! execute_pre_agent_phase; then
        log_critical "Pre-agent phase failed - ABORTING"
        return 1
    fi

    # Pre-model
    execute_pre_model_phase

    # [LLM execution happens here - external to orchestrator]
    log_info "→ LLM execution (external)"

    # Post-model (if output provided)
    if [[ -n "${1:-}" ]]; then
        execute_post_model_phase "$1"
    fi

    # Post-agent
    execute_post_agent_phase

    log_info "╔════════════════════════════════════════════════════╗"
    log_info "║      FULL LIFECYCLE COMPLETE ✓                     ║"
    log_info "╚════════════════════════════════════════════════════╝"
}

# ============================================================================
# MAIN ENTRY POINT
# ============================================================================

function main() {
    local phase="${1:-}"
    shift || true

    case "$phase" in
        pre_agent|pre-agent)
            execute_pre_agent_phase
            ;;
        pre_model|pre-model)
            execute_pre_model_phase
            ;;
        pre_tool|pre-tool)
            execute_pre_tool_phase "$@"
            ;;
        post_tool|post-tool)
            execute_post_tool_phase "$@"
            ;;
        post_model|post-model)
            execute_post_model_phase "$@"
            ;;
        post_agent|post-agent)
            execute_post_agent_phase
            ;;
        language)
            check_language_hooks "$@"
            ;;
        full|lifecycle)
            execute_full_lifecycle "$@"
            ;;
        *)
            cat <<EOF
OpenCode Hook Orchestrator v1.0.0

Usage: hook_orchestrator.sh <phase> [args]

PHASES:
  pre_agent                 Run all pre-agent hooks
  pre_model                 Run pre-model hooks
  pre_tool <tool> [file]    Run pre-tool hooks for specific tool
  post_tool <tool> [file]   Run post-tool hooks
  post_model <output>       Validate model output
  post_agent                Run post-agent cleanup
  language <op> <context>   Check conditional language hooks
  full [output]             Run complete lifecycle

EXAMPLES:
  # Start of agent session
  hook_orchestrator.sh pre_agent

  # Before tool execution
  hook_orchestrator.sh pre_tool file_create myfile.py

  # After tool execution
  hook_orchestrator.sh post_tool file_create myfile.py "success"

  # Validate LLM output
  hook_orchestrator.sh post_model "LLM response text..."

  # End of agent session
  hook_orchestrator.sh post_agent

  # Complete lifecycle
  hook_orchestrator.sh full "LLM output"

ENVIRONMENT:
  HOOK_SESSION_ID           Unique session identifier
  LLM_AGENT_SESSION         LLM tool session ID
  LOG_LEVEL                 DEBUG|INFO|WARNING|ERROR|CRITICAL

LOGS:
  ${HOOKS_LOGS}/hook_execution.log
  ${HOOKS_LOGS}/security_audit.log
  ${HOOKS_LOGS}/immutable_audit.log
EOF
            exit 1
            ;;
    esac
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi