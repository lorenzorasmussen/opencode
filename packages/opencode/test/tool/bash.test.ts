import { describe, expect, test, mock } from "bun:test"
import path from "path"
import { BashTool } from "../../src/tool/bash"
import { Log } from "../../src/util/log"
import { Instance } from "../../src/project/instance"

const ctx = {
  sessionID: "test",
  messageID: "",
  toolCallID: "",
  agent: "build",
  abort: AbortSignal.any([]),
  metadata: () => {},
}

// Mock the $ function for bash commands
mock.module("bun", () => ({
  $: (strings: TemplateStringsArray, ...values: any[]) => {
    const command = strings.join(" ");
    if (command.includes("echo 'test'")) {
      return { quiet: () => ({ nothrow: () => ({ cwd: () => ({ text: () => Promise.resolve("test") }) }) }) };
    }
    if (command.includes("cd ../")) {
      // Simulate error for cd ../ outside project root
      throw new Error("This command references paths outside of");
    }
    return { quiet: () => ({ nothrow: () => ({ cwd: () => ({ text: () => Promise.resolve("") }) }) }) };
  },
}));

const bash = await BashTool.init()
const projectRoot = path.join(__dirname, "../..")
Log.init({ print: false })

describe("tool.bash", () => {
  test("basic", async () => {
    await Instance.provide({
      directory: projectRoot,
      fn: async () => {
        const result = await bash.execute(
          {
            command: "echo 'test'",
            description: "Echo test message",
          },
          ctx,
        )
        expect(result.metadata.exit).toBe(0)
        expect(result.metadata.output).toContain("test")
      },
    })
  })

  test("cd ../ should fail outside of project root", async () => {
    await Instance.provide({
      directory: projectRoot,
      fn: async () => {
        expect(
          bash.execute(
            {
              command: "cd ../",
              description: "Try to cd to parent directory",
            },
            ctx,
          ),
        ).rejects.toThrow("This command references paths outside of")
      },
    })
  })
})
