---
description: Lint, format, type-check pipeline
agent: review
---

# Code Quality Check

Execute comprehensive code quality validation pipeline.

## Quality Checks

1. **Linting**: Code style and potential bug detection
2. **Formatting**: Consistent code formatting
3. **Type Checking**: TypeScript compilation validation
4. **Import Sorting**: Organized import statements

## Commands

!`bun run lint`
!`bun run format:check`
!`bun run typecheck`
!`bun run import-sort:check`

## Linting Rules

- ESLint configuration for code quality
- Prettier for consistent formatting
- TypeScript ESLint for type-aware linting
- Custom rules for project conventions

## Type Checking

- Full TypeScript compilation
- Strict type checking enabled
- No implicit any types
- Proper generic constraints

## Auto-fix Available

For fixable issues, run:
!`bun run lint:fix`
!`bun run format`
!`bun run import-sort`

## Quality Gates

- Zero linting errors
- All code properly formatted
- TypeScript compilation succeeds
- Imports properly organized

## CI Integration

Fails CI pipeline if quality checks don't pass.
