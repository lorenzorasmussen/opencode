import { describe, expect, test } from "bun:test"
import { withTestContext, createMockFileSystem, measurePerformance } from "../utils/test-helpers"

/**
 * Integration test template for OpenCode components
 *
 * This template demonstrates:
 * - Component integration testing
 * - File system interactions
 * - Performance testing
 * - End-to-end flow testing
 */

describe("Example Integration Tests", () => {
  withTestContext("should handle complete workflow", async (ctx) => {
    // Setup test file system
    await createMockFileSystem(ctx.tmpDir, {
      "package.json": JSON.stringify({
        name: "test-project",
        version: "1.0.0",
      }),
      "src/main.ts": "console.log('Hello World')",
    })

    // Test file operations and data flow
    const packagePath = `${ctx.tmpDir}/package.json`
    const packageJson = await Bun.file(packagePath).text()
    const parsed = JSON.parse(packageJson)
    expect(parsed.name).toBe("test-project")
    expect(parsed.version).toBe("1.0.0")

    // Test file interactions
    const mainPath = `${ctx.tmpDir}/src/main.ts`
    const mainFile = await Bun.file(mainPath).text()
    expect(mainFile).toContain("console.log")
  })

  test("should handle tool interactions", async () => {
    // Test tool-to-tool interactions
    const performance = await measurePerformance(async () => {
      // Simulate some work
      await new Promise((resolve) => setTimeout(resolve, 10))
      return "result"
    }, 3)

    expect(performance.result).toBe("result")
    expect(performance.avgDuration).toBeGreaterThan(5)
    expect(performance.avgDuration).toBeLessThan(100)
  })

  withTestContext("should handle complex file operations", async (ctx) => {
    // Create complex directory structure
    await createMockFileSystem(ctx.tmpDir, {
      "src/components/Button.ts": "export class Button {}",
      "src/utils/helpers.ts": "export const helper = () => {}",
      "tests/Button.test.ts": "describe('Button', () => {})",
      "README.md": "# Test Project",
    })

    // Verify structure
    const components = await Bun.file(`${ctx.tmpDir}/src/components/Button.ts`).exists()
    const utils = await Bun.file(`${ctx.tmpDir}/src/utils/helpers.ts`).exists()
    const tests = await Bun.file(`${ctx.tmpDir}/tests/Button.test.ts`).exists()

    expect(components).toBe(true)
    expect(utils).toBe(true)
    expect(tests).toBe(true)
  })

  test("should handle error scenarios gracefully", async () => {
    // Test error handling in integrated components
    try {
      // Simulate an operation that might fail
      throw new Error("Integration test error")
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect((error as Error).message).toContain("Integration test error")
    }
  })
})
