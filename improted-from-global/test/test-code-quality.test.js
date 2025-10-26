import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { execSync } from 'child_process';

// Mock child_process
vi.mock('child_process', () => ({
  execSync: vi.fn()
}));

// Mock fs
vi.mock('fs', () => ({
  readFileSync: vi.fn(),
  existsSync: vi.fn(),
  readdirSync: vi.fn(),
  statSync: vi.fn()
}));

// Mock path
vi.mock('path', () => ({
  join: vi.fn(),
  resolve: vi.fn(),
  dirname: vi.fn()
}));

// Mock url
vi.mock('url', () => ({
  fileURLToPath: vi.fn()
}));

describe('Test Code Quality Suite', () => {
  let mockConsole;
  let originalConsole;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock console
    originalConsole = global.console;
    mockConsole = {
      log: vi.fn(),
      error: vi.fn(),
      warn: vi.fn()
    };
    global.console = mockConsole;

    // Mock execSync to return successful results by default
    execSync.mockReturnValue('');
  });

  afterEach(() => {
    global.console = originalConsole;
    vi.restoreAllMocks();
  });

  describe('Comprehensive Test Suite', () => {
    it('should run all tests successfully when no issues found', async () => {
      // Mock all external dependencies to return success
      execSync.mockReturnValue('');
      const { readdirSync, statSync } = await import('fs');
      const { join } = await import('path');

      // Mock file system operations
      readdirSync.mockReturnValue(['test.js']);
      statSync.mockReturnValue({ isDirectory: () => false, isFile: () => true });
      join.mockImplementation((...args) => args.join('/'));

      // Import and run the test suite
      const { default: CodeQualityTester } = await import('../test-code-quality.js');
      const tester = new CodeQualityTester();

      await tester.runAllTests();

      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('Starting Comprehensive Code Quality Test Suite')
      );
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('CODE QUALITY TEST SUMMARY')
      );
    });

    it('should handle test failures gracefully', async () => {
      // Mock some tests to fail
      execSync.mockImplementation((command) => {
        if (command.includes('tsc')) {
          throw new Error('TypeScript compilation failed');
        }
        if (command.includes('eslint')) {
          throw new Error('ESLint failed');
        }
        return '';
      });

      const { readdirSync, statSync } = await import('fs');
      const { join } = await import('path');

      // Mock file system operations
      readdirSync.mockReturnValue(['test.js']);
      statSync.mockReturnValue({ isDirectory: () => false, isFile: () => true });
      join.mockImplementation((...args) => args.join('/'));

      const { default: CodeQualityTester } = await import('../test-code-quality.js');
      const tester = new CodeQualityTester();

      await tester.runAllTests();

      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('❌ Tests failed: 3')
      );
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('Overall Status: ❌ FAILED')
      );
    });

    it('should detect file path issues', async () => {
      const { readFileSync, existsSync, readdirSync, statSync } = await import('fs');
      const { join, dirname } = await import('path');

      // Mock file system to simulate file path issues
      readdirSync.mockReturnValue(['test.js']);
      statSync.mockReturnValue({ isDirectory: () => false, isFile: () => true });
      readFileSync.mockReturnValue(`
        import { missing } from 'nonexistent-package';
        const fs = require('fs'); // This should be ignored
      `);
      existsSync.mockReturnValue(false);
      dirname.mockReturnValue('/test');
      join.mockImplementation((...args) => args.join('/'));

      execSync.mockImplementation((cmd) => {
        if (cmd.includes('npm list nonexistent-package')) {
          throw new Error('Package not found');
        }
        return '';
      });

      const { default: CodeQualityTester } = await import('../test-code-quality.js');
      const tester = new CodeQualityTester();

      tester.runCommand = vi.fn().mockResolvedValue('');
      tester.testFilePathReferences();

      expect(tester.results.warnings).toBeDefined();
    });

    it('should generate proper summary reports', async () => {
      const { default: CodeQualityTester } = await import('../test-code-quality.js');
      const tester = new CodeQualityTester();

      // Simulate some results
      tester.results.passed = 3;
      tester.results.failed = 1;
      tester.results.warnings = 1;
      tester.results.errors = [{ test: 'TypeScript', error: 'Failed', code: 1 }];
      tester.results.warnings = [{ test: 'File Paths', issues: ['Issue 1'] }];

      tester.generateSummary(10.5);

      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('Total execution time: 10.50 seconds')
      );
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('Tests passed: 3')
      );
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('Tests failed: 1')
      );
    });
  });

  describe('Command Execution', () => {
    it('should handle successful command execution', async () => {
      const { default: CodeQualityTester } = await import('../test-code-quality.js');
      const tester = new CodeQualityTester();

      execSync.mockReturnValue('Success output');

      const result = tester.runCommand('echo test', 'Test command');

      expect(result).toBe('Success output');
      expect(tester.results.passed).toBe(1);
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('✅ Test command passed')
      );
    });

    it('should handle command execution failures', async () => {
      const { default: CodeQualityTester } = await import('../test-code-quality.js');
      const tester = new CodeQualityTester();

      const error = new Error('Command failed');
      error.status = 1;
      execSync.mockImplementation(() => {
        throw error;
      });

      const result = tester.runCommand('failing-command', 'Failing test');

      expect(result).toBeNull();
      expect(tester.results.failed).toBe(1);
      expect(tester.results.errors).toHaveLength(1);
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('❌ Failing test failed')
      );
    });
  });

  describe('Logging', () => {
    it('should format log messages with colors and timestamps', async () => {
      const { default: CodeQualityTester } = await import('../test-code-quality.js');
      const tester = new CodeQualityTester();

      tester.log('Test message', 'success');

      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringMatching(/^\x1b\[32m\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] Test message\x1b\[0m$/)
      );
    });

    it('should use different colors for different log types', async () => {
      const { default: CodeQualityTester } = await import('../test-code-quality.js');
      const tester = new CodeQualityTester();

      tester.log('Error message', 'error');
      tester.log('Warning message', 'warning');
      tester.log('Info message', 'info');

      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringMatching(/\x1b\[31m\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] Error message\x1b\[0m/)
      );
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringMatching(/\x1b\[33m\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] Warning message\x1b\[0m/)
      );
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringMatching(/\x1b\[36m\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] Info message\x1b\[0m/)
      );
    });
  });
});