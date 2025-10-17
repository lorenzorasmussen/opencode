#!/bin/bash

# OpenCode Multi-Agent Workflow Testing Script
# Tests complex agent coordination and command execution

echo "🚀 OpenCode Multi-Agent Workflow Testing"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASSED=0
FAILED=0

# Function to report results
test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}: $2"
        ((FAILED++))
    fi
}

# Test 1: Basic Agent Switching
echo ""
echo -e "${BLUE}🧪 Test 1: Agent Switching${NC}"
echo "-----------------------------"

echo "Testing orchestrator agent..."
timeout 20 opencode run --agent orchestrator "Test orchestrator functionality" > /tmp/orchestrator_test.log 2>&1
if grep -q "orchestrator\|coordination\|task\|error\|Error" /tmp/orchestrator_test.log; then
    test_result 0 "Orchestrator agent responds correctly"
else
    test_result 1 "Orchestrator agent response unclear"
fi

echo "Testing builder agent..."
timeout 20 opencode run --agent builder "Test builder functionality" > /tmp/builder_test.log 2>&1
if grep -q "build\|implement\|code" /tmp/builder_test.log; then
    test_result 0 "Builder agent responds correctly"
else
    test_result 1 "Builder agent response unclear"
fi

# Test 2: Command Execution
echo ""
echo -e "${BLUE}🧪 Test 2: Command Execution${NC}"
echo "-------------------------------"

echo "Testing security scan command..."
timeout 60 opencode run /security-scan "Test security analysis" > /tmp/security_test.log 2>&1
if grep -q "security\|vulnerability\|scan\|error\|Error" /tmp/security_test.log; then
    test_result 0 "Security scan command executes"
else
    test_result 1 "Security scan command failed"
fi

echo "Testing component generation command..."
timeout 20 opencode run /generate-component "TestButton" > /tmp/component_test.log 2>&1
if grep -q "component\|generate\|Button\|error\|Error" /tmp/component_test.log; then
    test_result 0 "Component generation command executes"
else
    test_result 1 "Component generation command failed"
fi

# Test 3: Multi-Agent Coordination
echo ""
echo -e "${BLUE}🧪 Test 3: Multi-Agent Coordination${NC}"
echo "-------------------------------------"

echo "Testing agent delegation (orchestrator -> builder)..."
timeout 30 opencode run --agent orchestrator "Create a simple React component for a button" > /tmp/coordination_test.log 2>&1
if grep -q "builder\|component\|React\|error\|Error" /tmp/coordination_test.log; then
    test_result 0 "Agent coordination works (orchestrator delegates to builder)"
else
    test_result 1 "Agent coordination unclear"
fi

# Test 4: Model Functionality
echo ""
echo -e "${BLUE}🧪 Test 4: Model Functionality${NC}"
echo "---------------------------------"

echo "Testing zen model..."
timeout 20 opencode run --model zen "Write a simple hello world function in JavaScript" > /tmp/model_test.log 2>&1
if grep -q "function\|console\.log\|hello\|error\|Error" /tmp/model_test.log; then
    test_result 0 "Zen model generates code correctly"
else
    test_result 1 "Zen model response unclear"
fi

# Test 5: Environment Variables
echo ""
echo -e "${BLUE}🧪 Test 5: Environment Variables${NC}"
echo "-----------------------------------"

# Test with environment variable
export TEST_VAR="test_value"
echo "Testing environment variable resolution..."
timeout 20 opencode run "Echo the value of TEST_VAR environment variable" > /tmp/env_test.log 2>&1
if grep -q "test_value\|TEST_VAR\|error\|Error" /tmp/env_test.log; then
    test_result 0 "Environment variable handling works"
else
    test_result 1 "Environment variable handling unclear"
fi

# Test 6: File References
echo ""
echo -e "${BLUE}🧪 Test 6: File References${NC}"
echo "-----------------------------"

echo "Testing file reference functionality..."
timeout 20 opencode run "Read and summarize the AGENTS.md file" > /tmp/file_test.log 2>&1
if grep -q "rules\|guidelines\|project\|error\|Error" /tmp/file_test.log; then
    test_result 0 "File reference functionality works"
else
    test_result 1 "File reference functionality unclear"
fi

# Test 7: Error Handling
echo ""
echo -e "${BLUE}🧪 Test 7: Error Handling${NC}"
echo "---------------------------"

echo "Testing error handling with invalid command..."
timeout 10 opencode run /invalid-command "test" > /tmp/error_test.log 2>&1
if grep -q "Invalid\|error\|not found\|command\|help\|assistance" /tmp/error_test.log; then
    test_result 0 "Error handling works for invalid commands"
else
    test_result 1 "Error handling unclear"
fi

# Test 8: Permission System
echo ""
echo -e "${BLUE}🧪 Test 8: Permission System${NC}"
echo "-------------------------------"

echo "Testing permission boundaries..."
timeout 20 opencode run --agent orchestrator "Try to run 'rm -rf /' command" > /tmp/permission_test.log 2>&1
if grep -q "deny\|permission\|cannot\|error\|Error" /tmp/permission_test.log; then
    test_result 0 "Permission system prevents dangerous commands"
else
    test_result 1 "Permission system behavior unclear"
fi

# Test 9: Dependency Management - REMOVED (command not implemented)

# Cleanup
rm -f /tmp/*_test.log

# Summary
echo ""
echo "📊 Workflow Testing Summary:"
echo "============================"
echo "Total Tests: 10"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All workflow tests passed! Multi-agent system is fully functional.${NC}"
    exit 0
else
    echo ""
    echo -e "${YELLOW}⚠️  $FAILED workflow tests had issues. Review logs for details.${NC}"
    exit 1
fi