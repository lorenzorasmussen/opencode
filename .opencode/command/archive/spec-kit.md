
---
description: Advanced documentation orchestration with GitHub Spec-Kit integration, automated spec generation, living documentation, and intelligent update detection
agent: documenter
subagent: researcher
argument-hint: "component --type=api|architecture|user-guide|adr|spec --spec-kit --update --publish"
---
```

## Additional Phase: Spec-Kit Integration & Living Documentation

### Phase 2.5: GitHub Spec-Kit Integration & Setup

**Objective:** Integrate GitHub Spec-Kit for spec-driven documentation that stays synchronized with code changes[1][2][3][4][5]

**2.5.1 Spec-Kit Detection & Initialization**[3][6][1]

```
SPEC-KIT INTEGRATION STATUS
════════════════════════════════════════════════════════════════

Checking Project for Spec-Kit...

[→] Scanning repository structure...
    Checking for: .specify/, .github/specify.prompt.md, specs/

────────────────────────────────────────────────────────────────

SCENARIO 1: Spec-Kit Not Found - Initialize New
────────────────────────────────────────────────────────────────

Status: Spec-Kit not detected in repository
Recommendation: Initialize Spec-Kit for spec-driven development

Initialization Plan:
1. Install Spec-Kit CLI
2. Run: uvx --from git+https://github.com/github/spec-kit.git specify init
3. Detect AI agent (Copilot/Claude/Gemini)
4. Generate project templates
5. Create constitution.md with project principles

Execute initialization? [yes/no]: yes

────────────────────────────────────────────────────────────────

[✓] Installing Spec-Kit CLI
    Source: https://github.com/github/spec-kit.git
    Method: uvx (Python Universal Executor)
    
[✓] Detecting AI Agent
    Found: GitHub Copilot (via GitHub CLI)
    Alternative: Claude Code detected
    Selected: GitHub Copilot (default)

[✓] Running: specify init e-commerce-platform
    Creating directories:
      .specify/
      .specify/templates/
      .github/
      specs/

[✓] Project Structure Created:
    .
    ├── .specify/
    │   ├── constitution.md (project principles)
    │   ├── templates/
    │   │   ├── spec-template.md
    │   │   ├── plan-template.md
    │   │   └── tasks-template.md
    │   └── scripts/
    │       ├── check-prerequisites.sh
    │       ├── setup-plan.sh
    │       └── update-claude-md.sh
    ├── .github/
    │   ├── specify.prompt.md (AI prompts for /specify)
    │   ├── plan.prompt.md (AI prompts for /plan)
    │   └── tasks.prompt.md (AI prompts for /tasks)
    └── specs/ (empty, ready for features)

────────────────────────────────────────────────────────────────

SCENARIO 2: Spec-Kit Found - Intelligent Update Mode
────────────────────────────────────────────────────────────────

Status: ✓ Spec-Kit detected
Existing Structure:
  ✓ .specify/ directory found
  ✓ 3 feature specs detected (specs/001-*, 002-*, 003-*)
  ✓ Constitution.md present
  ✓ Templates configured

Analyzing Changes Since Last Documentation Update...

[→] Git diff analysis (last doc update: 2025-10-10 14:32)
    
    Modified Files (code):
      src/api/orders.py        (+142 -34 lines)
      src/models/order.py      (+89 -12 lines)
      tests/test_orders.py     (+67 -23 lines)
    
    Modified Files (specs):
      specs/002-order-management/spec.md     (outdated)
      specs/002-order-management/plan.md     (outdated)
      specs/002-order-management/tasks/      (2 completed)

[→] Change Impact Analysis:
    
    Critical Changes Detected:
      ⚠ OrderStatus enum added 3 new states (code)
        → spec.md does not mention these states
        → Status: SPEC OUTDATED
    
      ⚠ New endpoint: POST /api/orders/{id}/cancel (code)
        → Not documented in api-spec.json
        → Status: API SPEC OUTDATED
    
      ✓ Task 002-03 "Implement order validation" marked complete
        → Code changes match task requirements
        → Status: IN SYNC

Update Strategy:
  → Regenerate spec.md for feature 002 (order-management)
  → Update api-spec.json with new endpoints
  → Mark completed tasks
  → Generate summary of changes for team review

Proceed with intelligent update? [yes/auto/manual]: auto

════════════════════════════════════════════════════════════════
```

**2.5.2 Spec-Kit Workflow Integration**[2][4][5][1][3]

```
SPEC-KIT DOCUMENTATION WORKFLOW
════════════════════════════════════════════════════════════════

GitHub Spec-Kit follows 4-phase spec-driven development:
  1. SPECIFY - Define what & why (goals, users, requirements)
  2. PLAN - Define how (architecture, tech stack, dependencies)
  3. TASKS - Break into actionable work items
  4. IMPLEMENT - Build to spec with continuous sync

────────────────────────────────────────────────────────────────

INTEGRATION POINTS WITH /document COMMAND:
────────────────────────────────────────────────────────────────

Auto-Trigger Documentation Updates:
  ✓ Git pre-commit hook: Check if spec.md needs update
  ✓ CI/CD pipeline: Validate docs sync with code
  ✓ GitHub Actions: Auto-PR when spec drift detected
  ✓ Scheduled: Daily check for documentation staleness

Slash Command Enhancements:
  /document --spec-kit          → Initialize/update all specs
  /document spec 002            → Update specific feature spec
  /document plan 002            → Regenerate technical plan
  /document tasks 002           → Update task breakdown
  /document --sync              → Sync all specs with code

────────────────────────────────────────────────────────────────

EXAMPLE: Creating New Feature Documentation
────────────────────────────────────────────────────────────────

Command:
  /document --spec-kit --type=spec --new="Webhook Notifications"

Execution Flow:

[1] CREATE FEATURE SPEC (using Spec-Kit)
    
    Creating: specs/004-webhook-notifications/
    
    Prompt to AI (via /specify slash command):
      "We need to add webhook notifications for order events.
       External partners should be able to subscribe to order
       created, updated, shipped, and delivered events. Each
       webhook should include the full order payload and be
       retried up to 3 times with exponential backoff."
    
    Generated: specs/004-webhook-notifications/spec.md
    
    ```
    # Feature Spec: Webhook Notifications
    
    ## Overview
    Enable external partners to receive real-time order event
    notifications via HTTP webhooks.
    
    ## Goals
    - Allow partners to subscribe to order lifecycle events
    - Ensure reliable delivery with retry mechanism
    - Provide security via signature verification
    
    ## User Stories
    
    ### US-1: Partner Subscription
    As a partner developer
    I want to register a webhook URL
    So that I can receive order notifications in real-time
    
    Acceptance Criteria:
    - Partner can register webhook URL via API
    - Webhook must pass validation (HTTPS, reachable)
    - Partner receives confirmation event
    
    ### US-2: Event Delivery
    As a partner system
    I want to receive order events as they happen
    So that I can update my internal systems
    
    Acceptance Criteria:
    - Events delivered within 5 seconds of occurrence
    - Payload includes full order details
    - Events ordered chronologically
    
    ### US-3: Delivery Reliability
    As a partner developer
    I want failed deliveries to be retried
    So that I don't miss critical events
    
    Acceptance Criteria:
    - Failed deliveries retried up to 3 times
    - Exponential backoff: 5s, 25s, 125s
    - Partner notified after all retries fail
    
    ## Non-Functional Requirements
    - Latency: p95 < 5 seconds from event to delivery
    - Reliability: 99.9% delivery success rate
    - Security: HMAC signature on all payloads
    - Scalability: Support 10K webhooks, 1M events/day
    
    ## Success Metrics
    - 80% partner adoption within 3 months
    - < 0.1% failed deliveries after retries
    - < 5 support tickets/month related to webhooks
    ```

────────────────────────────────────────────────────────────────

[2] GENERATE TECHNICAL PLAN (using /plan)
    
    Prompt to AI:
      "We are building this using:
       - Python (FastAPI) for webhook delivery service
       - PostgreSQL for webhook subscriptions
       - Redis for job queue (Celery for async tasks)
       - HMAC-SHA256 for signature verification
       
       The system should be horizontally scalable and fault-tolerant."
    
    Generated: specs/004-webhook-notifications/plan.md
    
    ```
    # Technical Plan: Webhook Notifications
    
    ## Architecture
    
    ### Components
    1. **Webhook Registry Service** (FastAPI)
       - CRUD operations for webhook subscriptions
       - Validation of webhook URLs
       - Signature key management
    
    2. **Event Publisher** (Python)
       - Listens to order service events
       - Publishes to Redis queue
       - Handles event serialization
    
    3. **Webhook Delivery Worker** (Celery)
       - Consumes from Redis queue
       - Delivers HTTP POST to subscriber URLs
       - Implements retry logic with exponential backoff
       - Tracks delivery status
    
    ### Data Model
    
    webhooks table:
      - id: UUID (primary key)
      - partner_id: UUID (foreign key)
      - url: TEXT (HTTPS only)
      - secret: TEXT (for HMAC)
      - events: TEXT[] (subscribed event types)
      - active: BOOLEAN
      - created_at: TIMESTAMP
    
    webhook_deliveries table:
      - id: UUID (primary key)
      - webhook_id: UUID (foreign key)
      - event_type: TEXT
      - payload: JSONB
      - status: ENUM (pending, success, failed)
      - attempts: INT
      - next_retry: TIMESTAMP
      - delivered_at: TIMESTAMP
    
    ### API Endpoints
    
    POST /webhooks
      Create new webhook subscription
      Request: { url, events: [], secret }
      Response: { id, url, events, active }
    
    GET /webhooks
      List all webhooks for partner
    
    DELETE /webhooks/{id}
      Remove webhook subscription
    
    POST /webhooks/{id}/test
      Send test event to validate webhook
    
    ### External Dependencies
    - Redis (>= 7.0): Message queue
    - PostgreSQL (>= 14): Data persistence
    - Celery (>= 5.3): Async task processing
    
    ### Security Considerations
    - HMAC-SHA256 signature in X-Webhook-Signature header
    - TLS 1.3 required for webhook URLs
    - Rate limiting: 100 req/min per partner
    - Secret rotation mechanism
    
    ## Implementation Phases
    
    Phase 1 (Sprint 13): Foundation
      - Database schema & migrations
      - Webhook CRUD API
      - URL validation
    
    Phase 2 (Sprint 14): Delivery
      - Event publisher integration
      - Celery worker setup
      - Basic delivery (no retries yet)
    
    Phase 3 (Sprint 15): Reliability
      - Retry logic with exponential backoff
      - Delivery status tracking
      - Monitoring & alerting
    
    Phase 4 (Sprint 16): Production
      - Load testing (10K webhooks)
      - Security audit
      - Documentation & partner onboarding
    ```

────────────────────────────────────────────────────────────────

[3] GENERATE TASK BREAKDOWN (using /tasks)
    
    Generated: specs/004-webhook-notifications/tasks/
    
    Tasks created:
      004-01-database-schema.md
      004-02-webhook-crud-api.md
      004-03-url-validation.md
      004-04-event-publisher.md
      004-05-celery-worker.md
      004-06-retry-logic.md
      004-07-monitoring.md
      004-08-security-audit.md
    
    Example Task: 004-02-webhook-crud-api.md
    ```
    # Task: Webhook CRUD API
    
    **ID**: 004-02
    **Feature**: Webhook Notifications
    **Status**: TODO
    **Assignee**: TBD
    **Sprint**: 13
    
    ## Description
    Implement REST API endpoints for managing webhook subscriptions
    (create, read, update, delete).
    
    ## Prerequisites
    - Task 004-01 (Database Schema) completed
    - FastAPI project structure in place
    
    ## Acceptance Criteria
    - [ ] POST /webhooks creates new subscription
    - [ ] GET /webhooks lists all subscriptions for partner
    - [ ] GET /webhooks/{id} returns single subscription
    - [ ] DELETE /webhooks/{id} removes subscription
    - [ ] All endpoints require authentication
    - [ ] Input validation using Pydantic models
    - [ ] OpenAPI spec auto-generated
    - [ ] Unit tests with 90%+ coverage
    
    ## Implementation Notes
    - Use FastAPI dependency injection for auth
    - Validate webhook URL is HTTPS and reachable
    - Generate HMAC secret automatically (secrets.token_hex)
    - Return 400 for invalid URLs, 404 for not found
    
    ## Testing
    - Unit: Test CRUD operations with mocked DB
    - Integration: Test with real Postgres (testcontainers)
    - E2E: Test API via HTTP client
    
    ## Definition of Done
    - [ ] Code reviewed and approved
    - [ ] Tests passing in CI
    - [ ] API documented in OpenAPI spec
    - [ ] Merged to main
    ```

════════════════════════════════════════════════════════════════
```

**2.5.3 Intelligent Update & Sync Mechanism**[4][1][3]

```
INTELLIGENT DOCUMENTATION SYNC ENGINE
════════════════════════════════════════════════════════════════

Monitoring: Continuous (Git hooks + scheduled checks)
Strategy: Detect drift, auto-update specs, notify team

────────────────────────────────────────────────────────────────

DRIFT DETECTION ALGORITHM:
────────────────────────────────────────────────────────────────

[1] Code Change Analysis (Git Diff)
    
    Analyze commits since last doc update:
      git log --since="2025-10-10" --name-only --pretty="" \
        | grep -E "^src/|^tests/" | sort -u
    
    Extract changed files:
      src/api/webhooks.py         (NEW FILE)
      src/models/webhook.py        (NEW FILE)
      tests/test_webhooks.py       (NEW FILE)
      src/api/orders.py            (MODIFIED)

[2] Semantic Change Detection (AST Analysis)
    
    Parse Python AST for structural changes:
      ✓ New class: WebhookSubscription (src/models/webhook.py)
      ✓ New endpoint: POST /webhooks (src/api/webhooks.py)
      ✓ Modified: OrderStatus enum (+3 states)
    
    Map to Spec-Kit features:
      WebhookSubscription → specs/004-webhook-notifications/
      POST /webhooks → specs/004-webhook-notifications/
      OrderStatus → specs/002-order-management/

[3] Spec-to-Code Consistency Check
    
    For each spec, verify code alignment:
    
    Feature: 004-webhook-notifications
      Spec States: "POST /webhooks creates subscription"
      Code Reality: ✓ Found POST /webhooks in webhooks.py
      Status: ✓ IN SYNC
    
    Feature: 002-order-management
      Spec States: OrderStatus has 5 states
      Code Reality: ⚠ OrderStatus has 8 states (3 new)
      Status: ⚠ SPEC OUTDATED
      
      New States Detected:
        - PAYMENT_PENDING (added 2025-10-12)
        - FRAUD_REVIEW (added 2025-10-13)
        - CANCELLED_BY_SYSTEM (added 2025-10-14)

[4] Automated Update Decision
    
    Rule-Based Classification:
    
    CRITICAL UPDATE (auto-update + PR):
      → Public API changes (new endpoints, modified contracts)
      → Breaking changes (removed fields, changed types)
      → Security-related changes
      → Action: Auto-regenerate spec, create PR for review
    
    STANDARD UPDATE (notify + suggest):
      → Internal refactoring (no public API impact)
      → New private methods
      → Test additions
      → Action: Suggest update, don't auto-execute
    
    MINOR UPDATE (background update):
      → Comment changes
      → Formatting
      → Variable renames
      → Action: Update silently, include in next review

────────────────────────────────────────────────────────────────

EXECUTION: Auto-Update Workflow
────────────────────────────────────────────────────────────────

Trigger: Critical change detected (OrderStatus enum)

[1] Create Feature Branch
    git checkout -b docs/update-order-status-spec

[2] Regenerate Spec with AI
    
    Prompt to AI (via /specify command):
      "Update the spec for feature 002 (order-management).
       The OrderStatus enum now includes 3 additional states:
       - PAYMENT_PENDING: Order created but payment not confirmed
       - FRAUD_REVIEW: Order flagged for fraud review
       - CANCELLED_BY_SYSTEM: Order auto-cancelled by system
       
       Update the spec to document these states, their transitions,
       and any user-facing implications."
    
    Generated Updates:
      specs/002-order-management/spec.md (updated)
      specs/002-order-management/plan.md (reviewed, no changes)
      specs/002-order-management/data-model.md (updated enum)

[3] Validate Changes
    
    [✓] Spec markdown linting passed
    [✓] All internal links valid
    [✓] Code examples tested
    [✓] OpenAPI spec regenerated (api-spec.json)

[4] Create Pull Request
    
    PR Title: "docs: Update order management spec for new order states"
    
    PR Description:
      ## Changes
      - Added 3 new OrderStatus enum values to spec
      - Updated state transition diagram
      - Documented business rules for new states
      
      ## Context
      This PR auto-updates documentation to match code changes
      introduced in commits:
        - abc123: Add PAYMENT_PENDING state
        - def456: Implement fraud review workflow
        - ghi789: Add system cancellation logic
      
      ## Review Checklist
      - [ ] Spec accurately reflects code behavior
      - [ ] State transitions make business sense
      - [ ] No breaking API changes introduced
      
      Auto-generated by /document --sync
    
    Reviewers: @product-team, @backend-lead
    Labels: documentation, auto-generated, needs-review

[5] Team Notification
    
    Slack Message (#documentation):
      📄 Documentation update available!
      
      Feature: Order Management (002)
      Changes: 3 new order states added
      PR: https://github.com/company/repo/pull/1847
      
      Review needed from @product-team
      Auto-merge in 24h if approved

────────────────────────────────────────────────────────────────

RESULT:
────────────────────────────────────────────────────────────────

✓ Spec updated automatically
✓ Pull request created
✓ Team notified
✓ Waiting for review (auto-merge: 2025-10-16 16:47 CEST)

Documentation-code sync status: 94% (up from 87%)

════════════════════════════════════════════════════════════════
```

**2.5.4 Living Documentation Dashboard**[5][1][3]

```
SPEC-KIT DOCUMENTATION HEALTH DASHBOARD
════════════════════════════════════════════════════════════════

Project: E-Commerce Platform v2.0
Last Updated: 2025-10-15 16:47 CEST
Spec-Kit Version: 1.2.0

────────────────────────────────────────────────────────────────

FEATURE SPECIFICATIONS (6 total)
────────────────────────────────────────────────────────────────

Feature ID  Name                    Status      Sync    Last Updated
────────────────────────────────────────────────────────────────
001         User Authentication      ✓ Complete  100%   2025-09-28
002         Order Management         ⚠ Outdated   87%   2025-10-10
003         Product Catalog          ✓ Complete  100%   2025-10-01
004         Webhook Notifications    → Active     94%   2025-10-15
005         Analytics Dashboard      📋 Planning   N/A   2025-10-14
006         Payment Processing       ⏸ On Hold    N/A   2025-09-15

────────────────────────────────────────────────────────────────

SYNC STATUS BREAKDOWN:
────────────────────────────────────────────────────────────────

✓ In Sync (100%):        2 features (001, 003)
⚠ Needs Update (< 95%):  1 feature (002)
→ Actively Updating:     1 feature (004)
📋 Planning Phase:       1 feature (005)
⏸ On Hold:              1 feature (006)

────────────────────────────────────────────────────────────────

OUTSTANDING UPDATES:
────────────────────────────────────────────────────────────────

Feature 002: Order Management
  Issue: Spec shows 5 order states, code has 8 states
  Drift: 3 enum values undocumented
  Auto-Update: PR #1847 pending review
  ETA: Review by 2025-10-16 12:00, auto-merge if approved

Feature 004: Webhook Notifications
  Issue: Task 004-06 (retry logic) implemented but not marked done
  Action: Update task status to DONE
  Auto-Update: In progress (marking complete)

────────────────────────────────────────────────────────────────

DOCUMENTATION COVERAGE:
────────────────────────────────────────────────────────────────

Component Coverage:
  API Endpoints:        42/45 documented (93%)
  Database Tables:      18/18 documented (100%)
  Events/Webhooks:      12/15 documented (80%)
  Background Jobs:      8/12 documented (67%) ⚠

Missing Documentation:
  ⚠ POST /api/analytics/export (added 2025-10-13)
  ⚠ BackgroundJob: order_cleanup (added 2025-10-11)
  ⚠ Event: payment.refunded (added 2025-10-12)

Recommendation: Schedule doc sprint to cover missing items

────────────────────────────────────────────────────────────────

SPEC-KIT HEALTH METRICS:
────────────────────────────────────────────────────────────────

Overall Health Score:    89/100 (↑ from 82 last week)

Breakdown:
  Completeness:         92/100 (all features have specs)
  Freshness:            87/100 (87% specs updated < 30 days)
  Code Alignment:       89/100 (89% avg sync across features)
  Task Completion:      76/100 (76% tasks marked done vs code)

Trends:
  ↑ Completeness:       +10 points (new specs added)
  ↑ Code Alignment:     +7 points (auto-sync working)
  ↓ Task Completion:    -3 points (features shipped, tasks not updated)

────────────────────────────────────────────────────────────────

NEXT ACTIONS:
────────────────────────────────────────────────────────────────

Priority 1 (This Week):
  1. Review & merge PR #1847 (order management spec update)
  2. Mark completed tasks for feature 004 (webhooks)
  3. Document 3 missing API endpoints

Priority 2 (Next Week):
  4. Complete spec for feature 005 (analytics dashboard)
  5. Audit background job documentation coverage
  6. Schedule team training: Spec-Kit best practices

════════════════════════════════════════════════════════════════
```

## Updated Usage Examples

```bash
# Initialize Spec-Kit in new project
/document --spec-kit --init

# Create new feature spec (Spec-Kit workflow)
/document --spec-kit --new="Real-time Notifications"

# Update specific feature spec based on code changes
/document spec 002 --update

# Sync all specs with current codebase (detect drift)
/document --sync --auto

# Generate technical plan for existing spec
/document plan 004

# Break spec into tasks
/document tasks 004

# Check documentation health
/document --audit --spec-kit

# Manual spec update (no AI, direct edit)
/document spec 003 --edit

# Export all specs to PDF for stakeholder review
/document --export=pdf --spec-kit
```

## Benefits of Spec-Kit Integration

**1. Living Documentation:** Specs evolve with code, never go stale[1][2][3]

**2. Intelligent Drift Detection:** AI detects when code diverges from spec[3][4]

**3. Automated Updates:** Critical changes trigger automatic spec regeneration[1][3]

**4. Structured Workflow:** 4-phase process (Specify → Plan → Tasks → Implement)[2][4][5][1]

**5. Multi-Agent Support:** Works with GitHub Copilot, Claude Code, Gemini CLI[6][3][1]

**6. Version Control:** All specs in Git, full audit trail[4][3][1]

**7. Team Collaboration:** PR-based review process for spec updates[3][4]

**8. Traceability:** Map requirements → specs → tasks → code → tests[5][2][1]

This enhanced integration ensures documentation is not an afterthought but a living artifact that drives development and stays synchronized with reality.[6][2][4][5][1][3]
