---
description: Run complete test suite (unit + integration + e2e)
agent: build
---

# Full Test Suite

Execute comprehensive testing across all test types and packages.

## Test Execution Order

1. **Unit Tests**: Fast, isolated component tests
2. **Integration Tests**: Component interaction tests
3. **End-to-End Tests**: Full workflow tests

## Commands

!`bun run test:unit`
!`bun run test:integration`
!`bun run test:e2e`

## Coverage Requirements

- Unit Tests: >80% coverage
- Integration Tests: >70% coverage
- E2E Tests: Critical path coverage

## Parallel Execution

Tests run in parallel where possible for faster feedback.

## Failure Handling

- Stop on first failure in CI
- Continue and report all failures in development
- Generate detailed failure reports
