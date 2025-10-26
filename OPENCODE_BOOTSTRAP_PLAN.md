# OpenCode Bootstrap and Init Implementation Plan

## 1. Directory Structure

### Global Directory (`~/.config/opencode/`)
- Purpose: Templates, reusable agent/command markdown, global UI/theme settings, but never executable or project-specific code
- Structure:
```
~/.config/opencode/
├─ opencode.json             # Global defaults only!
├─ agent/                    # Reusable agent .md templates
├─ command/                  # Reusable command .md templates
├─ theme/
├─ keybinds.json
├─ formatter/
├─ providers/
└─ instructions/
```
- **Exclude:** `node_modules/`, `package.json`, per-project code/assets
- **Bootstrap code location:** For a global bootstrapper, place only non-executable templates here; for actual initialization scripts, place them in each project directory

### Project Directory (`~/projects/opencode/` or custom-repo)
- Purpose: All project-specific code, dependencies, working opencode.json, MCP/server configs, runtime assets, private agent tweaks
- Structure (created by `opencode /init` or bootstrap script):
```
~/projects/opencode/
├─ opencode.json         # Main config (dominates!) 
├─ node_modules/
├─ package.json
└─ .opencode/
    ├─ agent/            # Project-specific agent configs
    ├─ command/          # Project-specific commands
    ├─ instructions/
    ├─ mcp/              # MCP server configs
    └─ (any overrides from global pulled here on /init)
```

## 2. Bootstrap Init Logic

When run (`opencode /init` or custom init script):
1. **Checks** whether `.opencode/` exists in the repo; if not, creates necessary subdirs (`agent/`, `command/`, etc.)
2. **Copies** default templates from `~/.config/opencode/agent/` and `command/` into project-local `.opencode/` only if not already customized/overridden
3. **Generates** a fresh `opencode.json` with project-specific MCP, providers, and settings—pulling global defaults only
4. **Verifies** required npm/node assets and checks against forbidden global node_modules/package.json
5. **Optionally lints** for duplicate/ambiguous configs (e.g., agent name collision global vs. project)

## 3. File Precedence/Discovery Order

| Priority | Searched Dir                          | Used for            |
|----------|---------------------------------------|---------------------|
| 1        | Project (`./opencode.json`)           | Always preferred    |
| 2        | Project (`.opencode/{agent,command}`) | Commands/Agents     |
| 3        | Project (`package.json`, MCPs, etc.)  | npm/deps/MCPs       |
| 4        | Global (`~/.config/opencode/`)        | ONLY on fallback    |
| 5        | Global (agent/command .md, templates) | Template import     |

- **What Runs:**  
   - Only markdown/JSON templates are inherited from global
   - Only project-local code/commands/scripts (`node_modules/`, `package.json`) are executed by OpenCode run/agent commands
   - Global node packages, scripts, or modules are IGNORED and never executed

## 4. How Global Settings Apply to Projects

- When a new project runs `/init`, global opencode.json and template directories are referenced *as defaults*
- After initialization, the project's local settings override all global ones—future changes to global templates/settings only propagate if the local project does not override that config/command/agent name
- MCP servers, themes, and defaults in `~/.config/opencode/opencode.json` are offered as template choices, not as runtime settings once overwritten locally

## 5. Comparison: OpenCode Project vs Generic Project Directory

| **Characteristic**        | **OpenCode Project (`~/projects/opencode/`)**         | **Non-OpenCode Project (`~/projects/my-app/`)**          |
|--------------------------|-------------------------------------------------------|----------------------------------------------------------|
| **opencode.json**        | Present/required in project root                      | Optional. If absent, global config or defaults used      |
| **.opencode/**           | Always present; holds agent/, command/, instructions/ | May not exist; OpenCode won't look unless present        |
| **node_modules/**        | Allowed (project-specific deps, scripts)              | Allowed (project's own build/runtime deps)               |
| **package.json**         | Allowed (OpenCode agents/commands/scripts run here)   | Allowed; OpenCode will use if present                    |
| **Agents/Commands**      | Local `.opencode/agent/` and `.opencode/command/`     | Looks for these if `.opencode/` exists in cwd            |
| **Global Templates**     | Used if local assets missing or on `/init` only       | Used as fallback if `.opencode/` missing in cwd          |
| **Bootstrap/init**       | Required to set up proper folder with `/init` script  | Optional; can be run to CLI-bootstrap `.opencode/`       |
| **Config Precedence**    | 1. Project opencode.json 2. `.opencode/` assets 3. Global | 1. Project-level if present 2. Fallback to global templates/configs |
| **Runtime Behavior**     | Local agents/commands > global templates, project npm | If no OpenCode structure, global only; agents/commands loaded from project if init'd |
| **MCP/Server settings**  | Project-local, explicit JSON in project config        | Fallback to global if not defined in cwd                 |
| **What NOT Allowed**     | Global `node_modules`, project-less code execution    | Same: never run code from global config dir              |

## Best Practices

### Dedicated OpenCode Project:
- Use for platform extensions, shared agent development, or demo repos
- Expect all OpenCode custom logic/assets to be present and version-controlled

### Other Projects (`my-app`):
- Only natively uses OpenCode if you bootstrap `.opencode/` and config there (e.g., run `opencode /init`)
- Without `.opencode/`, will use global commands/templates, but cannot use agents/commands not present in global config
- Node/project assets are always local to `my-app` (never referenced from global)
- Recommended to version `.opencode/` for full team portability

## Next Steps

1. For new/existing projects in other repos, always run `opencode /init` or manually create `.opencode/` for project-scoped tooling
2. Never copy or symlink `node_modules` or active scripts from global config
3. Use global only for agent/command/tpl templates when no local override exists
4. Implement the correct bootstrap/init process ensuring assets are in the right location
5. Verify that the current setup in your project (`~/projects/opencode/`) follows the recommended structure