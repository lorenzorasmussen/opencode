import { describe, it, expect } from "bun:test";
import { gitTool } from "./git";

describe("gitTool", () => {
  it("should get git status", async () => {
    const result = await gitTool.execute({
      command: "status"
    });
    expect(result).toBeDefined();
  });

  it("should throw error without message for commit", async () => {
    expect(async () => {
      await gitTool.execute({
        command: "commit"
      });
    }).toThrow("Commit message required");
  });
});