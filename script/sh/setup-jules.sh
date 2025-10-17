#!/bin/bash

# Jules Setup Script for Local Development
# This script helps you set up Jules integration locally and on GitHub

set -e

COLOR_GREEN='\033[0;32m'
COLOR_BLUE='\033[0;34m'
COLOR_YELLOW='\033[1;33m'
COLOR_RED='\033[0;31m'
COLOR_NC='\033[0m' # No Color

echo -e "${COLOR_BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_NC}"
echo -e "${COLOR_BLUE}   Jules Automated Issue Resolution Setup${COLOR_NC}"
echo -e "${COLOR_BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_NC}"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${COLOR_BLUE}[1/6]${COLOR_NC} Checking prerequisites..."

if ! command_exists git; then
    echo -e "${COLOR_RED}❌ Git is not installed${COLOR_NC}"
    exit 1
fi

if ! command_exists gh; then
    echo -e "${COLOR_YELLOW}⚠️  GitHub CLI (gh) is not installed${COLOR_NC}"
    echo -e "   Install it from: https://cli.github.com/"
    echo -e "   Or continue without it (some features will be limited)"
    read -p "   Continue without gh? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    HAS_GH=false
else
    echo -e "${COLOR_GREEN}✓${COLOR_NC} GitHub CLI found"
    HAS_GH=true
fi

if ! command_exists npm; then
    echo -e "${COLOR_RED}❌ npm is not installed${COLOR_NC}"
    exit 1
fi
echo -e "${COLOR_GREEN}✓${COLOR_NC} npm found"

echo ""

# Check if we're in a git repository
echo -e "${COLOR_BLUE}[2/6]${COLOR_NC} Checking repository..."

if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${COLOR_RED}❌ Not in a git repository${COLOR_NC}"
    exit 1
fi

REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"
echo -e "${COLOR_GREEN}✓${COLOR_NC} Repository found: $REPO_ROOT"

# Get repository info
REPO_URL=$(git config --get remote.origin.url)
REPO_NAME=$(basename -s .git "$REPO_URL")
REPO_OWNER=$(basename $(dirname "$REPO_URL") | sed 's/.*://')

echo -e "   Owner: $REPO_OWNER"
echo -e "   Repo: $REPO_NAME"
echo ""

# Check if workflow file exists
echo -e "${COLOR_BLUE}[3/6]${COLOR_NC} Checking workflow files..."

if [ -f ".github/workflows/jules-automation.yml" ]; then
    echo -e "${COLOR_GREEN}✓${COLOR_NC} Jules automation workflow found"
else
    echo -e "${COLOR_YELLOW}⚠️  Workflow file not found${COLOR_NC}"
    echo -e "   Expected location: .github/workflows/jules-automation.yml"
fi

if [ -f ".github/jules-config.yml" ]; then
    echo -e "${COLOR_GREEN}✓${COLOR_NC} Jules configuration found"
else
    echo -e "${COLOR_YELLOW}⚠️  Configuration file not found${COLOR_NC}"
fi
echo ""

# Setup GitHub Secret
echo -e "${COLOR_BLUE}[4/6]${COLOR_NC} Setting up GitHub Secret for Jules API Key..."

if [ "$HAS_GH" = true ]; then
    # Check if logged in to GitHub CLI
    if ! gh auth status >/dev/null 2>&1; then
        echo -e "${COLOR_YELLOW}⚠️  Not logged in to GitHub CLI${COLOR_NC}"
        echo -e "   Logging in..."
        gh auth login
    fi
    
    echo -e "   You need to add your Jules API key as a GitHub Secret."
    echo -e "   Secret name: ${COLOR_GREEN}JULES_API_KEY${COLOR_NC}"
    echo ""
    read -p "   Do you want to add it now? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "   Enter your Jules API key (input will be hidden):"
        read -s JULES_API_KEY
        echo ""
        
        if [ -n "$JULES_API_KEY" ]; then
            echo "$JULES_API_KEY" | gh secret set JULES_API_KEY --repo "$REPO_OWNER/$REPO_NAME"
            echo -e "${COLOR_GREEN}✓${COLOR_NC} Secret added successfully"
        else
            echo -e "${COLOR_YELLOW}⚠️  No API key provided, skipping${COLOR_NC}"
        fi
    fi
else
    echo -e "   Please add your Jules API key manually:"
    echo -e "   1. Go to: ${COLOR_BLUE}https://github.com/$REPO_OWNER/$REPO_NAME/settings/secrets/actions${COLOR_NC}"
    echo -e "   2. Click 'New repository secret'"
    echo -e "   3. Name: ${COLOR_GREEN}JULES_API_KEY${COLOR_NC}"
    echo -e "   4. Value: Your Jules API key"
    echo -e "   5. Click 'Add secret'"
    echo ""
    read -p "   Press Enter when done..."
fi
echo ""

# Create Jules label
echo -e "${COLOR_BLUE}[5/6]${COLOR_NC} Creating 'jules' label in repository..."

if [ "$HAS_GH" = true ]; then
    if gh label create jules --description "Trigger Jules to automatically work on this issue" --color "7057ff" 2>/dev/null; then
        echo -e "${COLOR_GREEN}✓${COLOR_NC} Label created"
    else
        echo -e "${COLOR_YELLOW}⚠️  Label might already exist (this is okay)${COLOR_NC}"
    fi
else
    echo -e "   Please create the label manually:"
    echo -e "   1. Go to: ${COLOR_BLUE}https://github.com/$REPO_OWNER/$REPO_NAME/labels${COLOR_NC}"
    echo -e "   2. Click 'New label'"
    echo -e "   3. Name: ${COLOR_GREEN}jules${COLOR_NC}"
    echo -e "   4. Description: Trigger Jules to automatically work on this issue"
    echo -e "   5. Color: #7057ff"
    echo ""
fi
echo ""

# Test setup
echo -e "${COLOR_BLUE}[6/6]${COLOR_NC} Testing setup..."

if [ "$HAS_GH" = true ]; then
    echo -e "   Checking GitHub Actions status..."
    if gh api repos/$REPO_OWNER/$REPO_NAME/actions/workflows >/dev/null 2>&1; then
        echo -e "${COLOR_GREEN}✓${COLOR_NC} GitHub Actions is enabled"
    else
        echo -e "${COLOR_YELLOW}⚠️  Could not verify GitHub Actions status${COLOR_NC}"
    fi
fi
echo ""

# Summary
echo -e "${COLOR_GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_NC}"
echo -e "${COLOR_GREEN}   Setup Complete! 🎉${COLOR_NC}"
echo -e "${COLOR_GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_NC}"
echo ""
echo -e "Next steps:"
echo -e "  1. ${COLOR_BLUE}Test the workflow${COLOR_NC}"
echo -e "     - Create or find an issue in your repository"
echo -e "     - Add the 'jules' label to it"
echo -e "     - Watch Jules work its magic! 🤖"
echo ""
echo -e "  2. ${COLOR_BLUE}Monitor the workflow${COLOR_NC}"
echo -e "     - Go to: https://github.com/$REPO_OWNER/$REPO_NAME/actions"
echo -e "     - Look for 'Jules Automated Issue Resolution' workflow"
echo ""
echo -e "  3. ${COLOR_BLUE}Customize configuration${COLOR_NC}"
echo -e "     - Edit: .github/jules-config.yml"
echo -e "     - Adjust auto-merge settings, rollback behavior, etc."
echo ""
echo -e "  4. ${COLOR_BLUE}Read the documentation${COLOR_NC}"
echo -e "     - Check: .github/JULES_SETUP.md"
echo ""
echo -e "For issues or questions, check the logs at:"
echo -e "  ${COLOR_BLUE}https://github.com/$REPO_OWNER/$REPO_NAME/actions${COLOR_NC}"
echo ""
echo -e "${COLOR_GREEN}Happy coding! 🚀${COLOR_NC}"
echo ""
