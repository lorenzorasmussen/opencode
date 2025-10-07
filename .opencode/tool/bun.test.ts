import { describe, it, expect } from "bun:test";
import { bunTool } from "./bun";

describe("bunTool", () => {
  it("should run bun install", async () => {
    const result = await bunTool.execute({
      command: "install"
    });
    expect(result).toBeDefined();
  });

  it("should throw error for run without script", async () => {
    expect(async () => {
      await bunTool.execute({
        command: "run"
      });
    }).toThrow("Script name required");
  });
});