# Jules Integration - Quick Start Guide

## 🚀 Setup (One-time)

### 1. Run the setup script:
```bash
./scripts/setup-jules.sh
```

**OR** Set up manually:

### 2. Add API Key to GitHub Secrets:
1. Go to: `https://github.com/YOUR_USERNAME/opencode/settings/secrets/actions`
2. Create secret: `JULES_API_KEY` = your Jules API key
3. **Never commit API keys to code!**

### 3. Create the `jules` label:
```bash
gh label create jules --description "Trigger Jules" --color "7057ff"
```

## 🎯 Usage

### Trigger Jules on an Issue:

**Method 1: Add Label**
- Add the `jules` label to any issue
- Jules starts working automatically

**Method 2: Comment**
- Comment on an issue: `@jules please fix this`
- Jules is triggered

**Method 3: Manual Run**
- Go to Actions → "Jules Automated Issue Resolution"
- Click "Run workflow"
- Enter issue number

## 🔄 Workflow

1. **Jules works** → Creates branch `jules/issue-{number}`
2. **Creates PR** → Automatically with description
3. **Runs checks** → Tests, typecheck, format
4. **Auto-merges** → If all checks pass ✅
5. **Monitors** → Watches for post-merge issues
6. **Rollback** → If problems detected 🔄

## ⚙️ Configuration

Edit `.github/jules-config.yml` to customize:

```yaml
auto_merge:
  enabled: true              # Enable auto-merge
  required_approvals: 0      # Human approvals needed (0 = none)
  
rollback:
  enabled: true              # Enable rollback monitoring
  auto_revert: false         # Auto-create revert PR
  monitor_duration: 5        # Minutes to monitor
```

## 🏷️ Labels Used

- `jules` - Trigger Jules (add this manually)
- `auto-merged` - PR was auto-merged
- `jules-resolved` - Successfully resolved
- `needs-review` - Manual review required
- `auto-merge-blocked` - Checks failed

## 📊 Monitoring

View workflow runs:
```
https://github.com/YOUR_USERNAME/opencode/actions/workflows/jules-automation.yml
```

## 🛡️ Safety

**Auto-merge blocked for:**
- Files in `package.json`
- Files in `.github/workflows/*`
- When checks fail
- When labeled `no-auto-merge`

**Rollback triggers when:**
- Post-merge tests fail
- Deploy workflow fails
- Within monitoring window (5 min)

## 🐛 Troubleshooting

**Jules doesn't start:**
- ✅ Check `JULES_API_KEY` is set in secrets
- ✅ Verify `jules` label exists
- ✅ Check Actions are enabled

**Auto-merge blocked:**
- ✅ View workflow logs for details
- ✅ Check test/typecheck/format output
- ✅ Verify no `no-auto-merge` label

**View logs:**
```bash
gh run list --workflow=jules-automation.yml
gh run view [run-id] --log
```

## 📚 Full Documentation

See `.github/JULES_SETUP.md` for complete documentation.

## 🎯 Example Workflow

```bash
# 1. Create an issue (or find one)
gh issue create --title "Fix bug in feature X" --body "Description..."

# 2. Add jules label
gh issue edit 123 --add-label "jules"

# 3. Watch it work
gh run watch

# 4. Check the PR
gh pr list --label "jules-resolved"
```

---

**Remember:** Always review the changes Jules makes before relying on auto-merge in production!
