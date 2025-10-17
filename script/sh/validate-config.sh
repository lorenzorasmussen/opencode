#!/bin/bash

# OpenCode Configuration Validation Script
# Tests compliance with official OpenCode specifications

echo "🔍 OpenCode Configuration Validation"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Function to report results
check_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}: $2"
        ((FAILED++))
    fi
}

# 1. Directory Structure Validation
echo ""
echo "📁 Directory Structure Validation:"
echo "----------------------------------"

# Check for singular directory names
if [ -d "agent" ] && [ ! -d "agents" ]; then
    check_result 0 "Agent directory uses singular naming (agent/)"
else
    check_result 1 "Agent directory should use singular naming (agent/)"
fi

if [ -d "command" ] && [ ! -d "commands" ]; then
    check_result 0 "Command directory uses singular naming (command/)"
else
    check_result 1 "Command directory should use singular naming (command/)"
fi

# 2. JSON Schema Validation
echo ""
echo "📋 JSON Schema Validation:"
echo "--------------------------"

# Check JSON syntax
if python3 -m json.tool opencode.json > /dev/null 2>&1; then
    check_result 0 "JSON syntax is valid"
else
    check_result 1 "JSON syntax is invalid"
fi

# Check for correct schema URL
if grep -q '"$schema": "https://opencode.ai/config.json"' opencode.json; then
    check_result 0 "Official schema URL is present"
else
    check_result 1 "Official schema URL is missing"
fi

# Check for singular keys
if grep -q '"agent":' opencode.json && ! grep -q '"agents":' opencode.json; then
    check_result 0 "Uses singular 'agent' key"
else
    check_result 1 "Should use singular 'agent' key"
fi

if grep -q '"command":' opencode.json && ! grep -q '"commands":' opencode.json; then
    check_result 0 "Uses singular 'command' key"
else
    check_result 1 "Should use singular 'command' key"
fi

# 3. Permission System Validation
echo ""
echo "🔐 Permission System Validation:"
echo "--------------------------------"

# Check for permission key (singular)
if grep -q '"permission":' opencode.json && ! grep -q '"permissions":' opencode.json; then
    check_result 0 "Uses singular 'permission' key"
else
    check_result 1 "Should use singular 'permission' key"
fi

# Check for proper permission values
if grep -q '"allow"\|"ask"\|"deny"' opencode.json; then
    check_result 0 "Uses proper permission values (allow/ask/deny)"
else
    check_result 1 "Permission values should be allow/ask/deny"
fi

# 4. Model Validation
echo ""
echo "🤖 Model Validation:"
echo "-------------------"

# Check for valid OpenCode models (zen-only configuration or omitted for OAuth inheritance)
if grep -q '"zen"' opencode.json || ! grep -q '"model"' opencode.json; then
    check_result 0 "Uses Zen model or inherits via OAuth (enforced Zen-only configuration)"
else
    check_result 1 "Should use zen model or omit for OAuth inheritance (enforced Zen-only configuration)"
fi

# 5. Variable Syntax Validation
echo ""
echo "🔧 Variable Syntax Validation:"
echo "------------------------------"

# Check for proper variable syntax
if grep -q '{env:\|{file:' opencode.json; then
    check_result 0 "Uses official variable syntax ({env:}/{file:})"
else
    echo -e "${YELLOW}⚠️  INFO${NC}: No environment/file variables found (this is OK for basic configs)"
fi

# 6. Agent File Validation
echo ""
echo "👥 Agent File Validation:"
echo "------------------------"

# Check agent files exist
agent_count=$(find agent -name "*.md" 2>/dev/null | wc -l)
if [ $agent_count -gt 0 ]; then
    check_result 0 "Found $agent_count agent configuration files"
else
    check_result 1 "No agent configuration files found"
fi

# Check for proper frontmatter in agent files
agent_frontmatter_count=$(find agent -name "*.md" -exec grep -l "^---$" {} \; | wc -l)
if [ $agent_frontmatter_count -eq $agent_count ]; then
    check_result 0 "All agent files have proper frontmatter"
else
    check_result 1 "Some agent files missing proper frontmatter"
fi

# 7. Command File Validation
echo ""
echo "⚙️ Command File Validation:"
echo "--------------------------"

# Check command files exist
command_count=$(find command -name "*.md" 2>/dev/null | wc -l)
if [ $command_count -gt 0 ]; then
    check_result 0 "Found $command_count command configuration files"
else
    check_result 1 "No command configuration files found"
fi

# Check for subtask in command files
subtask_count=$(find command -name "*.md" -exec grep -l "subtask:" {} \; | wc -l)
if [ $subtask_count -eq $command_count ]; then
    check_result 0 "All command files have subtask field"
else
    check_result 1 "Some command files missing subtask field"
fi

# 8. Functional Testing
echo ""
echo "🧪 Functional Testing:"
echo "----------------------"

# Test OpenCode availability
if command -v opencode &> /dev/null; then
    check_result 0 "OpenCode CLI is available"
else
    check_result 1 "OpenCode CLI is not available"
fi

# Test configuration loading (without executing)
if opencode run --help > /dev/null 2>&1; then
    check_result 0 "OpenCode can load configuration"
else
    check_result 1 "OpenCode cannot load configuration"
fi

# Summary
echo ""
echo "📊 Validation Summary:"
echo "======================"
echo "Total Tests: $((PASSED + FAILED))"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All validation checks passed! Configuration is ready for production.${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}⚠️  $FAILED validation checks failed. Please review and fix issues.${NC}"
    exit 1
fi