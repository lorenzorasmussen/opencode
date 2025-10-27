import { describe, expect, test } from "bun:test"
import { withTestContext, createMockFileSystem } from "../utils/test-helpers"
import { spawn } from "child_process"

/**
 * End-to-End test template for OpenCode CLI
 *
 * This template demonstrates:
 * - CLI command execution testing
 * - Full workflow testing
 * - Process management
 * - Output validation
 */

describe("Example E2E Tests", () => {
  withTestContext("should execute CLI commands successfully", async (ctx) => {
    // Setup test project
    await createMockFileSystem(ctx.tmpDir, {
      "package.json": JSON.stringify({
        name: "e2e-test",
        version: "1.0.0",
        scripts: {
          test: "echo 'test passed'",
        },
      }),
    })

    // Execute CLI command
    const result = await executeCommand("echo", ["hello world"], { cwd: ctx.tmpDir })

    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain("hello world")
  })

  withTestContext("should handle complex project operations", async (ctx) => {
    // Setup complex test project
    await createMockFileSystem(ctx.tmpDir, {
      "package.json": JSON.stringify({
        name: "complex-e2e-test",
        version: "1.0.0",
      }),
      "src/index.ts": `
        import { readFileSync } from "fs"
        console.log("Project version:", JSON.parse(readFileSync("package.json", "utf-8")).version)
      `,
      "tests/unit.test.ts": `
        import { test, expect } from "bun:test"
        test("example", () => expect(1 + 1).toBe(2))
      `,
    })

    // Test TypeScript compilation
    const compileResult = await executeCommand("bun", ["run", "src/index.ts"], {
      cwd: ctx.tmpDir,
    })

    expect(compileResult.exitCode).toBe(0)
    expect(compileResult.stdout).toContain("Project version: 1.0.0")

    // Test running tests
    const testResult = await executeCommand("bun", ["test"], {
      cwd: ctx.tmpDir,
    })

    expect(testResult.exitCode).toBe(0)
  })

  test("should handle error scenarios", async () => {
    // Test command that should fail
    const result = await executeCommand("nonexistent-command", [], {})

    expect(result.exitCode).not.toBe(0)
    expect(result.stderr).toBeDefined()
  })

  withTestContext("should handle file system operations end-to-end", async (ctx) => {
    // Create initial files
    await createMockFileSystem(ctx.tmpDir, {
      "input.txt": "Hello World",
      "script.ts": `
        import { readFileSync, writeFileSync } from "fs"
        const content = readFileSync("input.txt", "utf-8")
        writeFileSync("output.txt", content.toUpperCase())
      `,
    })

    // Execute script
    const result = await executeCommand("bun", ["run", "script.ts"], {
      cwd: ctx.tmpDir,
    })

    expect(result.exitCode).toBe(0)

    // Verify output file
    const outputContent = await Bun.file(`${ctx.tmpDir}/output.txt`).text()
    expect(outputContent).toBe("HELLO WORLD")
  })

  withTestContext("should handle OpenCode CLI initialization", async (ctx) => {
    // Setup a basic project
    await createMockFileSystem(ctx.tmpDir, {
      "package.json": JSON.stringify({
        name: "opencode-e2e-test",
        version: "1.0.0",
      }),
      "src/main.ts": "console.log('OpenCode E2E Test')",
    })

    // Test if OpenCode CLI can be invoked (without full setup)
    // This is a placeholder for actual CLI testing
    const result = await executeCommand("echo", ["OpenCode CLI test"], {
      cwd: ctx.tmpDir,
    })

    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain("OpenCode CLI test")
  })

  withTestContext("should handle complex multi-step workflows", async (ctx) => {
    // Setup a project with multiple files
    await createMockFileSystem(ctx.tmpDir, {
      "package.json": JSON.stringify({
        name: "workflow-test",
        version: "1.0.0",
        scripts: {
          build: "echo 'Building...' && mkdir -p dist",
          test: "echo 'Testing...' && echo 'All tests passed'",
        },
      }),
      "src/utils.ts": "export const helper = () => 'utility function'",
      "src/index.ts": `
        import { helper } from "./utils"
        console.log("Using helper:", helper())
        console.log("Build complete")
      `,
    })

    // Step 1: Run build using bun
    const buildResult = await executeCommand("bun", ["run", "build"], {
      cwd: ctx.tmpDir,
    })
    expect(buildResult.exitCode).toBe(0)
    expect(buildResult.stdout).toContain("Building...")

    // Step 2: Run tests using bun
    const testResult = await executeCommand("bun", ["run", "test"], {
      cwd: ctx.tmpDir,
    })
    expect(testResult.exitCode).toBe(0)
    expect(testResult.stdout).toContain("Testing...")
    expect(testResult.stdout).toContain("All tests passed")

    // Step 3: Run main script
    const runResult = await executeCommand("bun", ["run", "src/index.ts"], {
      cwd: ctx.tmpDir,
    })
    expect(runResult.exitCode).toBe(0)
    expect(runResult.stdout).toContain("Using helper: utility function")
    expect(runResult.stdout).toContain("Build complete")
  })
})

/**
 * Execute a command and return the result
 */
async function executeCommand(
  command: string,
  args: string[] = [],
  options: { cwd?: string; env?: Record<string, string> } = {},
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: options.cwd || process.cwd(),
      env: { ...process.env, ...options.env },
      stdio: ["pipe", "pipe", "pipe"],
    })

    let stdout = ""
    let stderr = ""

    child.stdout?.on("data", (data) => {
      stdout += data.toString()
    })

    child.stderr?.on("data", (data) => {
      stderr += data.toString()
    })

    child.on("close", (exitCode) => {
      resolve({
        exitCode: exitCode || 0,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
      })
    })

    child.on("error", (error) => {
      resolve({
        exitCode: 1,
        stdout,
        stderr: error.message,
      })
    })
  })
}
