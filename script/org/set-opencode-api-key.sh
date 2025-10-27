#!/usr/bin/env bash
set -euo pipefail

# Set OPENCODE_API_KEY as an organization-level GitHub Actions secret
# Default visibility: all repositories in the org
#
# Usage examples:
#   ORG="your-org" OPENCODE_API_KEY="<secret>" script/org/set-opencode-api-key.sh
#   ORG="your-org" script/org/set-opencode-api-key.sh           # secure prompt for key
#   ORG="your-org" VISIBILITY=selected REPOS="repo1,repo2" script/org/set-opencode-api-key.sh
#   ORG="your-org" VISIBILITY=all script/org/set-opencode-api-key.sh
#
# Env vars:
#   ORG               required (organization slug/login)
#   OPENCODE_API_KEY  optional (if empty, script will prompt securely)
#   VISIBILITY        optional: all|private|selected (default: all)
#   REPOS             optional: comma-separated repo names (only valid with VISIBILITY=selected)

red() { printf "\033[31m%s\033[0m\n" "$*"; }
yellow() { printf "\033[33m%s\033[0m\n" "$*"; }
green() { printf "\033[32m%s\033[0m\n" "$*"; }

need() { command -v "$1" >/dev/null 2>&1 || { red "Missing required command: $1"; exit 1; }; }

need gh

ORG=${ORG:-}
if [ -z "${ORG}" ]; then
  red "ORG is required. Export ORG=your-org or pass inline."
  exit 1
fi

VISIBILITY=${VISIBILITY:-all}
REPOS=${REPOS:-}

if [ "$VISIBILITY" = "selected" ] && [ -z "$REPOS" ]; then
  red "VISIBILITY=selected requires REPOS to be set (comma-separated repo names within $ORG)."
  exit 1
fi

yellow "Checking GitHub CLI authentication..."
if ! gh auth status >/dev/null 2>&1; then
  red "gh is not authenticated. Run: gh auth login"
  exit 1
fi

yellow "Ensuring token has admin:org scope (you may be prompted)..."
if ! gh auth status -t 2>/dev/null | grep -q "admin:org"; then
  gh auth refresh -h github.com -s admin:org -s read:org >/dev/null || true
fi

if ! gh api "orgs/${ORG}" >/dev/null 2>&1; then
  red "Unable to access org '${ORG}'. Ensure you are an org owner or have Security Manager role."
  exit 1
fi

a_key=${OPENCODE_API_KEY:-}
if [ -z "$a_key" ]; then
  read -r -s -p "Enter OPENCODE_API_KEY: " a_key
  echo
fi

if [ -z "$a_key" ]; then
  red "OPENCODE_API_KEY is empty. Aborting."
  exit 1
fi

yellow "Setting org secret 'OPENCODE_API_KEY' in '${ORG}' with visibility '${VISIBILITY}'..."
set_cmd=(gh secret set OPENCODE_API_KEY --org "$ORG" --visibility "$VISIBILITY")
if [ "$VISIBILITY" = "selected" ]; then
  set_cmd+=(--repos "$REPOS")
fi

printf %s "$a_key" | "${set_cmd[@]}" >/dev/null

green "Secret set successfully. Verifying..."
if gh secret list --org "$ORG" | grep -q "^OPENCODE_API_KEY\b"; then
  green "OPENCODE_API_KEY is configured for org '$ORG'."
else
  red "Verification failed: OPENCODE_API_KEY not listed."
  exit 1
fi

if [ "$VISIBILITY" = "selected" ]; then
  yellow "Repositories with access:"
  gh api "orgs/${ORG}/actions/secrets/OPENCODE_API_KEY/repositories" --jq '.repositories[].name' || true
fi
