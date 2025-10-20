import { describe, expect, test } from "bun:test"
import { Filesystem } from "../../src/util/filesystem"
import { setupTestLogging } from "../utils/test-helpers"
import path from "path"
import fs from "fs/promises"
import { Global } from "../../src/global"

setupTestLogging()

describe("Filesystem", () => {
  test("overlaps function detects overlapping paths", () => {
    expect(Filesystem.overlaps("/a/b", "/a/b/c")).toBe(true)
    expect(Filesystem.overlaps("/a/b/c", "/a/b")).toBe(true)
    expect(Filesystem.overlaps("/a/b", "/a/c")).toBe(false)
    expect(Filesystem.overlaps("/a/b", "/d/e")).toBe(false)
  })

  test("contains function checks if parent contains child", () => {
    expect(Filesystem.contains("/a/b", "/a/b/c")).toBe(true)
    expect(Filesystem.contains("/a/b/c", "/a/b")).toBe(false)
    expect(Filesystem.contains("/a/b", "/a/c")).toBe(false)
  })

  test("findUp function finds files upwards", async () => {
    // Create a temporary directory structure for testing
    const tempDir = await fs.mkdtemp(path.join(Global.Path.data, "filesystem-test-"))
    const subDir = path.join(tempDir, "sub", "deep")
    await fs.mkdir(subDir, { recursive: true })

    // Create a file in the temp directory
    const targetFile = path.join(tempDir, "target.txt")
    await fs.writeFile(targetFile, "test")

    try {
      const results = await Filesystem.findUp("target.txt", subDir)
      expect(results).toContain(targetFile)
      expect(results.length).toBe(1)
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true })
    }
  })

  test("up generator yields files upwards", async () => {
    const tempDir = await fs.mkdtemp(path.join(Global.Path.data, "filesystem-test-"))
    const subDir = path.join(tempDir, "sub", "deep")
    await fs.mkdir(subDir, { recursive: true })

    const targetFile = path.join(tempDir, "target.txt")
    await fs.writeFile(targetFile, "test")

    try {
      const results = []
      for await (const file of Filesystem.up({ targets: ["target.txt"], start: subDir })) {
        results.push(file)
      }
      expect(results).toContain(targetFile)
      expect(results.length).toBe(1)
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true })
    }
  })

  test("globUp function finds files with glob patterns", async () => {
    const uniqueTempDir = await fs.mkdtemp(path.join(Global.Path.data, "globup-test-"))
    const subDir = path.join(uniqueTempDir, "sub")
    await fs.mkdir(subDir, { recursive: true })

    const targetFile = path.join(subDir, "test.txt")
    await fs.writeFile(targetFile, "test")

    try {
      const results = await Filesystem.globUp("*.txt", subDir)
      console.log("globUp results:", results)
      expect(results).toContain(targetFile)
      expect(results.length).toBe(1)
    } finally {
      await fs.rm(uniqueTempDir, { recursive: true, force: true })
    }
  })

  // Note: More comprehensive tests would require setting up complex directory structures
})
