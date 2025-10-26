---
description: Comprehensive code review of recent git changes with automated analysis, quality assessment, and improvement recommendations
agent: code-reviewer
subagent: git-committer
subtask: true
argument-hint: "--commits 10 --branch main --author user --since 1week --detailed"
---

## 5-Phase Comprehensive Change Review System

### Phase 1: Change Discovery & Context Analysis

**Objective:** Identify recent changes, analyze commit patterns, and establish review context[1][2][3]

```
COMPREHENSIVE CHANGE REVIEW SYSTEM
════════════════════════════════════════════════════════════════

Date: 2025-10-15 18:45 CEST
Mode: Automated Code Review with Quality Analysis

────────────────────────────────────────────────────────────────

PHASE 1.1: CHANGE DISCOVERY & FILTERING
────────────────────────────────────────────────────────────────

```
#!/bin/bash

echo "🔍 Comprehensive Change Review System"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Parse arguments
COMMITS_TO_REVIEW=10
BRANCH="main"
AUTHOR_FILTER=""
SINCE_FILTER=""
DETAILED_MODE=false

if [[ "$*" == *"--commits"* ]]; then
    COMMITS_TO_REVIEW=$(echo "$*" | sed -n 's/.*--commits \([0-9]*\).*/\1/p')
fi

if [[ "$*" == *"--branch"* ]]; then
    BRANCH=$(echo "$*" | sed -n 's/.*--branch \([^ ]*\).*/\1/p')
fi

if [[ "$*" == *"--author"* ]]; then
    AUTHOR_FILTER="--author=$(echo "$*" | sed -n 's/.*--author \([^ ]*\).*/\1/p')"
fi

if [[ "$*" == *"--since"* ]]; then
    SINCE_FILTER="--since=$(echo "$*" | sed -n 's/.*--since \([^ ]*\).*/\1/p')"
fi

if [[ "$*" == *"--detailed"* ]]; then
    DETAILED_MODE=true
fi

echo "🎯 Review Configuration:"
echo "  • Commits to Review: $COMMITS_TO_REVIEW"
echo "  • Branch: $BRANCH"
echo "  • Author Filter: ${AUTHOR_FILTER:-All}"
echo "  • Time Filter: ${SINCE_FILTER:-All}"
echo "  • Detailed Mode: $DETAILED_MODE"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Get recent commits
echo "📋 Recent Commits Analysis:"
echo ""

COMMIT_DATA=$(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER 2>/dev/null)

if [ -z "$COMMIT_DATA" ]; then
    echo "⚠️  No commits found matching the criteria"
    echo "   Try adjusting the filters or check the branch name"
    exit 1
fi

echo "$COMMIT_DATA"
echo ""

# Count commits and analyze patterns
COMMIT_COUNT=$(echo "$COMMIT_DATA" | wc -l)
echo "📊 Commit Statistics:"
echo "  • Total Commits: $COMMIT_COUNT"
echo "  • Time Period: $(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format:"%ad" --date=short | head -1) to $(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format:"%ad" --date=short | tail -1)"
echo ""

# Analyze commit message patterns
echo "💬 Commit Message Analysis:"
CONVENTIONAL_COMMITS=$(echo "$COMMIT_DATA" | grep -E "^[a-f0-9]+ (feat|fix|docs|style|refactor|test|chore|perf|ci|build)(\(.+\))?: " | wc -l)
echo "  • Conventional Commits: $CONVENTIONAL_COMMITS/$COMMIT_COUNT"
echo "  • Well-formatted: $(($CONVENTIONAL_COMMITS * 100 / $COMMIT_COUNT))%"
echo ""

# Identify potential issues
echo "🚨 Potential Issues Detected:"
SHORT_COMMITS=$(echo "$COMMIT_DATA" | awk 'length($0) < 20' | wc -l)
if [ $SHORT_COMMITS -gt 0 ]; then
    echo "  • Short commit messages: $SHORT_COMMITS commits"
fi

WIP_COMMITS=$(echo "$COMMIT_DATA" | grep -i "wip\|work\|temp\|fixme" | wc -l)
if [ $WIP_COMMITS -gt 0 ]; then
    echo "  • Work-in-progress commits: $WIP_COMMITS commits"
fi

echo ""
```

────────────────────────────────────────────────────────────────

PHASE 1.2: CHANGE IMPACT ASSESSMENT
────────────────────────────────────────────────────────────────

```
# Analyze the impact and scope of changes
echo "📈 Change Impact Assessment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Get detailed change statistics
echo "📊 Change Metrics:"

TOTAL_FILES_CHANGED=$(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format: --name-only | sort | uniq | wc -l)
TOTAL_INSERTIONS=$(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format: --shortstat | grep -o "[0-9]* insertion" | awk '{sum+=$1} END {print sum}')
TOTAL_DELETIONS=$(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format: --shortstat | grep -o "[0-9]* deletion" | awk '{sum+=$1} END {print sum}')

echo "  • Files Changed: $TOTAL_FILES_CHANGED"
echo "  • Lines Added: ${TOTAL_INSERTIONS:-0}"
echo "  • Lines Removed: ${TOTAL_DELETIONS:-0}"
echo "  • Net Change: $((${TOTAL_INSERTIONS:-0} - ${TOTAL_DELETIONS:-0})) lines"
echo ""

# Analyze change types
echo "🏷️  Change Type Distribution:"
echo ""

# Categorize files changed
FILE_TYPES=$(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format: --name-only | grep -v '^$' | sed 's/.*\.//' | sort | uniq -c | sort -nr)

echo "$FILE_TYPES" | while read count type; do
    case $type in
        js|ts|jsx|tsx)
            echo "  • JavaScript/TypeScript: $count files"
            ;;
        py)
            echo "  • Python: $count files"
            ;;
        rs)
            echo "  • Rust: $count files"
            ;;
        java)
            echo "  • Java: $count files"
            ;;
        md)
            echo "  • Documentation: $count files"
            ;;
        json|yml|yaml|toml)
            echo "  • Configuration: $count files"
            ;;
        css|scss|sass)
            echo "  • Styles: $count files"
            ;;
        *)
            echo "  • Other ($type): $count files"
            ;;
    esac
done

echo ""

# Identify high-risk changes
echo "⚠️  Risk Assessment:"
HIGH_RISK_FILES=$(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format: --name-only | grep -E "(auth|security|payment|config|database)" | sort | uniq | wc -l)
if [ $HIGH_RISK_FILES -gt 0 ]; then
    echo "  • High-risk files modified: $HIGH_RISK_FILES files"
    echo "    → Review authentication, security, and configuration changes carefully"
fi

LARGE_COMMITS=$(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format: --shortstat | grep -E "[0-9]{4,} (insertion|deletion)" | wc -l)
if [ $LARGE_COMMITS -gt 0 ]; then
    echo "  • Large commits detected: $LARGE_COMMITS commits"
    echo "    → Consider splitting large changes into smaller, focused commits"
fi

echo ""
```

════════════════════════════════════════════════════════════════
```

***

### Phase 2: Code Quality & Standards Review

**Objective:** Analyze code quality, adherence to standards, and identify potential issues[1][3][4]

```
CODE QUALITY & STANDARDS REVIEW
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────

PHASE 2.1: AUTOMATED CODE ANALYSIS
────────────────────────────────────────────────────────────────

```
#!/bin/bash

echo "🔧 Automated Code Quality Analysis"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Analyze each commit individually
echo "📋 Commit-by-Commit Analysis:"
echo ""

# Process each commit
COMMIT_INDEX=1
echo "$COMMIT_DATA" | while read -r commit_line; do
    COMMIT_HASH=$(echo "$commit_line" | awk '{print $1}')
    COMMIT_MSG=$(echo "$commit_line" | cut -d' ' -f2-)

    echo "Commit $COMMIT_INDEX: $COMMIT_HASH"
    echo "  Message: \"$COMMIT_MSG\""
    echo ""

    # Get files changed in this commit
    COMMIT_FILES=$(git show --name-only --pretty=format: $COMMIT_HASH | grep -v '^$')

    # Analyze code quality for each file
    echo "$COMMIT_FILES" | while read -r file; do
        if [ -f "$file" ]; then
            echo "  📁 $file:"

            # Check file size changes
            LINES_CHANGED=$(git show $COMMIT_HASH -- "$file" | wc -l)
            echo "    • Lines changed: $LINES_CHANGED"

            # Language-specific analysis
            case "${file##*.}" in
                js|ts|jsx|tsx)
                    # JavaScript/TypeScript analysis
                    if command -v eslint &> /dev/null; then
                        ERRORS=$(git show $COMMIT_HASH -- "$file" | npx eslint --stdin --stdin-filename "$file" 2>/dev/null | wc -l)
                        if [ $ERRORS -gt 0 ]; then
                            echo "    • ESLint issues: $ERRORS"
                        fi
                    fi

                    # Check for console.log statements
                    CONSOLE_LOGS=$(git show $COMMIT_HASH -- "$file" | grep -c "console\.")
                    if [ $CONSOLE_LOGS -gt 0 ]; then
                        echo "    ⚠️  Console statements added: $CONSOLE_LOGS"
                    fi
                    ;;
                py)
                    # Python analysis
                    if command -v pylint &> /dev/null; then
                        ISSUES=$(git show $COMMIT_HASH -- "$file" | pylint --from-stdin "$file" 2>/dev/null | grep -c "rated")
                        if [ $ISSUES -gt 0 ]; then
                            echo "    • Pylint issues detected"
                        fi
                    fi
                    ;;
                rs)
                    # Rust analysis
                    if command -v cargo &> /dev/null && [ -f "Cargo.toml" ]; then
                        cargo check --quiet 2>/dev/null && echo "    ✅ Rust compilation OK" || echo "    ❌ Rust compilation issues"
                    fi
                    ;;
            esac

            # Check for TODO/FIXME comments
            TODO_COUNT=$(git show $COMMIT_HASH -- "$file" | grep -c -i "todo\|fixme\|hack")
            if [ $TODO_COUNT -gt 0 ]; then
                echo "    📝 TODO/FIXME comments: $TODO_COUNT"
            fi

            # Check for large functions/files
            if [ $LINES_CHANGED -gt 300 ]; then
                echo "    ⚠️  Large file change - consider splitting"
            fi
        fi
    done

    echo ""
    ((COMMIT_INDEX++))
done

echo "✅ Code analysis complete"
echo ""
```

────────────────────────────────────────────────────────────────

PHASE 2.2: STANDARDS COMPLIANCE CHECK
────────────────────────────────────────────────────────────────

```
# Check adherence to coding standards and best practices
echo "📏 Standards Compliance Review"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🎯 Standards Assessment:"
echo ""

# Check commit message standards
echo "💬 Commit Message Standards:"
PERFECT_MSGS=$(echo "$COMMIT_DATA" | grep -E "^[a-f0-9]+ [a-z]+(\([a-z0-9-]+\))?: [A-Z]" | wc -l)
echo "  • Perfect format: $PERFECT_MSGS/$COMMIT_COUNT"

IMPERATIVE_MSGS=$(echo "$COMMIT_DATA" | grep -E "^[a-f0-9]+ (add|fix|update|remove|refactor|implement)" | wc -l)
echo "  • Imperative mood: $IMPERATIVE_MSGS/$COMMIT_COUNT"

SHORT_MSGS=$(echo "$COMMIT_DATA" | awk 'length($0) < 50' | wc -l)
echo "  • Too short (<50 chars): $SHORT_MSGS/$COMMIT_COUNT"

echo ""

# Check code formatting
echo "🎨 Code Formatting Standards:"
if [ -f "package.json" ]; then
    if grep -q "prettier\|eslint" package.json; then
        echo "  ✅ Formatting tools configured"
    else
        echo "  ⚠️  Consider adding Prettier/ESLint"
    fi
fi

# Check testing
echo "🧪 Testing Standards:"
if [ -d "tests" ] || [ -d "__tests__" ] || [ -d "spec" ]; then
    echo "  ✅ Test directory found"
else
    echo "  ⚠️  No test directory found"
fi

# Check documentation
echo "📚 Documentation Standards:"
README_EXISTS=false
if [ -f "README.md" ] || [ -f "readme.md" ]; then
    README_EXISTS=true
    echo "  ✅ README found"
fi

# Check for new features without tests
NEW_FEATURES=$(echo "$COMMIT_DATA" | grep -E "(feat|add|implement)" | wc -l)
if [ $NEW_FEATURES -gt 0 ] && [ ! -d "tests" ] && [ ! -d "__tests__" ]; then
    echo "  ⚠️  New features added but no tests found"
fi

echo ""

# Overall quality score
QUALITY_SCORE=0
[ $PERFECT_MSGS -gt 0 ] && ((QUALITY_SCORE += 20))
[ $README_EXISTS = true ] && ((QUALITY_SCORE += 20))
[ -d "tests" ] || [ -d "__tests__" ] && ((QUALITY_SCORE += 20))
[ $IMPERATIVE_MSGS -gt $((COMMIT_COUNT / 2)) ] && ((QUALITY_SCORE += 20))
[ $SHORT_MSGS -eq 0 ] && ((QUALITY_SCORE += 20))

echo "🏆 Overall Quality Score: $QUALITY_SCORE/100"
echo ""

case $QUALITY_SCORE in
    9[0-9]|100)
        echo "🎉 Excellent quality standards!"
        ;;
    [7-8][0-9])
        echo "👍 Good quality standards"
        ;;
    [5-6][0-9])
        echo "🤔 Acceptable quality standards"
        ;;
    *)
        echo "⚠️  Quality standards need improvement"
        ;;
esac
```

════════════════════════════════════════════════════════════════
```

***

### Phase 3: Security & Vulnerability Assessment

**Objective:** Identify security issues, vulnerabilities, and compliance concerns in the changes[2][4][5]

```
SECURITY & VULNERABILITY ASSESSMENT
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────

PHASE 3.1: SECURITY VULNERABILITY SCAN
────────────────────────────────────────────────────────────────

```
#!/bin/bash

echo "🔒 Security Vulnerability Assessment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🛡️  Security Analysis:"
echo ""

SECURITY_ISSUES=0

# Check for sensitive data exposure
echo "🔍 Sensitive Data Exposure:"
SENSITIVE_FILES=$(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format: --name-only | grep -E "\.(env|key|pem|crt|p12|pfx)$" | sort | uniq)

if [ -n "$SENSITIVE_FILES" ]; then
    echo "  ❌ Sensitive files committed:"
    echo "$SENSITIVE_FILES" | sed 's/^/    • /'
    ((SECURITY_ISSUES++))
else
    echo "  ✅ No sensitive files detected"
fi

# Check for hardcoded secrets
echo ""
echo "🔐 Hardcoded Secrets Detection:"
SECRET_PATTERNS=("password" "secret" "key" "token" "api_key" "apikey")
SECRET_FOUND=false

for pattern in "${SECRET_PATTERNS[@]}"; do
    SECRET_COUNT=$(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format: --grep="$pattern" | wc -l)
    if [ $SECRET_COUNT -gt 0 ]; then
        echo "  ⚠️  Potential secrets found: $pattern ($SECRET_COUNT occurrences)"
        SECRET_FOUND=true
        ((SECURITY_ISSUES++))
    fi
done

if [ "$SECRET_FOUND" = false ]; then
    echo "  ✅ No hardcoded secrets detected"
fi

# Check for SQL injection vulnerabilities
echo ""
echo "💉 SQL Injection Risk Assessment:"
SQL_INJECTIONS=$(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format: --grep="SELECT.*+" | wc -l)
if [ $SQL_INJECTIONS -gt 0 ]; then
    echo "  ⚠️  Potential SQL injection patterns: $SQL_INJECTIONS"
    ((SECURITY_ISSUES++))
else
    echo "  ✅ No SQL injection patterns detected"
fi

# Check for XSS vulnerabilities
echo ""
echo "🕷️  XSS Vulnerability Check:"
XSS_PATTERNS=$(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format: --grep="innerHTML\|outerHTML\|document\.write" | wc -l)
if [ $XSS_PATTERNS -gt 0 ]; then
    echo "  ⚠️  Potential XSS patterns: $XSS_PATTERNS"
    ((SECURITY_ISSUES++))
else
    echo "  ✅ No XSS patterns detected"
fi

echo ""
echo "📊 Security Summary:"
echo "  • Issues Found: $SECURITY_ISSUES"
if [ $SECURITY_ISSUES -eq 0 ]; then
    echo "  • Risk Level: LOW"
    echo "  • Status: ✅ PASSED"
else
    echo "  • Risk Level: $([ $SECURITY_ISSUES -gt 3 ] && echo "HIGH" || [ $SECURITY_ISSUES -gt 1 ] && echo "MEDIUM" || echo "LOW")"
    echo "  • Status: ⚠️  REVIEW REQUIRED"
fi
```

────────────────────────────────────────────────────────────────

PHASE 3.2: COMPLIANCE & DEPENDENCY CHECK
────────────────────────────────────────────────────────────────

```
# Check dependencies and compliance
echo ""
echo "📋 Compliance & Dependency Analysis"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check for dependency changes
echo "📦 Dependency Changes:"
DEP_CHANGES=$(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format: --name-only | grep -E "(package\.json|requirements\.txt|Cargo\.toml|pom\.xml|build\.gradle)" | sort | uniq)

if [ -n "$DEP_CHANGES" ]; then
    echo "  📝 Dependency files modified:"
    echo "$DEP_CHANGES" | sed 's/^/    • /'
    echo ""
    echo "  🛡️  Security Recommendations:"
    echo "    → Run dependency vulnerability scan"
    echo "    → Review changelogs for breaking changes"
    echo "    → Update security dependencies"
else
    echo "  ✅ No dependency changes detected"
fi

# Check for license compliance
echo ""
echo "⚖️  License Compliance:"
LICENSE_FILES=$(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format: --name-only | grep -i license | sort | uniq)

if [ -n "$LICENSE_FILES" ]; then
    echo "  📄 License files modified:"
    echo "$LICENSE_FILES" | sed 's/^/    • /'
    echo "    → Review license compatibility"
else
    echo "  ✅ No license changes detected"
fi

# Check for GDPR/PII data handling
echo ""
echo "🔒 Data Privacy Compliance:"
PII_PATTERNS=("email" "phone" "address" "ssn" "credit_card")
PII_FOUND=false

for pattern in "${PII_PATTERNS[@]}"; do
    PII_COUNT=$(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format: --grep="$pattern" | wc -l)
    if [ $PII_COUNT -gt 0 ]; then
        echo "  ⚠️  Potential PII data handling: $pattern"
        PII_FOUND=true
    fi
done

if [ "$PII_FOUND" = false ]; then
    echo "  ✅ No PII data patterns detected"
fi

echo ""
echo "✅ Security assessment complete"
echo ""
```

════════════════════════════════════════════════════════════════
```

***

### Phase 4: Performance & Architecture Review

**Objective:** Evaluate performance implications and architectural impact of the changes[3][5][1]

```
PERFORMANCE & ARCHITECTURE REVIEW
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────

PHASE 4.1: PERFORMANCE IMPACT ANALYSIS
────────────────────────────────────────────────────────────────

```
#!/bin/bash

echo "⚡ Performance Impact Analysis"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🏃 Performance Assessment:"
echo ""

# Analyze performance implications
PERF_CONCERNS=0

# Check for N+1 query patterns
echo "🔍 Database Query Analysis:"
N_PLUS_ONE=$(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format: --grep="SELECT.*for.*in\|query.*loop" | wc -l)
if [ $N_PLUS_ONE -gt 0 ]; then
    echo "  ⚠️  Potential N+1 query patterns: $N_PLUS_ONE"
    ((PERF_CONCERNS++))
else
    echo "  ✅ No N+1 query patterns detected"
fi

# Check for memory leaks
echo ""
echo "🧠 Memory Management:"
MEMORY_ISSUES=$(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format: --grep="new.*\[\|\.push.*|\.splice" | wc -l)
if [ $MEMORY_ISSUES -gt 0 ]; then
    echo "  📊 Memory allocation patterns: $MEMORY_ISSUES"
    echo "    → Review for potential memory leaks"
fi

# Check for blocking operations
echo ""
echo "⏳ Asynchronous Operations:"
BLOCKING_OPS=$(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format: --grep="fs\.readFileSync\|sync\|wait" | wc -l)
if [ $BLOCKING_OPS -gt 0 ]; then
    echo "  ⚠️  Blocking operations detected: $BLOCKING_OPS"
    ((PERF_CONCERNS++))
else
    echo "  ✅ No blocking operations detected"
fi

# Check bundle size impact
echo ""
echo "📦 Bundle Size Analysis:"
if [ -f "package.json" ]; then
    BUNDLE_CHANGES=$(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format: --name-only | grep -E "\.(js|ts|jsx|tsx|css|scss)$" | wc -l)
    if [ $BUNDLE_CHANGES -gt 10 ]; then
        echo "  ⚠️  Large number of frontend changes: $BUNDLE_CHANGES files"
        echo "    → Monitor bundle size impact"
        ((PERF_CONCERNS++))
    else
        echo "  ✅ Bundle size impact minimal"
    fi
fi

echo ""
echo "📊 Performance Summary:"
echo "  • Performance Concerns: $PERF_CONCERNS"
echo "  • Risk Level: $([ $PERF_CONCERNS -gt 3 ] && echo "HIGH" || [ $PERF_CONCERNS -gt 1 ] && echo "MEDIUM" || echo "LOW")"
```

────────────────────────────────────────────────────────────────

PHASE 4.2: ARCHITECTURAL IMPACT ASSESSMENT
────────────────────────────────────────────────────────────────

```
echo ""
echo "🏗️  Architectural Impact Assessment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Analyze architectural implications
echo "🏛️  Architecture Review:"
echo ""

# Check for architectural pattern changes
PATTERN_CHANGES=$(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format: --grep="pattern\|architecture\|design" | wc -l)
if [ $PATTERN_CHANGES -gt 0 ]; then
    echo "  📐 Architectural changes detected: $PATTERN_CHANGES"
    echo "    → Review design pattern consistency"
fi

# Check for breaking changes
BREAKING_CHANGES=$(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format: --grep="BREAKING\|breaking\|BREAK" | wc -l)
if [ $BREAKING_CHANGES -gt 0 ]; then
    echo "  💥 Breaking changes: $BREAKING_CHANGES"
    echo "    → Update API documentation"
    echo "    → Notify dependent teams"
fi

# Check for new dependencies
NEW_DEPS=$(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format: --grep="add.*dependency\|install.*package" | wc -l)
if [ $NEW_DEPS -gt 0 ]; then
    echo "  📦 New dependencies added: $NEW_DEPS"
    echo "    → Review dependency licenses"
    echo "    → Check for security vulnerabilities"
fi

# Check for refactoring
REFACTORING=$(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format: --grep="refactor\|restructure" | wc -l)
if [ $REFACTORING -gt 0 ]; then
    echo "  🔄 Refactoring activities: $REFACTORING"
    echo "    → Ensure backward compatibility"
    echo "    → Update internal documentation"
fi

echo ""

# Overall architecture health
ARCHITECTURE_SCORE=100
[ $BREAKING_CHANGES -gt 0 ] && ((ARCHITECTURE_SCORE -= 20))
[ $NEW_DEPS -gt 3 ] && ((ARCHITECTURE_SCORE -= 10))
[ $PERF_CONCERNS -gt 0 ] && ((ARCHITECTURE_SCORE -= 15))

echo "🏗️  Architecture Health Score: $ARCHITECTURE_SCORE/100"
echo ""

if [ $ARCHITECTURE_SCORE -ge 90 ]; then
    echo "✅ Architecture impact: MINIMAL"
elif [ $ARCHITECTURE_SCORE -ge 75 ]; then
    echo "⚠️  Architecture impact: MODERATE"
else
    echo "🚨 Architecture impact: SIGNIFICANT"
fi

echo ""
echo "✅ Architecture review complete"
echo ""
```

════════════════════════════════════════════════════════════════
```

***

### Phase 5: Comprehensive Review Report & Recommendations

**Objective:** Generate detailed review report with prioritized recommendations and next steps[4][2][5]

```
COMPREHENSIVE REVIEW REPORT
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────

PHASE 5.1: EXECUTIVE SUMMARY & RECOMMENDATIONS
────────────────────────────────────────────────────────────────

```
#!/bin/bash

echo "📋 Comprehensive Review Report"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Generate executive summary
echo "📊 Executive Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Review Period: $(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format:"%ad" --date=short | head -1) to $(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format:"%ad" --date=short | tail -1)"
echo "Commits Reviewed: $COMMIT_COUNT"
echo "Files Changed: $TOTAL_FILES_CHANGED"
echo "Lines Changed: $((${TOTAL_INSERTIONS:-0} + ${TOTAL_DELETIONS:-0}))"
echo ""

# Overall assessment
OVERALL_SCORE=$((QUALITY_SCORE + (100 - SECURITY_ISSUES * 10) + ARCHITECTURE_SCORE))
OVERALL_SCORE=$((OVERALL_SCORE / 3))

echo "🎯 Overall Assessment Score: $OVERALL_SCORE/100"
echo ""

if [ $OVERALL_SCORE -ge 85 ]; then
    OVERALL_STATUS="✅ EXCELLENT"
    OVERALL_COLOR="🟢"
elif [ $OVERALL_SCORE -ge 70 ]; then
    OVERALL_STATUS="👍 GOOD"
    OVERALL_COLOR="🟡"
elif [ $OVERALL_SCORE -ge 55 ]; then
    OVERALL_STATUS="🤔 NEEDS IMPROVEMENT"
    OVERALL_COLOR="🟠"
else
    OVERALL_STATUS="❌ REQUIRES ATTENTION"
    OVERALL_COLOR="🔴"
fi

echo "📈 Status: $OVERALL_COLOR $OVERALL_STATUS"
echo ""

# Key findings
echo "🔑 Key Findings:"
echo ""

# Positive findings
echo "✅ Positive Aspects:"
if [ $QUALITY_SCORE -ge 80 ]; then
    echo "  • High code quality standards maintained"
fi
if [ $SECURITY_ISSUES -eq 0 ]; then
    echo "  • No security vulnerabilities detected"
fi
if [ $ARCHITECTURE_SCORE -ge 90 ]; then
    echo "  • Architecture integrity preserved"
fi
if [ $CONVENTIONAL_COMMITS -eq $COMMIT_COUNT ]; then
    echo "  • All commits follow conventional format"
fi

echo ""

# Areas for improvement
echo "🎯 Areas for Improvement:"
if [ $QUALITY_SCORE -lt 70 ]; then
    echo "  • Code quality standards need enhancement"
fi
if [ $SECURITY_ISSUES -gt 0 ]; then
    echo "  • Address $SECURITY_ISSUES security concerns"
fi
if [ $PERF_CONCERNS -gt 0 ]; then
    echo "  • Review $PERF_CONCERNS performance issues"
fi
if [ $CONVENTIONAL_COMMITS -lt $COMMIT_COUNT ]; then
    echo "  • $(($COMMIT_COUNT - $CONVENTIONAL_COMMITS)) commits need message improvement"
fi

echo ""
```

────────────────────────────────────────────────────────────────

PHASE 5.2: PRIORITIZED ACTION ITEMS & NEXT STEPS
────────────────────────────────────────────────────────────────

```
# Generate prioritized recommendations
echo "📋 Prioritized Action Items"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🚨 CRITICAL PRIORITY (Immediate Action Required):"
echo ""

CRITICAL_ITEMS=0

# Security issues
if [ $SECURITY_ISSUES -gt 0 ]; then
    echo "  1. 🔒 Address $SECURITY_ISSUES security vulnerabilities"
    echo "     → Review and fix all security issues before deployment"
    ((CRITICAL_ITEMS++))
fi

# Breaking changes
if [ $BREAKING_CHANGES -gt 0 ]; then
    echo "  2. 💥 Handle $BREAKING_CHANGES breaking changes"
    echo "     → Update API documentation and notify stakeholders"
    ((CRITICAL_ITEMS++))
fi

# Large commits
if [ $LARGE_COMMITS -gt 0 ]; then
    echo "  3. 📦 Split $LARGE_COMMITS large commits"
    echo "     → Break down into focused, reviewable changes"
    ((CRITICAL_ITEMS++))
fi

if [ $CRITICAL_ITEMS -eq 0 ]; then
    echo "  ✅ No critical issues found"
fi

echo ""
echo "⚠️  HIGH PRIORITY (This Sprint):"
echo ""

# Quality improvements
if [ $QUALITY_SCORE -lt 80 ]; then
    echo "  • 🎨 Improve code quality score to 80+"
    echo "    → Add linting, formatting, and testing"
fi

# Performance issues
if [ $PERF_CONCERNS -gt 0 ]; then
    echo "  • ⚡ Address $PERF_CONCERNS performance concerns"
    echo "    → Optimize database queries and async operations"
fi

# Commit message improvements
if [ $CONVENTIONAL_COMMITS -lt $COMMIT_COUNT ]; then
    echo "  • 💬 Standardize commit messages"
    echo "    → Use conventional commit format for all changes"
fi

echo ""
echo "📝 MEDIUM PRIORITY (Next Sprint):"
echo ""

echo "  • 🧪 Enhance testing coverage"
echo "    → Add unit and integration tests for new features"
echo ""

echo "  • 📚 Update documentation"
echo "    → Keep README and API docs current"
echo ""

echo "  • 🔄 Implement code review automation"
echo "    → Add pre-commit hooks and CI checks"
echo ""

echo "🎯 LONG-TERM GOALS:"
echo ""

echo "  • 📊 Establish quality metrics dashboard"
echo "  • 🤖 Implement automated code review tools"
echo "  • 👥 Enhance team collaboration processes"
echo "  • 📈 Continuous improvement of development practices"
echo ""

# Generate detailed report file
REPORT_FILE="review-report-$(date +%Y%m%d-%H%M%S).md"

cat > "$REPORT_FILE" << EOF
# Code Review Report: Recent Changes

Generated: $(date)
Reviewed: $COMMIT_COUNT commits
Period: $(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format:"%ad" --date=short | head -1) to $(git log --oneline -$COMMITS_TO_REVIEW $BRANCH $AUTHOR_FILTER $SINCE_FILTER --pretty=format:"%ad" --date=short | tail -1)

## Executive Summary

- **Overall Score**: $OVERALL_SCORE/100 ($OVERALL_STATUS)
- **Commits Reviewed**: $COMMIT_COUNT
- **Files Changed**: $TOTAL_FILES_CHANGED
- **Security Issues**: $SECURITY_ISSUES
- **Performance Concerns**: $PERF_CONCERNS

## Detailed Findings

### Code Quality
- Quality Score: $QUALITY_SCORE/100
- Conventional Commits: $CONVENTIONAL_COMMITS/$COMMIT_COUNT
- Linting Issues: $([ -f ".eslintrc.js" ] && echo "Configured" || echo "Not configured")

### Security Assessment
- Vulnerabilities Found: $SECURITY_ISSUES
- Risk Level: $([ $SECURITY_ISSUES -gt 3 ] && echo "HIGH" || [ $SECURITY_ISSUES -gt 1 ] && echo "MEDIUM" || echo "LOW")

### Performance Analysis
- Performance Concerns: $PERF_CONCERNS
- Large Commits: $LARGE_COMMITS
- Blocking Operations: Detected in analysis

### Architecture Review
- Architecture Score: $ARCHITECTURE_SCORE/100
- Breaking Changes: $BREAKING_CHANGES
- New Dependencies: $NEW_DEPS

## Recommendations

See prioritized action items in the review output above.

## Raw Commit Data

\`\`\`
$COMMIT_DATA
\`\`\`

---
*Generated by OpenCode Change Review System*
EOF

echo "📄 Detailed report saved: $REPORT_FILE"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Comprehensive change review complete!"
echo ""
echo "🎉 Review Summary:"
echo "  • Status: $OVERALL_COLOR $OVERALL_STATUS"
echo "  • Score: $OVERALL_SCORE/100"
echo "  • Critical Issues: $CRITICAL_ITEMS"
echo "  • Report: $REPORT_FILE"
echo ""
echo "🚀 Next Steps:"
echo "  1. Address critical priority items immediately"
echo "  2. Review detailed report for specific recommendations"
echo "  3. Implement high-priority improvements this sprint"
echo "  4. Schedule regular code reviews for ongoing quality"
echo ""
echo "💡 Remember: Code review is a team sport - great job collaborating!"
```

════════════════════════════════════════════════════════════════
```

***

## Command Usage Examples

**Review recent commits on main branch:**
```bash
/review-changes
# Output: Comprehensive review of last 10 commits with quality analysis and recommendations
```

**Review specific author's changes:**
```bash
/review-changes --author john.doe --commits 20
# Output: Detailed review of john.doe's last 20 commits
```

**Review changes from specific time period:**
```bash
/review-changes --since "2 weeks ago" --detailed
# Output: In-depth analysis of changes from last 2 weeks with full metrics
```

**Review specific branch:**
```bash
/review-changes --branch feature/auth --commits 5
# Output: Focused review of auth feature branch commits
```

**Package.json integration (auto-added):**
```json
{
  "scripts": {
    "review": "opencode review-changes",
    "review:author": "opencode review-changes --author",
    "review:branch": "opencode review-changes --branch",
    "review:detailed": "opencode review-changes --detailed"
  }
}
```

***

This comprehensive change review system provides automated analysis of code quality, security, performance, and architectural impact with actionable recommendations for maintaining high development standards.[1][2][3][4][5]
