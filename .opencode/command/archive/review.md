---
description: Quick code review utility - analyzes code quality, finds issues, suggests improvements
agent: review_utility
subagent: none
argument-hint: "file dir --full --security --performance"
---
Command Workflow
text
CODE REVIEW UTILITY
════════════════════════════════════════════════════════════════

Command: /review src/auth/login.ts

Execution:
#!/bin/bash

TARGET="$1"
MODE="${2:---full}"

echo "👁️ Code Review Utility"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Target: $TARGET"
echo "Mode: $MODE"
echo ""

REVIEW_DIR=~/.reviews/$(date +%Y%m%d_%H%M%S)
mkdir -p "$REVIEW_DIR"

Step 1: Static Analysis
echo "🔍 Step 1: Static Analysis"
echo ""

if [[ "$TARGET" == *.ts ]] || [[ "$TARGET" == *.tsx ]]; then
# TypeScript
echo " Running ESLint..."
npx eslint "$TARGET" --format json > "$REVIEW_DIR/eslint.json"

text
ISSUES=$(jq 'length' "$REVIEW_DIR/eslint.json")
echo "   Found $ISSUES issue(s)"
elif [[ "$TARGET" == *.py ]]; then
# Python
echo " Running Ruff..."
ruff check "$TARGET" --output-format json > "$REVIEW_DIR/ruff.json"
fi

echo ""

Step 2: AI Code Review
echo "🤖 Step 2: AI Code Review"
echo ""

CODE_CONTENT=$(cat "$TARGET")

cat > "$REVIEW_DIR/review_prompt.txt" << EOF
Perform a comprehensive code review of this code:

```
$CODE_CONTENT
```

Analyze:

Code Quality - Readability, maintainability, style

Bugs & Issues - Potential runtime errors, logic flaws

Security - Vulnerabilities, injection risks, auth issues

Performance - Inefficiencies, optimizations

Best Practices - Design patterns, conventions

Testing - Test coverage needs, edge cases

For each issue found:

Severity: Critical/High/Medium/Low

Line number (if applicable)

Description

Suggested fix

Format as structured markdown.
EOF

AI-powered review
ollama run qwen3-coder < "$REVIEW_DIR/review_prompt.txt" > "$REVIEW_DIR/ai_review.md"

Parse and display
cat "$REVIEW_DIR/ai_review.md"

echo ""

Step 3: Security-Specific Checks (if --security)
if [ "$MODE" = "--security" ]; then
echo "🔒 Step 3: Security Analysis"
echo ""

text
# Check for common vulnerabilities
echo "   Checking for security issues..."

# SQL injection
if grep -q "execute.*+\|f\".*SELECT" "$TARGET"; then
    echo "   ⚠️  Potential SQL injection risk detected"
fi

# Hardcoded secrets
if grep -qE "password\s*=\s*['\"]|api_key\s*=\s*['\"]" "$TARGET"; then
    echo "   ⚠️  Hardcoded credentials detected"
fi

# XSS risks
if grep -q "innerHTML\|dangerouslySetInnerHTML" "$TARGET"; then
    echo "   ⚠️  XSS risk: Unsafe HTML insertion"
fi

echo ""
fi

Step 4: Generate Report
echo "📊 Step 4: Review Summary"
echo ""

cat > "$REVIEW_DIR/summary.md" << EOF

Code Review Summary
File: $TARGET
Date: $(date)
Reviewer: AI-Assisted Review Utility

Overall Assessment
$(head -5 "$REVIEW_DIR/ai_review.md")

Static Analysis Results
ESLint Issues: $(jq 'length' "$REVIEW_DIR/eslint.json" 2>/dev/null || echo "N/A")

Recommendations
See full report: $REVIEW_DIR/ai_review.md

Next Steps:

Address critical/high severity issues immediately

Create tickets for medium severity issues

Consider low severity as technical debt
EOF

cat "$REVIEW_DIR/summary.md"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Review complete: $REVIEW_DIR/"
echo ""
echo "Files created:"
echo " - ai_review.md - Full AI analysis"
echo " - eslint.json - Linting results"
echo " - summary.md - Executive summary"

text

**Output Example:**
👁️ Code Review Utility
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Target: src/auth/login.ts
Mode: --full

🔍 Step 1: Static Analysis

Running ESLint...
Found 3 issue(s)

🤖 Step 2: AI Code Review

Code Quality Review: src/auth/login.ts
🔴 Critical Issues (1)
Issue 1: No Error Handling on Database Query (Line 23)

typescript
const user = await db.users.findOne({ username });
Problem: Database query can throw, but error isn't caught
Fix:

typescript
try {
  const user = await db.users.findOne({ username });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
} catch (error) {
  logger.error('Database error:', error);
  return res.status(500).json({ error: 'Internal server error' });
}
🟠 High Severity Issues (2)
Issue 2: Password Comparison Not Constant-Time (Line 28)

typescript
if (user.password === hashedPassword) {
Problem: Vulnerable to timing attacks
Fix:

typescript
import { timingSafeEqual } from 'crypto';

const match = timingSafeEqual(
  Buffer.from(user.password),
  Buffer.from(hashedPassword)
);
Issue 3: JWT Secret Hardcoded (Line 34)

typescript
const token = jwt.sign(payload, 'my-secret-key');
Problem: Security risk - secret should be in environment variables
Fix:

typescript
const token = jwt.sign(payload, process.env.JWT_SECRET);
🟡 Medium Severity Issues (3)
Issue 4: Missing Input Validation

No validation for username/password format

Suggest using Zod or Joi

Issue 5: No Rate Limiting

Login endpoint vulnerable to brute force

Implement rate limiting (express-rate-limit)

Issue 6: Logging Sensitive Data

Line 15 logs entire user object (includes password hash)

Only log user ID

✅ Positive Aspects
Good use of async/await

TypeScript types properly defined

Code is readable and well-structured

📊 Metrics
Complexity: 6/10 (moderate)

Security: 4/10 (needs improvement)

Maintainability: 8/10 (good)

Test Coverage: Unknown (add tests!)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Review complete: ~/.reviews/20251015_183200/

Files created:

ai_review.md - Full AI analysis

eslint.json - Linting results

summary.md - Executive summary

text

---

## Command Summary

### `/plan` - Quick Planning
/plan "Add JWT auth" # Generate task breakdown
/plan "User dashboard" --estimate # With time estimates
/plan "API v2" --dependencies # Show dependency graph

text

### `/build` - Build/Compile
/build --prod # Production build
/build --dev # Development build
/build --watch # Watch mode
/build --clean # Clean artifacts

text

### `/debug` - Quick Debug
/debug "Error message" # Quick triage
/debug --ai # AI-assisted analysis
/debug --fix # Auto-fix suggestions

text

### `/review` - Code Review
/review src/auth/login.ts # Full review
/review src/ --security # Security focus
/review components/Button.tsx --performance # Performance focus