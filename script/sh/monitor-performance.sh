#!/bin/bash

# Performance Monitoring Script for OpenCode Agents
echo "🚀 OpenCode Performance Monitoring"
echo "=================================="

# Function to time an agent command
time_agent() {
    local agent=$1
    local prompt=$2
    local start_time=$(date +%s)
    echo "Testing $agent..."
    opencode run --agent $agent "$prompt" > /dev/null 2>&1
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    echo "$agent: ${duration}s"
}

# Test all agents with a simple prompt
time_agent orchestrator "Hello"
time_agent specifier "Hello"
time_agent planner "Hello"
time_agent architect "Hello"
time_agent builder "Hello"
time_agent reviewer "Hello"
time_agent extension-builder "Hello"
time_agent extension-tester "Hello"
time_agent monorepo-orchestrator "Hello"
time_agent i18n-manager "Hello"
time_agent context-debugger "Hello"

echo ""
echo "✅ Monitoring completed. Use /monitor-agent-performance for detailed reports."