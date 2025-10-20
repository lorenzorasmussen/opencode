import { describe, expect, test } from "bun:test"
import { replace, SimpleReplacer, LineTrimmedReplacer } from "../../src/tool/edit"
import { setupTestLogging } from "../utils/test-helpers"

setupTestLogging()

describe("Edit Tool", () => {
  test("SimpleReplacer yields exact match", () => {
    const content = "hello world"
    const find = "world"
    const results = Array.from(SimpleReplacer(content, find))
    expect(results).toEqual(["world"])
  })

  test("LineTrimmedReplacer matches trimmed lines", () => {
    const content = "  hello\n  world  \n"
    const find = "hello\nworld"
    const results = Array.from(LineTrimmedReplacer(content, find))
    expect(results).toEqual(["  hello\n  world  "])
  })

  test("replace function with exact match", () => {
    const content = "hello world"
    const oldString = "world"
    const newString = "universe"
    const result = replace(content, oldString, newString)
    expect(result).toBe("hello universe")
  })

  test("replace function with replaceAll", () => {
    const content = "test test test"
    const oldString = "test"
    const newString = "pass"
    const result = replace(content, oldString, newString, true)
    expect(result).toBe("pass pass pass")
  })

  test("replace function throws if oldString not found", () => {
    const content = "hello world"
    const oldString = "missing"
    const newString = "replacement"
    expect(() => replace(content, oldString, newString)).toThrow("oldString not found in content")
  })

  test("replace function throws if oldString and newString are same", () => {
    const content = "hello world"
    const oldString = "world"
    const newString = "world"
    expect(() => replace(content, oldString, newString)).toThrow("oldString and newString must be different")
  })

  test("replace function handles multiple occurrences", () => {
    const content = "one two one"
    const oldString = "one"
    const newString = "zero"
    // Should throw because multiple occurrences and not replaceAll
    expect(() => replace(content, oldString, newString)).toThrow(
      "oldString found multiple times and requires more code context",
    )
  })

  // Note: Full integration tests for the EditTool.execute would require mocking file system and permissions,
  // which is complex. For now, we test the core replace logic.
})
