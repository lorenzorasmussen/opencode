import { describe, it, expect } from "bun:test";
import { databaseTool } from "./database";

describe("databaseTool", () => {
  it("should execute query", async () => {
    const result = await databaseTool.execute({
      action: "query"
    });
    expect(result).toBe("Query executed successfully");
  });
});