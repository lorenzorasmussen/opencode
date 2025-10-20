import { describe, expect, test } from "bun:test"
import { FormatError } from "../../src/cli/error"
import { Config } from "../../src/config/config"
import { MCP } from "../../src/mcp"
import { UI } from "../../src/cli/ui"
import { setupTestLogging } from "../utils/test-helpers"

setupTestLogging()

describe("FormatError", () => {
  test("returns formatted message for MCP.Failed error", () => {
    const mcpError = new MCP.Failed({ name: "test-server" })
    const result = FormatError(mcpError)
    expect(result).toBe('MCP server "test-server" failed. Note, opencode does not support MCP authentication yet.')
  })

  test("returns formatted message for Config.JsonError", () => {
    const jsonError = new Config.JsonError({ path: "/path/to/config.json", message: "Invalid JSON" })
    const result = FormatError(jsonError)
    expect(result).toBe("Config file at /path/to/config.json is not valid JSON(C): Invalid JSON")
  })

  test("returns formatted message for Config.JsonError without message", () => {
    const jsonError = new Config.JsonError({ path: "/path/to/config.json" })
    const result = FormatError(jsonError)
    expect(result).toBe("Config file at /path/to/config.json is not valid JSON(C)")
  })

  test("returns formatted message for Config.DirectoryError", () => {
    const dirError = new Config.DirectoryError({
      dir: "invalid-dir",
      path: "/path/to/config.json",
      suggestion: "valid-dir",
    })
    const result = FormatError(dirError)
    expect(result).toBe('Directory "invalid-dir" in /path/to/config.json is not valid. Did you mean "valid-dir"?')
  })

  test("returns formatted message for Config.InvalidError", () => {
    const invalidError = new Config.InvalidError({
      path: "/path/to/config.json",
      message: "Invalid config",
    })
    const result = FormatError(invalidError)
    expect(result).toBe("Config file at /path/to/config.json is invalid: Invalid config")
  })

  test("returns empty string for UI.CancelledError", () => {
    const cancelError = new UI.CancelledError({})
    const result = FormatError(cancelError)
    expect(result).toBe("")
  })

  test("returns undefined for unknown error types", () => {
    const unknownError = new Error("Unknown error")
    const result = FormatError(unknownError)
    expect(result).toBeUndefined()
  })
})
