import { describe, it, expect } from "bun:test";
import { filesystemTool } from "./filesystem";

describe("filesystemTool", () => {
  it("should read a file", async () => {
     const result = await filesystemTool.execute({
       operation: "read",
       path: "package.json"
     });
    expect(result).toBeDefined();
  });

  it("should throw error for invalid path", async () => {
    expect(async () => {
       await filesystemTool.execute({
         operation: "read",
         path: "../../../etc/passwd"
       });
    }).toThrow("Invalid path: potential directory traversal");
  });
});