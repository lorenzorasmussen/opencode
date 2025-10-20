import { describe, expect, test } from "bun:test"
import { NamedError } from "../../src/util/error"
import { setupTestLogging } from "../utils/test-helpers"
import z from "zod/v4"

setupTestLogging()

describe("NamedError", () => {
  test("NamedError.create creates a custom error class", () => {
    const TestError = NamedError.create("TestError", z.object({ message: z.string() }))

    expect(typeof TestError).toBe("function")
    expect(TestError.name).toBe("TestError")
    expect(typeof TestError.Schema).toBe("object")
  })

  test("Custom error instance has correct properties", () => {
    const TestError = NamedError.create("TestError", z.object({ message: z.string() }))

    const error = new TestError({ message: "test error" })

    expect(error.name).toBe("TestError")
    expect(error.data).toEqual({ message: "test error" })
    expect(error.message).toBe("TestError")
  })

  test("isInstance correctly identifies error instances", () => {
    const TestError = NamedError.create("TestError", z.object({ message: z.string() }))

    const error = new TestError({ message: "test" })
    const otherError = new Error("other")

    expect(TestError.isInstance(error)).toBe(true)
    expect(TestError.isInstance(otherError)).toBe(false)
    expect(TestError.isInstance({})).toBe(false)
  })

  test("schema method returns correct schema", () => {
    const TestError = NamedError.create("TestError", z.object({ code: z.number() }))

    const schema = TestError.prototype.schema()
    expect(schema).toBe(TestError.Schema)
  })

  test("toObject method returns correct object", () => {
    const TestError = NamedError.create("TestError", z.object({ code: z.number() }))

    const error = new TestError({ code: 404 })
    const obj = error.toObject()

    expect(obj).toEqual({
      name: "TestError",
      data: { code: 404 },
    })
  })

  test("schema validation works correctly", () => {
    const TestError = NamedError.create("TestError", z.object({ code: z.number() }))

    const validData = { name: "TestError", data: { code: 404 } }
    const invalidData = { name: "TestError", data: { code: "not a number" } }

    expect(TestError.Schema.safeParse(validData).success).toBe(true)
    expect(TestError.Schema.safeParse(invalidData).success).toBe(false)
  })
})
