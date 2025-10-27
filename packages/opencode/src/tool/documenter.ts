import { z } from "zod"
import type { Tool } from "./tool.js"
import { $ } from "bun"
import { Log } from "../util/log.js"

const log = Log.create({ service: "documenter" })

export namespace Documenter {
  export const Info = {
    name: "Documenter",
    description:
      "Advanced documentation orchestration with GitHub Spec-Kit integration, automated spec generation, living documentation, and intelligent update detection",
    schema: z.object({
      command: z
        .enum([
          "spec-kit-init",
          "spec-kit-check",
          "spec-kit-spec",
          "spec-kit-plan",
          "spec-kit-tasks",
          "spec-kit-sync",
          "spec-kit-audit",
          "spec-kit-dashboard",
          "spec-kit-export",
        ])
        .describe("Spec-Kit command to execute"),
      featureId: z.string().optional().describe("Feature ID for spec operations"),
      type: z.enum(["api", "architecture", "user-guide", "adr", "spec"]).optional().describe("Documentation type"),
      update: z.boolean().optional().describe("Update existing documentation"),
      publish: z.boolean().optional().describe("Publish documentation"),
      specKit: z.boolean().optional().describe("Use Spec-Kit integration"),
    }),
  } as const

  export async function execute(input: z.infer<typeof Info.schema>) {
    const { command, featureId, update } = input

    try {
      switch (command) {
        case "spec-kit-init":
          return await initSpecKit()

        case "spec-kit-check":
          return await checkSpecKit()

        case "spec-kit-spec":
          if (!featureId) throw new Error("featureId required for spec command")
          return await generateSpec(featureId, { update })

        case "spec-kit-plan":
          if (!featureId) throw new Error("featureId required for plan command")
          return await generatePlan(featureId)

        case "spec-kit-tasks":
          if (!featureId) throw new Error("featureId required for tasks command")
          return await generateTasks(featureId)

        case "spec-kit-sync":
          return await syncSpecs()

        case "spec-kit-audit":
          return await auditSpecs()

        case "spec-kit-dashboard":
          return await showDashboard()

        case "spec-kit-export":
          return await exportSpecs()

        default:
          throw new Error(`Unknown command: ${command}`)
      }
    } catch (error) {
      log.error("Documenter execution failed", { error: (error as Error).message, command })
      throw error
    }
  }

  async function initSpecKit() {
    log.info("Initializing Spec-Kit...")

    // Check if already initialized
    const checkResult = await checkSpecKit()
    if (checkResult.status === "initialized") {
      return {
        status: "already_initialized",
        message: "Spec-Kit is already initialized in this project",
        details: checkResult,
      }
    }

    // Initialize Spec-Kit
    try {
      const result =
        await $`uvx --from git+https://github.com/github/spec-kit.git specify init --here --ai copilot --no-git --force`.text()
      log.info("Spec-Kit initialized successfully")
      return {
        status: "initialized",
        message: "Spec-Kit has been initialized successfully",
        output: result,
      }
    } catch (error) {
      log.error("Failed to initialize Spec-Kit", { error })
      throw new Error(`Spec-Kit initialization failed: ${(error as Error).message}`)
    }
  }

  async function checkSpecKit() {
    log.info("Checking Spec-Kit status...")

    const checks = {
      specifyDir: false,
      githubPrompts: false,
      constitution: false,
      templates: false,
      scripts: false,
    }

    // Check .specify directory
    try {
      await $`test -d .specify`
      checks.specifyDir = true
    } catch {}

    // Check constitution
    try {
      await $`test -f .specify/memory/constitution.md`
      checks.constitution = true
    } catch {}

    // Check templates
    try {
      await $`test -d .specify/templates`
      checks.templates = true
    } catch {}

    // Check scripts
    try {
      await $`test -d .specify/scripts`
      checks.scripts = true
    } catch {}

    // Check GitHub prompts
    try {
      await $`test -d .github/prompts`
      checks.githubPrompts = true
    } catch {}

    const allChecks = Object.values(checks).every(Boolean)
    const status = allChecks ? "initialized" : "partial"

    return {
      status,
      checks,
      ready: allChecks,
      message: allChecks
        ? "Spec-Kit is fully initialized and ready to use"
        : "Spec-Kit is partially initialized or not found",
    }
  }

  async function generateSpec(featureId: string, options: { update?: boolean } = {}) {
    log.info("Generating spec for feature", { featureId, options })

    const specDir = `specs/${featureId}`
    const specFile = `${specDir}/spec.md`

    // Check if spec already exists
    try {
      await $`test -f ${specFile}`
      if (!options.update) {
        return {
          status: "exists",
          message: `Spec already exists for feature ${featureId}`,
          path: specFile,
        }
      }
    } catch {}

    // Create spec directory if it doesn't exist
    await $`mkdir -p ${specDir}`

    // For now, create a basic spec template
    // In a real implementation, this would integrate with AI to generate the spec
    const specContent = `# Feature Spec: ${featureId}

## Overview
Feature specification for ${featureId}

## Goals
- Define the requirements and behavior for ${featureId}

## User Stories
<!-- Add user stories here -->

## Acceptance Criteria
<!-- Add acceptance criteria here -->

## Non-Functional Requirements
<!-- Add non-functional requirements here -->
`

    await Bun.write(specFile, specContent)

    return {
      status: "created",
      message: `Spec created for feature ${featureId}`,
      path: specFile,
      content: specContent,
    }
  }

  async function generatePlan(featureId: string) {
    log.info("Generating plan for feature", { featureId })

    const specDir = `specs/${featureId}`
    const planFile = `${specDir}/plan.md`

    // Check if spec exists first
    try {
      await $`test -f ${specDir}/spec.md`
    } catch {
      throw new Error(`Spec not found for feature ${featureId}. Create spec first.`)
    }

    // Create plan file
    const planContent = `# Technical Plan: ${featureId}

## Architecture
<!-- Describe the technical architecture -->

## Components
<!-- List the components needed -->

## Implementation Phases
<!-- Describe implementation phases -->

## Dependencies
<!-- List technical dependencies -->
`

    await Bun.write(planFile, planContent)

    return {
      status: "created",
      message: `Plan created for feature ${featureId}`,
      path: planFile,
      content: planContent,
    }
  }

  async function generateTasks(featureId: string) {
    log.info("Generating tasks for feature", { featureId })

    const specDir = `specs/${featureId}`
    const tasksDir = `${specDir}/tasks`

    // Check if plan exists first
    try {
      await $`test -f ${specDir}/plan.md`
    } catch {
      throw new Error(`Plan not found for feature ${featureId}. Create plan first.`)
    }

    // Create tasks directory
    await $`mkdir -p ${tasksDir}`

    // Create sample task
    const taskContent = `# Task: Sample Task for ${featureId}

**ID**: ${featureId}-01
**Feature**: ${featureId}
**Status**: TODO
**Assignee**: TBD

## Description
Sample task description

## Prerequisites
- None

## Acceptance Criteria
- [ ] Task completed

## Implementation Notes
<!-- Add implementation notes -->
`

    const taskFile = `${tasksDir}/${featureId}-01-sample.md`
    await Bun.write(taskFile, taskContent)

    return {
      status: "created",
      message: `Tasks directory created for feature ${featureId}`,
      path: tasksDir,
      sampleTask: taskFile,
    }
  }

  async function syncSpecs() {
    log.info("Syncing specs with codebase...")

    // Get all spec files
    const specFiles = []
    try {
      const result = await $`find specs -name "*.md" -type f`.text()
      specFiles.push(...result.trim().split("\n").filter(Boolean))
    } catch {}

    // Analyze git changes since last spec update
    const changes = []
    try {
      // Get recent commits that modified code files
      const recentCommits =
        await $`git log --since="30 days ago" --oneline --name-only --grep="feat\|fix\|refactor" | head -50`.text()

      // Look for code files that changed
      const codeChanges = []
      const lines = recentCommits.split("\n")
      for (const line of lines) {
        if (line.includes(".ts") || line.includes(".js") || line.includes(".py")) {
          if (!line.includes("spec") && !line.includes("test")) {
            codeChanges.push(line)
          }
        }
      }

      if (codeChanges.length > 0) {
        changes.push({
          type: "code_changes",
          description: `${codeChanges.length} code files changed recently`,
          files: codeChanges.slice(0, 5), // Show first 5
          action: "review_specs",
        })
      }
    } catch (error) {
      log.warn("Could not analyze git changes", { error })
    }

    // Check for missing specs
    const featuresWithCode = []
    try {
      const tsFiles = await $`find . -name "*.ts" -type f | grep -v node_modules | grep -v .opencode | head -20`.text()
      const features = tsFiles
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((file) => {
          // Extract feature-like names from file paths
          const parts = file.split("/")
          return parts.find((part) => part.includes("feature") || part.includes("service") || part.length > 3)
        })
        .filter((feature): feature is string => Boolean(feature))
        .filter((value, index, self) => self.indexOf(value) === index) // unique

      featuresWithCode.push(...features)
    } catch {}

    const specsWithoutCode = []
    for (const specFile of specFiles) {
      const featureName = specFile.split("/")[1]
      const hasCode = featuresWithCode.some((feature) => feature.includes(featureName))
      if (!hasCode) {
        specsWithoutCode.push(featureName)
      }
    }

    if (specsWithoutCode.length > 0) {
      changes.push({
        type: "orphaned_specs",
        description: `${specsWithoutCode.length} specs have no corresponding code`,
        specs: specsWithoutCode,
        action: "review_or_remove",
      })
    }

    return {
      status: "sync_complete",
      message: `Spec synchronization completed. Found ${changes.length} areas needing attention.`,
      changes,
      summary: {
        totalSpecs: specFiles.length,
        codeChanges: changes.filter((c) => c.type === "code_changes").length,
        orphanedSpecs: changes.filter((c) => c.type === "orphaned_specs").length,
      },
    }
  }

  async function auditSpecs() {
    log.info("Auditing specs...")

    // Check existing specs
    const specs = []
    try {
      const result = await $`find specs -name "spec.md" -type f`.text()
      specs.push(...result.trim().split("\n").filter(Boolean))
    } catch {}

    const audit = {
      totalSpecs: specs.length,
      specs: specs.map((spec) => ({
        path: spec,
        featureId: spec.split("/")[1],
        exists: true,
      })),
    }

    return {
      status: "audit_complete",
      audit,
      message: `Found ${specs.length} specs in the project`,
    }
  }

  async function showDashboard() {
    log.info("Generating dashboard...")

    const audit = await auditSpecs()
    const sync = await syncSpecs()

    // Calculate health metrics
    const totalSpecs = audit.audit.totalSpecs
    const orphanedSpecs = sync.summary.orphanedSpecs
    const codeChanges = sync.summary.codeChanges

    const completeness =
      totalSpecs > 0 ? Math.min(100, (totalSpecs / Math.max(totalSpecs + orphanedSpecs, 1)) * 100) : 0
    const freshness = Math.max(0, 100 - codeChanges * 10) // Deduct 10 points per code change area
    const codeAlignment = Math.max(0, 100 - orphanedSpecs * 20) // Deduct 20 points per orphaned spec
    const taskCompletion = 0 // Would need to analyze task completion

    const overallHealth = Math.round((completeness + freshness + codeAlignment + taskCompletion) / 4)

    const dashboard = {
      project: "OpenCode",
      specKitVersion: "0.0.69",
      lastUpdated: new Date().toISOString(),
      specs: audit.audit.specs,
      syncStatus: sync.summary,
      health: {
        overall: overallHealth,
        completeness: Math.round(completeness),
        freshness: Math.round(freshness),
        codeAlignment: Math.round(codeAlignment),
        taskCompletion: Math.round(taskCompletion),
      },
      alerts: sync.changes.map((change) => ({
        type: change.type,
        severity: change.type === "code_changes" ? "warning" : "info",
        message: change.description,
        action: change.action,
      })),
    }

    return {
      status: "dashboard_generated",
      dashboard,
      message: `Spec-Kit dashboard generated. Overall health: ${overallHealth}%`,
    }
  }

  async function exportSpecs() {
    log.info("Exporting specs...")

    // This would export specs to various formats
    return {
      status: "export_complete",
      message: "Spec export functionality not yet implemented",
      formats: ["markdown", "pdf", "html"],
    }
  }
}

export const documenter: Tool = {
  info: Documenter.Info,
  execute: Documenter.execute,
}
