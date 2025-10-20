import { describe, expect, test } from "bun:test"
import { Command } from "../../src/command"
import { setupTestLogging } from "../utils/test-helpers"

setupTestLogging()

describe("Command", () => {
  test("Command namespace exists", () => {
    expect(typeof Command).toBe("object")
  })

  test("Command.Info schema exists", () => {
    expect(typeof Command.Info).toBe("object")
    expect(typeof Command.Info.safeParse).toBe("function")
  })

  test("Command.get function exists", () => {
    expect(typeof Command.get).toBe("function")
  })

  test("Command.list function exists", () => {
    expect(typeof Command.list).toBe("function")
  })

  test("Command.Info schema validation", () => {
    const validInfo = {
      name: "test-command",
      template: "echo 'Hello World'",
    }

    const result = Command.Info.safeParse(validInfo)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe("test-command")
      expect(result.data.template).toBe("echo 'Hello World'")
    }
  })

  test("Command.Info schema rejects invalid data", () => {
    const invalidInfo = {
      name: 123, // Should be string
    }

    const result = Command.Info.safeParse(invalidInfo)
    expect(result.success).toBe(false)
  })

  // Note: get() and list() require full project context, so they are tested in integration tests
})
