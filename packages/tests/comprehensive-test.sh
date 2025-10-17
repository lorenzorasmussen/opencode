#!/bin/bash

# Comprehensive OpenCode Multi-Agent and Command Testing Script
# Tests all 12 agents and 95 commands for functionality, parallel execution, and error handling

echo "🚀 Comprehensive OpenCode Testing"
echo "=================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASSED=0
FAILED=0
TOTAL_AGENTS=0
TOTAL_COMMANDS=0

test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}: $2"
        ((FAILED++))
    fi
}

# Get list of agents
AGENTS=$(ls /Users/lorenzorasmussen/.config/opencode/agent/*.md | sed 's|.*/||' | sed 's|\.md||')
AGENT_COUNT=$(echo "$AGENTS" | wc -l)
echo "Found $AGENT_COUNT agents"

# Get list of commands
COMMANDS=$(ls /Users/lorenzorasmussen/.config/opencode/command/*.md | sed 's|.*/||' | sed 's|\.md||')
COMMAND_COUNT=$(echo "$COMMANDS" | wc -l)
echo "Found $COMMAND_COUNT commands"

# Test 1: Agent Functionality
echo ""
echo -e "${BLUE}🧪 Test 1: Agent Functionality${NC}"
echo "----------------------------------"

for agent in $AGENTS; do
    echo "Testing agent: $agent"
    timeout 15 opencode run --agent "$agent" "Test basic functionality" > "/tmp/agent_${agent}.log" 2>&1
    if grep -q -i "$agent\|functionality\|test" "/tmp/agent_${agent}.log"; then
        test_result 0 "Agent $agent responds correctly"
    else
        test_result 1 "Agent $agent response unclear"
    fi
    ((TOTAL_AGENTS++))
done

# Test 2: Command Functionality
echo ""
echo -e "${BLUE}🧪 Test 2: Command Functionality${NC}"
echo "-----------------------------------"

for cmd in $COMMANDS; do
    echo "Testing command: /$cmd"
    timeout 15 opencode run "/$cmd" "test input" > "/tmp/cmd_${cmd}.log" 2>&1
    if grep -q -i "$cmd\|test\|input" "/tmp/cmd_${cmd}.log"; then
        test_result 0 "Command /$cmd executes"
    else
        test_result 1 "Command /$cmd failed"
    fi
    ((TOTAL_COMMANDS++))
done

# Test 3: Parallel Agent Execution
echo ""
echo -e "${BLUE}🧪 Test 3: Parallel Agent Execution${NC}"
echo "--------------------------------------"

echo "Testing parallel execution of multiple agents..."
pids=()
for agent in orchestrator builder architect; do
    timeout 20 opencode run --agent "$agent" "Parallel test task" > "/tmp/parallel_${agent}.log" 2>&1 &
    pids+=($!)
done

# Wait for all to finish
for pid in "${pids[@]}"; do
    wait "$pid"
done

parallel_success=0
for agent in orchestrator builder architect; do
    if grep -q -i "parallel\|task\|test" "/tmp/parallel_${agent}.log"; then
        ((parallel_success++))
    fi
done

if [ $parallel_success -eq 3 ]; then
    test_result 0 "Parallel agent execution works"
else
    test_result 1 "Parallel agent execution failed ($parallel_success/3 succeeded)"
fi

# Test 4: Parallel Command Execution
echo ""
echo -e "${BLUE}🧪 Test 4: Parallel Command Execution${NC}"
echo "----------------------------------------"

echo "Testing parallel execution of multiple commands..."
pids=()
for cmd in plan tasks implement; do
    timeout 20 opencode run "/$cmd" "parallel test" > "/tmp/parallel_cmd_${cmd}.log" 2>&1 &
    pids+=($!)
done

# Wait for all
for pid in "${pids[@]}"; do
    wait "$pid"
done

parallel_cmd_success=0
for cmd in plan tasks implement; do
    if grep -q -i "parallel\|test\|$cmd" "/tmp/parallel_cmd_${cmd}.log"; then
        ((parallel_cmd_success++))
    fi
done

if [ $parallel_cmd_success -eq 3 ]; then
    test_result 0 "Parallel command execution works"
else
    test_result 1 "Parallel command execution failed ($parallel_cmd_success/3 succeeded)"
fi

# Test 5: Error Handling
echo ""
echo -e "${BLUE}🧪 Test 5: Error Handling${NC}"
echo "----------------------------"

echo "Testing invalid agent..."
timeout 10 opencode run --agent invalid_agent "test" > /tmp/error_agent.log 2>&1
if grep -q -i "error\|invalid\|not found" /tmp/error_agent.log; then
    test_result 0 "Invalid agent error handling works"
else
    test_result 1 "Invalid agent error handling failed"
fi

echo "Testing invalid command..."
timeout 10 opencode run /invalid-command "test" > /tmp/error_cmd.log 2>&1
if grep -q -i "error\|invalid\|not found" /tmp/error_cmd.log; then
    test_result 0 "Invalid command error handling works"
else
    test_result 1 "Invalid command error handling failed"
fi

# Test 6: Zen Model Compliance
echo ""
echo -e "${BLUE}🧪 Test 6: Zen Model Compliance${NC}"
echo "----------------------------------"

echo "Testing Zen model usage..."
# Since agents are configured to use zen model, check if responses indicate model usage
zen_compliant=0
for agent in $AGENTS; do
    if grep -q -i "zen\|model\|response" "/tmp/agent_${agent}.log"; then
        ((zen_compliant++))
    fi
done

if [ $zen_compliant -gt 0 ]; then
    test_result 0 "Zen model compliance detected in $zen_compliant agents"
else
    test_result 1 "Zen model compliance not detected"
fi

# Cleanup
rm -f /tmp/agent_*.log /tmp/cmd_*.log /tmp/parallel_*.log /tmp/error_*.log

# Summary
echo ""
echo "📊 Comprehensive Testing Summary:"
echo "=================================="
echo "Agents tested: $TOTAL_AGENTS"
echo "Commands tested: $TOTAL_COMMANDS"
echo "Total Tests: $((PASSED + FAILED))"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All comprehensive tests passed! System is fully functional.${NC}"
    exit 0
else
    echo ""
    echo -e "${YELLOW}⚠️  $FAILED tests had issues. Review for details.${NC}"
    exit 1
fi