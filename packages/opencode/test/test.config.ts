/**
 * Test configuration for OpenCode testing infrastructure
 */

export interface TestConfig {
  /** Test environment settings */
  environment: {
    timeout: number
    retries: number
    parallel: boolean
  }

  /** Coverage settings */
  coverage: {
    enabled: boolean
    thresholds: {
      branches: number
      functions: number
      lines: number
      statements: number
    }
    exclude: string[]
  }

  /** Test categories */
  categories: {
    unit: boolean
    integration: boolean
    e2e: boolean
  }

  /** External services for integration tests */
  services: {
    mockExternalAPIs: boolean
    database: {
      inMemory: boolean
      resetBetweenTests: boolean
    }
  }
}

export const testConfig: TestConfig = {
  environment: {
    timeout: 30000, // 30 seconds
    retries: 2,
    parallel: true,
  },

  coverage: {
    enabled: true,
    thresholds: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    exclude: ["**/node_modules/**", "**/test/**", "**/*.test.ts", "**/*.spec.ts", "**/coverage/**", "**/*.d.ts"],
  },

  categories: {
    unit: true,
    integration: true,
    e2e: process.env["CI"] === "true", // Only run E2E in CI by default
  },

  services: {
    mockExternalAPIs: true,
    database: {
      inMemory: true,
      resetBetweenTests: true,
    },
  },
}

/**
 * Get test configuration for current environment
 */
export function getTestConfig(): TestConfig {
  const config = { ...testConfig }

  // Override based on environment variables
  if (process.env["TEST_TIMEOUT"]) {
    config.environment.timeout = parseInt(process.env["TEST_TIMEOUT"])
  }

  if (process.env["SKIP_E2E"] === "true") {
    config.categories.e2e = false
  }

  if (process.env["COVERAGE_ENABLED"] === "false") {
    config.coverage.enabled = false
  }

  return config
}

/**
 * Validate test configuration
 */
export function validateTestConfig(config: TestConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (config.environment.timeout < 1000) {
    errors.push("Test timeout must be at least 1000ms")
  }

  if (config.coverage.thresholds.branches < 0 || config.coverage.thresholds.branches > 100) {
    errors.push("Branch coverage threshold must be between 0 and 100")
  }

  if (config.coverage.thresholds.functions < 0 || config.coverage.thresholds.functions > 100) {
    errors.push("Function coverage threshold must be between 0 and 100")
  }

  if (config.coverage.thresholds.lines < 0 || config.coverage.thresholds.lines > 100) {
    errors.push("Line coverage threshold must be between 0 and 100")
  }

  if (config.coverage.thresholds.statements < 0 || config.coverage.thresholds.statements > 100) {
    errors.push("Statement coverage threshold must be between 0 and 100")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
