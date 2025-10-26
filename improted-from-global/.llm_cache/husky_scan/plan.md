---
description: "Quick project breakdown and task planning utility"
agent: planning_utility
subagent: none
argument-hint: "feature project --breakdown --estimate --dependencies"
---

## Core Identity
You are a Quick Planning Utility that rapidly breaks down features or projects into actionable tasks with estimates and dependencies. This is a lightweight planning tool, not the full Planner agent.

Command Workflow
text
QUICK PLANNING UTILITY
════════════════════════════════════════════════════════════════

Command: /plan "Add JWT authentication to API"

Execution:
#!/bin/bash

FEATURE="$1"
PLAN_DIR=~/.plans/$(date +%Y%m%d_%H%M%S)
echo "📋 Quick Plan Generator"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Feature: $FEATURE"
Generate plan using AI
cat > "$PLAN_DIR/plan_prompt.txt" << EOF
Break

Feature: $FEATURE

Provide:

User Stories (3-5)

Technical Tasks (broken down, specific)

Effort Estimates (hours)

Dependencies (what must be done first)

Acceptance Criteria

Risks/Blockers

Format as structured markdown.
echo "🤖 Analyzing feature..."
Use AI to generate plan
(Replace with actual AI call - using ollama as example)
ollama run qwen3-coder < "$PLAN_DIR/plan_prompt.txt" > "$PLAN_DIR/plan.md"

Parse and display
cat "$PLAN_DIR/plan.md"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
text

**Output Example:**
📋 Quick Plan Generator
━━━━━━━━━━━━━━━━━━━━

Feature: Add JWT authentication to API

🤖 Analyzing feature...

User Stories
US-1: As a user, I want to log in with credentials to receive a JWT token
US-2: As a user, I want to use my JWT token to access protected endpoints
US-3: As a user, I want my token to expire for security
US-4: As a developer, I want token refresh capability
US-5: As an admin, I want to revoke user tokens

Technical Tasks
Phase 1: Setup (4 hours)
 T-1: Install JWT library (pyjwt/jsonwebtoken) - 0.5h

 T-2: Create auth configuration module - 1h

 T-3: Setup environment variables for secrets - 0.5h

 T-4: Create user model with password hashing - 2h

Phase 2: Core Authentication (6 hours)
 T-5: Implement login endpoint - 2h

Dependencies: T-4

 T-6: Implement JWT token generation - 1.5h

Dependencies: T-2, T-3

 T-7: Implement JWT middleware/decorator - 2h

Dependencies: T-6

 T-8: Add token validation logic - 0.5h

Dependencies: T-7

Phase 3: Advanced Features (4 hours)
 T-9: Implement refresh token endpoint - 2h

Dependencies: T-6

 T-10: Add token expiry handling - 1h

Dependencies: T-8

 T-11: Implement token revocation - 1h

Dependencies: T-8

Phase 4: Testing & Security (5 hours)
 T-12: Write unit tests for auth module - 2h

Dependencies: T-5, T-6, T-7

 T-13: Write integration tests - 1.5h

Dependencies: T-8, T-9

 T-14: Security review & penetration testing - 1.5h

Dependencies: All above

Effort Estimate
Total: 19 hours (~2.5 days)

Phase 1: 4h

Phase 2: 6h

Phase 3: 4h

Phase 4: 5h

Dependencies Graph
text
T-1, T-2, T-3 → T-4 → T-5 → T-6 → T-7 → T-8
                              ↓     ↓     ↓
                             T-9  T-10  T-11
                                    ↓
                              T-12, T-13 → T-14
Acceptance Criteria
✓ Users can log in with username/password and receive JWT
✓ JWT tokens expire after configured time (e.g., 15 min)
✓ Refresh tokens work for extended sessions
✓ Protected endpoints reject invalid/expired tokens
✓ Token revocation prevents compromised tokens
✓ 90%+ test coverage on auth module
Risks & Blockers
⚠️ Risk 1: Secret key management

Mitigation: Use environment variables + secrets manager

⚠️ Risk 2: Token storage (where to store on client)

Mitigation: Document best practices (httpOnly cookies vs localStorage)

⚠️ Risk 3: Refresh token security

Mitigation: Implement rotation + store hashed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Plan