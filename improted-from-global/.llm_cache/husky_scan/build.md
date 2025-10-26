---
description: "Quick project build/compilation utility"
agent: build_utility
subagent: none
argument-hint: "--dev --prod --watch --clean"
---

# 2. `/build` - Quick Build/Compile Command

## Command Workflow

BUILD UTILITY
════════════════════════════════════════════════════════════════

Command: /build --prod

Execution:

bash
#!/bin/bash

MODE="${1:---prod}"

echo "🏗️  Build Utility"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Mode: $MODE"
echo ""

# Detect project type
if [ -f "package.json" ]; then
    PROJECT_TYPE="javascript"
elif [ -f "pyproject.toml" ]; then
    PROJECT_TYPE="python"
elif [ -f "Cargo.toml" ]; then
    PROJECT_TYPE="rust"
elif [ -f "go.mod" ]; then
    PROJECT_TYPE="go"
fi

echo "📦 Project Type: $PROJECT_TYPE"
echo ""

case $PROJECT_TYPE in
    javascript)
        echo "🔨 Building JavaScript/TypeScript project..."
        
        # Check for build tool
        if [ -f "vite.config.ts" ] || [ -f "vite.config.js" ]; then
            BUILD_TOOL="vite"
        elif [ -f "webpack.config.js" ]; then
            BUILD_TOOL="webpack"
        else
            BUILD_TOOL="tsc"
        fi
        
        echo "   Build Tool: $BUILD_TOOL"
        echo ""
        
        case $MODE in
            --dev)
                npm run dev
                ;;
            --prod)
                # Production build
                echo "   Step 1/5: Cleaning previous build..."
                rm -rf dist/ build/
                
                echo "   Step 2/5: Type checking..."
                npx tsc --noEmit
                
                echo "   Step 3/5: Linting..."
                npm run lint
                
                echo "   Step 4/5: Building..."
                npm run build
                
                echo "   Step 5/5: Analyzing bundle..."
                if [ -d "dist" ]; then
                    echo ""
                    echo "   📊 Build Summary:"
                    du -sh dist/
                    find dist/ -name "*.js" -o -name "*.css" | while read file; do
                        SIZE=$(du -h "$file" | cut -f1)
                        echo "      $SIZE - $(basename $file)"
                    done
                fi
                ;;
            --watch)
                npm run build -- --watch
                ;;
            --clean)
                echo "   🧹 Cleaning build artifacts..."
                rm -rf dist/ build/ node_modules/.cache/
                echo "   ✅ Clean complete"
                ;;
        esac
        ;;
        
    python)
        echo "🔨 Building Python project..."
        
        case $MODE in
            --prod)
                echo "   Step 1/4: Installing dependencies..."
                pip install -r requirements.txt
                
                echo "   Step 2/4: Running tests..."
                pytest
                
                echo "   Step 3/4: Building package..."
                python -m build
                
                echo "   Step 4/4: Package created:"
                ls -lh dist/
                ;;
            --dev)
                pip install -e .
                ;;
        esac
        ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Build complete!"
Output Example:

text
🏗️  Build Utility
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Mode: --prod

📦 Project Type: javascript

🔨 Building JavaScript/TypeScript project...
   Build Tool: vite

   Step 1/5: Cleaning previous build...
   ✓ Removed dist/

   Step 2/5: Type checking...
   ✓ No type errors

   Step 3/5: Linting...
   ✓ No linting errors

   Step 4/5: Building...
   vite v5.0.0 building for production...
   ✓ 156 modules transformed.
   dist/index.html                   0.45 kB
   dist/assets/index-BdxkT3g9.css   12.34 kB │ gzip:  3.21 kB
   dist/assets/index-DFg7Th2x.js   142.56 kB │ gzip: 45.78 kB
   ✓ built in 2.34s

   Step 5/5: Analyzing bundle...

   📊 Build Summary:
   160K    dist/
      143K - index-DFg7Th2x.js
      12K  - index-BdxkT3g9.css
      1K   - index.html

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Build complete!