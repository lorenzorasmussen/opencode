---
description: Intelligent git commit with conventional prefixes, semantic messaging, and automated push workflow
agent: git-committer
subagent: none
subtask: true
argument-hint: "--message 'commit message' --push --amend --force"
---

## 5-Phase Intelligent Commit Workflow

### Phase 1: Repository Analysis & Change Detection

**Objective:** Analyze git status, detect changes, and categorize modifications[1][2][3]

```
INTELLIGENT GIT COMMIT SYSTEM
════════════════════════════════════════════════════════════════

Date: 2025-10-15 18:45 CEST
Mode: Semantic Commit with Conventional Prefixes

────────────────────────────────────────────────────────────────

PHASE 1.1: REPOSITORY STATUS ANALYSIS
────────────────────────────────────────────────────────────────

```
#!/bin/bash

echo "🔄 Intelligent Git Commit System"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

echo "📊 Repository Status:"
echo "  • Branch: $(git branch --show-current)"
echo "  • Remote: $(git remote get-url origin 2>/dev/null || echo 'No remote configured')"
echo "  • Status: $(git status --porcelain | wc -l) changes"
echo ""

# Analyze changed files
echo "📁 Changed Files Analysis:"
git status --porcelain | while read -r status file; do
    case "$status" in
        "M ")
            echo "  • Modified: $file"
            ;;
        "A ")
            echo "  • Added: $file"
            ;;
        "D ")
            echo "  • Deleted: $file"
            ;;
        "R ")
            echo "  • Renamed: $file"
            ;;
        "??")
            echo "  • Untracked: $file"
            ;;
        *)
            echo "  • Other: $status $file"
            ;;
    esac
done

echo ""
```

────────────────────────────────────────────────────────────────

PHASE 1.2: CHANGE CATEGORIZATION & IMPACT ANALYSIS
────────────────────────────────────────────────────────────────

```
# Categorize changes for conventional commit prefixes
echo "🏷️  Change Categorization:"
echo ""

# Initialize counters
declare -A change_types
change_types=(
    ["docs"]=0
    ["feat"]=0
    ["fix"]=0
    ["refactor"]=0
    ["test"]=0
    ["chore"]=0
    ["style"]=0
    ["perf"]=0
    ["ci"]=0
    ["build"]=0
)

# Analyze file changes
while IFS= read -r line; do
    file=$(echo "$line" | awk '{print $2}')
    status=$(echo "$line" | awk '{print $1}')

    # Categorize by file type and change type
    if [[ "$file" =~ \.(md|txt|rst)$ ]]; then
        ((change_types["docs"]++))
    elif [[ "$file" =~ \.(js|ts|jsx|tsx|py|java|c|cpp)$ ]]; then
        if [[ "$status" == "A " ]]; then
            ((change_types["feat"]++))
        elif [[ "$status" == "M " ]]; then
            ((change_types["fix"]++))
        fi
    elif [[ "$file" =~ test.*\.(js|ts|py)$ ]]; then
        ((change_types["test"]++))
    elif [[ "$file" =~ \.(json|yml|yaml|toml|lock)$ ]]; then
        ((change_types["build"]++))
    elif [[ "$file" =~ \.(css|scss|html)$ ]]; then
        ((change_types["style"]++))
    elif [[ "$file" =~ \.(github|ci|jenkins)$ ]]; then
        ((change_types["ci"]++))
    else
        ((change_types["chore"]++))
    fi
done < <(git status --porcelain)

# Display categorization
for type in "${!change_types[@]}"; do
    if [ "${change_types[$type]}" -gt 0 ]; then
        echo "  • $type: ${change_types[$type]} files"
    fi
done

echo ""

# Determine primary change type
PRIMARY_TYPE="chore"
MAX_COUNT=0
for type in "${!change_types[@]}"; do
    if [ "${change_types[$type]}" -gt "$MAX_COUNT" ]; then
        MAX_COUNT="${change_types[$type]}"
        PRIMARY_TYPE="$type"
    fi
done

echo "🎯 Primary Change Type: $PRIMARY_TYPE"
echo ""
```

════════════════════════════════════════════════════════════════
```

***

### Phase 2: Semantic Commit Message Generation

**Objective:** Generate meaningful commit messages focusing on WHY rather than WHAT[1][3][4]

```
COMMIT MESSAGE GENERATION
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────

PHASE 2.1: CONVENTIONAL COMMIT FORMAT ANALYSIS
────────────────────────────────────────────────────────────────

```
# Generate commit message based on conventional commits
echo "📝 Commit Message Generation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Conventional commit prefixes
declare -A prefix_descriptions
prefix_descriptions=(
    ["docs"]="Documentation updates and improvements"
    ["feat"]="New features and functionality"
    ["fix"]="Bug fixes and error corrections"
    ["refactor"]="Code restructuring without functional changes"
    ["test"]="Testing infrastructure and test cases"
    ["chore"]="Maintenance tasks and housekeeping"
    ["style"]="Code style and formatting changes"
    ["perf"]="Performance improvements and optimizations"
    ["ci"]="Continuous integration and deployment"
    ["build"]="Build system and dependency changes"
)

echo "📋 Available Conventional Prefixes:"
for prefix in "${!prefix_descriptions[@]}"; do
    echo "  • $prefix: ${prefix_descriptions[$prefix]}"
done

echo ""
echo "✅ Recommended Prefix: $PRIMARY_TYPE"
echo "   ${prefix_descriptions[$PRIMARY_TYPE]}"
echo ""

# Check for custom message argument
CUSTOM_MESSAGE=""
if [[ "$*" == *"--message"* ]]; then
    CUSTOM_MESSAGE=$(echo "$*" | sed -n 's/.*--message \([^--]*\).*/\1/p' | sed 's/["'"'"']//g')
fi

if [ -n "$CUSTOM_MESSAGE" ]; then
    echo "💬 Using custom message: $CUSTOM_MESSAGE"
    COMMIT_MESSAGE="$PRIMARY_TYPE: $CUSTOM_MESSAGE"
else
    # Generate semantic message from changes
    COMMIT_MESSAGE=$(generate_semantic_message)
fi

echo ""
echo "✨ Generated Commit Message:"
echo "  $COMMIT_MESSAGE"
echo ""
```

────────────────────────────────────────────────────────────────

PHASE 2.2: SEMANTIC MESSAGE ENHANCEMENT
────────────────────────────────────────────────────────────────

```
# Function to generate semantic commit message
generate_semantic_message() {
    local message=""

    # Analyze the nature of changes
    local has_breaking=$(git diff --cached | grep -i "breaking\|break" | wc -l)
    local has_new_features=$(git diff --cached | grep -E "(add|new|create)" | wc -l)
    local has_fixes=$(git diff --cached | grep -E "(fix|resolve|correct)" | wc -l)
    local has_refactor=$(git diff --cached | grep -E "(refactor|restructure|clean)" | wc -l)

    case $PRIMARY_TYPE in
        "docs")
            if [ $has_new_features -gt 0 ]; then
                message="improve documentation for new features"
            else
                message="update and improve documentation"
            fi
            ;;
        "feat")
            message="add new functionality and capabilities"
            ;;
        "fix")
            if [ $has_breaking -gt 0 ]; then
                message="fix critical issues and bugs"
            else
                message="resolve bugs and improve stability"
            fi
            ;;
        "refactor")
            message="restructure code for better maintainability"
            ;;
        "test")
            message="enhance testing coverage and reliability"
            ;;
        "chore")
            message="maintain and update project infrastructure"
            ;;
        "style")
            message="improve code formatting and consistency"
            ;;
        "perf")
            message="optimize performance and efficiency"
            ;;
        "ci")
            message="improve automation and deployment processes"
            ;;
        "build")
            message="update build system and dependencies"
            ;;
        *)
            message="implement improvements and updates"
            ;;
    esac

    # Add scope if applicable
    local scope=""
    if [ -f "package.json" ]; then
        scope=$(grep '"name"' package.json | sed 's/.*"name": "\([^"]*\)".*/\1/' | tr '[:upper:]' '[:lower:]')
    fi

    if [ -n "$scope" ]; then
        echo "$PRIMARY_TYPE($scope): $message"
    else
        echo "$PRIMARY_TYPE: $message"
    fi
}

# Validate commit message format
validate_commit_message() {
    local msg="$1"

    # Check conventional commit format
    if [[ ! "$msg" =~ ^[a-z]+(\([a-z0-9-]+\))?:\ [a-z] ]]; then
        echo "⚠️  Warning: Message doesn't follow conventional format"
        echo "   Recommended: type(scope): description"
        return 1
    fi

    # Check length
    if [ ${#msg} -gt 72 ]; then
        echo "⚠️  Warning: Message is quite long (>72 chars)"
        return 1
    fi

    return 0
}

validate_commit_message "$COMMIT_MESSAGE"
```

════════════════════════════════════════════════════════════════
```

***

### Phase 3: Staging & Pre-commit Validation

**Objective:** Stage appropriate files and run pre-commit validations[2][4][5]

```
STAGING & VALIDATION
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────

PHASE 3.1: INTELLIGENT STAGING
────────────────────────────────────────────────────────────────

```
#!/bin/bash

echo ""
echo "📦 Intelligent File Staging"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check current staging status
STAGED_FILES=$(git diff --cached --name-only | wc -l)
UNSTAGED_FILES=$(git diff --name-only | wc -l)

echo "📊 Staging Status:"
echo "  • Staged files: $STAGED_FILES"
echo "  • Unstaged files: $UNSTAGED_FILES"
echo ""

# Auto-stage based on change types
if [ "$STAGED_FILES" -eq 0 ]; then
    echo "🤖 Auto-staging files based on change analysis..."

    # Stage all changes if they're consistent
    if [ "${change_types[$PRIMARY_TYPE]}" -gt 0 ]; then
        echo "  → Staging all $PRIMARY_TYPE-related changes"
        git add .
    else
        echo "  → Staging all changes"
        git add .
    fi

    echo "✅ Files staged successfully"
else
    echo "ℹ️  Files already staged, proceeding..."
fi

echo ""
```

────────────────────────────────────────────────────────────────

PHASE 3.2: PRE-COMMIT VALIDATION
────────────────────────────────────────────────────────────────

```
# Run pre-commit validations
echo "🔍 Pre-commit Validation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

VALIDATION_PASSED=true

# Check for large files
echo "📏 Checking for large files..."
git diff --cached --stat | while read -r line; do
    if [[ "$line" =~ \|\ *([0-9]+)\ [+-]*$ ]]; then
        size="${BASH_REMATCH[1]}"
        if [ "$size" -gt 1000000 ]; then  # 1MB
            echo "⚠️  Large file detected: $line"
            VALIDATION_PASSED=false
        fi
    fi
done

# Check for sensitive data
echo "🔐 Checking for sensitive data..."
if git diff --cached | grep -i "password\|secret\|key\|token" > /dev/null; then
    echo "⚠️  Potential sensitive data detected in changes"
    VALIDATION_PASSED=false
fi

# Run linting if available
if [ -f "package.json" ] && grep -q "lint" package.json; then
    echo "🔧 Running linting..."
    if npm run lint > /dev/null 2>&1; then
        echo "✅ Linting passed"
    else
        echo "⚠️  Linting failed - consider fixing before commit"
        VALIDATION_PASSED=false
    fi
fi

# Run tests if available
if [ -f "package.json" ] && grep -q "test" package.json; then
    echo "🧪 Running tests..."
    if npm test > /dev/null 2>&1; then
        echo "✅ Tests passed"
    else
        echo "⚠️  Tests failed - fix issues before commit"
        VALIDATION_PASSED=false
    fi
fi

if [ "$VALIDATION_PASSED" = true ]; then
    echo "✅ All validations passed"
else
    echo "⚠️  Some validations failed - review before proceeding"
fi

echo ""
```

════════════════════════════════════════════════════════════════
```

***

### Phase 4: Commit Execution & Push

**Objective:** Execute commit with proper message and handle push operations[3][5][1]

```
COMMIT EXECUTION & PUSH
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────

PHASE 4.1: COMMIT EXECUTION
────────────────────────────────────────────────────────────────

```
#!/bin/bash

echo ""
echo "💾 Commit Execution"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Handle amend flag
AMEND_FLAG=""
if [[ "$*" == *"--amend"* ]]; then
    AMEND_FLAG="--amend"
    echo "🔄 Amending previous commit..."
fi

# Execute commit
echo "📝 Committing with message: $COMMIT_MESSAGE"

if git commit $AMEND_FLAG -m "$COMMIT_MESSAGE"; then
    echo "✅ Commit successful!"
    echo "   Hash: $(git rev-parse HEAD)"
    echo "   Message: $COMMIT_MESSAGE"
else
    echo "❌ Commit failed"
    exit 1
fi

echo ""
```

────────────────────────────────────────────────────────────────

PHASE 4.2: PUSH OPERATIONS
────────────────────────────────────────────────────────────────

```
# Handle push operations
PUSH_ENABLED=false
FORCE_PUSH=false

if [[ "$*" == *"--push"* ]]; then
    PUSH_ENABLED=true
fi

if [[ "$*" == *"--force"* ]]; then
    FORCE_PUSH=true
fi

if [ "$PUSH_ENABLED" = true ]; then
    echo "🚀 Push Operations"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Check if remote exists
    if git remote get-url origin > /dev/null 2>&1; then
        echo "📡 Pushing to remote..."

        PUSH_CMD="git push"
        if [ "$FORCE_PUSH" = true ]; then
            PUSH_CMD="git push --force-with-lease"
            echo "⚠️  Force push enabled - use with caution!"
        fi

        if $PUSH_CMD; then
            echo "✅ Push successful!"
            echo "   Remote: $(git remote get-url origin)"
            echo "   Branch: $(git branch --show-current)"
        else
            echo "❌ Push failed - check remote status"
            exit 1
        fi
    else
        echo "⚠️  No remote configured - skipping push"
    fi
else
    echo "ℹ️  Push not requested - commit completed locally"
fi

echo ""
```

════════════════════════════════════════════════════════════════
```

***

### Phase 5: Post-commit Analysis & Recommendations

**Objective:** Analyze commit impact and provide improvement recommendations[4][2][5]

```
POST-COMMIT ANALYSIS
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────

PHASE 5.1: COMMIT IMPACT ANALYSIS
────────────────────────────────────────────────────────────────

```
#!/bin/bash

echo ""
echo "📊 Commit Impact Analysis"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Analyze commit statistics
COMMIT_STATS=$(git show --stat HEAD | tail -10)
LINES_CHANGED=$(git show --stat HEAD | grep -E "insertion|deletion" | awk '{sum+=$4+$6} END {print sum}')

echo "📈 Commit Statistics:"
echo "  • Files changed: $(git show --name-only HEAD | wc -l)"
echo "  • Lines changed: $LINES_CHANGED"
echo "  • Commit size: $([ "$LINES_CHANGED" -gt 1000 ] && echo "Large" || [ "$LINES_CHANGED" -gt 100 ] && echo "Medium" || echo "Small")"
echo ""

# Check commit message quality
echo "💬 Commit Message Quality:"
if [[ "$COMMIT_MESSAGE" =~ ^[a-z]+(\([a-z0-9-]+\))?:\ [a-z] ]]; then
    echo "  ✅ Follows conventional commit format"
else
    echo "  ⚠️  Doesn't follow conventional format"
fi

if [ ${#COMMIT_MESSAGE} -le 72 ]; then
    echo "  ✅ Appropriate length"
else
    echo "  ⚠️  Message is quite long"
fi

if [[ "$COMMIT_MESSAGE" =~ \b(add|fix|update|improve|refactor|remove)\b ]]; then
    echo "  ✅ Contains action verbs"
else
    echo "  ⚠️  Consider using action verbs"
fi

echo ""
```

────────────────────────────────────────────────────────────────

PHASE 5.2: IMPROVEMENT RECOMMENDATIONS
────────────────────────────────────────────────────────────────

```
# Provide recommendations for future commits
echo "🎯 Improvement Recommendations"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "📝 Commit Message Best Practices:"
echo "  • Focus on WHY changes were made, not WHAT was changed"
echo "  • Use imperative mood: 'add feature' not 'added feature'"
echo "  • Keep first line under 72 characters"
echo "  • Use conventional prefixes for automated tooling"
echo ""

echo "🔄 Workflow Improvements:"
echo "  • Run tests before committing"
echo "  • Use interactive staging for complex changes"
echo "  • Consider squashing related commits"
echo "  • Review changes with 'git diff --cached'"
echo ""

echo "🤝 Team Collaboration:"
echo "  • Communicate breaking changes clearly"
echo "  • Reference issue numbers when applicable"
echo "  • Use co-authors for pair programming"
echo ""

# Check for potential issues
if [ "$LINES_CHANGED" -gt 1000 ]; then
    echo "⚠️  Large commit detected - consider splitting into smaller commits"
fi

if [[ "$COMMIT_MESSAGE" =~ "WIP" ]] || [[ "$COMMIT_MESSAGE" =~ "temp" ]]; then
    echo "⚠️  Work-in-progress commit - remember to clean up later"
fi

echo ""
echo "✨ Commit workflow completed successfully!"
echo "   Use '/commit --push' for future commits with automatic push"
```

════════════════════════════════════════════════════════════════
```

***

## Command Usage Examples

**Smart commit with auto-generated message:**
```bash
/commit
# Output: Analyzes changes, generates semantic message, commits with conventional prefix
```

**Commit with custom message:**
```bash
/commit --message "fix login validation for edge cases"
# Output: Uses custom message with appropriate prefix
```

**Commit and push:**
```bash
/commit --push
# Output: Commits and pushes to remote repository
```

**Amend previous commit:**
```bash
/commit --amend --message "improve error handling in auth module"
# Output: Amends last commit with new message
```

**Force push (use with caution):**
```bash
/commit --push --force
# Output: Force pushes with lease protection
```

**Conventional Commit Prefixes:**
- `docs:` - Documentation changes
- `feat:` - New features
- `fix:` - Bug fixes
- `refactor:` - Code restructuring
- `test:` - Testing improvements
- `chore:` - Maintenance tasks
- `style:` - Code style changes
- `perf:` - Performance improvements
- `ci:` - CI/CD changes
- `build:` - Build system changes

***

This intelligent commit system ensures semantic versioning, conventional commit standards, and focuses on explaining the purpose and impact of changes from an end-user perspective.[1][2][3][4][5]
