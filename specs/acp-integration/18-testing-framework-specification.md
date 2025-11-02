# Testing Framework Specification

## Overview

This document specifies the comprehensive testing framework for the OpenCode-Zed ACP integration, including test architecture, automation, and quality assurance processes.

## Test Framework Architecture

### Test Pyramid Structure

```
┌─────────────────────────────────┐
│    End-to-End Tests (E2E)       │ ◄─ User Journey Validation
│    Integration Tests            │ ◄─ Component Interaction
├─────────────────────────────────┤
│    Component Tests              │ ◄─ Unit + Integration
│    Contract Tests               │ ◄─ API Compliance
├─────────────────────────────────┤
│    Unit Tests                   │ ◄─ Function/Method Testing
│    Static Analysis              │ ◄─ Code Quality
└─────────────────────────────────┘
```

### Test Categories

#### 1. Unit Tests

**Purpose**: Validate individual functions and methods
**Scope**: Single functions, classes, modules
**Tools**: Jest (JavaScript), Rust built-in testing
**Coverage Target**: > 90%

#### 2. Component Tests

**Purpose**: Validate component behavior in isolation
**Scope**: Single components with mocked dependencies
**Tools**: Jest with mocking, Rust component testing
**Coverage Target**: > 85%

#### 3. Integration Tests

**Purpose**: Validate component interactions
**Scope**: Multiple components working together
**Tools**: Test containers, in-memory databases
**Coverage Target**: > 80%

#### 4. Contract Tests

**Purpose**: Validate API contracts between services
**Scope**: API interfaces and data formats
**Tools**: Pact, Spring Cloud Contract
**Coverage Target**: 100% of APIs

#### 5. End-to-End Tests

**Purpose**: Validate complete user workflows
**Scope**: Full system from user perspective
**Tools**: Playwright (UI), Cypress, custom E2E framework
**Coverage Target**: > 70% of user journeys

## Test Automation Infrastructure

### Test Environment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Test Environments                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Local Dev  │  │  CI/CD      │  │  Staging/Prod       │ │
│  │ Environment │  │ Environment │  │ Environment         │ │
│  │             │  │             │  │                     │ │
│  │ • Hot reload│  │ • Isolated  │  │ • Production-like   │ │
│  │ • Fast      │  │ • Parallel  │  │ • Full integration  │ │
│  │ • Debug     │  │ • Automated │  │ • Performance       │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Test Data   │  │ Mock Services│  │ Monitoring         │ │
│  │ Management  │  │             │  │                     │ │
│  │             │  │ • WireMock   │  │ • Test metrics     │ │
│  │ • Fixtures  │  │ • Test       │  │ • Coverage reports │ │
│  │ • Factories │  │ containers   │  │ • Performance      │ │
│  │ • Cleanup   │  │ • Stubs      │  │ • Error tracking    │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Test Data Management

#### Test Data Strategy

**Data Types**:

- **Static Fixtures**: Predefined test data
- **Dynamic Factories**: Generated test data
- **Mock Data**: Simulated external service responses
- **Production Subsets**: Anonymized production data

**Data Management**:

```typescript
// Test data factory
class TestDataFactory {
  static createUser(overrides: Partial<User> = {}): User {
    return {
      id: randomUUID(),
      name: faker.name.fullName(),
      email: faker.internet.email(),
      ...overrides,
    }
  }

  static createSession(userId: string, overrides: Partial<Session> = {}): Session {
    return {
      id: randomUUID(),
      userId,
      createdAt: new Date(),
      status: "active",
      ...overrides,
    }
  }
}

// Test data cleanup
class TestDataCleanup {
  static async cleanup(): Promise<void> {
    await database.reset()
    await cache.clear()
    await filesystem.cleanup("/tmp/test-*")
  }
}
```

### Mock and Stub Infrastructure

#### Service Mocking

**External Service Mocks**:

```typescript
// MCP server mock
class MockMCPServer {
  private responses: Map<string, any> = new Map()

  setResponse(tool: string, response: any): void {
    this.responses.set(tool, response)
  }

  async callTool(tool: string, params: any): Promise<any> {
    const response = this.responses.get(tool)
    if (!response) {
      throw new Error(`No mock response for tool: ${tool}`)
    }
    return response
  }
}

// ACP client mock
class MockACPClient {
  private messages: ACPMessage[] = []

  async sendMessage(message: ACPMessage): Promise<void> {
    this.messages.push(message)
  }

  getSentMessages(): ACPMessage[] {
    return [...this.messages]
  }

  mockResponse(message: ACPMessage): void {
    // Simulate receiving response
    this.onMessage?.(message)
  }
}
```

## Test Implementation Details

### Unit Test Framework

#### JavaScript/TypeScript Testing

```typescript
// Jest configuration
export const jestConfig = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],
  collectCoverageFrom: ["src/**/*.{ts,js}", "!src/**/*.d.ts", "!src/**/index.ts"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
}

// Test setup
export const testSetup = () => {
  // Global test configuration
  beforeAll(async () => {
    await TestDatabase.setup()
    await TestCache.setup()
  })

  afterAll(async () => {
    await TestDatabase.teardown()
    await TestCache.teardown()
  })

  beforeEach(async () => {
    await TestDataCleanup.cleanup()
  })
}
```

#### Rust Testing

```rust
// Test module structure
#[cfg(test)]
mod tests {
    use super::*;
    use tokio::test;

    #[test]
    async fn test_message_parsing() {
        let json = r#"{"jsonrpc":"2.0","id":1,"method":"initialize"}"#;
        let message: ACPMessage = serde_json::from_str(json).unwrap();

        match message {
            ACPMessage::Request { id, method, .. } => {
                assert_eq!(id, MessageId::Number(1));
                assert_eq!(method, "initialize");
            }
            _ => panic!("Expected request"),
        }
    }

    #[tokio::test]
    async fn test_session_creation() {
        let manager = SessionManager::new();
        let session_id = manager.create_session("/tmp").await.unwrap();

        assert!(manager.get_session(&session_id).is_some());
    }
}
```

### Integration Test Framework

#### Test Containers

```typescript
// Docker test container setup
class TestContainerManager {
  private containers: Map<string, GenericContainer> = new Map()

  async startPostgres(): Promise<PostgreSQLContainer> {
    const container = await new PostgreSQLContainer()
      .withDatabase("testdb")
      .withUsername("testuser")
      .withPassword("testpass")
      .start()

    this.containers.set("postgres", container)
    return container
  }

  async startRedis(): Promise<RedisContainer> {
    const container = await new RedisContainer().withExposedPorts(6379).start()

    this.containers.set("redis", container)
    return container
  }

  async cleanup(): Promise<void> {
    for (const container of this.containers.values()) {
      await container.stop()
    }
    this.containers.clear()
  }
}
```

#### API Contract Testing

```typescript
// Pact contract test
describe("ACP Protocol Contract", () => {
  const provider = new PactV3({
    consumer: "Zed ACP Client",
    provider: "OpenCode ACP Server",
  })

  describe("initialize interaction", () => {
    it("returns protocol version", async () => {
      await provider
        .given("server is running")
        .uponReceiving("initialize request")
        .withRequest({
          method: "POST",
          path: "/",
          body: {
            jsonrpc: "2.0",
            id: 1,
            method: "initialize",
            params: {
              protocolVersion: 1,
            },
          },
        })
        .willRespondWith({
          status: 200,
          body: {
            jsonrpc: "2.0",
            id: 1,
            result: {
              protocolVersion: 1,
              agentCapabilities: like({
                loadSession: boolean(true),
              }),
            },
          },
        })
    })
  })
})
```

### End-to-End Test Framework

#### UI Testing with Playwright

```typescript
// E2E test configuration
export const playwrightConfig = {
  testDir: "./e2e",
  use: {
    baseURL: "http://localhost:3000",
    browserName: "chromium",
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
  ],
}

// E2E test example
test("complete user workflow", async ({ page }) => {
  // Setup
  await page.goto("/")

  // Configure agent server
  await page.getByRole("button", { name: "Settings" }).click()
  await page.getByLabel("Agent Server Command").fill("opencode acp")
  await page.getByRole("button", { name: "Save" }).click()

  // Create session
  await page.getByRole("button", { name: "New Session" }).click()

  // Send message
  await page.getByPlaceholder("Type your message...").fill("Hello OpenCode!")
  await page.getByRole("button", { name: "Send" }).click()

  // Verify response
  await expect(page.getByText("Hi there!")).toBeVisible()
})
```

### Performance Test Framework

#### Load Testing with k6

```javascript
// k6 performance test
import http from "k6/http"
import { check, sleep } from "k6"

export const options = {
  stages: [
    { duration: "2m", target: 10 }, // Ramp up to 10 users
    { duration: "5m", target: 10 }, // Stay at 10 users
    { duration: "2m", target: 50 }, // Ramp up to 50 users
    { duration: "5m", target: 50 }, // Stay at 50 users
    { duration: "2m", target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests < 500ms
    http_req_failed: ["rate<0.1"], // Error rate < 10%
  },
}

export default function () {
  const payload = JSON.stringify({
    jsonrpc: "2.0",
    id: Math.floor(Math.random() * 1000),
    method: "session/prompt",
    params: {
      sessionId: "test-session",
      prompt: [{ type: "text", text: "Hello" }],
    },
  })

  const response = http.post("http://localhost:3000/acp", payload, {
    headers: { "Content-Type": "application/json" },
  })

  check(response, {
    "status is 200": (r) => r.status === 200,
    "response time < 500ms": (r) => r.timings.duration < 500,
    "has valid response": (r) => {
      try {
        const jsonResponse = JSON.parse(r.body)
        return jsonResponse.jsonrpc === "2.0" && jsonResponse.result
      } catch {
        return false
      }
    },
  })

  sleep(1)
}
```

## Test Execution and Reporting

### CI/CD Integration

#### GitHub Actions Workflow

```yaml
name: ACP Integration Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20]
        rust-version: [1.70, stable]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"

      - name: Setup Rust
        uses: dtolnay/rust-toolchain@stable
        with:
          toolchain: ${{ matrix.rust-version }}

      - name: Install dependencies
        run: |
          npm ci
          cargo check

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Run performance tests
        run: npm run test:performance

      - name: Generate coverage report
        run: npm run coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3

      - name: Upload test artifacts
        uses: actions/upload-artifact@v3
        with:
          name: test-results-${{ matrix.node-version }}-${{ matrix.rust-version }}
          path: |
            test-results/
            coverage/
            performance-results/
```

### Test Reporting

#### Coverage Reporting

```typescript
// Coverage configuration
export const coverageConfig = {
  include: ["packages/opencode/src/acp/**/*", "packages/zed-acp/**/*"],
  exclude: ["**/test/**", "**/node_modules/**", "**/*.d.ts"],
  thresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    "packages/opencode/src/acp/": {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  reporters: ["text", "lcov", "html", "json"],
}
```

#### Test Result Analysis

```typescript
// Test result processor
class TestResultAnalyzer {
  analyze(results: TestResult[]): TestAnalysis {
    const passed = results.filter((r) => r.status === "passed").length
    const failed = results.filter((r) => r.status === "failed").length
    const skipped = results.filter((r) => r.status === "skipped").length

    const passRate = (passed / (passed + failed)) * 100

    const slowTests = results
      .filter((r) => r.duration > 1000)
      .sort((a, b) => b.duration - a.duration)

    const flakyTests = results.filter((r) => r.flaky).map((r) => r.name)

    return {
      summary: { passed, failed, skipped, passRate },
      performance: { slowTests, averageDuration: this.averageDuration(results) },
      reliability: { flakyTests, failurePatterns: this.analyzeFailurePatterns(results) },
    }
  }
}
```

## Test Quality Assurance

### Test Quality Metrics

#### Test Effectiveness

- **Mutation Testing**: Measure test suite effectiveness
- **Coverage Analysis**: Identify untested code paths
- **Flakiness Detection**: Identify unreliable tests
- **Maintenance Burden**: Track test maintenance effort

#### Test Performance

- **Execution Time**: Monitor test suite runtime
- **Resource Usage**: Track memory and CPU usage
- **Parallelization**: Measure parallel execution efficiency
- **Reliability**: Track test failure rates

### Test Maintenance

#### Test Refactoring

```typescript
// Test utility for common patterns
export class ACPTestHelper {
  static async createTestSession(client: ACPClient): Promise<string> {
    const response = await client.sendRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "session/new",
      params: { cwd: "/tmp" },
    })
    return response.result.sessionId
  }

  static async waitForResponse(client: ACPClient, requestId: number, timeout = 5000): Promise<any> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Timeout")), timeout)

      client.onResponse((response) => {
        if (response.id === requestId) {
          clearTimeout(timer)
          resolve(response)
        }
      })
    })
  }

  static async cleanupTestData(): Promise<void> {
    // Clean up test data
    await TestDatabase.reset()
    await TestFilesystem.cleanup()
  }
}
```

#### Test Data Management

```typescript
// Test data versioning
class TestDataManager {
  private dataVersion = "1.0.0"

  async loadTestData(scenario: string): Promise<TestData> {
    const dataPath = `test/data/${scenario}/${this.dataVersion}.json`
    const data = await fs.readFile(dataPath, "utf8")
    return JSON.parse(data)
  }

  async saveTestData(scenario: string, data: TestData): Promise<void> {
    const dataPath = `test/data/${scenario}/${this.dataVersion}.json`
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2))
  }

  async migrateTestData(fromVersion: string, toVersion: string): Promise<void> {
    // Migrate test data between versions
    const scenarios = await fs.readdir("test/data")
    for (const scenario of scenarios) {
      const oldData = await this.loadVersionedData(scenario, fromVersion)
      const newData = this.migrateData(oldData, fromVersion, toVersion)
      await this.saveVersionedData(scenario, toVersion, newData)
    }
  }
}
```

## Success Criteria

### Test Coverage Targets

- **Unit Tests**: > 90% code coverage
- **Integration Tests**: > 80% component interactions covered
- **E2E Tests**: > 70% user journeys tested
- **Performance Tests**: All critical paths benchmarked

### Test Quality Targets

- **Flaky Tests**: < 1% of test suite
- **Test Execution Time**: < 10 minutes for full suite
- **Test Maintenance**: < 2 hours/week
- **Documentation**: 100% of test scenarios documented

### CI/CD Quality Gates

- [ ] All tests pass on main branch
- [ ] Coverage targets met
- [ ] No flaky tests
- [ ] Performance benchmarks pass
- [ ] Security tests pass

---

**Version**: 1.0.0
**Date**: November 2, 2025
**Authors**: Testing Framework Specification Team
