import { z } from "zod";
import { $ } from "bun";

type GitCommand = "status" | "diff" | "add" | "commit" | "push" | "pull";

export const gitTool = {
  name: "git",
  description: "Git operations with safety checks",
  args: z.object({
    command: z.enum(["status", "diff", "add", "commit", "push", "pull"]),
    files: z.array(z.string()).optional(),
    message: z.string().optional()
  }),
  execute: async (args: { command: GitCommand; files?: string[]; message?: string }) => {
    const command: GitCommand = args.command;
    const files: string[] | undefined = args.files;
    const message: string | undefined = args.message;
    switch (command) {
      case "status":
        return await $`git status --porcelain`.text();
      case "diff":
        return await $`git diff ${files?.join(" ") || ""}`.text();
      case "commit":
        if (!message) throw new Error("Commit message required");
        return await $`git commit -m ${message}`.text();
      // ... other cases
    }
  }
};