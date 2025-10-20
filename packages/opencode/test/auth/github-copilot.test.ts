import { describe, expect, test } from "bun:test"
import { AuthGithubCopilot } from "../../src/auth/github-copilot"
import { setupTestLogging } from "../utils/test-helpers"

setupTestLogging()

describe("AuthGithubCopilot", () => {
  test("authorize function exists", () => {
    expect(typeof AuthGithubCopilot.authorize).toBe("function")
  })

  test("poll function exists", () => {
    expect(typeof AuthGithubCopilot.poll).toBe("function")
  })

  test("access function exists", () => {
    expect(typeof AuthGithubCopilot.access).toBe("function")
  })

  test("error classes exist", () => {
    expect(typeof AuthGithubCopilot.DeviceCodeError).toBe("function")
    expect(typeof AuthGithubCopilot.TokenExchangeError).toBe("function")
    expect(typeof AuthGithubCopilot.AuthenticationError).toBe("function")
    expect(typeof AuthGithubCopilot.CopilotTokenError).toBe("function")
  })

  // Note: Full integration tests would require mocking HTTP requests,
  // which is complex in Bun test without additional libraries
})
