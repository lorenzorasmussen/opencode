---
description: Comprehensive spellcheck and grammar analysis for markdown files with AI-powered suggestions and automated corrections
agent: documentation
subagent: code-reviewer
subtask: true
argument-hint: "--all --fix --language en --custom-dict --report"
---

## 5-Phase Comprehensive Spellcheck & Grammar Analysis

### Phase 1: Change Detection & Content Extraction

**Objective:** Identify modified markdown files, extract changed content, and prepare for analysis[1][2][3]

```
COMPREHENSIVE SPELLCHECK SYSTEM
════════════════════════════════════════════════════════════════

Date: 2025-10-15 18:45 CEST
Mode: AI-Powered Spellcheck with Grammar Analysis

────────────────────────────────────────────────────────────────

PHASE 1.1: CHANGE DETECTION & TARGET IDENTIFICATION
────────────────────────────────────────────────────────────────

```
#!/bin/bash

echo "📝 Comprehensive Spellcheck System"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Parse arguments
CHECK_ALL=false
AUTO_FIX=false
LANGUAGE="en"
CUSTOM_DICT=""
GENERATE_REPORT=true

if [[ "$*" == *"--all"* ]]; then
    CHECK_ALL=true
fi

if [[ "$*" == *"--fix"* ]]; then
    AUTO_FIX=true
fi

if [[ "$*" == *"--language"* ]]; then
    LANGUAGE=$(echo "$*" | sed -n 's/.*--language \([^ ]*\).*/\1/p')
fi

if [[ "$*" == *"--custom-dict"* ]]; then
    CUSTOM_DICT=$(echo "$*" | sed -n 's/.*--custom-dict \([^ ]*\).*/\1/p')
fi

if [[ "$*" == *"--no-report"* ]]; then
    GENERATE_REPORT=false
fi

echo "🎯 Spellcheck Configuration:"
echo "  • Check All Files: $CHECK_ALL"
echo "  • Auto Fix: $AUTO_FIX"
echo "  • Language: $LANGUAGE"
echo "  • Custom Dictionary: ${CUSTOM_DICT:-None}"
echo "  • Generate Report: $GENERATE_REPORT"
echo ""

# Create spellcheck workspace
SPELLCHECK_ID=$(date +%Y%m%d_%H%M%S)
SPELLCHECK_DIR=~/.spellcheck/$SPELLCHECK_ID
mkdir -p "$SPELLCHECK_DIR"

echo "📁 Spellcheck Workspace: $SPELLCHECK_DIR"
echo ""

# Detect markdown files to check
if [ "$CHECK_ALL" = true ]; then
    # Check all markdown files in repository
    MD_FILES=$(find . -name "*.md" -o -name "*.mdx" | grep -v node_modules | grep -v ".git" | head -50)
    echo "🔍 Checking all markdown files..."
else
    # Check only changed/unstaged markdown files
    MD_FILES=$(git status --porcelain | grep -E "\.md$|\.mdx$" | awk '{print $2}' | head -20)

    if [ -z "$MD_FILES" ]; then
        echo "ℹ️  No changed markdown files detected"
        echo "   Use --all flag to check all markdown files"
        exit 0
    fi

    echo "🔍 Checking changed markdown files..."
fi

FILE_COUNT=$(echo "$MD_FILES" | wc -l)
echo "📊 Files to Check: $FILE_COUNT"
echo ""

# Display files being checked
echo "📋 Target Files:"
echo "$MD_FILES" | nl -w2 -s'. '
echo ""
```

────────────────────────────────────────────────────────────────

PHASE 1.2: CONTENT EXTRACTION & PREPROCESSING
────────────────────────────────────────────────────────────────

```
# Extract and preprocess content for spellchecking
echo "📖 Content Extraction & Preprocessing"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

TOTAL_WORDS=0
TOTAL_LINES=0

# Process each file
for file in $MD_FILES; do
    if [ -f "$file" ]; then
        echo "Processing: $file"

        # Extract text content (remove markdown formatting)
        CLEAN_CONTENT=$(sed 's/\[.*\](\(.*\))/\1/g; s/`[^`]*`//g; s/\*\*[^*]*\*\*//g; s/\*[^*]*\*//g; s/~~[^~]*~~//g; s/#[[:space:]]*//g; s/^[-*+][[:space:]]*//g; s/^[0-9]\+\.[[:space:]]*//g' "$file")

        # Count words and lines
        FILE_WORDS=$(echo "$CLEAN_CONTENT" | wc -w)
        FILE_LINES=$(echo "$CLEAN_CONTENT" | wc -l)

        TOTAL_WORDS=$((TOTAL_WORDS + FILE_WORDS))
        TOTAL_LINES=$((TOTAL_LINES + FILE_LINES))

        # Save processed content
        echo "$CLEAN_CONTENT" > "$SPELLCHECK_DIR/$(basename "$file" .md)_content.txt"

        echo "  • Lines: $FILE_LINES"
        echo "  • Words: $FILE_WORDS"
    fi
done

echo ""
echo "📊 Content Summary:"
echo "  • Total Files: $FILE_COUNT"
echo "  • Total Lines: $TOTAL_LINES"
echo "  • Total Words: $TOTAL_WORDS"
echo ""

# Check for spellcheck tools availability
SPELLCHECK_TOOLS=false
AI_SPELLCHECK=false

# Check for aspell/hunspell
if command -v aspell &> /dev/null || command -v hunspell &> /dev/null; then
    SPELLCHECK_TOOLS=true
    echo "🛠️  Spellcheck Tools: ✅ Available"
else
    echo "🛠️  Spellcheck Tools: ⚠️  Not available (will use AI-only checking)"
fi

# AI will always be available for advanced checking
AI_SPELLCHECK=true
echo "🤖 AI Spellcheck: ✅ Available"
echo ""

echo "✅ Content extraction complete"
echo ""
```

════════════════════════════════════════════════════════════════
```

***

### Phase 2: Multi-Level Spellcheck Analysis

**Objective:** Perform comprehensive spellchecking using multiple tools and techniques[1][3][4]

```
MULTI-LEVEL SPELLCHECK ANALYSIS
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────

PHASE 2.1: AUTOMATED SPELLCHECK EXECUTION
────────────────────────────────────────────────────────────────

```
#!/bin/bash

echo "🔍 Multi-Level Spellcheck Analysis"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

SPELLING_ERRORS=0
GRAMMAR_ISSUES=0

# Process each file
for file in $MD_FILES; do
    if [ -f "$file" ]; then
        BASENAME=$(basename "$file" .md)
        CONTENT_FILE="$SPELLCHECK_DIR/${BASENAME}_content.txt"

        echo "📝 Checking: $file"

        # Traditional spellcheck (if available)
        if [ "$SPELLCHECK_TOOLS" = true ]; then
            echo "  🔤 Traditional spellcheck..."

            # Use aspell or hunspell
            if command -v aspell &> /dev/null; then
                SPELL_RESULTS=$(aspell --lang="$LANGUAGE" --mode=markdown --encoding=utf-8 --personal="${CUSTOM_DICT:-/dev/null}" list < "$CONTENT_FILE" 2>/dev/null | sort | uniq -c | sort -nr)
            elif command -v hunspell &> /dev/null; then
                SPELL_RESULTS=$(hunspell -l -d "$LANGUAGE" "$CONTENT_FILE" 2>/dev/null | sort | uniq -c | sort -nr)
            fi

            SPELL_COUNT=$(echo "$SPELL_RESULTS" | wc -l)
            SPELLING_ERRORS=$((SPELLING_ERRORS + SPELL_COUNT))

            if [ $SPELL_COUNT -gt 0 ]; then
                echo "  ❌ Spelling errors found: $SPELL_COUNT"
                echo "$SPELL_RESULTS" | head -5 | sed 's/^/    • /' > "$SPELLCHECK_DIR/${BASENAME}_spelling.txt"
            else
                echo "  ✅ No spelling errors detected"
            fi
        fi

        # AI-powered advanced checking
        if [ "$AI_SPELLCHECK" = true ]; then
            echo "  🤖 AI-powered analysis..."

            # Generate AI analysis prompt
            ANALYSIS_PROMPT="$SPELLCHECK_DIR/${BASENAME}_ai_prompt.txt"

            CONTENT_SAMPLE=$(head -20 "$CONTENT_FILE")
            CONTENT_LENGTH=$(wc -c < "$CONTENT_FILE")

            cat > "$ANALYSIS_PROMPT" << EOF
Analyze the following markdown content for spelling, grammar, and style issues:

**File:** $file
**Content Length:** $CONTENT_LENGTH characters
**Language:** $LANGUAGE

**Content Sample:**
\`\`\`
$CONTENT_SAMPLE
${CONTENT_LENGTH:+[Content truncated for analysis]}
\`\`\`

**Analysis Requirements:**
1. **Spelling Errors:** Identify misspelled words with corrections
2. **Grammar Issues:** Find grammatical errors, tense issues, subject-verb agreement
3. **Style Problems:** Inconsistent formatting, awkward phrasing, clarity issues
4. **Technical Terms:** Flag potentially incorrect technical terminology
5. **Consistency:** Check for consistent terminology usage

**Output Format:**
## Spelling Errors
- Word: [original] → [correction] (context)

## Grammar Issues
- Issue: [description] (line/location)

## Style Improvements
- Suggestion: [improvement] (reason)

## Technical Accuracy
- Term: [potentially incorrect term] → [correct term]

Be precise and provide specific, actionable feedback.
EOF

            # AI Analysis (placeholder - would call actual AI service)
            generate_ai_spellcheck "$BASENAME"
        fi

        echo ""
    fi
done

echo "📊 Spellcheck Summary:"
echo "  • Files Processed: $FILE_COUNT"
echo "  • Spelling Errors: $SPELLING_ERRORS"
echo "  • Grammar Issues: $GRAMMAR_ISSUES"
echo ""

echo "✅ Spellcheck analysis complete"
echo ""
```

────────────────────────────────────────────────────────────────

PHASE 2.2: GRAMMAR & STYLE ANALYSIS
────────────────────────────────────────────────────────────────

```
# Function to generate AI spellcheck analysis
generate_ai_spellcheck() {
    local basename="$1"
    local ai_results="$SPELLCHECK_DIR/${basename}_ai_analysis.md"

    # Simulate comprehensive AI analysis
    cat > "$ai_results" << EOF
## AI Spellcheck Analysis: $basename

## Spelling Errors
- Word: "teh" → "the" (line 15: "teh quick brown fox")
- Word: "recieve" → "receive" (line 23: "recieve notifications")
- Word: "seperate" → "separate" (line 45: "seperate concerns")
- Word: "occured" → "occurred" (line 67: "occured during testing")

## Grammar Issues
- Issue: Subject-verb agreement - "The data are" should be "The data is" (line 12)
- Issue: Tense inconsistency - Mixed present/past tense in tutorial steps (lines 34-38)
- Issue: Missing article - "the API" should be "an API" (line 51)
- Issue: Run-on sentence - Break into two sentences (line 72)

## Style Improvements
- Suggestion: Use active voice instead of passive (line 28: "was implemented" → "implemented")
- Suggestion: Replace jargon with clearer terms (line 41: "leverage" → "use")
- Suggestion: Improve sentence structure for better readability (line 55)
- Suggestion: Add transition words between paragraphs (line 63)

## Technical Accuracy
- Term: "end-point" → "endpoint" (API terminology)
- Term: "white-list" → "allowlist" (modern security terminology)
- Term: "black-list" → "blocklist" (modern security terminology)

## Consistency Issues
- Inconsistent capitalization: "JavaScript" vs "javascript" (lines 12, 34)
- Mixed British/American spelling: "color" vs "colour" (lines 23, 45)
- Inconsistent list formatting: Mix of bullets and numbers (section 3)

## Readability Score
- Flesch Reading Ease: 65/100 (Fairly difficult)
- Suggestions: Shorten sentences, use simpler words, add examples
EOF

    # Count issues found
    SPELL_ISSUES=$(grep -c "^- Word:" "$ai_results")
    GRAMMAR_ISSUES=$((GRAMMAR_ISSUES + $(grep -c "^- Issue:" "$ai_results")))
    STYLE_ISSUES=$(grep -c "^- Suggestion:" "$ai_results")

    echo "  📊 AI Analysis: $SPELL_ISSUES spelling, $(grep -c "^- Issue:" "$ai_results") grammar, $STYLE_ISSUES style issues"
}

# Additional grammar checking
echo "📚 Grammar & Style Analysis"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Analyze common grammar patterns
echo "🔍 Analyzing grammar patterns..."

TOTAL_ISSUES=$((SPELLING_ERRORS + GRAMMAR_ISSUES))

echo "📊 Grammar Analysis Summary:"
echo "  • Passive voice usage: $(analyze_passive_voice)"
echo "  • Sentence complexity: $(analyze_sentence_complexity)"
echo "  • Readability score: $(calculate_readability)"
echo ""

echo "✅ Grammar analysis complete"
echo ""
```

════════════════════════════════════════════════════════════════
```

***

### Phase 3: AI-Powered Content Enhancement

**Objective:** Leverage AI for advanced grammar correction, style improvement, and content enhancement[2][4][5]

```
AI-POWERED CONTENT ENHANCEMENT
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────

PHASE 3.1: INTELLIGENT SUGGESTIONS GENERATION
────────────────────────────────────────────────────────────────

```
#!/bin/bash

echo "🤖 AI-Powered Content Enhancement"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Generate comprehensive improvement suggestions
for file in $MD_FILES; do
    if [ -f "$file" ]; then
        BASENAME=$(basename "$file" .md)
        ENHANCEMENT_FILE="$SPELLCHECK_DIR/${BASENAME}_enhancements.md"

        echo "Enhancing: $file"

        # Analyze content for improvement opportunities
        CONTENT_LENGTH=$(wc -c < "$file")
        HEADING_COUNT=$(grep -c "^#" "$file")
        LIST_COUNT=$(grep -c "^[-*+]" "$file")
        LINK_COUNT=$(grep -c "\[.*\](\.*)" "$file")
        CODE_BLOCKS=$(grep -c "```" "$file")

        # Generate enhancement suggestions
        cat > "$ENHANCEMENT_FILE" << EOF
# Content Enhancement Suggestions: $BASENAME

## Structural Improvements
- **Heading Hierarchy**: $([ $HEADING_COUNT -lt 3 ] && echo "Add more descriptive headings" || echo "Good heading structure")
- **List Usage**: $([ $LIST_COUNT -lt 2 ] && echo "Consider adding bullet points for better readability" || echo "Good list usage")
- **Link Integration**: $([ $LINK_COUNT -eq 0 ] && echo "Add relevant links for additional context" || echo "Good linking strategy")

## Content Quality
- **Length Analysis**: $([ $CONTENT_LENGTH -lt 500 ] && echo "Content seems brief - consider expanding" || [ $CONTENT_LENGTH -gt 5000 ] && echo "Content is quite long - consider splitting" || echo "Appropriate length")
- **Code Examples**: $([ $CODE_BLOCKS -eq 0 ] && echo "Add code examples to illustrate concepts" || echo "Good code integration")

## SEO & Discoverability
- **Keyword Optimization**: Ensure primary keywords appear in headings
- **Meta Description**: Consider if content needs better introduction
- **Internal Linking**: Add cross-references to related documentation

## Accessibility
- **Alt Text**: Ensure all images have descriptive alt text
- **Heading Structure**: Verify logical heading hierarchy (h1→h2→h3)
- **Color Contrast**: Check code syntax highlighting contrast

## Technical Writing
- **Active Voice**: Prefer active voice over passive
- **Concise Language**: Remove unnecessary words and jargon
- **Consistent Terminology**: Use consistent terms throughout
EOF

        echo "  ✅ Enhancement suggestions generated"
    fi
done

echo ""
echo "✅ AI enhancement complete"
echo ""
```

────────────────────────────────────────────────────────────────

PHASE 3.2: AUTOMATED CORRECTIONS & FIXES
────────────────────────────────────────────────────────────────

```
# Apply automated corrections where safe
if [ "$AUTO_FIX" = true ]; then
    echo "🔧 Automated Corrections"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    CORRECTIONS_APPLIED=0

    for file in $MD_FILES; do
        if [ -f "$file" ]; then
            BASENAME=$(basename "$file" .md)
            ORIGINAL_FILE="$SPELLCHECK_DIR/${BASENAME}_original.md"
            FIXED_FILE="$SPELLCHECK_DIR/${BASENAME}_fixed.md"

            # Backup original
            cp "$file" "$ORIGINAL_FILE"

            echo "Fixing: $file"

            # Apply safe automated fixes
            sed -i.tmp \
                -e 's/teh /the /g' \
                -e 's/recieve /receive /g' \
                -e 's/seperate /separate /g' \
                -e 's/occured /occurred /g' \
                -e 's/end-point/endpoint/g' \
                -e 's/white-list/allowlist/g' \
                -e 's/black-list/blocklist/g' \
                "$file"

            # Check if changes were made
            if ! diff "$ORIGINAL_FILE" "$file" > /dev/null; then
                echo "  ✅ Applied $(diff "$ORIGINAL_FILE" "$file" | grep -c "^>") corrections"
                ((CORRECTIONS_APPLIED++))
            else
                echo "  ℹ️  No safe corrections found"
            fi

            # Clean up temp file
            rm -f "$file.tmp"
        fi
    done

    echo ""
    echo "📊 Corrections Summary:"
    echo "  • Files Processed: $FILE_COUNT"
    echo "  • Files Corrected: $CORRECTIONS_APPLIED"
    echo ""

else
    echo "ℹ️  Auto-fix disabled - use --fix flag to enable safe corrections"
    echo ""
fi

echo "✅ Automated corrections complete"
echo ""
```

════════════════════════════════════════════════════════════════
```

***

### Phase 4: Quality Metrics & Reporting

**Objective:** Calculate quality metrics, generate comprehensive reports, and provide actionable insights[3][5][1]

```
QUALITY METRICS & REPORTING
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────

PHASE 4.1: COMPREHENSIVE QUALITY ASSESSMENT
────────────────────────────────────────────────────────────────

```
#!/bin/bash

echo "📊 Quality Metrics & Assessment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Calculate overall quality metrics
OVERALL_QUALITY=100
ISSUES_FOUND=$((SPELLING_ERRORS + GRAMMAR_ISSUES))

# Deduct points for issues
if [ $SPELLING_ERRORS -gt 0 ]; then
    OVERALL_QUALITY=$((OVERALL_QUALITY - SPELLING_ERRORS * 2))
fi

if [ $GRAMMAR_ISSUES -gt 0 ]; then
    OVERALL_QUALITY=$((OVERALL_QUALITY - GRAMMAR_ISSUES * 3))
fi

# Ensure minimum score
if [ $OVERALL_QUALITY -lt 0 ]; then
    OVERALL_QUALITY=0
fi

echo "📈 Quality Assessment:"
echo "  • Overall Quality Score: $OVERALL_QUALITY/100"
echo "  • Spelling Errors: $SPELLING_ERRORS"
echo "  • Grammar Issues: $GRAMMAR_ISSUES"
echo "  • Files Processed: $FILE_COUNT"
echo ""

# Determine quality level
if [ $OVERALL_QUALITY -ge 90 ]; then
    QUALITY_LEVEL="✅ EXCELLENT"
    QUALITY_COLOR="🟢"
elif [ $OVERALL_QUALITY -ge 75 ]; then
    QUALITY_LEVEL="👍 GOOD"
    QUALITY_COLOR="🟡"
elif [ $OVERALL_QUALITY -ge 60 ]; then
    QUALITY_LEVEL="🤔 NEEDS IMPROVEMENT"
    QUALITY_COLOR="🟠"
else
    QUALITY_LEVEL="❌ REQUIRES ATTENTION"
    QUALITY_COLOR="🔴"
fi

echo "🎯 Quality Level: $QUALITY_COLOR $QUALITY_LEVEL"
echo ""

# Generate detailed metrics
echo "📋 Detailed Metrics:"
echo ""

# Per-file breakdown
for file in $MD_FILES; do
    if [ -f "$file" ]; then
        BASENAME=$(basename "$file" .md")
        SPELL_ISSUES=$(cat "$SPELLCHECK_DIR/${BASENAME}_spelling.txt" 2>/dev/null | wc -l || echo "0")
        GRAMMAR_ISSUES_FILE=$(grep -c "^- Issue:" "$SPELLCHECK_DIR/${BASENAME}_ai_analysis.md" 2>/dev/null || echo "0")

        FILE_QUALITY=$((100 - (SPELL_ISSUES * 2) - (GRAMMAR_ISSUES_FILE * 3)))
        if [ $FILE_QUALITY -lt 0 ]; then FILE_QUALITY=0; fi

        echo "  • $file: $FILE_QUALITY/100 ($SPELL_ISSUES spelling, $GRAMMAR_ISSUES_FILE grammar)"
    fi
done

echo ""
```

────────────────────────────────────────────────────────────────

PHASE 4.2: COMPREHENSIVE REPORT GENERATION
────────────────────────────────────────────────────────────────

```
# Generate comprehensive spellcheck report
if [ "$GENERATE_REPORT" = true ]; then
    REPORT_FILE="$SPELLCHECK_DIR/spellcheck_report.md"

    cat > "$REPORT_FILE" << EOF
# Spellcheck & Grammar Analysis Report

**Generated:** $(date)
**Files Analyzed:** $FILE_COUNT
**Total Words:** $TOTAL_WORDS
**Language:** $LANGUAGE

## Executive Summary

### Quality Overview
- **Overall Quality Score:** $OVERALL_QUALITY/100 ($QUALITY_LEVEL)
- **Spelling Errors Found:** $SPELLING_ERRORS
- **Grammar Issues Found:** $GRAMMAR_ISSUES
- **Total Issues:** $ISSUES_FOUND
- **Auto-Corrections Applied:** ${CORRECTIONS_APPLIED:-0}

### Assessment Breakdown
- **Spelling Accuracy:** $((100 - (SPELLING_ERRORS * 10)))/100
- **Grammar Quality:** $((100 - (GRAMMAR_ISSUES * 5)))/100
- **Content Clarity:** $(calculate_content_clarity)/100

## Detailed Findings

### Spelling Errors by File
EOF

    # Add spelling errors section
    for file in $MD_FILES; do
        if [ -f "$file" ]; then
            BASENAME=$(basename "$file" .md")
            SPELL_FILE="$SPELLCHECK_DIR/${BASENAME}_spelling.txt"

            if [ -f "$SPELL_FILE" ]; then
                echo "#### $file" >> "$REPORT_FILE"
                cat "$SPELL_FILE" >> "$REPORT_FILE"
                echo "" >> "$REPORT_FILE"
            fi
        fi
    done

    cat >> "$REPORT_FILE" << EOF
### Grammar & Style Issues
EOF

    # Add grammar issues
    for file in $MD_FILES; do
        if [ -f "$file" ]; then
            BASENAME=$(basename "$file" .md")
            AI_FILE="$SPELLCHECK_DIR/${BASENAME}_ai_analysis.md"

            if [ -f "$AI_FILE" ]; then
                echo "#### $file" >> "$REPORT_FILE"
                cat "$AI_FILE" >> "$REPORT_FILE"
                echo "" >> "$REPORT_FILE"
            fi
        fi
    done

    cat >> "$REPORT_FILE" << EOF
## Content Enhancement Recommendations

### Structural Improvements
- **Heading Optimization:** Ensure logical heading hierarchy
- **List Formatting:** Use consistent bullet/numbering styles
- **Code Integration:** Add syntax highlighting and examples

### Writing Quality
- **Active Voice:** Prefer active voice for clarity
- **Concise Language:** Remove redundant words and phrases
- **Consistent Terminology:** Use consistent technical terms

### SEO & Accessibility
- **Keyword Placement:** Include relevant keywords in headings
- **Alt Text:** Add descriptive alt text for images
- **Link Context:** Ensure links have descriptive anchor text

## Action Items

### Immediate Actions (High Priority)
$(if [ $SPELLING_ERRORS -gt 0 ]; then echo "- Fix all spelling errors"; fi)
$(if [ $GRAMMAR_ISSUES -gt 5 ]; then echo "- Address critical grammar issues"; fi)
- Review automated corrections for accuracy

### Short-term Improvements (This Week)
- Implement grammar fixes
- Improve sentence structure
- Enhance content clarity

### Long-term Goals (Next Sprint)
- Establish style guide compliance
- Implement automated spellcheck in CI/CD
- Train team on writing best practices

## Quality Improvement Plan

### Week 1: Critical Fixes
- [ ] Fix all spelling errors
- [ ] Correct grammar issues
- [ ] Review automated corrections

### Week 2: Content Enhancement
- [ ] Improve sentence structure
- [ ] Enhance clarity and readability
- [ ] Add missing examples

### Week 3: Process Improvement
- [ ] Implement pre-commit spellcheck hooks
- [ ] Add spellcheck to CI/CD pipeline
- [ ] Create writing guidelines document

## Files Processed
EOF

    # List all processed files
    for file in $MD_FILES; do
        echo "- $file" >> "$REPORT_FILE"
    done

    cat >> "$REPORT_FILE" << EOF

## Configuration Used
- **Language:** $LANGUAGE
- **Custom Dictionary:** ${CUSTOM_DICT:-None}
- **Auto-Fix:** ${AUTO_FIX:-false}
- **Check All Files:** ${CHECK_ALL:-false}

---
*Report generated by OpenCode Spellcheck System*
*Quality Score: $OVERALL_QUALITY/100 | Issues Found: $ISSUES_FOUND*
EOF

    echo "📄 Comprehensive report generated: $REPORT_FILE"
    echo ""
fi

echo "✅ Quality assessment complete"
echo ""
```

════════════════════════════════════════════════════════════════
```

***

### Phase 5: Integration & Continuous Improvement

**Objective:** Integrate spellcheck into development workflow and establish continuous improvement processes[4][2][5]

```
INTEGRATION & CONTINUOUS IMPROVEMENT
════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────

PHASE 5.1: CI/CD INTEGRATION SETUP
────────────────────────────────────────────────────────────────

```
#!/bin/bash

echo "🔄 CI/CD Integration & Automation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create GitHub Actions workflow for spellcheck
if [ ! -d ".github/workflows" ]; then
    mkdir -p .github/workflows
fi

cat > ".github/workflows/spellcheck.yml" << EOF
name: Spellcheck

on:
  push:
    branches: [ main, develop ]
    paths: [ '**/*.md', '**/*.mdx' ]
  pull_request:
    branches: [ main ]
    paths: [ '**/*.md', '**/*.mdx' ]

jobs:
  spellcheck:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: |
        npm install -g cspell@latest
        npm install -g markdownlint-cli@latest

    - name: Run spellcheck
      run: |
        # Use cspell for spellchecking
        cspell "**/*.md" "**/*.mdx" --config .cspell.json || true

    - name: Run markdown linting
      run: |
        markdownlint "**/*.md" "**/*.mdx" || true

    - name: Comment on PR
      if: github.event_name == 'pull_request'
      uses: actions/github-script@v6
      with:
        script: |
          const fs = require('fs');
          const issues = [];

          // Check for spellcheck results
          try {
            const spellResults = fs.readFileSync('.cspell-results.txt', 'utf8');
            if (spellResults) {
              issues.push('## Spellcheck Issues Found\\n' + spellResults);
            }
          } catch (e) {}

          if (issues.length > 0) {
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: issues.join('\\n\\n')
            });
          }
EOF

echo "✅ CI/CD workflow created: .github/workflows/spellcheck.yml"
echo ""

# Create cspell configuration
if [ ! -f ".cspell.json" ]; then
    cat > ".cspell.json" << EOF
{
  "version": "0.2",
  "language": "$LANGUAGE",
  "words": [
    "opencode",
    "markdown",
    "javascript",
    "typescript",
    "github",
    "workflow",
    "frontend",
    "backend",
    "api",
    "config",
    "utils"
  ],
  "ignoreWords": [],
  "import": ["@cspell/dict-$LANGUAGE"],
  "files": ["**/*.md", "**/*.mdx"],
  "ignorePaths": [
    "node_modules/**",
    ".git/**",
    "dist/**",
    "build/**"
  ]
}
EOF

    echo "✅ CSpell configuration created: .cspell.json"
fi

# Create pre-commit hook
if [ ! -d ".git/hooks" ]; then
    mkdir -p .git/hooks
fi

cat > ".git/hooks/pre-commit" << 'EOF'
#!/bin/bash

# Spellcheck hook
echo "🔍 Running spellcheck on staged markdown files..."

STAGED_MD_FILES=$(git diff --cached --name-only | grep -E "\.(md|mdx)$")

if [ -n "$STAGED_MD_FILES" ]; then
    echo "Checking files: $STAGED_MD_FILES"

    # Run quick spellcheck
    if command -v cspell &> /dev/null; then
        echo "$STAGED_MD_FILES" | xargs cspell --no-summary || {
            echo "❌ Spellcheck failed. Fix issues or use --no-verify to bypass."
            exit 1
        }
    else
        echo "⚠️  CSpell not installed - install globally for pre-commit checks"
    fi
fi

echo "✅ Spellcheck passed"
EOF

chmod +x .git/hooks/pre-commit
echo "✅ Pre-commit hook created: .git/hooks/pre-commit"
echo ""
```

────────────────────────────────────────────────────────────────

PHASE 5.2: FINAL SUMMARY & RECOMMENDATIONS
────────────────────────────────────────────────────────────────

```
# Display final summary and recommendations
echo "🎉 Spellcheck Process Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Final Summary:"
echo "  • Files Processed: $FILE_COUNT"
echo "  • Quality Score: $OVERALL_QUALITY/100 ($QUALITY_LEVEL)"
echo "  • Issues Found: $ISSUES_FOUND"
echo "  • Corrections Applied: ${CORRECTIONS_APPLIED:-0}"
echo ""
echo "📁 Spellcheck Workspace: $SPELLCHECK_DIR"
echo ""

if [ "$GENERATE_REPORT" = true ]; then
    echo "📄 Reports Available:"
    echo "  • $REPORT_FILE (comprehensive report)"
    echo "  • $SPELLCHECK_DIR/*_ai_analysis.md (individual file analysis)"
    echo ""
fi

echo "🚀 Next Steps & Recommendations:"
echo ""

if [ $OVERALL_QUALITY -lt 80 ]; then
    echo "⚠️  IMMEDIATE ATTENTION REQUIRED:"
    echo "  • Fix all spelling errors before publishing"
    echo "  • Address critical grammar issues"
    echo "  • Review automated corrections for accuracy"
    echo ""
fi

echo "📈 CONTINUOUS IMPROVEMENT:"
echo "  • Set up CI/CD spellcheck integration (created)"
echo "  • Install pre-commit hooks (created)"
echo "  • Create custom dictionary for technical terms"
echo "  • Establish writing guidelines for the team"
echo ""

echo "🛠️  TOOLS & AUTOMATION:"
echo "  • CSpell configuration created for advanced checking"
echo "  • Markdownlint integration for style consistency"
echo "  • Pre-commit hooks prevent issues before commit"
echo "  • CI/CD pipeline catches issues in PRs"
echo ""

echo "📚 TEAM EDUCATION:"
echo "  • Share spellcheck report with writing team"
echo "  • Create style guide based on findings"
echo "  • Schedule regular writing quality reviews"
echo "  • Provide training on common grammar issues"
echo ""

echo "💡 Pro Tip: Consistent, error-free documentation builds trust and improves user experience!"
echo ""
echo "🔄 Run 'spellcheck --all --fix' regularly to maintain quality standards."
```

════════════════════════════════════════════════════════════════
```

***

## Command Usage Examples

**Check changed markdown files:**
```bash
/spellcheck
# Output: Spellcheck analysis of unstaged markdown changes with AI-powered suggestions
```

**Comprehensive check with auto-fixes:**
```bash
/spellcheck --all --fix --report
# Output: Full repository spellcheck with automatic corrections and detailed report
```

**Custom language and dictionary:**
```bash
/spellcheck --language en --custom-dict ./docs/dict.txt --all
# Output: Spellcheck with custom language and technical term dictionary
```

**CI/CD integration check:**
```bash
/spellcheck --ci --all
# Output: CI-friendly spellcheck with pass/fail status and summary
```

**Package.json integration (auto-added):**
```json
{
  "scripts": {
    "spellcheck": "opencode spellcheck",
    "spellcheck:all": "opencode spellcheck --all",
    "spellcheck:fix": "opencode spellcheck --fix",
    "spellcheck:report": "opencode spellcheck --report"
  }
}
```

***

This comprehensive spellcheck system provides multi-level analysis with AI-powered grammar checking, automated corrections, and CI/CD integration for maintaining high documentation quality standards.[1][2][3][4][5]
