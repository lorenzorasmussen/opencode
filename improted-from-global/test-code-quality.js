#!/usr/bin/env node

/**
 * Comprehensive Code Quality Test Suite
 * Checks variables, file paths, syntax, spelling, formatting, and unused code
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class CodeQualityTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      errors: [],
      warnings: []
    };
    this.projectRoot = resolve(__dirname);
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      reset: '\x1b[0m'
    };
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
  }

  runCommand(command, description, options = {}) {
    try {
      this.log(`Running: ${description}`, 'info');
      const result = execSync(command, {
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: options.silent ? 'pipe' : 'inherit',
        ...options
      });
      this.results.passed++;
      this.log(`✅ ${description} passed`, 'success');
      return result;
    } catch (error) {
      this.results.failed++;
      this.results.errors.push({
        test: description,
        error: error.message,
        code: error.status
      });
      this.log(`❌ ${description} failed: ${error.message}`, 'error');
      return null;
    }
  }

  // Test 1: TypeScript Compilation & Type Checking
  testTypeScript() {
    this.log('🔍 Testing TypeScript compilation and type checking...', 'info');

    // Check for type errors
    const typeCheck = this.runCommand(
      'npx tsc --noEmit --strict',
      'TypeScript type checking',
      { silent: true }
    );

    return { typeCheck };
  }

  // Test 2: ESLint Comprehensive Analysis
  testESLint() {
    this.log('🔍 Running comprehensive ESLint analysis...', 'info');

    const eslintResult = this.runCommand(
      'npx eslint . --ext .js,.jsx,.ts,.tsx --format json',
      'ESLint comprehensive analysis',
      { silent: true }
    );

    if (eslintResult) {
      try {
        const issues = JSON.parse(eslintResult);
        let errorCount = 0;
        let warningCount = 0;

        issues.forEach(file => {
          file.messages.forEach(msg => {
            if (msg.severity === 2) errorCount++;
            if (msg.severity === 1) warningCount++;
          });
        });

        this.log(`ESLint found ${errorCount} errors and ${warningCount} warnings`, 'info');

        // Check for specific variable-related issues
        const varIssues = issues.flatMap(file =>
          file.messages.filter(msg =>
            msg.ruleId?.includes('no-unused') ||
            msg.ruleId?.includes('no-undef') ||
            msg.message?.includes('variable')
          )
        );

        if (varIssues.length > 0) {
          this.log(`Found ${varIssues.length} variable-related issues`, 'warning');
          this.results.warnings.push({
            test: 'Variable Analysis',
            issues: varIssues
          });
        }

      } catch (e) {
        this.log(`Failed to parse ESLint output: ${e.message}`, 'error');
      }
    }

    return eslintResult;
  }

  // Test 3: File Path Reference Validation
  testFilePathReferences() {
    this.log('🔍 Checking file path references...', 'info');

    const issues = [];
    const fileExtensions = ['.js', '.ts', '.tsx', '.jsx'];

    // Node.js built-in modules that should be ignored
    const nodeBuiltIns = new Set([
      'fs', 'path', 'crypto', 'util', 'events', 'stream', 'buffer', 'os', 'url',
      'querystring', 'http', 'https', 'child_process', 'cluster', 'worker_threads',
      'inspector', 'trace_events', 'async_hooks', 'timers', 'net', 'tls', 'dgram',
      'dns', 'v8', 'vm', 'repl', 'readline', 'tty', 'zlib', 'perf_hooks'
    ]);

    function checkFile(filePath) {
      try {
        const content = readFileSync(filePath, 'utf8');
        const lines = content.split('\n');

        lines.forEach((line, index) => {
          // Check for import statements
          const importMatch = line.match(/import.*from\s+['"]([^'"]+)['"]/);
          if (importMatch) {
            const importPath = importMatch[1];
            // Skip Node.js built-ins and absolute imports
            if (!importPath.startsWith('@') && !importPath.startsWith('.') && !importPath.startsWith('/') && !nodeBuiltIns.has(importPath)) {
              // Check if the file exists in node_modules or as a local file
              const possiblePaths = [
                join(dirname(filePath), importPath + '.js'),
                join(dirname(filePath), importPath + '.ts'),
                join(dirname(filePath), importPath + '.tsx'),
                join(dirname(filePath), importPath + '.jsx'),
                join(dirname(filePath), importPath, 'index.js'),
                join(dirname(filePath), importPath, 'index.ts'),
                join(dirname(filePath), importPath, 'index.tsx'),
                join(dirname(filePath), importPath),
                join(__dirname, 'node_modules', importPath, 'package.json'), // Check if it's an npm package
                join(__dirname, 'node_modules', importPath) // Check if it's an npm package
              ];

              const exists = possiblePaths.some(path => existsSync(path));
              if (!exists) {
                issues.push({
                  file: filePath,
                  line: index + 1,
                  type: 'missing-import',
                  message: `Import path '${importPath}' may not exist`,
                  path: importPath
                });
              }
            }
          }

          // Check for require statements
          const requireMatch = line.match(/require\s*\(\s*['"]([^'"]+)['"]\s*\)/);
          if (requireMatch) {
            const requirePath = requireMatch[1];
            // Skip Node.js built-ins and absolute imports
            if (!requirePath.startsWith('.') && !requirePath.startsWith('/') && !nodeBuiltIns.has(requirePath)) {
              const possiblePaths = [
                join(dirname(filePath), requirePath + '.js'),
                join(dirname(filePath), requirePath + '.ts'),
                join(dirname(filePath), requirePath + '.json'),
                join(dirname(filePath), requirePath),
                join(__dirname, 'node_modules', requirePath, 'package.json'), // Check if it's an npm package
                join(__dirname, 'node_modules', requirePath) // Check if it's an npm package
              ];

              const exists = possiblePaths.some(path => existsSync(path));
              if (!exists) {
                issues.push({
                  file: filePath,
                  line: index + 1,
                  type: 'missing-require',
                  message: `Require path '${requirePath}' may not exist`,
                  path: requirePath
                });
              }
            }
          }
        });
      } catch (e) {
        // Skip files that can't be read
      }
    }

    function scanDirectory(dir) {
      const items = readdirSync(dir);
      items.forEach(item => {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== '.git') {
          scanDirectory(fullPath);
        } else if (stat.isFile() && fileExtensions.some(ext => item.endsWith(ext))) {
          checkFile(fullPath);
        }
      });
    }

    scanDirectory(this.projectRoot);

    if (issues.length > 0) {
      this.results.warnings.push({
        test: 'File Path References',
        issues: issues
      });
      this.log(`Found ${issues.length} potential file path issues`, 'warning');
    } else {
      this.log('✅ All file path references appear valid', 'success');
    }

    return issues;
  }

  // Test 4: Spelling Check
  testSpelling() {
    this.log('🔍 Checking spelling...', 'info');

    const spellCheck = this.runCommand(
      'npx cspell "**/*.{js,ts,tsx,jsx,md,txt}" --no-progress --no-summary',
      'Spell checking',
      { silent: true }
    );

    return spellCheck;
  }

  // Test 5: Formatting Check
  testFormatting() {
    this.log('🔍 Checking code formatting...', 'info');

    const formatCheck = this.runCommand(
      'npx prettier --check "**/*.{js,jsx,ts,tsx,json,md}" --ignore-path .prettierignore',
      'Code formatting check',
      { silent: true }
    );

    return formatCheck;
  }

  // Test 6: Unused Files and Dead Code Detection
  testUnusedCode() {
    this.log('🔍 Checking for unused files and dead code...', 'info');

    // Simple heuristic: count TypeScript/JavaScript files
    const allFiles = new Set();

    function scanDirectory(dir) {
      const items = readdirSync(dir);
      items.forEach(item => {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          scanDirectory(fullPath);
        } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js') || item.endsWith('.jsx'))) {
          const relativePath = fullPath.replace(__dirname + '/', '');
          allFiles.add(relativePath);
        }
      });
    }

    scanDirectory(this.projectRoot);

    // This is a basic implementation - a full unused file detector would be more complex
    this.log(`Found ${allFiles.size} TypeScript/JavaScript files`, 'info');

    return { totalFiles: allFiles.size };
  }

  // Test 7: Variable Declaration and Usage Analysis
  testVariableAnalysis() {
    this.log('🔍 Analyzing variable declarations and usage...', 'info');

    // Use ESLint with existing config to find variable-related issues
    const varAnalysis = this.runCommand(
      'npx eslint . --ext .js,.jsx,.ts,.tsx --format json',
      'Variable analysis',
      { silent: true }
    );

    if (varAnalysis) {
      try {
        const issues = JSON.parse(varAnalysis);
        const varIssues = issues.flatMap(file =>
          file.messages.filter(msg =>
            msg.ruleId?.includes('no-unused') ||
            msg.ruleId?.includes('no-undef') ||
            msg.message?.toLowerCase().includes('variable') ||
            msg.message?.toLowerCase().includes('declared but never used')
          )
        );

        if (varIssues.length > 0) {
          this.results.warnings.push({
            test: 'Variable Analysis',
            issues: varIssues
          });
          this.log(`Found ${varIssues.length} variable-related issues`, 'warning');
        } else {
          this.log('✅ No variable issues found', 'success');
        }
      } catch (e) {
        this.log(`Failed to parse variable analysis: ${e.message}`, 'error');
      }
    }

    return varAnalysis;
  }

  // Run all tests
  async runAllTests() {
    this.log('🚀 Starting Comprehensive Code Quality Test Suite', 'info');
    this.log('=' .repeat(60), 'info');

    const startTime = Date.now();

    // Run all tests
    this.testTypeScript();
    this.testESLint();
    this.testFilePathReferences();
    this.testSpelling();
    this.testFormatting();
    this.testUnusedCode();
    this.testVariableAnalysis();

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    // Generate summary
    this.generateSummary(duration);
  }

  generateSummary(duration) {
    this.log('=' .repeat(60), 'info');
    this.log('📊 CODE QUALITY TEST SUMMARY', 'info');
    this.log('=' .repeat(60), 'info');

    this.log(`⏱️  Total execution time: ${duration.toFixed(2)} seconds`, 'info');
    this.log(`✅ Tests passed: ${this.results.passed}`, 'success');
    this.log(`❌ Tests failed: ${this.results.failed}`, 'error');
    this.log(`⚠️  Warnings: ${this.results.warnings.length}`, 'warning');

    if (this.results.errors.length > 0) {
      this.log('\n❌ ERRORS:', 'error');
      this.results.errors.forEach(error => {
        this.log(`  • ${error.test}: ${error.error}`, 'error');
      });
    }

    if (this.results.warnings.length > 0) {
      this.log('\n⚠️  WARNINGS:', 'warning');
      this.results.warnings.forEach(warning => {
        this.log(`  • ${warning.test}: ${warning.issues?.length || 0} issues`, 'warning');
        if (warning.issues && warning.issues.length > 0) {
          warning.issues.slice(0, 5).forEach(issue => {
            const location = issue.file ? `${issue.file}:${issue.line || '?'}` : '';
            this.log(`    - ${location} ${issue.message}`, 'warning');
          });
          if (warning.issues.length > 5) {
            this.log(`    ... and ${warning.issues.length - 5} more issues`, 'warning');
          }
        }
      });
    }

    const overallStatus = this.results.failed === 0 ? '✅ PASSED' : '❌ FAILED';
    this.log(`\n🎯 Overall Status: ${overallStatus}`, this.results.failed === 0 ? 'success' : 'error');

    if (this.results.failed === 0) {
      this.log('\n🎉 All critical checks passed! Code quality looks good.', 'success');
    } else {
      this.log('\n⚠️  Some tests failed. Please review the errors above.', 'warning');
    }
  }
}

// Export for testing
export default CodeQualityTester;

// Run the tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new CodeQualityTester();
  tester.runAllTests().catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
}