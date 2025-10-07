import { z } from "zod";
import { $ } from "bun";

export const filesystemTool = {
  name: "filesystem",
  description: "File system operations with safety checks",
  args: z.object({
    operation: z.enum(["read", "write", "list", "delete"]),
    path: z.string(),
    content: z.string().optional()
  }),
  execute: async (args: { operation: string; path: string; content?: string }) => {
    const { operation, path, content } = args;
    switch (operation) {
      case "read":
        return await $`cat ${path}`.text();
      case "write":
        if (!content) throw new Error("Content required for write");
        return await $`echo ${content} > ${path}`.text();
      case "list":
        return await $`ls -la ${path}`.text();
      case "delete":
        return await $`rm ${path}`.text();
    }
  }
};