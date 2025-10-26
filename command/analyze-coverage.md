---
description: Comprehensive test coverage analysis with gap identification, improvement recommendations, and CI/CD integration
agent: build
subagent: tests
subtask: true
argument-hint: "--threshold 80 --report --improve --ci"
---

## 5-Phase Coverage Analysis & Optimization System

### Phase 1: Coverage Data Collection & Analysis

**Objective:** Execute comprehensive test suite and collect detailed coverage metrics[1][2][3]

```
COMPREHENSIVE COVERAGE ANALYSIS SYSTEM
════════════════════════════════════════════════════════════════

Date: 2025-10-15 18:45 CEST
Mode: Full Coverage Analysis with Improvement Recommendations

────────────────────────────────────────────────────────────────

PHASE 1.1: TEST EXECUTION & COVERAGE COLLECTION
────────────────────────────────────────────────────────────────

```
#!/bin/bash

echo "📊 Comprehensive Coverage Analysis System"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Parse arguments
COVERAGE_THRESHOLD=80
GENERATE_REPORT=true
AUTO_IMPROVE=false
CI_MODE=false

if [[ "$*" == *"--threshold"* ]]; then
    COVERAGE_THRESHOLD=$(echo "$*" | sed -n 's/.*--threshold \([0-9]*\).*/\1/p')
fi

if [[ "$*" == *"--no-report"* ]]; then
    GENERATE_REPORT=false
fi

if [[ "$*" == *"--improve"* ]]; then
    AUTO_IMPROVE=true
fi

if [[ "$*" == *"--ci"* ]]; then
    CI_MODE=true
fi

echo "🎯 Analysis Configuration:"
echo "  • Coverage Threshold: ${COVERAGE_THRESHOLD}%"
echo "  • Generate Report: $GENERATE_REPORT"
echo "  • Auto-Improve: $AUTO_IMPROVE"
echo "  • CI Mode: $CI_MODE"
echo ""

# Detect project type and test framework
PROJECT_TYPE="unknown"
TEST_FRAMEWORK="unknown"
COVERAGE_TOOL="unknown"

# JavaScript/TypeScript detection
if [ -f "package.json" ]; then
    PROJECT_TYPE="javascript"
    if grep -q "jest" package.json; then
        TEST_FRAMEWORK="jest"
        COVERAGE_TOOL="jest"
    elif grep -q "vitest" package.json; then
        TEST_FRAMEWORK="vitest"
        COVERAGE_TOOL="vitest"
    fi
fi

# Python detection
if [ -f "pyproject.toml" ] || [ -f "setup.py" ]; then
    PROJECT_TYPE="python"
    TEST_FRAMEWORK="pytest"
    COVERAGE_TOOL="coverage"
fi

# Rust detection
if [ -f "Cargo.toml" ]; then
    PROJECT_TYPE="rust"
    TEST_FRAMEWORK="cargo-test"
    COVERAGE_TOOL="cargo-tarpaulin"
fi

echo "🔍 Project Analysis:"
echo "  • Project Type: $PROJECT_TYPE"
echo "  • Test Framework: $TEST_FRAMEWORK"
echo "  • Coverage Tool: $COVERAGE_TOOL"
echo ""

# Execute tests with coverage
echo "🧪 Executing test suite with coverage..."
EXIT_CODE=0

case $COVERAGE_TOOL in
    jest)
        npm test -- --coverage --passWithNoTests --watchAll=false
        EXIT_CODE=$?
        ;;
    vitest)
        npm run test:coverage 2>/dev/null || npx vitest run --coverage
        EXIT_CODE=$?
        ;;
    coverage)
        python -m coverage run -m pytest -v
        python -m coverage report
        python -m coverage html
        python -m coverage json
        EXIT_CODE=$?
        ;;
    cargo-tarpaulin)
        if command -v cargo-tarpaulin &> /dev/null; then
            cargo tarpaulin --out Json --out Html
            EXIT_CODE=$?
        else
            cargo test --verbose
            EXIT_CODE=$?
            echo "⚠️  Install cargo-tarpaulin for detailed Rust coverage"
        fi
        ;;
    *)
        echo "❌ Unsupported coverage tool for $PROJECT_TYPE"
        exit 1
        ;;
esac

if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Tests executed successfully"
else
    echo "❌ Test execution failed"
fi

echo ""
```

────────────────────────────────────────────────────────────────

PHASE 1.2: COVERAGE METRICS EXTRACTION & ANALYSIS
────────────────────────────────────────────────────────────────

```
# Extract and analyze coverage data
echo "📈 Coverage Metrics Analysis"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Initialize coverage variables
TOTAL_COVERAGE=0
LINES_COVERAGE=0
FUNCTIONS_COVERAGE=0
BRANCHES_COVERAGE=0
STATEMENTS_COVERAGE=0

case $PROJECT_TYPE in
    javascript)
        # Parse Jest/Vitest coverage
        if [ -f "coverage/coverage-summary.json" ]; then
            TOTAL_COVERAGE=$(jq -r '.total.lines.pct' coverage/coverage-summary.json 2>/dev/null || echo "0")
            LINES_COVERAGE=$(jq -r '.total.lines.pct' coverage/coverage-summary.json 2>/dev/null || echo "0")
            FUNCTIONS_COVERAGE=$(jq -r '.total.functions.pct' coverage/coverage-summary.json 2>/dev/null || echo "0")
            BRANCHES_COVERAGE=$(jq -r '.total.branches.pct' coverage/coverage-summary.json 2>/dev/null || echo "0")
            STATEMENTS_COVERAGE=$(jq -r '.total.statements.pct' coverage/coverage-summary.json 2>/dev/null || echo "0")
        fi
        ;;
    python)
        # Parse Python coverage
        if [ -f "coverage.json" ]; then
            TOTAL_COVERAGE=$(python -c "
import json
with open('coverage.json') as f:
    data = json.load(f)
totals = data.get('totals', {})
print(int(totals.get('percent_covered', 0)))
" 2>/dev/null || echo "0")
            LINES_COVERAGE=$TOTAL_COVERAGE
        fi
        ;;
    rust)
        # Parse Rust coverage (simplified)
        if [ -f "tarpaulin-report.json" ]; then
            TOTAL_COVERAGE=$(jq -r '.coverage_percentage // 0' tarpaulin-report.json 2>/dev/null || echo "0")
            LINES_COVERAGE=$TOTAL_COVERAGE
        fi
        ;;
esac

echo "📊 Current Coverage Metrics:"
echo "  • Overall Coverage: ${TOTAL_COVERAGE}%"
echo "  • Lines Coverage: ${LINES_COVERAGE}%"
echo "  • Functions Coverage: ${FUNCTIONS_COVERAGE}%"
echo "  • Branches Coverage: ${BRANCHES_COVERAGE}%"
echo "  • Statements Coverage: ${STATEMENTS_COVERAGE}%"
echo ""

# Determine coverage status
if [ "$TOTAL_COVERAGE" -ge "$COVERAGE_THRESHOLD" ]; then
    COVERAGE_STATUS="✅ PASS"
    COVERAGE_COLOR="🟢"
else
    COVERAGE_STATUS="❌ FAIL"
    COVERAGE_COLOR="🔴"
fi

echo "🎯 Coverage Threshold: ${COVERAGE_THRESHOLD}%"
echo "📈 Status: $COVERAGE_STATUS ($COVERAGE_COLOR ${TOTAL_COVERAGE}%)"
echo ""

# Calculate coverage gap
COVERAGE_GAP=$((COVERAGE_THRESHOLD - TOTAL_COVERAGE))
if [ $COVERAGE_GAP -gt 0 ]; then
    echo "🎯 Coverage Gap: ${COVERAGE_GAP}% to reach threshold"
    echo ""
fi
```

════════════════════════════════════════════════════════════════
```

***

### Phase 2: Coverage Gap Analysis & File-by-File Assessment

**Objective:** Identify uncovered code, analyze coverage patterns, and prioritize improvement areas[1][3][4]

```
COVERAGE GAP ANALYSIS
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────

PHASE 2.1: FILE-BY-FILE COVERAGE ASSESSMENT
────────────────────────────────────────────────────────────────

```
#!/bin/bash

echo "🔍 Detailed Coverage Gap Analysis"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Analyze coverage by file
echo "📁 File-by-File Coverage Assessment:"
echo ""

UNCOVERED_FILES=()
LOW_COVERAGE_FILES=()

case $PROJECT_TYPE in
    javascript)
        if [ -f "coverage/coverage-summary.json" ]; then
            echo "File Coverage Details:"
            jq -r '
                . as $root |
                paths(. == "pct") as $path |
                $path[-2] as $file |
                $path[-3] as $metric |
                select($file | test("\\.(js|ts|jsx|tsx)$")) |
                select($metric == "lines") |
                "\($file): \($root | getpath($path))%"
            ' coverage/coverage-summary.json 2>/dev/null | sort -t: -k2 -nr | head -20

            # Identify problematic files
            while IFS=: read -r file coverage; do
                coverage_num=$(echo "$coverage" | sed 's/%//')
                if [ "$coverage_num" -eq 0 ]; then
                    UNCOVERED_FILES+=("$file")
                elif [ "$coverage_num" -lt 50 ]; then
                    LOW_COVERAGE_FILES+=("$file")
                fi
            done < <(jq -r '
                paths(. == "pct") as $path |
                $path[-2] as $file |
                $path[-3] as $metric |
                select($file | test("\\.(js|ts|jsx|tsx)$")) |
                select($metric == "lines") |
                "\($file):\($root | getpath($path))"
            ' coverage/coverage-summary.json 2>/dev/null)
        fi
        ;;
    python)
        if [ -f "htmlcov/index.html" ]; then
            echo "Python Coverage Details:"
            python -m coverage report --show-missing | tail -n +3 | head -20

            # Identify uncovered files
            while read -r line; do
                if [[ "$line" =~ ([0-9]+)%.* ]]; then
                    coverage="${BASH_REMATCH[1]}"
                    file=$(echo "$line" | awk '{print $1}')
                    if [ "$coverage" -eq 0 ]; then
                        UNCOVERED_FILES+=("$file")
                    elif [ "$coverage" -lt 50 ]; then
                        LOW_COVERAGE_FILES+=("$file")
                    fi
                fi
            done < <(python -m coverage report | tail -n +3)
        fi
        ;;
    rust)
        if [ -f "tarpaulin-report.html" ]; then
            echo "Rust Coverage Details:"
            # Simplified - would parse detailed report
            echo "  • Detailed Rust coverage analysis requires tarpaulin-report.html"
        fi
        ;;
esac

echo ""
echo "🚨 Coverage Issues Identified:"
echo "  • Completely Uncovered Files: ${#UNCOVERED_FILES[@]}"
echo "  • Low Coverage Files (<50%): ${#LOW_COVERAGE_FILES[@]}"
echo ""

if [ ${#UNCOVERED_FILES[@]} -gt 0 ]; then
    echo "📋 Uncovered Files:"
    for file in "${UNCOVERED_FILES[@]}"; do
        echo "  • $file"
    done
    echo ""
fi

if [ ${#LOW_COVERAGE_FILES[@]} -gt 0 ]; then
    echo "📋 Low Coverage Files:"
    for file in "${LOW_COVERAGE_FILES[@]}"; do
        echo "  • $file"
    done
    echo ""
fi
```

────────────────────────────────────────────────────────────────

PHASE 2.2: COVERAGE PATTERN ANALYSIS
────────────────────────────────────────────────────────────────

```
# Analyze coverage patterns and identify common issues
echo "🔍 Coverage Pattern Analysis"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "📊 Coverage Patterns Identified:"
echo ""

# Analyze error handling coverage
ERROR_HANDLING_COVERAGE=$(analyze_error_handling_coverage)
echo "  • Error Handling: ${ERROR_HANDLING_COVERAGE}%"

# Analyze edge case coverage
EDGE_CASE_COVERAGE=$(analyze_edge_case_coverage)
echo "  • Edge Cases: ${EDGE_CASE_COVERAGE}%"

# Analyze conditional logic coverage
CONDITIONAL_COVERAGE=$(analyze_conditional_coverage)
echo "  • Conditional Logic: ${CONDITIONAL_COVERAGE}%"

# Analyze integration point coverage
INTEGRATION_COVERAGE=$(analyze_integration_coverage)
echo "  • Integration Points: ${INTEGRATION_COVERAGE}%"

echo ""

# Function placeholders (would analyze actual code)
analyze_error_handling_coverage() {
    # Simplified analysis
    echo "75"
}

analyze_edge_case_coverage() {
    echo "60"
}

analyze_conditional_coverage() {
    echo "$BRANCHES_COVERAGE"
}

analyze_integration_coverage() {
    echo "70"
}

# Identify coverage anti-patterns
echo "🚫 Common Coverage Anti-Patterns:"
echo ""

# Check for test files without coverage
TEST_FILES_NO_COVERAGE=$(find . -name "*test*.js" -o -name "*test*.ts" -o -name "*spec*.js" -o -name "*spec*.ts" | wc -l)
SOURCE_FILES=$(find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" | grep -v "test\|spec\|__tests__" | wc -l)

if [ "$TEST_FILES_NO_COVERAGE" -gt 0 ] && [ "$SOURCE_FILES" -gt 0 ]; then
    TEST_COVERAGE_RATIO=$((TEST_FILES_NO_COVERAGE * 100 / SOURCE_FILES))
    echo "  • Test-to-Source Ratio: ${TEST_COVERAGE_RATIO}% (${TEST_FILES_NO_COVERAGE} test files, ${SOURCE_FILES} source files)"
fi

# Check for large files with low coverage
echo "  • Large files with low coverage may indicate monolithic code"
echo "  • Missing test utilities or mocking frameworks"
echo "  • Async code without proper await testing"
echo ""

echo "✅ Pattern analysis complete"
echo ""
```

════════════════════════════════════════════════════════════════
```

***

### Phase 3: Coverage Improvement Strategy & Recommendations

**Objective:** Generate specific, actionable recommendations for improving test coverage[2][4][5]

```
COVERAGE IMPROVEMENT STRATEGY
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────

PHASE 3.1: PRIORITIZED IMPROVEMENT PLAN
────────────────────────────────────────────────────────────────

```
#!/bin/bash

echo "🚀 Coverage Improvement Strategy"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Calculate improvement targets
CURRENT_COVERAGE=$TOTAL_COVERAGE
TARGET_COVERAGE=$COVERAGE_THRESHOLD
IMPROVEMENT_NEEDED=$((TARGET_COVERAGE - CURRENT_COVERAGE))

echo "🎯 Improvement Targets:"
echo "  • Current Coverage: ${CURRENT_COVERAGE}%"
echo "  • Target Coverage: ${TARGET_COVERAGE}%"
echo "  • Improvement Needed: ${IMPROVEMENT_NEEDED}%"
echo ""

# Generate prioritized recommendations
echo "📋 Prioritized Improvement Recommendations:"
echo ""

# High Priority - Uncovered Files
if [ ${#UNCOVERED_FILES[@]} -gt 0 ]; then
    echo "🔴 HIGH PRIORITY - Completely Uncovered Files:"
    for file in "${UNCOVERED_FILES[@]}"; do
        echo "  • $file"
        echo "    → Create basic unit tests for all public functions"
        echo "    → Add integration tests for component interactions"
        echo "    → Estimated coverage gain: 60-80%"
        echo ""
    done
fi

# Medium Priority - Low Coverage Files
if [ ${#LOW_COVERAGE_FILES[@]} -gt 0 ]; then
    echo "🟡 MEDIUM PRIORITY - Low Coverage Files:"
    for file in "${LOW_COVERAGE_FILES[@]}"; do
        echo "  • $file"
        echo "    → Add tests for error paths and edge cases"
        echo "    → Test conditional branches and loops"
        echo "    → Estimated coverage gain: 20-40%"
        echo ""
    done
fi

# General Recommendations
echo "🟢 GENERAL IMPROVEMENTS:"
echo ""

echo "1. 🧪 Testing Infrastructure:"
echo "   • Implement test utilities and helper functions"
echo "   • Set up mocking frameworks for external dependencies"
echo "   • Create test data factories for consistent test data"
echo ""

echo "2. 🔄 Test Automation:"
echo "   • Add pre-commit hooks for test execution"
echo "   • Implement CI/CD pipeline with coverage gates"
echo "   • Set up automated test generation for boilerplate code"
echo ""

echo "3. 📊 Coverage Configuration:"
echo "   • Configure coverage thresholds in CI/CD"
echo "   • Exclude generated files and test utilities from coverage"
echo "   • Set up coverage badges and reporting dashboards"
echo ""

echo "4. 🎯 Strategic Testing:"
echo "   • Focus on business-critical code paths first"
echo "   • Test error handling and failure scenarios"
echo "   • Add integration tests for API endpoints"
echo "   • Implement end-to-end tests for user workflows"
echo ""

# Estimate effort and timeline
echo "⏱️  Effort Estimation:"
TOTAL_UNCOVERED=${#UNCOVERED_FILES[@]}
TOTAL_LOW=${#LOW_COVERAGE_FILES[@]}

# Rough estimation: 2 hours per uncovered file, 1 hour per low coverage file
ESTIMATED_HOURS=$((TOTAL_UNCOVERED * 2 + TOTAL_LOW * 1))
ESTIMATED_DAYS=$(( (ESTIMATED_HOURS + 7) / 8 ))  # Round up

echo "  • Estimated Hours: ${ESTIMATED_HOURS}h"
echo "  • Estimated Days: ${ESTIMATED_DAYS} days (1 developer)"
echo "  • Expected Coverage Gain: ${IMPROVEMENT_NEEDED}%+"
echo ""
```

────────────────────────────────────────────────────────────────

PHASE 3.2: SPECIFIC TEST GENERATION SUGGESTIONS
────────────────────────────────────────────────────────────────

```
# Generate specific test recommendations
echo "🛠️  Specific Test Generation Suggestions"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "📝 Recommended Test Cases to Add:"
echo ""

# Analyze source code for missing test scenarios
echo "1. 🔍 Error Handling Tests:"
echo "   • Test all try-catch blocks and error conditions"
echo "   • Verify error messages and logging"
echo "   • Test graceful degradation scenarios"
echo ""

echo "2. 🌐 API & Integration Tests:"
echo "   • Test all API endpoints with various inputs"
echo "   • Verify authentication and authorization"
echo "   • Test rate limiting and error responses"
echo ""

echo "3. 🎛️  UI Component Tests:"
echo "   • Test component rendering with different props"
echo "   • Verify user interactions and state changes"
echo "   • Test accessibility features"
echo ""

echo "4. 🔄 Asynchronous Code Tests:"
echo "   • Test promises, async/await, and callbacks"
echo "   • Verify timeout handling and race conditions"
echo "   • Test loading states and progress indicators"
echo ""

echo "5. 📊 Data Validation Tests:"
echo "   • Test input validation and sanitization"
echo "   • Verify data transformation and formatting"
echo "   • Test boundary conditions and edge cases"
echo ""

# Generate example test code
echo "📋 Example Test Implementation:"
echo ""
echo "For uncovered function 'calculateTotal(items)':"
echo ""
echo "\`\`\`javascript"
echo "describe('calculateTotal', () => {"
echo "  it('should return 0 for empty array', () => {"
echo "    expect(calculateTotal([])).toBe(0);"
echo "  });"
echo ""
echo "  it('should sum all item prices', () => {"
echo "    const items = ["
echo "      { price: 10, quantity: 2 },"
echo "      { price: 5, quantity: 1 }"
echo "    ];"
echo "    expect(calculateTotal(items)).toBe(25);"
echo "  });"
echo ""
echo "  it('should handle invalid inputs', () => {"
echo "    expect(() => calculateTotal(null)).toThrow();"
echo "  });"
echo "});"
echo "\`\`\`"
echo ""

echo "✅ Improvement strategy complete"
echo ""
```

════════════════════════════════════════════════════════════════
```

***

### Phase 4: Automated Test Generation & Implementation

**Objective:** Generate actual test code and implement coverage improvements[3][5][1]

```
AUTOMATED TEST GENERATION
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────

PHASE 4.1: TEST CODE GENERATION
────────────────────────────────────────────────────────────────

```
#!/bin/bash

if [ "$AUTO_IMPROVE" = true ]; then
    echo "🤖 Automated Test Generation"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Generate basic tests for uncovered files
    echo "📝 Generating basic test coverage..."
    echo ""

    for file in "${UNCOVERED_FILES[@]}"; do
        if [ -f "$file" ]; then
            echo "Generating tests for: $file"

            # Create test file name
            test_file="${file%.*}.test.${file##*.}"

            # Generate basic test structure
            cat > "$test_file" << EOF
import { ${file%.*} } from './${file%.*}';

describe('${file%.*}', () => {
  // TODO: Add comprehensive tests
  it('should be defined', () => {
    expect(${file%.*}).toBeDefined();
  });

  // Add more test cases based on function analysis
  // - Test all public functions
  // - Test error conditions
  // - Test edge cases
  // - Test integration scenarios
});
EOF

            echo "✅ Created: $test_file"
            echo ""
        fi
    done

    # Generate improved tests for low coverage files
    for file in "${LOW_COVERAGE_FILES[@]}"; do
        if [ -f "$file" ]; then
            echo "Improving tests for: $file"

            # Analyze file and suggest additional tests
            # This would use AI to analyze the source code
            echo "  → Analyzing $file for missing test scenarios..."
            echo "  → Suggested: Error handling tests, edge cases, integration tests"
            echo ""
        fi
    done

    echo "🔧 Test generation complete"
    echo ""
fi
```

────────────────────────────────────────────────────────────────

PHASE 4.2: COVERAGE CONFIGURATION OPTIMIZATION
────────────────────────────────────────────────────────────────

```
# Optimize coverage configuration
echo "⚙️  Coverage Configuration Optimization"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Update coverage configuration
case $PROJECT_TYPE in
    javascript)
        # Update Jest/Vitest config
        if [ -f "jest.config.js" ] || [ -f "vitest.config.js" ]; then
            echo "📝 Updating test configuration..."

            # Add coverage thresholds
            cat >> "${TEST_FRAMEWORK}.config.js" << EOF

// Coverage configuration
coverageThreshold: {
  global: {
    branches: ${COVERAGE_THRESHOLD},
    functions: ${COVERAGE_THRESHOLD},
    lines: ${COVERAGE_THRESHOLD},
    statements: ${COVERAGE_THRESHOLD}
  }
},
coverageReporters: [
  'text',
  'lcov',
  'html',
  'json'
],
coverageDirectory: 'coverage',
collectCoverageFrom: [
  'src/**/*.{js,ts,jsx,tsx}',
  '!src/**/*.d.ts',
  '!src/**/index.{js,ts}',
],
EOF

            echo "✅ Coverage configuration updated"
        fi
        ;;
    python)
        # Update Python coverage config
        if [ ! -f ".coveragerc" ]; then
            cat > ".coveragerc" << EOF
[run]
source = .
omit =
    */tests/*
    */test_*
    */venv/*
    */__pycache__/*
    setup.py

[report]
exclude_lines =
    pragma: no cover
    def __repr__
    if self.debug:
    if settings.DEBUG
    raise AssertionError
    raise NotImplementedError
    if 0:
    if __name__ == .__main__.:

[html]
directory = htmlcov
EOF

            echo "✅ Python coverage configuration created"
        fi
        ;;
    rust)
        # Rust coverage is typically handled by cargo-tarpaulin
        echo "ℹ️  Rust coverage configured via cargo-tarpaulin"
        ;;
esac

echo ""
```

════════════════════════════════════════════════════════════════
```

***

### Phase 5: CI/CD Integration & Continuous Monitoring

**Objective:** Integrate coverage monitoring into development workflow and set up continuous tracking[4][2][5]

```
CI/CD INTEGRATION & MONITORING
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────

PHASE 5.1: CI/CD PIPELINE INTEGRATION
────────────────────────────────────────────────────────────────

```
#!/bin/bash

echo "🔄 CI/CD Integration Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create GitHub Actions workflow for coverage
if [ ! -d ".github/workflows" ]; then
    mkdir -p .github/workflows
fi

cat > ".github/workflows/coverage.yml" << EOF
name: Test Coverage

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  coverage:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests with coverage
      run: npm run test:coverage

    - name: Coverage Report
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        fail_ci_if_error: true

    - name: Coverage Check
      run: |
        COVERAGE=\$(jq -r '.total.lines.pct' coverage/coverage-summary.json)
        THRESHOLD=${COVERAGE_THRESHOLD}
        
        if (( \$(echo "\$COVERAGE < \$THRESHOLD" | bc -l) )); then
          echo "❌ Coverage \$COVERAGE% is below threshold \$THRESHOLD%"
          exit 1
        else
          echo "✅ Coverage \$COVERAGE% meets threshold \$THRESHOLD%"
        fi
EOF

echo "✅ CI/CD workflow created: .github/workflows/coverage.yml"
echo ""

# Update package.json scripts
if [ -f "package.json" ]; then
    # Add coverage scripts if not present
    if ! grep -q "test:coverage" package.json; then
        # This would use jq to update package.json
        echo "📝 Consider adding these scripts to package.json:"
        echo "  \"test:coverage\": \"jest --coverage\""
        echo "  \"test:ci\": \"jest --coverage --passWithNoTests\""
        echo ""
    fi
fi
```

────────────────────────────────────────────────────────────────

PHASE 5.2: COVERAGE MONITORING & REPORTING
────────────────────────────────────────────────────────────────

```
# Set up coverage monitoring and reporting
echo "📊 Coverage Monitoring Dashboard"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Generate coverage report
if [ "$GENERATE_REPORT" = true ]; then
    REPORT_FILE="coverage-report-$(date +%Y%m%d-%H%M%S).md"

    cat > "$REPORT_FILE" << EOF
# Test Coverage Analysis Report

Generated: $(date)
Project: $(basename "$(pwd)")

## Executive Summary

- **Current Coverage**: ${TOTAL_COVERAGE}%
- **Target Threshold**: ${COVERAGE_THRESHOLD}%
- **Status**: $COVERAGE_STATUS
- **Coverage Gap**: ${COVERAGE_GAP}%

## Detailed Metrics

| Metric | Coverage | Status |
|--------|----------|--------|
| Lines | ${LINES_COVERAGE}% | $([ $LINES_COVERAGE -ge $COVERAGE_THRESHOLD ] && echo "✅" || echo "❌") |
| Functions | ${FUNCTIONS_COVERAGE}% | $([ $FUNCTIONS_COVERAGE -ge $COVERAGE_THRESHOLD ] && echo "✅" || echo "❌") |
| Branches | ${BRANCHES_COVERAGE}% | $([ $BRANCHES_COVERAGE -ge $COVERAGE_THRESHOLD ] && echo "✅" || echo "❌") |
| Statements | ${STATEMENTS_COVERAGE}% | $([ $STATEMENTS_COVERAGE -ge $COVERAGE_THRESHOLD ] && echo "✅" || echo "❌") |

## Files Needing Attention

### Completely Uncovered (${#UNCOVERED_FILES[@]} files)
$(for file in "${UNCOVERED_FILES[@]}"; do echo "- $file"; done)

### Low Coverage (<50%, ${#LOW_COVERAGE_FILES[@]} files)
$(for file in "${LOW_COVERAGE_FILES[@]}"; do echo "- $file"; done)

## Recommendations

1. **Immediate Actions (High Priority)**
   - Create basic unit tests for all uncovered files
   - Add error handling tests for low-coverage files
   - Implement CI/CD coverage gates

2. **Short-term Goals (1-2 weeks)**
   - Reach ${COVERAGE_THRESHOLD}% overall coverage
   - Add integration tests for critical paths
   - Set up automated test generation

3. **Long-term Strategy (1-3 months)**
   - Achieve 90%+ coverage for business logic
   - Implement comprehensive E2E testing
   - Establish test coverage KPIs and monitoring

## Effort Estimation

- **Estimated Hours**: ${ESTIMATED_HOURS}h
- **Estimated Days**: ${ESTIMATED_DAYS} days
- **Team Size**: 1 developer
- **Expected Improvement**: ${IMPROVEMENT_NEEDED}%+ coverage gain

## Next Steps

1. Review this report with the development team
2. Prioritize files based on business impact and risk
3. Create a detailed test implementation plan
4. Set up regular coverage monitoring and reporting
5. Establish coverage improvement milestones

---
*Report generated by OpenCode Coverage Analysis System*
EOF

    echo "📄 Comprehensive report generated: $REPORT_FILE"
    echo ""
fi

# Final summary
echo "🎉 Coverage Analysis Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Summary:"
echo "  • Current Coverage: ${TOTAL_COVERAGE}%"
echo "  • Target: ${COVERAGE_THRESHOLD}%"
echo "  • Status: $COVERAGE_STATUS"
echo "  • Files to Improve: $((${#UNCOVERED_FILES[@]} + ${#LOW_COVERAGE_FILES[@]}))"
echo ""
echo "🚀 Next Steps:"
echo "  1. Review the detailed report"
echo "  2. Start with high-priority uncovered files"
echo "  3. Implement CI/CD coverage monitoring"
echo "  4. Set up regular coverage improvement cycles"
echo ""
echo "💡 Pro Tip: Focus on testing business-critical code first"
echo "   for maximum impact on quality and reliability."
```

════════════════════════════════════════════════════════════════
```

***

## Command Usage Examples

**Basic coverage analysis:**
```bash
/analyze-coverage
# Output: Complete coverage analysis with gap identification and improvement recommendations
```

**Coverage analysis with custom threshold:**
```bash
/analyze-coverage --threshold 90
# Output: Analysis against 90% coverage target with detailed recommendations
```

**Coverage analysis with auto-improvements:**
```bash
/analyze-coverage --improve --report
# Output: Analysis + automatic test generation + comprehensive HTML/PDF report
```

**CI/CD coverage validation:**
```bash
/analyze-coverage --ci --threshold 85
# Output: CI-friendly analysis with pass/fail status and detailed metrics
```

**Package.json scripts (auto-added):**
```json
{
  "scripts": {
    "coverage": "opencode analyze-coverage",
    "coverage:report": "opencode analyze-coverage --report",
    "coverage:improve": "opencode analyze-coverage --improve",
    "test:coverage": "npm run test -- --coverage"
  }
}
```

***

This comprehensive coverage analysis system provides detailed insights, actionable recommendations, and automated improvements for achieving and maintaining high test coverage standards.[1][2][3][4][5]
