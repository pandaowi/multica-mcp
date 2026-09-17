import { z } from "zod";
import type { CommandDefinition } from "../types.js";


const repo_addSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  description: z.string().optional().describe("Optional description; only valid when adding one URL"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  url: z.string().optional().describe("Repository URL to add (may be repeated)"),
}).strict();

export const repo_addCommand: CommandDefinition = {
  commandId: "repo.add",
  title: "Adds one or more repository URLs to the current workspace repository registry",
  description: "Adds one or more repository URLs to the current workspace repository registry. Existing URLs are not duplicated. Use project resources when you need project-specific context instead.",
  inputSchema: repo_addSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/repo/add"
};


const repo_checkoutSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  url: z.string().min(1).describe("Positional argument: url"),
  ref: z.string().optional().describe("branch, tag, or commit to check out instead of the remote default branch"),
}).strict();

export const repo_checkoutCommand: CommandDefinition = {
  commandId: "repo.checkout",
  title: "Creates a git worktree from the daemon's bare clone cache",
  description: "Creates a git worktree from the daemon's bare clone cache. Used by agents to check out repos on demand.",
  inputSchema: repo_checkoutSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: true,
  method: "GET",
  path: "/repo/checkout"
};


const repo_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
}).strict();

export const repo_listCommand: CommandDefinition = {
  commandId: "repo.list",
  title: "Lists the repository registry for the current workspace",
  description: "Lists the repository registry for the current workspace. These are workspace-level repos, separate from project resources.",
  inputSchema: repo_listSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/repo/list"
};


const repo_removeSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  url: z.string().optional().describe("Repository URL to remove (may be repeated)"),
}).strict();

export const repo_removeCommand: CommandDefinition = {
  commandId: "repo.remove",
  title: "Removes one or more repository URLs from the current workspace repository registry",
  description: "Removes one or more repository URLs from the current workspace repository registry.",
  inputSchema: repo_removeSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/repo/remove"
};


export const repoCommands: readonly CommandDefinition[] = [
  repo_addCommand,
  repo_checkoutCommand,
  repo_listCommand,
  repo_removeCommand
];
