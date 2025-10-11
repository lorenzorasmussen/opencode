#!/bin/sh
# hooks/tests/test_loop_guardian.sh

set -eu

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
. "${SCRIPT_DIR}/../config/hook_config.sh"
. "${SCRIPT_DIR}/../core/hook_loop_guardian.sh"

# Test state
TEST_NAME="Loop Guardian Test"
TESTS_RUN=0
TESTS_PASSED=0

assert_equals() {
    TESTS_RUN=$((TESTS_RUN + 1))
    expected="$1"
    actual="$2"
    message="${3:-Assertion failed}"

    if [ "$expected" = "$actual" ]; then
        TESTS_PASSED=$((TESTS_PASSED + 1))
        echo "  ✓ $message"
    else
        echo "  ✗ $message"
        echo "    Expected: $expected"
        echo "    Actual: $actual"
        return 1
    fi
}

assert_success() {
    TESTS_RUN=$((TESTS_RUN + 1))
    message="${1:-Command should succeed}"

    set +e
    "$@" > /dev/null 2>&1
    exit_code=$?
    set -e

    if [ "$exit_code" -eq 0 ]; then
        TESTS_PASSED=$((TESTS_PASSED + 1))
        echo "  ✓ $message"
    else
        echo "  ✗ $message"
        return 1
    fi
}

assert_failure() {
    TESTS_RUN=$((TESTS_RUN + 1))
    message="${1:-Command should fail}"

    if ( "$@" ) 2>/dev/null; then
        echo "  ✗ $message"
        return 1
    else
        TESTS_PASSED=$((TESTS_PASSED + 1))
        echo "  ✓ $message"
    fi
}

echo "$TEST_NAME"
echo "----------------------------------------"

# Test 1: Basic execution guard
echo "Test 1: Basic execution guard"
# Clear stack
rm -f "$EXECUTION_STACK"
HOOK_COOLDOWN=0
assert_success guard_hook_execution "test_hook" "test_context"
complete_hook_execution "test_hook"

# Test 2: Self-recursion detection
echo "Test 2: Self-recursion detection"
echo "MAX_SAME_HOOK_CONSECUTIVE=$MAX_SAME_HOOK_CONSECUTIVE"
rm -f "$EXECUTION_STACK"
HOOK_COOLDOWN=0
MAX_SAME_HOOK_CONSECUTIVE=2
LOG_LEVEL=DEBUG

assert_success guard_hook_execution "recursive_hook" "ctx1"
assert_success guard_hook_execution "recursive_hook" "ctx2"
assert_failure guard_hook_execution "recursive_hook" "ctx3"

complete_hook_execution "recursive_hook"
complete_hook_execution "recursive_hook"

# Test 3: Basic complete
echo "Test 3: Basic complete"
rm -f "$EXECUTION_STACK"
HOOK_COOLDOWN=0
assert_success guard_hook_execution "complete_hook" "ctx"
assert_success complete_hook_execution "complete_hook"

# Summary
echo "----------------------------------------"
echo "Tests Run: $TESTS_RUN"
echo "Tests Passed: $TESTS_PASSED"
echo "Tests Failed: $((TESTS_RUN - TESTS_PASSED))"

[ "$TESTS_PASSED" -eq "$TESTS_RUN" ]