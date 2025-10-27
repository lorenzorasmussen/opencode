# Organization secret setup for OpenCode

Use this procedure to set the OPENCODE_API_KEY secret at the organization level, visible to all repositories by default.

Prerequisites:
- You are an owner (or Security Manager) of the organization
- GitHub CLI (gh) installed and authenticated

Quick start:

1) Set org slug and run the helper script

   ORG="your-org" ./script/org/set-opencode-api-key.sh

   You will be securely prompted for the key.

   Alternatively, set it via environment variable:

   ORG="your-org" OPENCODE_API_KEY="<your-key>" ./script/org/set-opencode-api-key.sh

2) Verify

   gh secret list --org "your-org"
   gh api orgs/"your-org"/actions/secrets/OPENCODE_API_KEY | jq

Advanced:
- Scope to selected repositories:

  ORG="your-org" VISIBILITY=selected REPOS="repo1,repo2" ./script/org/set-opencode-api-key.sh

Notes:
- Re-run the script to rotate/update the value
- For GitHub Enterprise Cloud, the same script works (requires admin:org scope)
- The script attempts to refresh token scopes and may prompt you
