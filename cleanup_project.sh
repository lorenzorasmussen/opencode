#!/bin/bash
# cleanup_project.sh

echo "→ Removing .DS_Store files..."
find . -name ".DS_Store" -type f -delete

# 2. Update .gitignore
echo "→ Updating .gitignore..."
cat >> .gitignore <<'EOF2'

# macOS
**/.DS_Store
.DS_Store

# Hook system
hooks/logs/*.log
!hooks/logs/.gitkeep
hooks/logs/loop_state/*
!hooks/logs/loop_state/.gitkeep
.hooks/
hooks/config/naming_conventions.json

# Caches
.turbo/cache/
**/.cache/
**/cache/

# IDE
.vscode/
.idea/

# Temporary files
*.tmp
*.bak
*.swp
*~
EOF2

# 3. Remove committed logs
echo "→ Removing logs from git..."
git rm --cached hooks/logs/*.log 2>/dev/null || true
git rm --cached .hooks/*.log 2>/dev/null || true

# 4. Remove sample files from hooks dir
echo "→ Cleaning sample files..."
rm -f hooks/*.sample

# 5. Remove duplicate .hooks directory
echo "→ Removing duplicate .hooks..."
rm -rf .hooks

# 6. Create .gitkeep files
echo "→ Creating .gitkeep files..."
touch hooks/logs/.gitkeep
touch hooks/logs/loop_state/.gitkeep

# 7. Remove caches from git
echo "→ Removing caches..."
git rm -r --cached .turbo/cache 2>/dev/null || true
git rm -r --cached node_modules/.cache 2>/dev/null || true

echo "✓ Cleanup complete!"
echo "Review changes with: git status"
echo "Then commit: git add . && git commit -m 'chore: cleanup project structure'"
