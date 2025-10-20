# OpenCode Testing Infrastructure

This directory contains the comprehensive testing infrastructure for OpenCode, implementing multi-layer testing with quality gates and coverage reporting.

## 🏗️ Architecture

The testing infrastructure follows a layered approach:

```
test/
├── unit/           # Unit tests (isolated components)
├── integration/    # Integration tests (component interactions)
├── e2e/           # End-to-end tests (full workflows)
├── utils/         # Test utilities and helpers
├── fixtures/      # Test data and fixtures
├── preload.ts     # Global test setup
├── test.config.ts # Test configuration
└── README.md      # This file
```

## 🧪 Test Categories

### Unit Tests (`test/unit/`)

- Test individual components in isolation
- Mock external dependencies
- Focus on business logic and edge cases
- Fast execution, high coverage targets

### Integration Tests (`test/integration/`)

- Test component interactions
- Use real dependencies where possible
- Validate data flow between components
- Medium execution time

### E2E Tests (`test/e2e/`)

- Test complete user workflows
- Use real file system and processes
- Validate CLI commands and outputs
- Slower execution, run in CI only by default

## 🛠️ Test Utilities

### Test Helpers (`utils/test-helpers.ts`)

```typescript
import { withTestContext, createMockToolContext, expectThrows } from "../utils/test-helpers"

withTestContext("should handle file operations", async (ctx) => {
  // ctx.tmpDir is automatically cleaned up
  const file = await createTestFile(ctx.tmpDir, "test.txt", "content")
  // ... test logic
})
```

### Test Configuration (`test.config.ts`)

```typescript
import { getTestConfig } from "./test.config"

const config = getTestConfig()
// Access coverage thresholds, timeouts, etc.
```

## 🚀 Running Tests

### All Tests

```bash
bun test
```

### Specific Categories

```bash
bun run test:unit        # Unit tests only
bun run test:integration # Integration tests only
bun run test:e2e         # E2E tests only
```

### With Coverage

```bash
bun run test:coverage
```

### Watch Mode

```bash
bun run test:watch
```

### CI Mode

```bash
bun run test:ci  # Verbose output with coverage
```

## 📊 Coverage Reporting

Coverage reports are generated in `packages/opencode/coverage/`:

- **HTML Report**: `coverage/index.html`
- **LCOV Report**: `coverage/lcov.info`
- **Text Summary**: Console output

### Coverage Thresholds

- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 70%
- **Statements**: 80%

## 🔧 Configuration

### Environment Variables

- `TEST_TIMEOUT`: Global test timeout (default: 30000ms)
- `SKIP_E2E`: Skip E2E tests (default: false in CI)
- `COVERAGE_ENABLED`: Enable/disable coverage (default: true)

### Bunfig Configuration

Coverage settings are configured in `packages/opencode/bunfig.toml`:

```toml
[test]
coverage = true
coverageReporters = ["text", "lcov", "html"]
coverageDirectory = "coverage"
coverageThreshold = { global = { branches = 70, functions = 80, lines = 80, statements = 80 } }
```

## 🏃 CI/CD Integration

### Quality Gates

The CI pipeline enforces:

- ✅ All tests pass
- ✅ Coverage thresholds met
- ✅ Type checking passes
- ✅ Linting passes
- ✅ No security vulnerabilities

### Workflows

- `.github/workflows/test.yml`: Basic test execution
- `.github/workflows/testing-infrastructure.yml`: Comprehensive testing with quality gates

## 📝 Writing Tests

### Unit Test Template

```typescript
import { describe, expect, test } from "bun:test"
import { withTestContext } from "../utils/test-helpers"

describe("MyComponent", () => {
  test("should handle basic functionality", () => {
    // Arrange
    const input = "test"

    // Act
    const result = myFunction(input)

    // Assert
    expect(result).toBe("expected")
  })

  withTestContext("should handle file operations", async (ctx) => {
    // Test with automatic cleanup
  })
})
```

### Integration Test Template

```typescript
import { describe, expect, test } from "bun:test"
import { withTestContext, createMockFileSystem } from "../utils/test-helpers"

describe("Component Integration", () => {
  withTestContext("should handle complete workflow", async (ctx) => {
    await createMockFileSystem(ctx.tmpDir, {
      "file1.txt": "content1",
      "file2.txt": "content2",
    })

    // Test component interactions
  })
})
```

### E2E Test Template

```typescript
import { describe, expect, test } from "bun:test"
import { executeCommand } from "../utils/test-helpers"

describe("CLI E2E", () => {
  test("should execute command successfully", async () => {
    const result = await executeCommand("echo", ["hello"])

    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain("hello")
  })
})
```

## 🔍 Debugging Tests

### Verbose Output

```bash
bun test --verbose
```

### Debug Specific Test

```bash
bun test packages/opencode/test/unit/specific.test.ts
```

### Inspect Test Context

```typescript
withTestContext("debug test", async (ctx) => {
  console.log("Test directory:", ctx.tmpDir)
  // Add debugger or logging
})
```

## 📈 Best Practices

1. **Test Isolation**: Each test should be independent
2. **Descriptive Names**: Use clear, descriptive test names
3. **Arrange-Act-Assert**: Follow AAA pattern
4. **Mock External Dependencies**: Use mocks for external APIs
5. **Cleanup**: Use `withTestContext` for automatic cleanup
6. **Performance**: Keep unit tests fast (< 100ms)
7. **Coverage**: Aim for high coverage on critical paths

## 🤝 Contributing

When adding new tests:

1. Place in appropriate category directory
2. Use test utilities for common operations
3. Follow naming conventions
4. Add JSDoc comments for complex tests
5. Ensure tests run in CI environment

## 📚 Resources

- [Bun Test Documentation](https://bun.sh/docs/test)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Code Coverage Guide](https://istanbul.js.org/)
