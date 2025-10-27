import { describe, expect, test } from "bun:test"
import { GlobTool } from "../../src/tool/glob"
import { setupTestLogging } from "../utils/test-helpers"

setupTestLogging()

describe("Glob Tool", () => {
  test("GlobTool is defined", () => {
    expect(typeof GlobTool).toBe("object")
    expect(GlobTool).toBeDefined()
  })

  test("parameters schema validation", async () => {
    const toolInfo = await GlobTool.init()
    const validParams = {
      pattern: "*.ts",
    }

    const result = toolInfo.parameters.safeParse(validParams)
    expect(result.success).toBe(true)
  })

  test("parameters schema rejects invalid pattern", async () => {
    const toolInfo = await GlobTool.init()
    const invalidParams = {
      pattern: 123, // Should be string
    }

    const result = toolInfo.parameters.safeParse(invalidParams)
    expect(result.success).toBe(false)
  })

  // Note: Full execution tests would require mocking Ripgrep and file system,
  // which is complex. For now, we test the schema and structure.
})
