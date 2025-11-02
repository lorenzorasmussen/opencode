# Validation Test Specification

## Overview

This document specifies the comprehensive testing framework for validating the OpenCode-Zed ACP integration, including test categories, test cases, automation, and quality metrics.

## Test Framework Architecture

### Test Categories

#### 1. Protocol Compliance Tests

**Purpose**: Validate ACP protocol implementation correctness

**Test Types**:

- Message format validation
- Protocol state machine testing
- Error handling verification
- Capability negotiation testing

#### 2. Functional Tests

**Purpose**: Validate end-to-end functionality

**Test Types**:

- Session lifecycle testing
- Tool execution validation
- Streaming response testing
- File operation verification

#### 3. Performance Tests

**Purpose**: Validate performance requirements

**Test Types**:

- Latency measurement
- Throughput testing
- Resource utilization monitoring
- Scalability validation

#### 4. Integration Tests

**Purpose**: Validate component interactions

**Test Types**:

- OpenCode ACP server testing
- Zed client integration testing
- MCP server integration testing
- Configuration validation

#### 5. Reliability Tests

**Purpose**: Validate system stability

**Test Types**:

- Error recovery testing
- Load testing
- Stress testing
- Chaos engineering

### Test Automation Framework

#### Test Structure

```
test/
├── protocol/           # Protocol compliance tests
│   ├── messages.test.ts
│   ├── handshake.test.ts
│   └── state_machine.test.ts
├── functional/         # Functional tests
│   ├── session.test.ts
│   ├── tools.test.ts
│   └── streaming.test.ts
├── performance/        # Performance tests
│   ├── latency.test.ts
│   ├── throughput.test.ts
│   └── resources.test.ts
├── integration/        # Integration tests
│   ├── opencode.test.ts
│   ├── zed.test.ts
│   └── mcp.test.ts
├── reliability/        # Reliability tests
│   ├── recovery.test.ts
│   ├── load.test.ts
│   └── chaos.test.ts
└── utils/              # Test utilities
    ├── mock_server.ts
    ├── test_client.ts
    └── fixtures.ts
```

#### Test Infrastructure

```typescript
// Base test class
export abstract class ACPTest {
  protected server: MockACPServer
  protected client: TestACPClient
  protected fixtures: TestFixtures

  async setup(): Promise<void> {
    this.server = new MockACPServer()
    this.client = new TestACPClient()
    this.fixtures = new TestFixtures()
    await this.server.start()
    await this.client.connect()
  }

  async teardown(): Promise<void> {
    await this.client.disconnect()
    await this.server.stop()
  }
}

// Test utilities
export class TestFixtures {
  sessionId(): string {
    return `session-${randomUUID()}`
  }
  messageId(): number {
    return Math.floor(Math.random() * 1000)
  }
  filePath(): string {
    return `/tmp/test-${randomUUID()}.txt`
  }
  toolCall(): ToolCall {
    /* ... */
  }
}
```

## Protocol Compliance Tests

### Message Format Tests

#### JSON-RPC 2.0 Validation

```typescript
describe("JSON-RPC 2.0 Compliance", () => {
  test("valid request format", () => {
    const request = {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {},
    }

    expect(validateJsonRpcMessage(request)).toBe(true)
  })

  test("invalid jsonrpc version", () => {
    const request = {
      jsonrpc: "1.0",
      id: 1,
      method: "initialize",
    }

    expect(() => validateJsonRpcMessage(request)).toThrow()
  })

  test("missing required fields", () => {
    const request = {
      jsonrpc: "2.0",
      method: "initialize",
    }

    expect(() => validateJsonRpcMessage(request)).toThrow()
  })
})
```

#### ACP Message Schema Validation

```typescript
describe("ACP Message Schema", () => {
  test("initialize request schema", () => {
    const message = {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: 1,
        clientCapabilities: {
          fs: { readTextFile: true },
        },
      },
    }

    expect(validateACPSchema(message, "InitializeRequest")).toBe(true)
  })

  test("invalid session/new params", () => {
    const message = {
      jsonrpc: "2.0",
      id: 2,
      method: "session/new",
      params: {
        // missing cwd
        mcpServers: [],
      },
    }

    expect(() => validateACPSchema(message, "NewSessionRequest")).toThrow()
  })
})
```

### Protocol State Machine Tests

#### Handshake Flow

```typescript
describe("Protocol Handshake", () => {
  test("successful initialization", async () => {
    const client = new TestACPClient()
    await client.connect()

    const response = await client.initialize({
      protocolVersion: 1,
    })

    expect(response.protocolVersion).toBe(1)
    expect(response.agentCapabilities).toBeDefined()
    expect(response.agentInfo.name).toBe("opencode")
  })

  test("protocol version negotiation", async () => {
    const client = new TestACPClient()
    await client.connect()

    // Test with unsupported version
    await expect(
      client.initialize({
        protocolVersion: 999,
      }),
    ).rejects.toThrow("Unsupported protocol version")
  })
})
```

#### Session Lifecycle

```typescript
describe("Session Lifecycle", () => {
  test("create and destroy session", async () => {
    const client = new TestACPClient()
    await client.initialize()

    const sessionId = await client.newSession("/tmp")
    expect(sessionId).toMatch(/^session-/)

    // Session should be active
    const sessions = await client.listSessions()
    expect(sessions).toContain(sessionId)

    // Cleanup handled by teardown
  })

  test("session isolation", async () => {
    const client = new TestACPClient()
    await client.initialize()

    const session1 = await client.newSession("/tmp/project1")
    const session2 = await client.newSession("/tmp/project2")

    // Sessions should be independent
    expect(session1).not.toBe(session2)

    // Messages in one shouldn't affect the other
    await client.prompt(session1, "Hello in session 1")
    const history1 = await client.getMessageHistory(session1)
    const history2 = await client.getMessageHistory(session2)

    expect(history1.length).toBe(2) // user + assistant
    expect(history2.length).toBe(0)
  })
})
```

## Functional Tests

### Tool Execution Tests

#### File Operations

```typescript
describe("File Operations", () => {
  test("read text file", async () => {
    const client = new TestACPClient()
    const sessionId = await client.createSession()

    // Create test file
    const testFile = "/tmp/test.txt"
    const testContent = "Hello World\n"
    await fs.writeFile(testFile, testContent)

    // Read via ACP
    const content = await client.readFile(sessionId, testFile)

    expect(content).toBe(testContent)
  })

  test("write text file", async () => {
    const client = new TestACPClient()
    const sessionId = await client.createSession()

    const testFile = "/tmp/write-test.txt"
    const testContent = "Written via ACP"

    await client.writeFile(sessionId, testFile, testContent)

    const actualContent = await fs.readFile(testFile, "utf8")
    expect(actualContent).toBe(testContent)
  })

  test("file permission handling", async () => {
    const client = new TestACPClient()
    const sessionId = await client.createSession()

    // Try to write to read-only location
    const protectedFile = "/etc/hosts"

    await expect(client.writeFile(sessionId, protectedFile, "test")).rejects.toThrow(
      "Permission denied",
    )
  })
})
```

#### Tool Call Flow

```typescript
describe("Tool Call Flow", () => {
  test("complete tool execution", async () => {
    const client = new TestACPClient()
    const sessionId = await client.createSession()

    // Mock tool that creates a file
    const toolCall = {
      toolCallId: "tool-123",
      title: "Create test file",
      kind: "edit",
      status: "pending",
    }

    // Start tool call
    await client.sendToolCall(sessionId, toolCall)

    // Should receive permission request
    const permissionRequest = await client.waitForPermissionRequest()
    expect(permissionRequest.toolCall.toolCallId).toBe("tool-123")

    // Grant permission
    await client.respondToPermission(permissionRequest.id, "once")

    // Tool should execute
    const toolUpdate = await client.waitForToolUpdate()
    expect(toolUpdate.status).toBe("completed")
  })
})
```

### Streaming Tests

#### Response Streaming

```typescript
describe("Response Streaming", () => {
  test("text streaming", async () => {
    const client = new TestACPClient()
    const sessionId = await client.createSession()

    const chunks: string[] = []
    const streamPromise = client.streamResponse(sessionId, (chunk) => {
      chunks.push(chunk)
    })

    await client.prompt(sessionId, "Tell me a story")

    await streamPromise

    expect(chunks.length).toBeGreaterThan(0)
    expect(chunks.join("")).toContain("story")
  })

  test("streaming interruption", async () => {
    const client = new TestACPClient()
    const sessionId = await client.createSession()

    // Start streaming response
    const streamPromise = client.prompt(sessionId, "Long response...")

    // Cancel after short delay
    setTimeout(() => client.cancel(sessionId), 100)

    const result = await streamPromise
    expect(result.stopReason).toBe("cancelled")
  })
})
```

## Performance Tests

### Latency Tests

```typescript
describe("Latency Tests", () => {
  test("message round-trip", async () => {
    const client = new TestACPClient()
    await client.connect()

    const start = Date.now()
    await client.ping()
    const latency = Date.now() - start

    expect(latency).toBeLessThan(500) // 500ms target
  })

  test("session creation time", async () => {
    const client = new TestACPClient()

    const start = Date.now()
    const sessionId = await client.newSession("/tmp")
    const duration = Date.now() - start

    expect(duration).toBeLessThan(2000) // 2s target
  })
})
```

### Throughput Tests

```typescript
describe("Throughput Tests", () => {
  test("concurrent sessions", async () => {
    const client = new TestACPClient()
    const sessions = []

    // Create multiple sessions
    for (let i = 0; i < 10; i++) {
      sessions.push(await client.newSession(`/tmp/session${i}`))
    }

    // Send prompts to all sessions
    const prompts = sessions.map((sessionId) => client.prompt(sessionId, "Hello"))

    const start = Date.now()
    await Promise.all(prompts)
    const duration = Date.now() - start

    // Should complete within reasonable time
    expect(duration).toBeLessThan(10000) // 10s for 10 sessions
  })

  test("message rate", async () => {
    const client = new TestACPClient()
    const sessionId = await client.createSession()

    const messages = []
    for (let i = 0; i < 100; i++) {
      messages.push(`Message ${i}`)
    }

    const start = Date.now()
    await Promise.all(messages.map((msg) => client.prompt(sessionId, msg)))
    const duration = Date.now() - start

    const rate = messages.length / (duration / 1000)
    expect(rate).toBeGreaterThan(5) // 5 messages/second minimum
  })
})
```

### Resource Utilization Tests

```typescript
describe("Resource Utilization", () => {
  test("memory usage", async () => {
    const client = new TestACPClient()
    const initialMemory = process.memoryUsage().heapUsed

    // Create sessions and send messages
    for (let i = 0; i < 50; i++) {
      const sessionId = await client.newSession("/tmp")
      await client.prompt(sessionId, "Test message")
    }

    const finalMemory = process.memoryUsage().heapUsed
    const memoryIncrease = finalMemory - initialMemory

    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024) // 50MB limit
  })

  test("cpu usage under load", async () => {
    // Monitor CPU usage during load test
    const cpuMonitor = new CPUMonitor()

    cpuMonitor.start()
    await runLoadTest()
    const avgCpu = cpuMonitor.stop()

    expect(avgCpu).toBeLessThan(70) // 70% CPU limit
  })
})
```

## Integration Tests

### OpenCode ACP Server Tests

```typescript
describe("OpenCode ACP Server", () => {
  test("server startup", async () => {
    const server = new OpenCodeACPServer()

    await server.start()
    expect(server.isRunning()).toBe(true)

    await server.stop()
    expect(server.isRunning()).toBe(false)
  })

  test("configuration loading", async () => {
    const config = await loadOpenCodeConfig("/path/to/config")
    const server = new OpenCodeACPServer(config)

    expect(server.getDefaultModel()).toBe("claude-3-5-sonnet-20241022")
    expect(server.getMaxSessions()).toBe(10)
  })

  test("MCP server integration", async () => {
    const server = new OpenCodeACPServer()
    await server.start()

    // Configure MCP server
    await server.addMCPServer("weather", {
      type: "local",
      command: ["echo", "weather service"],
    })

    // Verify server is available
    const servers = server.getMCPServers()
    expect(servers).toContain("weather")
  })
})
```

### Zed Client Tests

```typescript
describe("Zed Client Integration", () => {
  test("client connection", async () => {
    const zedClient = new ZedACPClient()

    await zedClient.connect()
    expect(zedClient.isConnected()).toBe(true)

    await zedClient.disconnect()
    expect(zedClient.isConnected()).toBe(false)
  })

  test("UI component rendering", async () => {
    const panel = new AgentPanel()

    // Render panel
    const element = panel.render()

    // Check structure
    expect(element.find(".session-selector")).toBeDefined()
    expect(element.find(".message-history")).toBeDefined()
    expect(element.find(".prompt-input")).toBeDefined()
  })

  test("message display", async () => {
    const messageView = new MessageView({
      type: "assistant",
      content: "Hello **world**",
      timestamp: new Date(),
    })

    const rendered = messageView.render()

    // Should contain formatted text
    expect(rendered.text()).toContain("Hello world")
    expect(rendered.find("strong")).toBeDefined() // Bold formatting
  })
})
```

## Reliability Tests

### Error Recovery Tests

```typescript
describe("Error Recovery", () => {
  test("connection loss recovery", async () => {
    const client = new TestACPClient()
    await client.connect()

    // Simulate connection loss
    await client.simulateConnectionLoss()

    // Should automatically reconnect
    await waitForReconnection(client)

    expect(client.isConnected()).toBe(true)
  })

  test("session recovery", async () => {
    const client = new TestACPClient()
    const sessionId = await client.createSession()

    // Send some messages
    await client.prompt(sessionId, "Message 1")
    await client.prompt(sessionId, "Message 2")

    // Simulate server restart
    await client.simulateServerRestart()

    // Session should be recoverable
    const recoveredSession = await client.loadSession(sessionId)
    expect(recoveredSession.messages.length).toBe(4) // 2 user + 2 assistant
  })

  test("tool failure recovery", async () => {
    const client = new TestACPClient()
    const sessionId = await client.createSession()

    // Mock tool that fails
    mockToolRegistry.setMock("failing-tool", async () => {
      throw new Error("Tool failed")
    })

    await client.prompt(sessionId, "Use failing tool")

    // Should handle error gracefully
    const response = await client.waitForResponse()
    expect(response.stopReason).toBe("end_turn")
    expect(response.error).toBeDefined()
  })
})
```

### Load Tests

```typescript
describe("Load Tests", () => {
  test("sustained load", async () => {
    const client = new TestACPClient()
    const sessionId = await client.createSession()

    const duration = 60000 // 1 minute
    const start = Date.now()

    let messageCount = 0
    while (Date.now() - start < duration) {
      await client.prompt(sessionId, `Message ${messageCount++}`)
      await sleep(100) // Small delay
    }

    // Should handle sustained load
    expect(messageCount).toBeGreaterThan(500) // At least 500 messages
  })

  test("peak load", async () => {
    const clients = []
    const sessions = []

    // Create multiple clients
    for (let i = 0; i < 10; i++) {
      const client = new TestACPClient()
      await client.connect()
      clients.push(client)

      const sessionId = await client.createSession()
      sessions.push({ client, sessionId })
    }

    // Send burst of messages
    const promises = sessions.flatMap(({ client, sessionId }) =>
      [1, 2, 3, 4, 5].map((i) => client.prompt(sessionId, `Burst message ${i}`)),
    )

    const start = Date.now()
    await Promise.all(promises)
    const duration = Date.now() - start

    // Should handle peak load
    expect(duration).toBeLessThan(10000) // 10s for 250 messages
  })
})
```

### Chaos Tests

```typescript
describe("Chaos Tests", () => {
  test("random failures", async () => {
    const client = new TestACPClient()
    const chaosMonkey = new ChaosMonkey(client)

    // Introduce random failures
    chaosMonkey.addFailure("connection", 0.1) // 10% connection failures
    chaosMonkey.addFailure("tool", 0.05) // 5% tool failures
    chaosMonkey.addDelay("message", 100, 0.2) // 20% messages delayed by 100ms

    chaosMonkey.start()

    // Run normal operations
    for (let i = 0; i < 100; i++) {
      const sessionId = await client.createSession()
      await client.prompt(sessionId, "Test message")
    }

    chaosMonkey.stop()

    // System should remain stable
    expect(client.getErrorCount()).toBeLessThan(20) // Less than 20% errors
  })
})
```

## Test Automation

### Continuous Integration

#### GitHub Actions Workflow

```yaml
name: ACP Integration Tests

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20]

    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run protocol tests
        run: npm run test:protocol

      - name: Run functional tests
        run: npm run test:functional

      - name: Run performance tests
        run: npm run test:performance

      - name: Run integration tests
        run: npm run test:integration

      - name: Generate coverage report
        run: npm run coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Test Reporting

#### Coverage Reporting

```typescript
// coverage configuration
export const coverageConfig = {
  include: ["packages/opencode/src/acp/**/*", "packages/zed-acp/**/*"],
  exclude: ["**/test/**", "**/node_modules/**"],
  thresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
```

#### Performance Benchmarking

```typescript
// Benchmark configuration
export const benchmarkConfig = {
  benchmarks: [
    {
      name: "message_latency",
      fn: async () => {
        const client = new TestACPClient()
        const start = performance.now()
        await client.ping()
        return performance.now() - start
      },
      target: 100, // ms
    },
    {
      name: "session_creation",
      fn: async () => {
        const client = new TestACPClient()
        const start = performance.now()
        await client.newSession("/tmp")
        return performance.now() - start
      },
      target: 2000, // ms
    },
  ],
}
```

## Quality Metrics

### Test Quality Metrics

| Metric              | Target         | Description                         |
| ------------------- | -------------- | ----------------------------------- |
| Test Coverage       | > 90%          | Code coverage for ACP components    |
| Test Execution Time | < 10 min       | Total CI test time                  |
| Flaky Test Rate     | < 1%           | Tests that fail intermittently      |
| Test Maintenance    | < 2 hours/week | Time spent fixing/maintaining tests |

### Success Criteria

#### Test Suite Health

- [ ] All critical path tests passing
- [ ] Performance benchmarks met
- [ ] No flaky tests in main branch
- [ ] Test coverage above 90%

#### Continuous Quality

- [ ] Tests run on every PR
- [ ] Performance regression detection
- [ ] Coverage reports generated
- [ ] Test results archived

---

**Version**: 1.0.0
**Date**: November 2, 2025
**Authors**: Validation Test Specification Team
