// Test setup file for Vitest
// This file runs before all tests

// Mock console methods to reduce noise during testing
global.originalConsole = { ...console };

// You can add global test setup here
// For example, setting up environment variables, mocking timers, etc.

// Clean up after tests
afterAll(() => {
  // Restore original console if needed
});