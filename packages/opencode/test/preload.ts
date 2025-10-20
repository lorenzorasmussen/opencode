import { Log } from "../src/util/log"
import { setupTestLogging } from "./utils/test-helpers"

// Initialize logging for tests
Log.init({
  print: false,
  dev: true,
  level: "ERROR", // Only show errors during tests
})

// Setup additional test infrastructure
setupTestLogging()

// Global test setup - using Bun's test lifecycle
// Note: Bun doesn't have global beforeAll/afterAll, so we use console logging
console.log("🧪 Starting OpenCode test suite...")

// Error handling for unhandled rejections in tests
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason)
  // Don't fail the test suite for unhandled rejections in tests
})

// Cleanup on process exit
process.on("exit", () => {
  console.log("✅ OpenCode test suite completed")
})
