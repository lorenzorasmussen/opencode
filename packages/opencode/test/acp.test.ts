import { describe, it, expect, beforeEach, afterEach } from "bun:test"
import { spawn } from "child_process"
import { promises as fs } from "fs"
import { join } from "path"

describe("ACP Integration", () => {
  const testDir = join(process.cwd(), "test-tmp")
  let acpProcess: any

  beforeEach(async () => {
    // Create test directory
    await fs.mkdir(testDir, { recursive: true })
  })

  afterEach(async () => {
    // Clean up test directory
    if (acpProcess) {
      acpProcess.kill()
      acpProcess = null
    }
    try {
      await fs.rm(testDir, { recursive: true, force: true })
    } catch (e) {
      // Ignore cleanup errors
    }
  })

  describe("ACP Server", () => {
    it("should start and respond to initialize", async () => {
      // Start ACP server
      acpProcess = spawn("bun", ["run", "opencode", "acp"], {
        cwd: testDir,
        stdio: ["pipe", "pipe", "pipe"],
      })

      const initMessage = {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: 1,
          clientInfo: {
            name: "Test Client",
            version: "1.0.0",
          },
        },
      }

      // Send initialize request
      acpProcess.stdin.write(JSON.stringify(initMessage) + "\n")
      acpProcess.stdin.end()

      // Read response
      let response = ""
      for await (const chunk of acpProcess.stdout) {
        response += chunk.toString()
        if (response.includes("\n")) break
      }

      const parsed = JSON.parse(response.trim())
      expect(parsed.jsonrpc).toBe("2.0")
      expect(parsed.id).toBe(1)
      expect(parsed.result.protocolVersion).toBe(1)
      expect(parsed.result.agentCapabilities).toBeDefined()
    }, 10000)

    it("should handle new session creation", async () => {
      // Start ACP server
      acpProcess = spawn("bun", ["run", "opencode", "acp"], {
        cwd: testDir,
        stdio: ["pipe", "pipe", "pipe"],
      })

      // Initialize first
      const initMessage = {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: { protocolVersion: 1 },
      }

      acpProcess.stdin.write(JSON.stringify(initMessage) + "\n")

      // Wait for init response
      let initResponse = ""
      for await (const chunk of acpProcess.stdout) {
        initResponse += chunk.toString()
        if (initResponse.includes("\n")) break
      }

      // Create new session
      const sessionMessage = {
        jsonrpc: "2.0",
        id: 2,
        method: "session/new",
        params: {
          cwd: testDir,
          mcpServers: [],
        },
      }

      acpProcess.stdin.write(JSON.stringify(sessionMessage) + "\n")
      acpProcess.stdin.end()

      // Read session response
      let sessionResponse = ""
      for await (const chunk of acpProcess.stdout) {
        sessionResponse += chunk.toString()
        if (sessionResponse.includes("\n")) break
      }

      const parsed = JSON.parse(sessionResponse.trim())
      expect(parsed.jsonrpc).toBe("2.0")
      expect(parsed.id).toBe(2)
      expect(parsed.result.sessionId).toBeDefined()
      expect(typeof parsed.result.sessionId).toBe("string")
    }, 10000)
  })

  describe("Protocol Compliance", () => {
    it("should follow JSON-RPC 2.0 format", async () => {
      acpProcess = spawn("bun", ["run", "opencode", "acp"], {
        cwd: testDir,
        stdio: ["pipe", "pipe", "pipe"],
      })

      const message = {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: { protocolVersion: 1 },
      }

      acpProcess.stdin.write(JSON.stringify(message) + "\n")
      acpProcess.stdin.end()

      let response = ""
      for await (const chunk of acpProcess.stdout) {
        response += chunk.toString()
        if (response.includes("\n")) break
      }

      const parsed = JSON.parse(response.trim())

      // Validate JSON-RPC 2.0 compliance
      expect(parsed.jsonrpc).toBe("2.0")
      expect(typeof parsed.id).toBe("number")
      expect(parsed).toHaveProperty("result")
      expect(parsed).not.toHaveProperty("error")
    })

    it("should handle invalid requests gracefully", async () => {
      acpProcess = spawn("bun", ["run", "opencode", "acp"], {
        cwd: testDir,
        stdio: ["pipe", "pipe", "pipe"],
      })

      const invalidMessage = {
        jsonrpc: "2.0",
        id: 1,
        method: "invalid_method",
        params: {},
      }

      acpProcess.stdin.write(JSON.stringify(invalidMessage) + "\n")
      acpProcess.stdin.end()

      let response = ""
      for await (const chunk of acpProcess.stdout) {
        response += chunk.toString()
        if (response.includes("\n")) break
      }

      const parsed = JSON.parse(response.trim())
      expect(parsed.jsonrpc).toBe("2.0")
      expect(parsed.id).toBe(1)
      expect(parsed).toHaveProperty("error")
      expect(parsed.error.code).toBeDefined()
    })
  })
})
