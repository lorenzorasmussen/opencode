import { z } from "zod";
import { $ } from "bun";

export const bunTool = {
  name: "bun",
  description: "Bun package manager operations",
  args: z.object({
    command: z.enum(["install", "run", "build", "test"]),
    script: z.string().optional()
  }),
  execute: async (args: { command: string; script?: string }) => {
    const { command, script } = args;
    switch (command) {
      case "install":
        return await $`bun install`.text();
      case "run":
        if (!script) throw new Error("Script required for run");
        return await $`bun run ${script}`.text();
      case "build":
        return await $`bun run build`.text();
      case "test":
        return await $`bun test`.text();
    }
  }
};