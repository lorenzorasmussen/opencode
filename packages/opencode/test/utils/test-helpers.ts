import { expect, test } from "bun:test"
import { tmpdir } from "os"
import { join } from "path"
import { mkdtemp, rm, writeFile, mkdir } from "fs/promises"
import { Log } from "../../src/util/log"

/**
 * Test utilities for OpenCode testing infrastructure
 */

export interface TestContext {
  tmpDir: string
  cleanup: () => Promise<void>
}

export interface MockToolContext {
  sessionID: string
  cwd: string
  env: Record<string, string>
}

/**
 * Creates a temporary directory for testing and returns cleanup function
 */
export async function createTestContext(): Promise<TestContext> {
  const tmpDir = await mkdtemp(join(tmpdir(), "opencode-test-"))

  const cleanup = async () => {
    try {
      await rm(tmpDir, { recursive: true, force: true })
    } catch (error) {
      console.warn(`Failed to cleanup test directory ${tmpDir}:`, error)
    }
  }

  return { tmpDir, cleanup }
}

/**
 * Creates a mock tool execution context
 */
export function createMockToolContext(overrides: Partial<MockToolContext> = {}): MockToolContext {
  return {
    sessionID: "test-session-" + Math.random().toString(36).substr(2, 9),
    cwd: process.cwd(),
    env: Object.fromEntries(Object.entries(process.env).filter(([_, v]) => v !== undefined)) as Record<string, string>,
    ...overrides,
  }
}

/**
 * Creates a temporary file with given content
 */
export async function createTestFile(dir: string, filename: string, content: string): Promise<string> {
  const filePath = join(dir, filename)
  await mkdir(join(dir, filename.split("/").slice(0, -1).join("/")), { recursive: true })
  await writeFile(filePath, content, "utf-8")
  return filePath
}

/**
 * Asserts that a function throws with specific error message
 */
export async function expectThrows(fn: () => Promise<any> | any, expectedMessage?: string | RegExp): Promise<void> {
  try {
    await fn()
    expect(true).toBe(false) // Should not reach here
  } catch (error) {
    if (expectedMessage) {
      const message = error instanceof Error ? error.message : String(error)
      if (expectedMessage instanceof RegExp) {
        expect(message).toMatch(expectedMessage)
      } else {
        expect(message).toContain(expectedMessage)
      }
    }
  }
}

/**
 * Test runner that automatically handles cleanup
 */
export function withTestContext(testName: string, testFn: (ctx: TestContext) => Promise<void> | void) {
  test(testName, async () => {
    const ctx = await createTestContext()
    try {
      await testFn(ctx)
    } finally {
      await ctx.cleanup()
    }
  })
}

/**
 * Setup function for test suites that need logging disabled
 */
export function setupTestLogging() {
  Log.init({
    print: false,
    dev: true,
    level: "ERROR", // Only show errors in tests
  })
}

/**
 * Mock implementation for testing async operations
 */
export class TestAsyncQueue {
  private queue: Array<() => Promise<void>> = []
  private running = false

  async add(fn: () => Promise<void>): Promise<void> {
    this.queue.push(fn)
    if (!this.running) {
      await this.process()
    }
  }

  private async process(): Promise<void> {
    this.running = true
    while (this.queue.length > 0) {
      const fn = this.queue.shift()!
      try {
        await fn()
      } catch (error) {
        console.error("Test async queue error:", error)
      }
    }
    this.running = false
  }
}

/**
 * Performance testing utility
 */
export async function measurePerformance<T>(
  fn: () => Promise<T> | T,
  iterations = 1,
): Promise<{ result: T; duration: number; avgDuration: number }> {
  const start = performance.now()
  let result: T

  for (let i = 0; i < iterations; i++) {
    result = await fn()
  }

  const end = performance.now()
  const duration = end - start
  const avgDuration = duration / iterations

  return { result: result!, duration, avgDuration }
}

/**
 * Creates a mock file system structure for testing
 */
export async function createMockFileSystem(baseDir: string, structure: Record<string, string>): Promise<void> {
  for (const [path, content] of Object.entries(structure)) {
    await createTestFile(baseDir, path, content)
  }
}
