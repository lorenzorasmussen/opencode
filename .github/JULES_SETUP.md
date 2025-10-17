# Jules Automated Issue Resolution Setup

This document explains how to set up and use Jules for automated issue resolution with automatic PR creation, merging, and rollback capabilities.

## 🚀 Quick Start

### 1. Add Jules API Key to GitHub Secrets

1. Go to your repository settings: `https://github.com/lorenzorasmussen/opencode/settings/secrets/actions`
2. Click "New repository secret"
3. Name: `JULES_API_KEY`
4. Value: Your Jules API key
5. Click "Add secret"

**IMPORTANT**: Never commit API keys to your repository. Always use GitHub Secrets.

### 2. Verify Workflow Files

The following files have been added:
- `.github/workflows/jules-automation.yml` - Main workflow for Jules automation
- `.github/jules-config.yml` - Configuration file for Jules behavior

### 3. Test the Setup

#### Option A: Label an Existing Issue
1. Go to any open issue in your repository
2. Add the label `jules` to the issue
3. Jules will automatically start working on it

#### Option B: Mention Jules in a Comment
1. Comment on any open issue with: `@jules please fix this`
2. Jules will be triggered to work on the issue

#### Option C: Manual Trigger
1. Go to Actions tab: `https://github.com/lorenzorasmussen/opencode/actions/workflows/jules-automation.yml`
2. Click "Run workflow"
3. Enter the issue number you want Jules to work on

## 🔄 How It Works

### Step 1: Issue Detection
When you label an issue with `jules` or mention `@jules` in a comment, the workflow triggers.

### Step 2: Isolated Environment
Jules spins up in a clean GitHub Actions environment with:
- Fresh checkout of your repository
- Node.js and dependencies installed
- Isolated workspace for making changes

### Step 3: Automated Fix
Jules analyzes the issue and creates code changes to resolve it on a new branch named `jules/issue-{number}`.

### Step 4: PR Creation
Jules automatically creates a Pull Request with:
- Descriptive title and body
- Link to the original issue
- Summary of changes made

### Step 5: Validation
The workflow automatically runs all your existing checks:
- `npm test` - Run test suite
- `npm run typecheck` - Type checking
- `npm run format:check` - Code formatting
- Any other checks defined in your CI

### Step 6: Auto-Merge Decision
If ALL checks pass:
- ✅ PR is automatically approved
- ✅ PR is merged using squash merge
- ✅ Original issue is automatically closed
- ✅ Branch is deleted

If ANY check fails:
- ⚠️ PR is labeled for manual review
- ⚠️ Team is notified
- ⚠️ No automatic merge occurs

### Step 7: Post-Merge Monitoring
After a successful merge, the workflow:
- Monitors critical workflows (test, deploy) for 5 minutes
- Checks for any failures that might indicate the merge broke something
- Can automatically trigger rollback if configured

### Step 8: Rollback (if needed)
If post-merge checks fail:
- 🔄 Rollback notification is posted
- 🔄 Issue is updated with rollback status
- 🔄 Can automatically create revert PR (if enabled in config)

## ⚙️ Configuration

### Customize Auto-Merge Behavior

Edit `.github/jules-config.yml` to customize:

```yaml
auto_merge:
  enabled: true
  required_approvals: 0  # Set to 1+ to require human approval
  merge_method: squash   # Options: squash, merge, rebase
```

### Customize Rollback Behavior

```yaml
rollback:
  enabled: true
  monitor_duration: 5    # Minutes to monitor after merge
  auto_revert: true      # Automatically create revert PR on failure
```

### Add Safety Rules

Block auto-merge for critical files:

```yaml
safety:
  require_manual_review:
    - "package.json"
    - ".github/workflows/*"
    - "*.config.js"
```

## 🏷️ Labels

The workflow uses these labels automatically:

- `jules` - Trigger label (add this to activate Jules)
- `auto-merged` - Added when PR is auto-merged
- `jules-resolved` - Added when Jules successfully resolves an issue
- `needs-review` - Added when auto-merge is blocked
- `auto-merge-blocked` - Added when checks fail

## 🔐 Security Best Practices

### API Key Management
- ✅ Store API keys in GitHub Secrets (never in code)
- ✅ Rotate keys regularly
- ✅ Use separate keys for different environments
- ✅ Revoke compromised keys immediately

### Workflow Permissions
The workflow uses `GITHUB_TOKEN` which has limited permissions:
- Read access to repository content
- Write access to pull requests and issues
- Write access to workflow runs

To review or modify permissions, check the workflow file.

## 📊 Monitoring

### View Workflow Runs
Go to: `https://github.com/lorenzorasmussen/opencode/actions/workflows/jules-automation.yml`

### Check Logs
Each workflow run provides detailed logs for:
- Jules execution
- Test results
- Merge attempts
- Rollback triggers

### Notifications
You'll receive notifications via:
- GitHub issue/PR comments
- GitHub notifications (if enabled)
- Discord (if webhook configured)

## 🐛 Troubleshooting

### Jules doesn't trigger
- ✅ Check that `JULES_API_KEY` is set in repository secrets
- ✅ Verify the issue has the `jules` label
- ✅ Check workflow permissions in repository settings

### Auto-merge doesn't work
- ✅ Verify all checks are passing
- ✅ Check if manual approval is required in config
- ✅ Ensure branch protection rules allow auto-merge

### Rollback doesn't trigger
- ✅ Check that monitored workflows are running
- ✅ Verify monitoring duration is sufficient
- ✅ Check workflow logs for errors

## 🎛️ Advanced Usage

### Custom Jules Commands

You can customize Jules behavior with special comments:

```markdown
@jules fix this with tests
@jules refactor this code
@jules add documentation for this feature
```

### Conditional Auto-Merge

Use labels to control auto-merge:

- Add `no-auto-merge` label to prevent automatic merging
- Add `fast-track` label to skip additional checks (if configured)

### Manual Rollback

If you need to manually rollback a change:

```bash
# Find the commit to revert
git log --oneline -10

# Create revert commit
git revert <commit-hash>

# Push to create revert PR
git push origin main
```

## 📚 Additional Resources

- [Jules Documentation](https://jules.ai/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Secrets Management](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

## 🤝 Contributing

If you improve this workflow, consider:
1. Testing thoroughly in a development environment
2. Documenting your changes
3. Sharing improvements with the team

## 📞 Support

For issues or questions:
1. Check workflow logs first
2. Review this documentation
3. Open an issue with the `workflow` label
4. Contact the team on Discord

---

**Remember**: Always test workflow changes in a separate branch or development repository before deploying to production!
