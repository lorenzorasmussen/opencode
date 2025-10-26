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

// Import after mocking
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

describe('CodeQualityChecker', () => {
  let checker;
  let mockConsole;

  beforeEach(async () => {
    // Reset all mocks
    vi.clearAllMocks();

    // Mock console methods
    mockConsole = {
      log: vi.fn(),
      error: vi.fn(),
      warn: vi.fn()
    };
    global.console = mockConsole;

    // Mock path functions
    resolve.mockReturnValue('/mock/project/root');
    dirname.mockReturnValue('/mock/project');

    // Mock fileURLToPath
    fileURLToPath.mockReturnValue('/mock/project/test-file.js');

    // Import the module after mocking
    const { default: CodeQualityChecker } = await import('../code-quality-check.js');
    checker = new CodeQualityChecker();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with empty issues and correct project root', () => {
      expect(checker.issues).toEqual({
        variables: [],
        filePaths: [],
        formatting: [],
        other: []
      });
      expect(checker.projectRoot).toBe('/mock/project/root');
    });
  });

  describe('Logging', () => {
    it('should log messages with timestamps and colors', () => {
      checker.log('Test message', 'success');

      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringMatching(/^\x1b\[32m\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] Test message\x1b\[0m$/)
      );
    });

    it('should use info color by default', () => {
      checker.log('Info message');

      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringMatching(/^\x1b\[36m.*Info message\x1b\[0m$/)
      );
    });
  });

  describe('Variable Analysis', () => {
    it('should detect variable issues from ESLint output', async () => {
      // Mock successful ESLint run with variable issues
      execSync.mockReturnValue(`
        /path/to/file.js
          5:7  warning  'unusedVar' is assigned a value but never used  no-unused-vars
          10:12  error  'undefinedVar' is not defined  no-undef
      `);

      await checker.checkVariables();

      expect(checker.issues.variables).toHaveLength(2);
      expect(checker.issues.variables[0]).toMatchObject({
        type: 'variable-issue',
        message: expect.stringContaining('unusedVar'),
        severity: 'warning'
      });
      expect(checker.issues.variables[1]).toMatchObject({
        type: 'variable-issue',
        message: expect.stringContaining('undefinedVar'),
        severity: 'error'
      });
    });

    it('should handle ESLint errors gracefully', async () => {
      // Mock ESLint failure
      execSync.mockImplementation(() => {
        throw new Error('ESLint failed');
      });

      await checker.checkVariables();

      // Should not crash, issues should remain empty
      expect(checker.issues.variables).toHaveLength(0);
    });
  });

  describe('File Path Analysis', () => {
    beforeEach(() => {
      // Mock file system
      readdirSync.mockReturnValue(['test.js', 'subdir']);
      statSync.mockImplementation((path) => ({
        isDirectory: () => path.includes('subdir'),
        isFile: () => path.includes('.js')
      }));
      readFileSync.mockReturnValue(`
        import { something } from 'valid-package';
        import { another } from './local-file';
        import { missing } from 'nonexistent-package';
      `);
      existsSync.mockReturnValue(true);
      dirname.mockReturnValue('/mock/dir');
      join.mockImplementation((...args) => args.join('/'));
    });

    it('should detect missing package imports', async () => {
      // Mock npm list to fail for nonexistent package
      execSync.mockImplementation((cmd) => {
        if (cmd.includes('nonexistent-package')) {
          throw new Error('Package not found');
        }
        return '';
      });

      await checker.checkFilePaths();

      expect(checker.issues.filePaths).toContainEqual(
        expect.objectContaining({
          type: 'missing-import',
          message: expect.stringContaining('nonexistent-package')
        })
      );
    });

    it('should ignore Node.js built-in modules', async () => {
      readFileSync.mockReturnValue(`
        const fs = require('fs');
        const path = require('path');
        import { readFile } from 'fs';
      `);

      await checker.checkFilePaths();

      // Should not have any issues for built-in modules
      const builtinIssues = checker.issues.filePaths.filter(issue =>
        issue.message.includes('fs') || issue.message.includes('path')
      );
      expect(builtinIssues).toHaveLength(0);
    });
  });

  describe('Formatting Analysis', () => {
    it('should detect formatting issues', async () => {
      execSync.mockImplementation(() => {
        throw new Error('Prettier check failed');
      });

      // Mock stderr with formatting issues
      execSync.mockImplementationOnce(() => {
        const error = new Error('Formatting issues found');
        error.stderr = '[warn] file1.js\n[warn] file2.js\nCode style issues found in 2 files.';
        throw error;
      });

      await checker.checkFormatting();

      expect(checker.issues.formatting).toHaveLength(2);
      expect(checker.issues.formatting[0]).toMatchObject({
        type: 'formatting-issue',
        message: expect.stringContaining('file1.js'),
        severity: 'warning'
      });
    });

    it('should handle successful formatting check', async () => {
      execSync.mockReturnValue(''); // Success

      await checker.checkFormatting();

      expect(checker.issues.formatting).toHaveLength(0);
    });
  });

  describe('TypeScript Analysis', () => {
    it('should detect TypeScript compilation errors', async () => {
      execSync.mockImplementation(() => {
        throw new Error('TypeScript compilation failed');
      });

      execSync.mockImplementationOnce(() => {
        const error = new Error('TSC failed');
        error.stderr = 'file.ts(10,5): error TS1234: Some type error\nfile.ts(20,10): error TS5678: Another error';
        throw error;
      });

      await checker.checkTypes();

      expect(checker.issues.other).toHaveLength(2);
      expect(checker.issues.other[0]).toMatchObject({
        type: 'type-error',
        message: expect.stringContaining('TS1234'),
        severity: 'error'
      });
    });

    it('should handle successful TypeScript compilation', async () => {
      execSync.mockReturnValue(''); // Success

      await checker.checkTypes();

      expect(checker.issues.other).toHaveLength(0);
    });
  });

  describe('Syntax Analysis', () => {
    it('should detect syntax errors', async () => {
      execSync.mockImplementation(() => {
        throw new Error('Syntax error');
      });

      await checker.checkSyntax();

      expect(checker.issues.other).toContainEqual(
        expect.objectContaining({
          type: 'syntax-error',
          message: expect.stringContaining('Syntax error'),
          severity: 'error'
        })
      );
    });

    it('should pass when syntax is valid', async () => {
      execSync.mockReturnValue(''); // Success

      await checker.checkSyntax();

      const syntaxErrors = checker.issues.other.filter(issue => issue.type === 'syntax-error');
      expect(syntaxErrors).toHaveLength(0);
    });
  });

  describe('Report Generation', () => {
    it('should generate comprehensive report', async () => {
      // Add some mock issues
      checker.issues.variables = [
        { type: 'variable-issue', message: 'Unused variable', severity: 'warning' }
      ];
      checker.issues.filePaths = [
        { type: 'missing-import', message: 'Missing import', severity: 'error' }
      ];

      checker.generateReport(5.5);

      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('CODE QUALITY REPORT')
      );
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('Total issues found: 2')
      );
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('Overall Status: ⚠️  ISSUES FOUND')
      );
    });

    it('should show success message when no issues found', async () => {
      checker.generateReport(3.2);

      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('Overall Status: ✅ PASSED')
      );
      expect(mockConsole.log).toHaveBeenCalledWith(
        expect.stringContaining('All checks passed! Code quality looks good.')
      );
    });
  });
});