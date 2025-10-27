#!/bin/bash

# Quick OpenCode Functionality Test
echo "🧪 Quick OpenCode Test"
echo "======================"

echo "1. Testing basic model response..."
opencode run --model opencode/code-supernova "Say 'Hello from OpenCode!'" | head -5

echo ""
echo "2. Testing agent availability..."
opencode run --agent orchestrator "Confirm you are the orchestrator agent" | head -3

echo ""
echo "3. Testing command system..."
opencode run /review-security "Quick security check" | head -3

echo ""
echo "✅ Quick test completed!"