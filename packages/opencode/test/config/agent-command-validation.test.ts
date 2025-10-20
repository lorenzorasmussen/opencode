import { describe, expect, test } from "bun:test"
import { setupTestLogging } from "../utils/test-helpers"
import fs from "fs/promises"
import path from "path"

setupTestLogging()

describe("Agent and Command Configuration Validation", () => {
  test("All agent .md files have valid YAML frontmatter with correct mode", async () => {
    const agentDir = path.resolve(__dirname, "../../src/agent")
    const files = await fs.readdir(agentDir)
    const mdFiles = files.filter((f) => f.endsWith(".md"))

    for (const file of mdFiles) {
      const filePath = path.join(agentDir, file)
      const content = await fs.readFile(filePath, "utf-8")

      // Check for YAML frontmatter
      const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/)
      expect(yamlMatch, `File ${file} must have YAML frontmatter`).toBeTruthy()

      if (yamlMatch) {
        const yamlContent = yamlMatch[1]

        // Check for required fields for agents
        expect(yamlContent.includes("description:"), `File ${file} must have description`).toBe(true)
        expect(yamlContent.includes("mode:"), `File ${file} must have mode`).toBe(true)
        expect(yamlContent.includes("model:"), `File ${file} must have model`).toBe(true)

        // Check mode value
        const modeMatch = yamlContent.match(/mode:\s*["']?(\w+)["']?/)
        if (modeMatch) {
          expect(
            ["primary", "subagent", "all"].includes(modeMatch[1]),
            `File ${file} mode must be primary, subagent, or all`,
          ).toBe(true)
        }

        // Ensure no "agent" field in agent files
        expect(yamlContent.includes("agent:"), `File ${file} should not have agent field`).toBe(false)
      }
    }
  })

  test("All command .md files have valid YAML frontmatter with agent field", async () => {
    const commandDir = path.resolve(__dirname, "../../src/command")
    const files = await fs.readdir(commandDir)
    const mdFiles = files.filter((f) => f.endsWith(".md"))

    for (const file of mdFiles) {
      const filePath = path.join(commandDir, file)
      const content = await fs.readFile(filePath, "utf-8")

      // Check for YAML frontmatter
      const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/)
      expect(yamlMatch, `File ${file} must have YAML frontmatter`).toBeTruthy()

      if (yamlMatch) {
        const yamlContent = yamlMatch[1]

        // Check for required fields for commands
        expect(yamlContent.includes("description:"), `File ${file} must have description`).toBe(true)
        expect(yamlContent.includes("agent:"), `File ${file} must have agent`).toBe(true)
        expect(yamlContent.includes("template:"), `File ${file} must have template`).toBe(true)

        // Ensure no "mode" field in command files
        expect(yamlContent.includes("mode:"), `File ${file} should not have mode field`).toBe(false)
      }
    }
  })

  test("All YAML frontmatter uses only accepted variables", async () => {
    const acceptedAgentVars = ["description", "mode", "model", "temperature", "top_p", "tools", "permission", "disable"]
    const acceptedCommandVars = ["description", "agent", "template", "subtask"]

    const agentDir = path.resolve(__dirname, "../../src/agent")
    const commandDir = path.resolve(__dirname, "../../src/command")

    // Check agent files
    const agentFiles = await fs.readdir(agentDir)
    for (const file of agentFiles.filter((f) => f.endsWith(".md"))) {
      const content = await fs.readFile(path.join(agentDir, file), "utf-8")
      const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/)
      if (yamlMatch) {
        const lines = yamlMatch[1].split("\n")
        for (const line of lines) {
          const keyMatch = line.match(/^(\w+):/)
          if (keyMatch) {
            const key = keyMatch[1]
            expect(acceptedAgentVars.includes(key), `File ${file} has invalid variable: ${key}`).toBe(true)
          }
        }
      }
    }

    // Check command files
    const commandFiles = await fs.readdir(commandDir)
    for (const file of commandFiles.filter((f) => f.endsWith(".md"))) {
      const content = await fs.readFile(path.join(commandDir, file), "utf-8")
      const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/)
      if (yamlMatch) {
        const lines = yamlMatch[1].split("\n")
        for (const line of lines) {
          const keyMatch = line.match(/^(\w+):/)
          if (keyMatch) {
            const key = keyMatch[1]
            expect(acceptedCommandVars.includes(key), `File ${file} has invalid variable: ${key}`).toBe(true)
          }
        }
      }
    }
  })
})
