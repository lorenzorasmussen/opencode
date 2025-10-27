import { describe, expect, test } from "bun:test"
import { withTestContext, createMockToolContext, expectThrows } from "../utils/test-helpers"

/**
 * Unit test template for OpenCode components
 *
 * This template demonstrates:
 * - Basic unit test structure
 * - Mock context creation
 * - Error testing
 * - Test context management
 */

describe("Example Unit Tests", () => {
  test("should handle basic functionality", () => {
    // Arrange
    const input = "test input"
    const expected = "TEST INPUT"

    // Act
    const result = input.toUpperCase()

    // Assert
    expect(result).toBe(expected)
  })

  test("should handle edge cases", () => {
    expect(() => {
      // Test edge case that should throw
      JSON.parse("{invalid json}")
    }).toThrow()
  })

  test("should validate input parameters", async () => {
    await expectThrows(async () => {
      // Simulate function that should throw
      throw new Error("Invalid parameter")
    }, "Invalid parameter")
  })

  withTestContext("should handle file operations", async (ctx) => {
    // This test automatically gets cleanup
    const testFile = await Bun.file(`${ctx.tmpDir}/test.txt`)
    await Bun.write(testFile, "test content")

    const content = await testFile.text()
    expect(content).toBe("test content")
  })

  test("should work with mock tool context", () => {
    const mockContext = createMockToolContext({
      sessionID: "custom-session",
      cwd: "/test/path",
    })

    expect(mockContext.sessionID).toBe("custom-session")
    expect(mockContext.cwd).toBe("/test/path")
  })
})
