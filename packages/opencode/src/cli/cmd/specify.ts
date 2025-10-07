import path from "path"
import fs from "fs/promises"
import { cmd } from "./cmd"

export const SpecifyCommand = cmd({
  command: "specify",
  describe: "Manage API specifications and documentation",
  builder: (yargs: any) =>
    yargs
      .command({
        command: "init-here",
        describe: "Initialize API specification generation in current directory",
        handler: initHere,
      })
      .command({
        command: "generate",
        describe: "Generate OpenAPI specification",
        handler: generateSpec,
      })
      .command({
        command: "validate",
        describe: "Validate the current OpenAPI specification",
        handler: validateSpec,
      })
      .demandCommand(1, "You need to specify a subcommand"),
  handler() {},
})

async function initHere() {
  const cwd = process.cwd()

  console.log("🔍 Analyzing current directory...")

  // Check if this is a Node.js/TypeScript project
  const packageJsonPath = path.join(cwd, "package.json")
  const tsconfigPath = path.join(cwd, "tsconfig.json")

  let isNodeProject = false

  try {
    await fs.access(packageJsonPath)
    isNodeProject = true
    console.log("✅ Found package.json")
  } catch {
    console.log("❌ No package.json found")
  }

  try {
    await fs.access(tsconfigPath)
    console.log("✅ Found TypeScript configuration")
  } catch {
    console.log("ℹ️  No TypeScript configuration found")
  }

  if (!isNodeProject) {
    console.log("❌ This doesn't appear to be a Node.js project. Please run in a directory with package.json")
    process.exit(1)
  }

  // Check for existing OpenAPI spec
  const existingSpecPaths = ["openapi.json", "openapi.yml", "openapi.yaml", "docs/openapi.json", "specs/openapi.json"]

  for (const specPath of existingSpecPaths) {
    try {
      await fs.access(path.join(cwd, specPath))
      console.log(`⚠️  Found existing OpenAPI spec at ${specPath}`)
      break
    } catch {}
  }

  // Create specification directory structure
  const specsDir = path.join(cwd, "specs")
  const docsDir = path.join(cwd, "docs")

  try {
    await fs.mkdir(specsDir, { recursive: true })
    console.log("📁 Created specs/ directory")
  } catch (error) {
    console.log("ℹ️  specs/ directory already exists")
  }

  try {
    await fs.mkdir(docsDir, { recursive: true })
    console.log("📁 Created docs/ directory")
  } catch (error) {
    console.log("ℹ️  docs/ directory already exists")
  }

  // Create a basic OpenAPI specification template
  const openapiTemplate = {
    openapi: "3.1.1",
    info: {
      title: await getProjectName(),
      description: "API specification",
      version: "1.0.0",
    },
    paths: {},
    components: {
      schemas: {},
    },
  }

  const specPath = path.join(specsDir, "openapi.json")
  await fs.writeFile(specPath, JSON.stringify(openapiTemplate, null, 2))
  console.log(`📄 Created basic OpenAPI spec at ${path.relative(cwd, specPath)}`)

  // Create a README for documentation
  const readmeContent = `# API Documentation

This directory contains the API specification and documentation for ${await getProjectName()}.

## Files

- \`specs/openapi.json\` - OpenAPI 3.1.1 specification
- \`docs/\` - Generated documentation

## Commands

\`\`\`bash
# Generate documentation
npm run docs:generate

# Validate specification
npm run docs:validate

# Serve documentation
npm run docs:serve
\`\`\`

## Development

To modify the API specification, edit \`specs/openapi.json\` or use automated tools to generate it from your code.
`

  const readmePath = path.join(docsDir, "README.md")
  await fs.writeFile(readmePath, readmeContent)
  console.log(`📄 Created documentation README at ${path.relative(cwd, readmePath)}`)

  // Update package.json with documentation scripts
  if (isNodeProject) {
    try {
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"))

      if (!packageJson.scripts) {
        packageJson.scripts = {}
      }

      // Add documentation scripts
      packageJson.scripts["docs:generate"] = "specify generate"
      packageJson.scripts["docs:validate"] = "specify validate"
      packageJson.scripts["docs:serve"] = "npx @redocly/cli preview-docs specs/openapi.json"

      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2))
      console.log("📦 Updated package.json with documentation scripts")
    } catch (error) {
      console.log("⚠️  Could not update package.json scripts")
    }
  }

  console.log("\n🎉 API specification initialized successfully!")
  console.log("\nNext steps:")
  console.log("1. Edit specs/openapi.json to define your API")
  console.log("2. Run 'npm run docs:generate' to generate documentation")
  console.log("3. Run 'npm run docs:serve' to preview documentation")
}

async function generateSpec() {
  console.log("🔄 Generating OpenAPI specification...")

  try {
    // Import the Server to generate specs from the codebase
    const { Server } = await import("../../server/server")
    const spec = await Server.openapi()

    const outputPath = "specs/openapi.json"
    await fs.writeFile(outputPath, JSON.stringify(spec, null, 2))
    console.log(`✅ Generated specification at ${outputPath}`)
  } catch (error) {
    console.error("❌ Failed to generate specification:", error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

async function validateSpec() {
  console.log("🔍 Validating OpenAPI specification...")

  const specPaths = ["specs/openapi.json", "openapi.json"]

  let specPath: string | null = null
  for (const path of specPaths) {
    try {
      await fs.access(path)
      specPath = path
      break
    } catch {}
  }

  if (!specPath) {
    console.error("❌ No OpenAPI specification found. Run 'specify init-here' first.")
    process.exit(1)
  }

  try {
    const specContent = await fs.readFile(specPath, "utf-8")
    const spec = JSON.parse(specContent)

    // Basic validation
    if (!spec.openapi) {
      throw new Error("Missing 'openapi' field")
    }

    if (!spec.info) {
      throw new Error("Missing 'info' field")
    }

    if (!spec.paths) {
      console.log("⚠️  Warning: No paths defined in specification")
    }

    console.log("✅ OpenAPI specification is valid")
  } catch (error) {
    console.error("❌ Invalid OpenAPI specification:", error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

async function getProjectName(): Promise<string> {
  try {
    const packageJson = JSON.parse(await fs.readFile("package.json", "utf-8"))
    return packageJson.name || "API"
  } catch {
    return "API"
  }
}
