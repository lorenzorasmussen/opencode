import { DialogSelect, type DialogSelectOption } from "@tui/ui/dialog-select"
import { DialogAlert } from "@tui/ui/dialog-alert"
import { createSignal } from "solid-js"
import { type DialogContext } from "@tui/ui/dialog"

export function AddDirectoryDialog() {
  const [step, setStep] = createSignal<"intro" | "help" | "cli">("intro")

  if (step() === "intro") {
    return (
      <DialogSelect
        title="Add Directory to Workspace"
        options={[
          {
            value: "cli",
            title: "Use CLI Command",
            description: "Run the full interactive directory addition workflow",
            onSelect: (ctx: DialogContext) => {
              ctx.replace(() => (
                <DialogAlert
                  title="Add Directory"
                  message="To add a directory to your workspace, use this command:\n\nopencode workspace add <path-to-directory>\n\nThis will prompt you for:\n• Display name\n• Description\n• Short alias (optional)\n\nExample:\nopencode workspace add ./my-project"
                />
              ))
            },
          },
          {
            value: "help",
            title: "Help & Information",
            description: "Learn about workspace directory management",
            onSelect: () => setStep("help"),
          },
        ]}
      />
    )
  }

  if (step() === "cli") {
    return (
      <DialogAlert
        title="CLI Command"
        message="Please run this command in your terminal:\n\nopencode workspace add <directory-path>\n\nThis provides a complete interactive experience for adding directories to your workspace."
      />
    )
  }

  return (
    <DialogAlert
      title="Workspace Directory Help"
      message="Workspace directories allow you to organize and manage multiple project folders.\n\n• Add directories to access them quickly\n• Set display names and descriptions\n• Create shortcuts with aliases\n\nUse 'opencode workspace list' to see all configured directories."
    />
  )
}