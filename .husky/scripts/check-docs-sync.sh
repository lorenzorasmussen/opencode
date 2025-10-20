#!/bin/bash

# Check documentation sync status
# This script runs during pre-commit to ensure specs are up to date

echo "🔍 Checking documentation sync..."

# Get the list of staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|js|py)$' | head -10)

if [ -n "$STAGED_FILES" ]; then
    echo "📝 Found staged code changes, checking if specs need updates..."

    # Run a quick sync check using the documenter tool
    cd packages/opencode
    bun run -e "
    import { documenter } from './src/tool/documenter.js'
    async function checkSync() {
      try {
        const result = await documenter.execute({ command: 'spec-kit-sync' })
        const criticalChanges = result.changes.filter(c => c.type === 'code_changes')
        if (criticalChanges.length > 0) {
          console.log('⚠️  Documentation may need updates:')
          criticalChanges.forEach(change => {
            console.log('   - ' + change.description)
          })
          console.log('')
          console.log('💡 Consider running: /document --spec-kit-sync')
          console.log('   Or update specs manually before committing')
        } else {
          console.log('✅ No critical documentation updates needed')
        }
      } catch (error) {
        console.log('⚠️  Could not check documentation sync:', error.message)
      }
    }
    checkSync()
    " 2>/dev/null

    cd -
else
    echo "✅ No code changes staged, skipping documentation check"
fi

echo ""