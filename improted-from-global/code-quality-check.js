#!/usr/bin/env node

/**
 * Code Quality Check - Focused on Variables, Paths, and Code Issues
 * A simpler, more reliable version of the comprehensive test
 */

import { execSync } from 'child_process';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class CodeQualityChecker {
  constructor() {
    this.issues = {
      variables: [],
      filePaths: [],
      formatting: [],
      other: []
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

  // Check 1: Variable Analysis using existing ESLint setup
  checkVariables() {
    this.log('🔍 Checking for unused variables and declarations...', 'info');

    try {
      // Use the existing lint script which we know works
      const result = execSync('npm run lint', {
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: 'pipe'
      });

      // Parse the output for variable-related issues
      const lines = result.split('\n');
      const varIssues = lines.filter(line =>
        line.includes('no-unused-vars') ||
        line.includes('no-undef') ||
        line.includes('declared but never used') ||
        line.includes('is not defined')
      );

      if (varIssues.length > 0) {
        this.issues.variables = varIssues.map(line => ({
          type: 'variable-issue',
          message: line.trim(),
          severity: line.includes('error') ? 'error' : 'warning'
        }));
        this.log(`Found ${varIssues.length} variable-related issues`, 'warning');
      } else {
        this.log('✅ No variable issues found', 'success');
      }
    } catch (error) {
      // ESLint exits with code > 0 when there are issues, which is expected
      const output = error.stdout || error.stderr || '';
      const lines = output.split('\n');
      const varIssues = lines.filter(line =>
        line.includes('no-unused-vars') ||
        line.includes('no-undef') ||
        line.includes('declared but never used') ||
        line.includes('is not defined')
      );

      if (varIssues.length > 0) {
        this.issues.variables = varIssues.map(line => ({
          type: 'variable-issue',
          message: line.trim(),
          severity: line.includes('error') ? 'error' : 'warning'
        }));
        this.log(`Found ${varIssues.length} variable-related issues`, 'warning');
      }
    }
  }

  // Check 2: File Path References (improved version)
  checkFilePaths() {
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
            // Skip Node.js built-ins, scoped packages, and relative imports
            if (!importPath.startsWith('@') && !importPath.startsWith('.') && !importPath.startsWith('/') && !nodeBuiltIns.has(importPath)) {
              // Check if it's a valid npm package
              try {
                execSync(`npm list ${importPath}`, { stdio: 'pipe', cwd: __dirname });
              } catch (e) {
                issues.push({
                  file: filePath,
                  line: index + 1,
                  type: 'missing-import',
                  message: `Import '${importPath}' may not be installed or available`,
                  path: importPath
                });
              }
            }
          }

          // Check for require statements
          const requireMatch = line.match(/require\s*\(\s*['"]([^'"]+)['"]\s*\)/);
          if (requireMatch) {
            const requirePath = requireMatch[1];
            // Skip Node.js built-ins and relative imports
            if (!requirePath.startsWith('.') && !requirePath.startsWith('/') && !nodeBuiltIns.has(requirePath)) {
              try {
                execSync(`npm list ${requirePath}`, { stdio: 'pipe', cwd: __dirname });
              } catch (e) {
                issues.push({
                  file: filePath,
                  line: index + 1,
                  type: 'missing-require',
                  message: `Require '${requirePath}' may not be installed or available`,
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
      try {
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
      } catch (e) {
        // Skip directories that can't be read
      }
    }

    scanDirectory(this.projectRoot);

    this.issues.filePaths = issues;

    if (issues.length > 0) {
      this.log(`Found ${issues.length} file path issues`, 'warning');
    } else {
      this.log('✅ All file path references appear valid', 'success');
    }
  }

  // Check 3: Code Formatting Issues
  checkFormatting() {
    this.log('🔍 Checking code formatting...', 'info');

    try {
      execSync('npx prettier --check "**/*.{js,jsx,ts,tsx,json,md}" --ignore-path .prettierignore', {
        cwd: this.projectRoot,
        stdio: 'pipe'
      });
      this.log('✅ Code formatting is correct', 'success');
    } catch (error) {
      const output = error.stdout || error.stderr || '';
      const outputStr = typeof output === 'string' ? output : output.toString();
      const lines = outputStr.split('\n').filter(line => line.includes('[warn]'));
      this.issues.formatting = lines.map(line => ({
        type: 'formatting-issue',
        message: line.replace('[warn] ', '').trim(),
        severity: 'warning'
      }));
      this.log(`Found ${lines.length} formatting issues`, 'warning');
    }
  }

  // Check 4: TypeScript Type Issues
  checkTypes() {
    this.log('🔍 Checking TypeScript types...', 'info');

    try {
      execSync('npx tsc --noEmit', {
        cwd: this.projectRoot,
        stdio: 'pipe'
      });
      this.log('✅ TypeScript compilation successful', 'success');
    } catch (error) {
      const output = error.stdout || error.stderr || '';
      const outputStr = typeof output === 'string' ? output : output.toString();
      const lines = outputStr.split('\n').filter(line =>
        line.includes('error TS') ||
        line.includes('is not assignable') ||
        line.includes('does not exist on type')
      );
      this.issues.other = this.issues.other.concat(lines.map(line => ({
        type: 'type-error',
        message: line.trim(),
        severity: 'error'
      })));
      this.log(`Found ${lines.length} TypeScript type issues`, 'warning');
    }
  }

  // Check 5: Syntax and Basic Code Issues
  checkSyntax() {
    this.log('🔍 Checking for syntax and basic code issues...', 'info');

    try {
      execSync('node -c test-code-quality.js', { cwd: this.projectRoot, stdio: 'pipe' });
      this.log('✅ Basic syntax check passed', 'success');
    } catch (error) {
      this.issues.other.push({
        type: 'syntax-error',
        message: `Syntax error in test file: ${error.message}`,
        severity: 'error'
      });
      this.log('❌ Syntax error found', 'error');
    }
  }

  // Run all checks
  runChecks() {
    this.log('🚀 Starting Code Quality Check', 'info');
    this.log('=' .repeat(50), 'info');

    const startTime = Date.now();

    this.checkVariables();
    this.checkFilePaths();
    this.checkFormatting();
    this.checkTypes();
    this.checkSyntax();

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    this.generateReport(duration);
  }

  generateReport(duration) {
    this.log('=' .repeat(50), 'info');
    this.log('📊 CODE QUALITY REPORT', 'info');
    this.log('=' .repeat(50), 'info');

    this.log(`⏱️  Execution time: ${duration.toFixed(2)} seconds`, 'info');

    const totalIssues = this.issues.variables.length + this.issues.filePaths.length +
                       this.issues.formatting.length + this.issues.other.length;

    this.log(`📋 Total issues found: ${totalIssues}`, totalIssues > 0 ? 'warning' : 'success');

    // Report by category
    if (this.issues.variables.length > 0) {
      this.log(`\n🔍 VARIABLE ISSUES (${this.issues.variables.length}):`, 'warning');
      this.issues.variables.slice(0, 10).forEach(issue => {
        this.log(`  • ${issue.message}`, issue.severity === 'error' ? 'error' : 'warning');
      });
      if (this.issues.variables.length > 10) {
        this.log(`  ... and ${this.issues.variables.length - 10} more`, 'warning');
      }
    }

    if (this.issues.filePaths.length > 0) {
      this.log(`\n📁 FILE PATH ISSUES (${this.issues.filePaths.length}):`, 'warning');
      this.issues.filePaths.slice(0, 10).forEach(issue => {
        this.log(`  • ${issue.file}:${issue.line} - ${issue.message}`, 'warning');
      });
      if (this.issues.filePaths.length > 10) {
        this.log(`  ... and ${this.issues.filePaths.length - 10} more`, 'warning');
      }
    }

    if (this.issues.formatting.length > 0) {
      this.log(`\n🎨 FORMATTING ISSUES (${this.issues.formatting.length}):`, 'warning');
      this.issues.formatting.slice(0, 10).forEach(issue => {
        this.log(`  • ${issue.message}`, 'warning');
      });
      if (this.issues.formatting.length > 10) {
        this.log(`  ... and ${this.issues.formatting.length - 10} more`, 'warning');
      }
    }

    if (this.issues.other.length > 0) {
      this.log(`\n⚠️  OTHER ISSUES (${this.issues.other.length}):`, 'warning');
      this.issues.other.slice(0, 10).forEach(issue => {
        this.log(`  • ${issue.message}`, issue.severity === 'error' ? 'error' : 'warning');
      });
      if (this.issues.other.length > 10) {
        this.log(`  ... and ${this.issues.other.length - 10} more`, 'warning');
      }
    }

    const status = totalIssues === 0 ? '✅ PASSED' : '⚠️  ISSUES FOUND';
    this.log(`\n🎯 Overall Status: ${status}`, totalIssues === 0 ? 'success' : 'warning');

    if (totalIssues > 0) {
      this.log('\n💡 Recommendations:', 'info');
      this.log('  • Run "npm run lint:fix" to auto-fix some issues', 'info');
      this.log('  • Run "npx prettier --write ." to fix formatting', 'info');
      this.log('  • Check TypeScript errors and fix type issues', 'info');
      this.log('  • Review file path imports for missing dependencies', 'info');
    } else {
      this.log('\n🎉 All checks passed! Code quality looks good.', 'success');
    }
  }
}

// Export for testing
export default CodeQualityChecker;

// Run the checks if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const checker = new CodeQualityChecker();
  checker.runChecks();
}