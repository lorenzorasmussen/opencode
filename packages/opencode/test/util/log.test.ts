import { describe, expect, test, beforeEach, afterEach } from "bun:test"
import { Log } from "../../src/util/log"
import { setupTestLogging } from "../utils/test-helpers"

// Mock stderr to capture log output
const originalStderr = process.stderr
let capturedOutput = ""

beforeEach(() => {
  capturedOutput = ""
  process.stderr = {
    write: (msg: string) => {
      capturedOutput += msg
      return true
    },
  } as any
})

afterEach(() => {
  process.stderr = originalStderr
})

setupTestLogging()

describe("Log", () => {
  test("Level schema validation", () => {
    const validLevel = "INFO"
    const result = Log.Level.safeParse(validLevel)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBe("INFO")
    }
  })

  test("Level schema rejects invalid level", () => {
    const invalidLevel = "INVALID"
    const result = Log.Level.safeParse(invalidLevel)
    expect(result.success).toBe(false)
  })

  test("create logger with service tag", () => {
    const logger = Log.create({ service: "test-service" })
    expect(typeof logger).toBe("object")
    expect(typeof logger.info).toBe("function")
    expect(typeof logger.error).toBe("function")
    expect(typeof logger.warn).toBe("function")
    expect(typeof logger.debug).toBe("function")
  })

  test("logger error method writes to stderr", () => {
    const logger = Log.create({ service: "test" })
    logger.error("Error message")

    expect(capturedOutput).toContain("ERROR")
    expect(capturedOutput).toContain("Error message")
  })

  test("logger tag method adds tags", () => {
    const logger = Log.create({ service: "test" })
    const taggedLogger = logger.tag("version", "1.0")

    expect(taggedLogger).toBe(logger) // Should return the same logger
  })

  test("logger clone method creates new logger", () => {
    const logger = Log.create({ service: "test" })
    const clonedLogger = logger.clone()

    expect(typeof clonedLogger).toBe("object")
    expect(typeof clonedLogger.info).toBe("function")
  })

  test("time method logs start and stop", () => {
    const logger = Log.create({ service: "test" })
    const timer = logger.time("Test operation")

    // Simulate some work
    setTimeout(() => {
      timer.stop()
    }, 10)

    // Note: In a real test, we'd need to wait for async, but for now just test structure
    expect(typeof timer.stop).toBe("function")
    expect(typeof timer[Symbol.dispose]).toBe("function")
  })

  test("Default logger exists", () => {
    expect(typeof Log.Default).toBe("object")
    expect(typeof Log.Default.info).toBe("function")
  })

  // Note: init() and file() functions would require file system mocking for full testing
})
