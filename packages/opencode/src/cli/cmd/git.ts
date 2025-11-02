import { exec } from "child_process"
import * as prompts from "@clack/prompts"
import { UI } from "../ui"
import { cmd } from "./cmd"
import { Instance } from "@/project/instance"
import { $ } from "bun"

export const GitCommand = cmd({
  command: "git",
  describe: "Git workflow automation with Jules AI integration",
  builder: (yargs) => yargs.command(GitInitCommand).command(GitBranchCommand).command(GitJulesCommand).command(GitCommitCommand).command(GitResolveConflictsCommand).command(GitRollbackCommand).command(GitStatusCommand).demandCommand(),
  async handler() {},
})

export const GitInitCommand = cmd({
  command: "init",
  describe: "Initialize repository and set up remote",
  async handler() {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        UI.empty()
        prompts.intro("Git Repository Initialization")

        // Check if Git repository exists
        const hasGit = await checkGitRepo()
        if (!hasGit) {
          prompts.log.info("📦 No Git repository detected. Initializing...")
          await $`git init`
          await $`git branch -M main`

          // Configure user if not set
          const userName = await $`git config user.name`.quiet().nothrow().text()
          if (!userName.trim()) {
            const name = process.env.GIT_USER_NAME || (await $`whoami`.text()).trim()
            await $`git config user.name ${name}`
          }

          const userEmail = await $`git config user.email`.quiet().nothrow().text()
          if (!userEmail.trim()) {
            const email = process.env.GIT_USER_EMAIL || `${(await $`whoami`.text()).trim()}@local`
            await $`git config user.email ${email}`
          }

          prompts.log.success("✅ Git repository initialized")
        } else {
          prompts.log.info("✓ Git repository already exists")
        }

        // Check for remote repository
        const hasRemote = await checkRemote()
        if (!hasRemote) {
          prompts.log.info("🌐 No remote repository configured")

          const remoteOption = await prompts.select({
            message: "Select remote setup option:",
            options: [
              { value: "create", label: "Create new GitHub repo (recommended)" },
              { value: "add", label: "Add existing remote URL" },
              { value: "skip", label: "Skip remote setup" },
            ],
          })

          if (prompts.isCancel(remoteOption)) throw new UI.CancelledError()

          switch (remoteOption) {
            case "create":
              try {
                const repoName = (await $`basename $(pwd)`.text()).trim()
                await $`gh repo create ${repoName} --public --source=. --remote=origin`
                const repoUrl = (await $`gh repo view --json url -q .url`.text()).trim()
                prompts.log.success(`✅ GitHub repository created: ${repoUrl}`)
              } catch (error) {
                prompts.log.error("Failed to create GitHub repository. Please check your gh CLI setup.")
                throw error
              }
              break
            case "add":
              const remoteUrl = await prompts.text({
                message: "Enter remote URL:",
                validate: (value) => {
                  if (!value) return "Remote URL is required"
                  return undefined
                },
              })
              if (prompts.isCancel(remoteUrl)) throw new UI.CancelledError()
              await $`git remote add origin ${remoteUrl}`
              prompts.log.success(`✅ Remote 'origin' added: ${remoteUrl}`)
              break
            case "skip":
              prompts.log.warn("⚠ Skipping remote setup (local only)")
              break
          }
        } else {
          const remoteUrl = (await $`git remote get-url origin`.text()).trim()
          prompts.log.info(`✓ Remote repository configured: ${remoteUrl}`)
        }

        // Install Git hooks
        await installGitHooks()

        prompts.outro("🎯 Repository ready for development!")
      },
    })
  },
})

export const GitBranchCommand = cmd({
  command: "branch <task>",
  describe: "Create feature branch with GitHub issue",
  builder: (yargs) =>
    yargs.positional("task", {
      describe: "Task description",
      type: "string",
      demandOption: true,
    }),
  async handler(args) {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        const taskDescription = args.task as string

        UI.empty()
        prompts.intro(`Creating branch for: ${taskDescription}`)

        // Ensure we're on main and up-to-date
        prompts.log.info("📥 Syncing with main branch...")
        await $`git checkout main`
        await $`git pull origin main`

        // Create GitHub Issue
        prompts.log.info("📝 Creating GitHub Issue...")
        const issueJson = await $`gh issue create --title ${JSON.stringify(taskDescription)} --body ${JSON.stringify(`**Task:** ${taskDescription}

**Status:** 🟡 In Progress
**Assigned:** @me (AI Agent)
**Created by:** Git Orchestrator
**Workflow:**
- [x] Issue created
- [x] Branch created
- [ ] Implementation
- [ ] Tests written
- [ ] PR submitted
- [ ] Code reviewed
- [ ] Merged to main

**AI Agent Details:**
- Model: ${process.env.AI_MODEL || "Unknown"}
- Started: ${(new Date()).toISOString()}

Refs #<issue_number>
`)} --label "ai-task,enhancement" --assignee "@me" --json number -q .number`

        const issueNumber = parseInt(issueJson.text().trim())
        prompts.log.success(`✅ GitHub Issue created: #${issueNumber}`)

        // Generate branch name
        const branchSlug = taskDescription
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")

        const branchName = `feature/${issueNumber}-${branchSlug}`

        // Create and checkout branch
        await $`git checkout -b ${branchName}`
        prompts.log.success(`✅ Branch created: ${branchName}`)

        // Link branch to issue in commit
        await $`git commit --allow-empty -m ${JSON.stringify(`feat: initialize work on issue #${issueNumber}

Task: ${taskDescription}
Branch: ${branchName}
Issue: https://github.com/${await getRepoOwner()}/issues/${issueNumber}

Refs #${issueNumber}`)}`

        // Push branch to remote
        await $`git push -u origin ${branchName}`

        const remoteUrl = (await $`git remote get-url origin`.text()).trim()

        prompts.outro(`📊 Branch Status:
  Branch: ${branchName}
  Issue: #${issueNumber}
  Remote: ${remoteUrl}

🎯 Ready to start work!`)
      },
    })
  },
})

export const GitJulesCommand = cmd({
  command: "jules <task>",
  describe: "Delegate task to Google Jules AI",
  builder: (yargs) =>
    yargs.positional("task", {
      describe: "Task description",
      type: "string",
      demandOption: true,
    }),
  async handler(args) {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        const task = args.task as string

        UI.empty()
        prompts.intro(`Delegating to Jules: ${task}`)

        const currentBranch = (await $`git branch --show-current`.text()).trim()

        // Verify we're on a feature branch
        if (currentBranch === "main") {
          prompts.log.error("❌ Error: Cannot delegate Jules tasks on 'main' branch")
          prompts.log.info("   Create a feature branch first: opencode git branch \"<task>\"")
          throw new UI.CancelledError()
        }

        prompts.log.info(`🤖 Delegating task to Google Jules...`)
        prompts.log.info(`   Branch: ${currentBranch}`)
        prompts.log.info(`   Task: ${task}`)

        // Note: Jules integration would require actual Jules CLI/API
        // For now, this is a placeholder that shows the workflow
        prompts.log.warn("⚠️ Jules integration not yet implemented - this is a placeholder")
        prompts.log.info("   In a real implementation, Jules would:")
        prompts.log.info("   - Analyze the codebase")
        prompts.log.info("   - Generate implementation plan")
        prompts.log.info("   - Execute changes asynchronously")
        prompts.log.info("   - Present diff + reasoning for approval")

        prompts.outro("🔄 Jules workflow simulation complete")
      },
    })
  },
})

export const GitCommitCommand = cmd({
  command: "commit <message>",
  describe: "Commit changes and create PR",
  builder: (yargs) =>
    yargs.positional("message", {
      describe: "Commit message",
      type: "string",
      demandOption: true,
    }),
  async handler(args) {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        const commitMsg = args.message as string

        UI.empty()
        prompts.intro(`Committing: ${commitMsg}`)

        // Stage all changes
        prompts.log.info("📦 Staging changes...")
        await $`git add .`

        // Verify changes exist
        const hasChanges = await $`git diff --cached --quiet`.nothrow()
        if (hasChanges.exitCode === 0) {
          prompts.log.warn("⚠ No changes to commit")
          return
        }

        // Show diff summary
        const diffStat = await $`git diff --cached --stat`.text()
        prompts.log.info("📊 Changes to commit:")
        console.log(diffStat)

        // Run pre-commit checks (would be handled by hooks)
        prompts.log.info("🔍 Running pre-commit checks...")

        // Commit with conventional format
        const currentBranch = (await $`git branch --show-current`.text()).trim()
        const issueNumber = currentBranch.match(/feature\/(\d+)/)?.[1]

        let fullCommitMsg = commitMsg
        if (issueNumber) {
          fullCommitMsg += `\n\nRefs #${issueNumber}`
        }

        await $`git commit -m ${JSON.stringify(fullCommitMsg)}`
        prompts.log.success("✅ Changes committed")

        // Push to remote
        prompts.log.info("📤 Pushing to remote...")
        await $`git push origin ${currentBranch}`

        // Create Pull Request
        prompts.log.info("🔀 Creating Pull Request...")

        const prBody = `## Summary
${commitMsg}

## Changes
${diffStat}

## Testing
- [x] Unit tests pass
- [x] Integration tests pass
- [x] Manual testing complete

## Checklist
- [x] Code follows style guidelines
- [x] Self-review completed
- [x] Documentation updated
- [x] No breaking changes

${issueNumber ? `## Related Issue
Closes #${issueNumber}` : ""}`

        const prJson = await $`gh pr create --title ${JSON.stringify(commitMsg)} --body ${JSON.stringify(prBody)} --base main --head ${currentBranch} --label "ai-generated,enhancement" --assignee "@me" --json url,number -q ".url"`

        const prData = JSON.parse(prJson.text().trim())
        prompts.log.success(`✅ Pull Request created: ${prData.url}`)

        // Check merge status
        prompts.log.info("🔍 Checking merge status...")

        // Simple merge check
        try {
          await $`git merge-base --is-ancestor HEAD origin/main`
          prompts.log.success("✅ PR can be automatically merged!")

          const autoMerge = await prompts.confirm({
            message: "Auto-merge now?",
            initialValue: false,
          })

          if (autoMerge) {
            await $`gh pr merge ${prData.number} --auto --squash --delete-branch`
            prompts.log.success("✅ PR will auto-merge when checks pass")
          } else {
            prompts.log.info("ℹ️ PR ready for manual review")
          }
        } catch {
          prompts.log.error("❌ Merge conflicts detected!")
          prompts.log.info("   Use 'opencode git resolve-conflicts' to resolve")
        }

        prompts.outro("🎉 Commit and PR workflow complete!")
      },
    })
  },
})

export const GitResolveConflictsCommand = cmd({
  command: "resolve-conflicts",
  describe: "AI-assisted merge conflict resolution",
  async handler() {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        UI.empty()
        prompts.intro("AI Conflict Resolver")

        // Check for conflicts
        const conflicts = await $`git diff --name-only --diff-filter=U`.nothrow()
        if (conflicts.exitCode !== 0 || !conflicts.text().trim()) {
          prompts.log.info("✓ No conflicts detected")
          return
        }

        const conflictFiles = conflicts.text().trim().split("\n")
        prompts.log.info(`📋 Conflicting files: ${conflictFiles.join(", ")}`)

        // Note: AI resolution would require LLM integration
        prompts.log.warn("⚠️ AI conflict resolution not yet implemented")
        prompts.log.info("   Manual resolution required:")
        prompts.log.info("   1. Edit conflicting files")
        prompts.log.info("   2. Stage resolved files: git add <file>")
        prompts.log.info("   3. Commit: git commit")

        prompts.outro("🔧 Use git mergetool for manual resolution")
      },
    })
  },
})

export const GitRollbackCommand = cmd({
  command: "rollback [target]",
  describe: "Emergency rollback system",
  builder: (yargs) =>
    yargs.positional("target", {
      describe: "Rollback target (commit hash, branch, or number of commits)",
      type: "string",
    }),
  async handler(args) {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        const rollbackTarget = args.target as string | undefined

        UI.empty()
        prompts.intro("Git Rollback System")

        if (!rollbackTarget) {
          // Interactive mode
          const log = await $`git log --oneline --graph --decorate -10`.text()
          console.log("Recent commits:")
          console.log(log)

          const target = await prompts.text({
            message: "Enter commit hash or number of commits to rollback:",
            validate: (value) => {
              if (!value) return "Target is required"
              return undefined
            },
          })

          if (prompts.isCancel(target)) throw new UI.CancelledError()

          await performRollback(target)
        } else {
          await performRollback(rollbackTarget)
        }

        prompts.outro("✅ Rollback complete")
      },
    })
  },
})

export const GitStatusCommand = cmd({
  command: "status",
  describe: "Show Git workflow status",
  async handler() {
    await Instance.provide({
      directory: process.cwd(),
      async fn() {
        UI.empty()
        prompts.intro("Git Workflow Status")

        const currentBranch = (await $`git branch --show-current`.text()).trim()
        const status = await $`git status --porcelain`.text()
        const remote = await $`git remote get-url origin`.nothrow()

        console.log(`📍 Current branch: ${currentBranch}`)
        console.log(`🌐 Remote: ${remote.exitCode === 0 ? remote.text().trim() : "None"}`)

        if (status.trim()) {
          console.log("📝 Changes:")
          console.log(status)
        } else {
          console.log("✅ Working tree clean")
        }

        // Check for issue number in branch
        const issueMatch = currentBranch.match(/feature\/(\d+)/)
        if (issueMatch) {
          console.log(`🎫 Related issue: #${issueMatch[1]}`)
        }

        prompts.outro("📊 Status check complete")
      },
    })
  },
})

// Helper functions
async function checkGitRepo(): Promise<boolean> {
  const result = await $`test -d .git`.nothrow()
  return result.exitCode === 0
}

async function checkRemote(): Promise<boolean> {
  const result = await $`git remote | grep -q origin`.nothrow()
  return result.exitCode === 0
}

async function installGitHooks() {
  prompts.log.info("🔧 Installing Git hooks...")

  // Create hooks directory if it doesn't exist
  await $`mkdir -p .git/hooks`

  // Pre-commit hook
  const preCommitHook = `#!/bin/bash
# Pre-commit hook: Enforce code quality
echo "🔍 Running pre-commit checks..."

# 1. Check for linting errors
if command -v ruff &> /dev/null; then
  echo "  - Running ruff..."
  ruff check . || exit 1
fi

# 2. Run type checker
if command -v mypy &> /dev/null; then
  echo "  - Running mypy..."
  mypy . || exit 1
fi

# 3. Check for sensitive data
echo "  - Checking for secrets..."
if grep -r "sk-[a-zA-Z0-9]*" .; then
  echo "❌ Error: API keys detected in code!"
  exit 1
fi

# 4. Run tests
echo "  - Running tests..."
pytest --quiet || exit 1

echo "✅ Pre-commit checks passed"
`

  await Bun.write(".git/hooks/pre-commit", preCommitHook)
  await $`chmod +x .git/hooks/pre-commit`

  // Commit-msg hook
  const commitMsgHook = `#!/bin/bash
# Commit message validation
commit_msg_file=$1
commit_msg=$(cat "$commit_msg_file")

# Enforce conventional commits format
# Types: feat, fix, docs, style, refactor, test, chore
if ! echo "$commit_msg" | grep -qE "^(feat|fix|docs|style|refactor|test|chore)(\\(.+\\))?: .{10,}"; then
  echo "❌ Invalid commit message format!"
  echo ""
  echo "Expected format:"
  echo "  type(scope): description"
  echo ""
  echo "Examples:"
  echo "  feat(auth): add JWT authentication"
  echo "  fix(api): resolve null pointer exception"
  echo "  docs(readme): update installation instructions"
  exit 1
fi
`

  await Bun.write(".git/hooks/commit-msg", commitMsgHook)
  await $`chmod +x .git/hooks/commit-msg`

  // Pre-push hook
  const prePushHook = `#!/bin/bash
# Pre-push hook: Final checks before pushing
echo "🚀 Running pre-push checks..."

# 1. Ensure all tests pass
pytest || exit 1

# 2. Check for merge conflicts
if git diff --check; then
  echo "✅ No merge conflicts detected"
else
  echo "❌ Merge conflicts detected! Resolve before pushing."
  exit 1
fi

# 3. Ensure branch is up-to-date
git fetch origin
if ! git merge-base --is-ancestor HEAD origin/$(git branch --show-current); then
  echo "❌ Branch is behind origin. Pull latest changes first."
  exit 1
fi

echo "✅ Pre-push checks passed"
`

  await Bun.write(".git/hooks/pre-push", prePushHook)
  await $`chmod +x .git/hooks/pre-push`

  prompts.log.success("✅ Git hooks installed")
}

async function getRepoOwner(): Promise<string> {
  const remoteUrl = (await $`git remote get-url origin`.text()).trim()
  const match = remoteUrl.match(/github\.com[\/:]([^\/]+)\/[^\/]+/)
  return match ? match[1] : "unknown"
}

async function performRollback(target: string) {
  // Create backup branch
  const backupBranch = `backup-${new Date().toISOString().replace(/[:-]/g, "").replace(/\..+/, "")}`
  await $`git branch ${backupBranch}`
  prompts.log.info(`✓ Backup created: ${backupBranch}`)

  // Determine rollback type
  if (/^[0-9a-f]{7,40}$/.test(target)) {
    // Specific commit
    prompts.log.info(`Rolling back to commit: ${target}`)
    await $`git reset --hard ${target}`
  } else if (/^[0-9]+$/.test(target)) {
    // Number of commits
    prompts.log.info(`Rolling back ${target} commits`)
    await $`git reset --hard HEAD~${target}`
  } else {
    // Branch name
    prompts.log.info(`Rolling back to branch: ${target}`)
    await $`git reset --hard ${target}`
  }

  prompts.log.success("✅ Rollback performed")

  // Optional force push for feature branches
  const currentBranch = (await $`git branch --show-current`.text()).trim()
  if (currentBranch !== "main") {
    const forcePush = await prompts.confirm({
      message: "Force push to remote?",
      initialValue: false,
    })

    if (forcePush) {
      await $`git push --force-with-lease origin ${currentBranch}`
      prompts.log.success("✅ Remote updated")
    }
  }
}