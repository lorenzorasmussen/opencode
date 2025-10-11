#!/bin/sh
# hooks/core/hook_loop_guardian.sh
# POSIX-compliant loop prevention system

set -eu

# ============================================================================
# CONFIGURATION
# ============================================================================

MAX_RECURSION_DEPTH="${MAX_RECURSION_DEPTH:-10}"
MAX_HOOK_CALLS_PER_SESSION="${MAX_HOOK_CALLS_PER_SESSION:-100}"
MAX_SAME_HOOK_CONSECUTIVE="${MAX_SAME_HOOK_CONSECUTIVE:-3}"

# State tracking using filesystem instead of associative arrays
LOOP_STATE_DIR="${LOOP_STATE_DIR:-/tmp/hook_loop_state}"
CURRENT_SESSION="${HOOK_SESSION_ID:-$$}"

# Execution tracking files
EXECUTION_STACK="${LOOP_STATE_DIR}/${CURRENT_SESSION}_stack.txt"
EXECUTION_COUNT_DIR="${LOOP_STATE_DIR}/${CURRENT_SESSION}_counts"
HOOK_TIMINGS_DIR="${LOOP_STATE_DIR}/${CURRENT_SESSION}_timings"
IGNORE_FLAGS_DIR="${LOOP_STATE_DIR}/${CURRENT_SESSION}_ignore"
CIRCULAR_DEPS="${LOOP_STATE_DIR}/${CURRENT_SESSION}_circular.txt"
HOOK_CALL_LOG="${LOOP_STATE_DIR}/${CURRENT_SESSION}_calls.log"

# Cooldown between hook re-executions (seconds)
HOOK_COOLDOWN=1

# Initialize state directories
mkdir -p "$LOOP_STATE_DIR"
mkdir -p "$EXECUTION_COUNT_DIR"
mkdir -p "$HOOK_TIMINGS_DIR"
mkdir -p "$IGNORE_FLAGS_DIR"

# ============================================================================
# POSIX-COMPATIBLE IMPLEMENTATIONS
# ============================================================================

# Replace associative arrays with file-based storage

# Get execution count for a hook
get_hook_count() {
    local hook_name="$1"
    local count_file="${EXECUTION_COUNT_DIR}/${hook_name}"

    if [ -f "$count_file" ]; then
        cat "$count_file"
    else
        echo "0"
    fi
}

# Increment execution count for a hook
increment_hook_count() {
    local hook_name="$1"
    local count_file="${EXECUTION_COUNT_DIR}/${hook_name}"
    local current_count

    current_count=$(get_hook_count "$hook_name")
    current_count=$((current_count + 1))
    echo "$current_count" > "$count_file"
    echo "$current_count"
}

# Get last execution time for a hook
get_last_execution_time() {
    local hook_name="$1"
    local time_file="${HOOK_TIMINGS_DIR}/${hook_name}"

    if [ -f "$time_file" ]; then
        cat "$time_file"
    else
        echo "0"
    fi
}

# Set last execution time for a hook
set_last_execution_time() {
    local hook_name="$1"
    local timestamp="$2"
    local time_file="${HOOK_TIMINGS_DIR}/${hook_name}"

    echo "$timestamp" > "$time_file"
}

# Check if ignore flag is set
is_ignore_flag_set() {
    local hook_name="$1"
    local context="${2:-default}"
    local ignore_file="${IGNORE_FLAGS_DIR}/${hook_name}_${context}"

    [ -f "$ignore_file" ]
}

# Set ignore flag
set_ignore_flag() {
    local hook_name="$1"
    local context="${2:-default}"
    local ignore_file="${IGNORE_FLAGS_DIR}/${hook_name}_${context}"

    touch "$ignore_file"
    log_debug "Set ignore flag for: ${hook_name}:${context}"
}

# Clear ignore flag
clear_ignore_flag() {
    local hook_name="$1"
    local context="${2:-default}"
    local ignore_file="${IGNORE_FLAGS_DIR}/${hook_name}_${context}"

    rm -f "$ignore_file"
    log_debug "Cleared ignore flag for: ${hook_name}:${context}"
}

# ============================================================================
# EXECUTION STACK TRACKING
# ============================================================================

push_execution_stack() {
    local hook_name="$1"
    local context="${2:-}"
    local timestamp
    timestamp=$(date +%s)

    echo "${timestamp}|${hook_name}|${context}" >> "$EXECUTION_STACK"

    # Check stack depth
    local stack_depth
    if [ -f "$EXECUTION_STACK" ]; then
        stack_depth=$(wc -l < "$EXECUTION_STACK")
    else
        stack_depth=0
    fi

    if [ "$stack_depth" -gt "$MAX_RECURSION_DEPTH" ]; then
        log_critical "RECURSION LIMIT EXCEEDED"
        log_critical "Stack depth: ${stack_depth} (max: ${MAX_RECURSION_DEPTH})"
        log_critical "Current stack:"
        tail -10 "$EXECUTION_STACK" 2>/dev/null || true

        raise_recursion_error "$hook_name" "$stack_depth"
        return 1
    fi

    log_debug "Stack push: $hook_name (depth: $stack_depth)"
    return 0
}

pop_execution_stack() {
    if [ -f "$EXECUTION_STACK" ] && [ -s "$EXECUTION_STACK" ]; then
        # POSIX way to remove last line
        if head -n -1 "$EXECUTION_STACK" > "${EXECUTION_STACK}.tmp" 2>/dev/null; then
            mv "${EXECUTION_STACK}.tmp" "$EXECUTION_STACK"
        fi
    fi
}

get_stack_depth() {
    if [ -f "$EXECUTION_STACK" ]; then
        wc -l < "$EXECUTION_STACK"
    else
        echo "0"
    fi
}

is_hook_in_stack() {
    local hook_name="$1"

    if [ -f "$EXECUTION_STACK" ]; then
        grep -q "|${hook_name}|" "$EXECUTION_STACK"
        return $?
    fi
    return 1
}

# ============================================================================
# SELF-RECURSION DETECTION
# ============================================================================

detect_self_recursion() {
    local hook_name="$1"
    local count

    # Check if this exact hook is already in the stack
    if is_hook_in_stack "$hook_name"; then
        count=$(grep -c "|${hook_name}|" "$EXECUTION_STACK" 2>/dev/null || echo "0")

        if [ "$count" -ge "$MAX_SAME_HOOK_CONSECUTIVE" ]; then
            log_critical "SELF-RECURSION DETECTED: $hook_name"
            log_critical "Hook has called itself $count times"
            log_critical "This indicates an infinite loop pattern"

            # Show the recursion chain
            log_critical "Recursion chain:"
            grep "|${hook_name}|" "$EXECUTION_STACK" | tail -5 2>/dev/null || true

            raise_recursion_error "$hook_name" "$count"
            return 1
        fi

        log_warning "Hook $hook_name recursing (depth: $count)"
    fi

    return 0
}

# ============================================================================
# CIRCULAR DEPENDENCY DETECTION
# ============================================================================

detect_circular_dependency() {
    local current_hook="$1"

    if [ ! -f "$EXECUTION_STACK" ]; then
        return 0
    fi

    # Simple cycle detection: look for repeating sequences
    # Extract hook names from stack
    local hooks_sequence
    hooks_sequence=$(cut -d'|' -f2 "$EXECUTION_STACK" | tr '\n' ' ')

    # Check for simple A->B->A pattern
    if echo "$hooks_sequence" | grep -qE '(\w+) \w+ \1'; then
        log_critical "CIRCULAR DEPENDENCY DETECTED"
        log_critical "Detected cycle in: $hooks_sequence"
        log_critical "Current hook attempting to continue: $current_hook"

        echo "$(date -u +%Y-%m-%dT%H:%M:%SZ)|CYCLE|${hooks_sequence}|${current_hook}" >> "$CIRCULAR_DEPS"

        raise_circular_dependency_error "$hooks_sequence"
        return 1
    fi

    return 0
}

# ============================================================================
# RATE LIMITING / COOLDOWN
# ============================================================================

check_hook_cooldown() {
    local hook_name="$1"
    local current_time
    local last_exec_time
    local time_since_last

    current_time=$(date +%s)
    last_exec_time=$(get_last_execution_time "$hook_name")

    if [ "$last_exec_time" != "0" ]; then
        time_since_last=$((current_time - last_exec_time))

        if [ "$time_since_last" -lt "$HOOK_COOLDOWN" ]; then
            log_warning "COOLDOWN VIOLATION: $hook_name"
            log_warning "Time since last execution: ${time_since_last}s (min: ${HOOK_COOLDOWN}s)"
            log_warning "Hook is executing too frequently - possible loop"

            # Enforce cooldown
            sleep "$HOOK_COOLDOWN"
        fi
    fi

    # Update last execution time
    set_last_execution_time "$hook_name" "$current_time"
}

# ============================================================================
# TOTAL EXECUTION COUNT LIMITING
# ============================================================================

check_total_executions() {
    local hook_name="$1"
    local current_count

    current_count=$(increment_hook_count "$hook_name")

    # Check against limits
    if [ "$current_count" -gt "$MAX_HOOK_CALLS_PER_SESSION" ]; then
        log_critical "HOOK EXECUTION LIMIT EXCEEDED: $hook_name"
        log_critical "Executions: $current_count (max: $MAX_HOOK_CALLS_PER_SESSION)"
        log_critical "This hook has executed too many times in this session"

        raise_execution_limit_error "$hook_name" "$current_count"
        return 1
    fi

    # Warn at 75% threshold
    local threshold=$((MAX_HOOK_CALLS_PER_SESSION * 3 / 4))
    if [ "$current_count" -gt "$threshold" ]; then
        log_warning "Hook $hook_name nearing execution limit: $current_count/$MAX_HOOK_CALLS_PER_SESSION"
    fi

    log_debug "Hook $hook_name execution count: $current_count"
    return 0
}

# ============================================================================
# IGNORE FLAG PATTERN (Break Recursion)
# ============================================================================

should_ignore_execution() {
    local hook_name="$1"
    local context="${2:-default}"

    if is_ignore_flag_set "$hook_name" "$context"; then
        log_info "Ignoring $hook_name due to ignore flag (preventing recursion)"
        return 0  # Should ignore
    fi

    return 1  # Should not ignore
}

# ============================================================================
# CHAIN ANALYSIS
# ============================================================================

analyze_execution_chain() {
    if [ ! -f "$EXECUTION_STACK" ]; then
        return 0
    fi

    local chain
    chain=$(cut -d'|' -f2 "$EXECUTION_STACK" | tr '\n' ' -> ')
    log_info "Current execution chain: $chain"

    # Detect problematic patterns

    # Pattern 1: Simple A -> B -> A cycle
    if echo "$chain" | grep -qE '(\w+) -> \w+ -> \1'; then
        log_warning "Detected simple A->B->A pattern"
    fi

    # Pattern 2: Growing chain
    local depth
    depth=$(get_stack_depth)
    local threshold=$((MAX_RECURSION_DEPTH * 2 / 3))
    if [ "$depth" -gt "$threshold" ]; then
        log_warning "Execution chain growing long: depth $depth"
    fi
}

# ============================================================================
# MAIN GUARD FUNCTION
# ============================================================================

guard_hook_execution() {
    local hook_name="$1"
    local context="${2:-default}"

    log_info "Loop guardian checking: $hook_name"

    # Log the call
    echo "$(date -u +%Y-%m-%dT%H:%M:%SZ)|$hook_name|$context" >> "$HOOK_CALL_LOG"

    # Check 1: Should we ignore this execution?
    if should_ignore_execution "$hook_name" "$context"; then
        return 0
    fi

    # Check 2: Cooldown (rate limiting)
    check_hook_cooldown "$hook_name"

    # Check 3: Total execution count
    if ! check_total_executions "$hook_name"; then
        return 1
    fi

    # Check 4: Self-recursion detection
    if ! detect_self_recursion "$hook_name"; then
        return 1
    fi

    # Check 5: Circular dependency detection
    if ! detect_circular_dependency "$hook_name"; then
        return 1
    fi

    # Check 6: Push to execution stack
    if ! push_execution_stack "$hook_name" "$context"; then
        return 1
    fi

    # Check 7: Analyze chain for patterns
    analyze_execution_chain

    log_info "Loop guardian PASSED: $hook_name"
    return 0
}

complete_hook_execution() {
    local hook_name="$1"

    pop_execution_stack
    log_debug "Hook completed: $hook_name"
}

# ============================================================================
# INITIALIZATION
# ============================================================================

initialize() {
    # Create initial state if needed
    touch "$EXECUTION_STACK"
    touch "$HOOK_CALL_LOG"
    log_info "Loop guardian initialized for session: $CURRENT_SESSION"
}

# ============================================================================
# ERROR HANDLERS
# ============================================================================

raise_recursion_error() {
    local hook_name="$1"
    local depth="$2"

    cat >&2 <<EOF
╔════════════════════════════════════════════════════════════════╗
║                   RECURSION LIMIT EXCEEDED                     ║
╚════════════════════════════════════════════════════════════════╝

Hook: $hook_name
Recursion Depth: $depth
Maximum Allowed: $MAX_RECURSION_DEPTH

This indicates an infinite loop in your hook system.

COMMON CAUSES:
1. Hook calls save/update which triggers the same hook again
2. Circular dependency between hooks (A calls B, B calls A)
3. Missing loop prevention logic in hook implementation

SOLUTION:
- Add ignore flag before triggering operations that re-invoke hook
- Use: set_ignore_flag "$hook_name" "context"
- Clear after: clear_ignore_flag "$hook_name" "context"

Execution stack (last 10):
$(tail -10 "$EXECUTION_STACK" 2>/dev/null || echo "No stack available")

Session: $CURRENT_SESSION
EOF

    emergency_session_halt
    exit 1
}

raise_circular_dependency_error() {
    local cycle="$1"

    cat >&2 <<EOF
╔════════════════════════════════════════════════════════════════╗
║               CIRCULAR DEPENDENCY DETECTED                     ║
╚════════════════════════════════════════════════════════════════╝

Detected Cycle: $cycle

Hooks are calling each other in a circular pattern.

Session: $CURRENT_SESSION
EOF

    emergency_session_halt
    exit 1
}

raise_execution_limit_error() {
    local hook_name="$1"
    local count="$2"

    cat >&2 <<EOF
╔════════════════════════════════════════════════════════════════╗
║            HOOK EXECUTION LIMIT EXCEEDED                       ║
╚════════════════════════════════════════════════════════════════╝

Hook: $hook_name
Executions: $count
Maximum Allowed: $MAX_HOOK_CALLS_PER_SESSION

Session: $CURRENT_SESSION
EOF

    emergency_session_halt
    exit 1
}

emergency_session_halt() {
    log_critical "EMERGENCY HALT TRIGGERED"

    # Mark session as halted
    touch "${LOOP_STATE_DIR}/${CURRENT_SESSION}_HALTED"

    # Kill child processes
    pkill -P $$ 2>/dev/null || true
}

# ============================================================================
# CLEANUP & REPORTING
# ============================================================================

cleanup_session() {
    local session_id="${1:-$CURRENT_SESSION}"

    log_info "Cleaning up loop guardian state for session: $session_id"

    rm -rf "${LOOP_STATE_DIR}/${session_id}_"* 2>/dev/null || true
    rm -rf "${EXECUTION_COUNT_DIR}" 2>/dev/null || true
    rm -rf "${HOOK_TIMINGS_DIR}" 2>/dev/null || true
    rm -rf "${IGNORE_FLAGS_DIR}" 2>/dev/null || true

    log_info "Session cleanup complete"
}

generate_loop_report() {
    local session_id="${1:-$CURRENT_SESSION}"

    echo "=== LOOP GUARDIAN REPORT ==="
    echo "Session: $session_id"
    echo "Generated: $(date)"
    echo

    if [ -f "${LOOP_STATE_DIR}/${session_id}_HALTED" ]; then
        echo "⚠️  SESSION WAS HALTED DUE TO LOOP DETECTION"
        echo
    fi

    echo "Execution Statistics:"
    if [ -d "$EXECUTION_COUNT_DIR" ]; then
        for count_file in "${EXECUTION_COUNT_DIR}"/*; do
            if [ -f "$count_file" ]; then
                local hook_name=$(basename "$count_file")
                local count=$(cat "$count_file")
                echo "  $hook_name: $count executions"
            fi
        done
    fi
    echo

    if [ -f "${LOOP_STATE_DIR}/${session_id}_circular.txt" ]; then
        echo "Circular Dependencies Detected:"
        cat "${LOOP_STATE_DIR}/${session_id}_circular.txt"
        echo
    fi

    if [ -f "${LOOP_STATE_DIR}/${session_id}_calls.log" ]; then
        echo "Total Hook Calls: $(wc -l < "${LOOP_STATE_DIR}/${session_id}_calls.log")"
    fi
}

# ============================================================================
# UTILITIES
# ============================================================================

log_debug() {
    [ "${LOG_LEVEL:-INFO}" = "DEBUG" ] && echo "[DEBUG] $*" >&2 || true
}

log_info() {
    echo "[INFO] $*" >&2
}

log_warning() {
    echo "[WARNING] $*" >&2
}

log_critical() {
    echo "[CRITICAL] $*" >&2
}

# ============================================================================
# MAIN
# ============================================================================

main() {
    local command="${1:-}"
    shift || true

    case "$command" in
        initialize)
            initialize
            ;;
        guard)
            guard_hook_execution "$@"
            ;;
        complete)
            complete_hook_execution "$@"
            ;;
        ignore|set-ignore)
            set_ignore_flag "$@"
            ;;
        clear|clear-ignore)
            clear_ignore_flag "$@"
            ;;
        report)
            generate_loop_report "$@"
            ;;
        cleanup)
            cleanup_session "$@"
            ;;
        analyze)
            analyze_execution_chain
            ;;
        *)
            cat <<EOF
Usage: hook_loop_guardian.sh <command> [args]

Commands:
  initialize                    Initialize loop guardian for session
  guard <hook_name> [context]   Check if hook can execute safely
  complete <hook_name>          Mark hook execution as complete
  ignore <hook_name> [context]  Set ignore flag to break recursion
  clear <hook_name> [context]   Clear ignore flag
  report [session_id]           Generate loop detection report
  cleanup [session_id]          Clean up session state files
  analyze                       Analyze current execution chain

Environment Variables:
  MAX_RECURSION_DEPTH           Default: 10
  MAX_HOOK_CALLS_PER_SESSION    Default: 100
  MAX_SAME_HOOK_CONSECUTIVE     Default: 3
  HOOK_COOLDOWN                 Default: 1 second
  LOOP_STATE_DIR                Default: /tmp/hook_loop_state
  HOOK_SESSION_ID               Unique session identifier
EOF
            exit 1
            ;;
    esac
}

if [ "${0##*/}" = "hook_loop_guardian.sh" ]; then
    main "$@"
fi