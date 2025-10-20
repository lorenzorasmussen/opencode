#!/bin/bash
# Prevent committing large files
# Warn: >1MB, Block: >5MB
#

echo "  -  Checking file sizes..."

WARN_SIZE=$((1024 * 1024))      # 1MB
ERROR_SIZE=$((5 * 1024 * 1024)) # 5MB

FILES=$(git diff --cached --name-only --diff-filter=ACM)
LARGE_FILES=()
HUGE_FILES=()

for file in $FILES; do
    if [ -f "$file" ]; then
        SIZE=$(wc -c < "$file")

        if [ $SIZE -gt $ERROR_SIZE ]; then
            HUGE_FILES+=("$file:$SIZE")
        elif [ $SIZE -gt $WARN_SIZE ]; then
            LARGE_FILES+=("$file:$SIZE")
        fi
    fi
done

# Block huge files
if [ ${#HUGE_FILES[@]} -gt 0 ]; then
    echo ""
    echo "    ❌ FILES TOO LARGE! Commit blocked."
    echo ""
    for item in "${HUGE_FILES[@]}"; do
        file="${item%:*}"
        size="${item#*:}"
        readable=$(numfmt --to=iec $size)
        echo "       $file ($readable)"
    done
    echo ""
    echo "    Maximum allowed: 5MB"
    echo "    Use Git LFS for large files: git lfs track \"$file\""
    echo ""
    exit 1
fi

# Warn about large files
if [ ${#LARGE_FILES[@]} -gt 0 ]; then
    echo ""
    echo "    ⚠️  Large files detected:"
    for item in "${LARGE_FILES[@]}"; do
        file="${item%:*}"
        size="${item#*:}"
        readable=$(numfmt --to=iec $size)
        echo "       $file ($readable)"
    done
    echo ""
fi

echo "    ✓ File size check passed"