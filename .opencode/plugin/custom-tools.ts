import { filesystemTool } from "../tool/filesystem";
import { gitTool } from "../tool/git";
import { bunTool } from "../tool/bun";
import { databaseTool } from "../tool/database";

export default () => ({
  name: "custom-tools",
  description: "Registry for custom project tools",
  tools: [
    filesystemTool,
    gitTool,
    bunTool,
    databaseTool
  ],
  register: () => {
    // Register tools with OpenCode
    console.log("Custom tools registered");
  }
});