import { describe, expect, test } from "bun:test"
import { Agent } from "../../src/agent/agent"
import { setupTestLogging } from "../utils/test-helpers"

setupTestLogging()

describe("Agent", () => {
  test("Agent namespace exists", () => {
    expect(typeof Agent).toBe("object")
  })

  test("Agent.Info schema exists", () => {
    expect(typeof Agent.Info).toBe("object")
    expect(typeof Agent.Info.safeParse).toBe("function")
  })

  test("Agent.get function exists", () => {
    expect(typeof Agent.get).toBe("function")
  })

  test("Agent.list function exists", () => {
    expect(typeof Agent.list).toBe("function")
  })

  test("Agent.generate function exists", () => {
    expect(typeof Agent.generate).toBe("function")
  })

  test("Info schema validation", () => {
    const validInfo = {
      name: "test-agent",
      mode: "subagent" as const,
      builtIn: false,
      permission: {
        edit: "allow" as const,
        bash: { "*": "allow" as const },
        webfetch: "allow" as const,
      },
      tools: { read: true, write: false },
      options: {},
    }

    const result = Agent.Info.safeParse(validInfo)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe("test-agent")
      expect(result.data.mode).toBe("subagent")
    }
  })

  test("Info schema rejects invalid mode", () => {
    const invalidInfo = {
      name: "test-agent",
      mode: "invalid-mode",
      builtIn: false,
    }

    const result = Agent.Info.safeParse(invalidInfo)
    expect(result.success).toBe(false)
  })
})
