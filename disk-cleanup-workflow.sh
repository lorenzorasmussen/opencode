#!/bin/bash

# Emergency Disk Space Cleanup Workflow
# Run this script to quickly free up disk space

echo "🧹 Starting Emergency Disk Cleanup..."

# Function to safely remove large directories with progress
safe_remove_large() {
    local dir="$1"
    local desc="$2"
    if [ -d "$dir" ]; then
        echo "Removing $desc ($dir)..."
        # Use find to delete files in batches to avoid timeout
        find "$dir" -type f -delete 2>/dev/null
        find "$dir" -type d -empty -delete 2>/dev/null
        # Try to remove the directory itself
        rmdir "$dir" 2>/dev/null && echo "✅ Removed $desc" || echo "⚠️  Partially removed $desc (some files may remain)"
    else
        echo "Directory $dir not found"
    fi
}

# Function to safely remove directories
safe_remove() {
    local dir="$1"
    local desc="$2"
    if [ -d "$dir" ]; then
        echo "Removing $desc..."
        rm -rf "$dir" 2>/dev/null && echo "✅ Removed $desc" || echo "❌ Failed to remove $desc"
    else
        echo "Directory $dir not found"
    fi
}

# Function to safely remove files
safe_remove_file() {
    local file="$1"
    local desc="$2"
    if [ -f "$file" ]; then
        echo "Removing $desc..."
        rm -f "$file" 2>/dev/null && echo "✅ Removed $desc" || echo "❌ Failed to remove $desc"
    else
        echo "File $file not found"
    fi
}

# LARGE CACHE DIRECTORIES (SAFE TO DELETE - High Priority)
# Use XDG standards for cache directories
CACHE_HOME="${XDG_CACHE_HOME:-$HOME/.cache}"
safe_remove "$CACHE_HOME/pip" "Python pip cache"
safe_remove "$CACHE_HOME/pipenv" "Pipenv cache"
safe_remove "$CACHE_HOME/poetry" "Poetry cache"
safe_remove "$CACHE_HOME/uv" "UV cache"
safe_remove "$CACHE_HOME/pre-commit" "Pre-commit cache"
safe_remove "$CACHE_HOME/ruff" "Ruff cache"
safe_remove "$HOME/.targeted_search_cache" "Search cache"
safe_remove "$HOME/.npm/_cacache" "NPM cache"
safe_remove "$HOME/.yarn/cache" "Yarn cache"

# LOG DIRECTORIES (SAFE TO DELETE - Medium Priority)
safe_remove "$HOME/.copilot/logs" "Copilot logs"
safe_remove "$HOME/.gemini/tmp" "Gemini temp files"
safe_remove "$HOME/.continue/logs" "Continue logs"
safe_remove "$HOME/.qwen/tmp" "Qwen temp files"
safe_remove "$HOME/workspace/logs" "Workspace logs"

# BACKUP FILES (SAFE TO DELETE - Check first!)
safe_remove_file "$HOME/Projects-backup.tar.gz" "Projects backup archive"
safe_remove_file "$HOME/lima.tar.gz" "Lima backup"
safe_remove_file "$HOME/podman.tar.gz" "Podman backup"
safe_remove_file "$HOME/ai-job-assistant.html" "Job assistant file"

# SPECIFIC LARGE FILES (Find and remove)
echo "🔍 Finding large files (>100MB) in projects/ ..."
find "$HOME/projects" -type f -size +100M -exec ls -lh {} \; 2>/dev/null | head -5
echo "💡 To remove large files: find $HOME/projects -type f -size +100M -delete"

# TEMPORARY FILES CLEANUP
echo "🗂️  Cleaning temporary files in workspace/ ..."
find "$HOME/workspace" -name "*.tmp" -type f -delete 2>/dev/null && echo "✅ Removed .tmp files" || echo "No .tmp files found"
find "$HOME/workspace" -name "*.temp" -type f -delete 2>/dev/null && echo "✅ Removed .temp files" || echo "No .temp files found"
find "$HOME/workspace" -name "*~" -type f -delete 2>/dev/null && echo "✅ Removed backup files (*~)" || echo "No backup files found"

# SYSTEM CACHE (May require sudo)
echo "🖥️  System cache cleanup (may require sudo):"
if command -v brew &> /dev/null; then
    brew cleanup 2>/dev/null && echo "✅ Homebrew cache cleaned" || echo "❌ Homebrew cleanup failed"
else
    echo "Homebrew not available"
fi

# Docker cleanup (if available)
if command -v docker &> /dev/null; then
    echo "🐳 Docker cleanup:"
    docker system prune -f 2>/dev/null && echo "✅ Docker system pruned" || echo "❌ Docker cleanup failed"
else
    echo "Docker not available"
fi

# Show current disk usage
echo ""
echo "📊 Current disk usage:"
df -h "$HOME/projects" | tail -1

# Show largest remaining directories
echo ""
echo "📂 Largest remaining directories in projects:"
du -sh "$HOME/projects"/* 2>/dev/null | sort -hr | head -10

# Node modules warning
echo ""
echo "⚠️  LARGE NODE_MODULES DETECTED:"
find . -name "node_modules" -type d -exec du -sh {} \; 2>/dev/null | sort -hr | head -3

echo ""
echo "🎉 Emergency cleanup complete!"
echo ""
echo "💡 Additional space-saving commands:"
echo "   rm -rf $HOME/.Trash/*                          # Empty Trash"
echo "   find $HOME/Downloads -mtime +30 -delete       # Remove old downloads"
echo "   sudo rm -rf /private/var/log/*                   # Clear system logs (requires sudo)"
echo ""
echo "🚨 EMERGENCY: If still low on space:"
echo "   find $HOME/projects -name node_modules -type d -exec rm -rf {} + 2>/dev/null || true  # Remove node modules"
echo "   find $HOME/projects -name .git -type d -exec rm -rf {} + 2>/dev/null || true          # Remove git history (backup first!)"