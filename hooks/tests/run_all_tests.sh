#!/bin/bash
# hooks/tests/run_all_tests.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOOKS_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

TESTS_PASSED=0
TESTS_FAILED=0

function run_test() {
    local test_file="$1"
    local test_name=$(basename "$test_file")

    echo -n "Running $test_name... "

    if "$test_file" > /dev/null 2>&1; then
        echo -e "${GREEN}PASSED${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}FAILED${NC}"
        ((TESTS_FAILED++))
        "$test_file"  # Re-run to show errors
    fi
}

echo "╔════════════════════════════════════════════════════╗"
echo "║         OpenCode Hook System Test Suite           ║"
echo "╚════════════════════════════════════════════════════╝"
echo

# Run all test files
for test_file in "${SCRIPT_DIR}"/test_*.sh; do
    [[ -f "$test_file" ]] || continue
    run_test "$test_file"
done

echo
echo "════════════════════════════════════════════════════"
echo -e "Tests Passed: ${GREEN}${TESTS_PASSED}${NC}"
echo -e "Tests Failed: ${RED}${TESTS_FAILED}${NC}"
echo "════════════════════════════════════════════════════"

[[ $TESTS_FAILED -eq 0 ]] && exit 0 || exit 1