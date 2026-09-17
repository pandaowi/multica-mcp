import { z } from "zod";
import type { CommandDefinition } from "../types.js";


const workspace_createSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  context: z.string().optional().describe("Workspace context (decodes \n, \r, \t, \\; pipe via --context-stdin to preserve literal backslashes)"),
  context_stdin: z.string().optional().describe("context from stdin (preserves multi-line content verbatim)"),
  description: z.string().optional().describe("Workspace description (decodes \n, \r, \t, \\; pipe via --description-stdin to preserve literal backslashes)"),
  description_stdin: z.string().optional().describe("description from stdin (preserves multi-line content verbatim)"),
  issue_prefix: z.string().optional().describe("Issue prefix (uppercased server-side)"),
  name: z.string().optional().describe("Workspace name"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  slug: z.string().optional().describe("Workspace slug"),
}).passthrough();

export const workspace_createCommand: CommandDefinition = {
  commandId: "workspace.create",
  title: "Creates a new workspace and adds you as its owner",
  description: "Creates a new workspace and adds you as its owner. Both --name and --slug are required; the slug is permanent (lowercase letters, digits, and hyphens) and cannot be changed after creation.",
  inputSchema: workspace_createSchema,
  risk: "routine_write",
  requiresWorkspace: false,
  requiresDevice: false,
  method: "POST",
  path: "/workspace/create"
};


const workspace_getSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
}).passthrough();

export const workspace_getCommand: CommandDefinition = {
  commandId: "workspace.get",
  title: "Prints the full details of a workspace",
  description: "Prints the full details of a workspace. The argument accepts a full UUID, a slug, or a short UUID prefix (≥4 hex chars) as shown in 'workspace list'. If omitted, the current default workspace is used.",
  inputSchema: workspace_getSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/workspace/get"
};


const workspace_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  full_id: z.string().optional().describe("full UUIDs in table output"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
}).passthrough();

export const workspace_listCommand: CommandDefinition = {
  commandId: "workspace.list",
  title: "List all workspaces you belong to",
  description: "List all workspaces you belong to",
  inputSchema: workspace_listSchema,
  risk: "read_only",
  requiresWorkspace: false,
  requiresDevice: false,
  method: "GET",
  path: "/workspace/list"
};


const workspace_mcp_addSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  server_name: z.string().min(1).describe("Positional argument: server_name"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  server_config: z.string().optional().describe("Server entry as JSON (avoid: lands in shell history)"),
  server_config_file: z.string().optional().describe("Read the server entry JSON from a file"),
  server_config_stdin: z.string().optional().describe("the server entry JSON from stdin"),
}).passthrough();

export const workspace_mcp_addCommand: CommandDefinition = {
  commandId: "workspace.mcp.add",
  title: "Adds an MCP server to the workspace library",
  description: "Adds an MCP server to the workspace library. It is assigned to no agent — use 'multica agent mcp add <agent-id> <server-id>' to give it to one.",
  inputSchema: workspace_mcp_addSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/workspace/mcp/add"
};


const workspace_mcp_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
}).passthrough();

export const workspace_mcp_listCommand: CommandDefinition = {
  commandId: "workspace.mcp.list",
  title: "Lists the workspace MCP library by name and transport",
  description: "Lists the workspace MCP library by name and transport. The stored configuration itself is write-only and is never returned — to anyone, including owners — because MCP entries routinely embed API tokens and a session URL is a credential on its own.",
  inputSchema: workspace_mcp_listSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/workspace/mcp/list"
};


const workspace_mcp_removeSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  server_id: z.string().min(1).describe("Positional argument: server_id"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
}).passthrough();

export const workspace_mcp_removeCommand: CommandDefinition = {
  commandId: "workspace.mcp.remove",
  title: "Removes the server from the library and from every agent it was assigned to",
  description: "Removes the server from the library and from every agent it was assigned to.",
  inputSchema: workspace_mcp_removeSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/workspace/mcp/remove"
};


const workspace_mcp_updateSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  server_id: z.string().min(1).describe("Positional argument: server_id"),
  name: z.string().optional().describe("New server name"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  server_config: z.string().optional().describe("Replacement server entry as JSON (avoid: lands in shell history)"),
  server_config_file: z.string().optional().describe("Read the replacement server entry JSON from a file"),
  server_config_stdin: z.string().optional().describe("the replacement server entry JSON from stdin"),
}).passthrough();

export const workspace_mcp_updateCommand: CommandDefinition = {
  commandId: "workspace.mcp.update",
  title: "Renames a server, replaces its configuration, or both",
  description: "Renames a server, replaces its configuration, or both. Agents keep their assignment across a rename because assignments key off the server id, not its name.",
  inputSchema: workspace_mcp_updateSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/workspace/mcp/update"
};


const workspace_member_inviteSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  email: z.string().min(1).describe("Positional argument: email"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
  role: z.string().optional().describe("Member role to grant: member or admin (owner is not allowed) (default \"member\")"),
}).passthrough();

export const workspace_member_inviteCommand: CommandDefinition = {
  commandId: "workspace.member.invite",
  title: "Sends a workspace invitation to an email address",
  description: "Sends a workspace invitation to an email address. The invitee gets a pending invitation they must accept before they join — this does not add them instantly. The optional workspace argument accepts a full UUID, a slug, or a short UUID prefix (≥4 hex chars) as shown in 'workspace list'; if omitted the current default workspace is used (--workspace-id / MULTICA_WORKSPACE_ID / profile default).",
  inputSchema: workspace_member_inviteSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/workspace/member/invite"
};


const workspace_member_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
}).passthrough();

export const workspace_member_listCommand: CommandDefinition = {
  commandId: "workspace.member.list",
  title: "List workspace members",
  description: "List workspace members",
  inputSchema: workspace_member_listSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/workspace/member/list"
};


const workspace_switchSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),

}).passthrough();

export const workspace_switchCommand: CommandDefinition = {
  commandId: "workspace.switch",
  title: "Sets the default workspace for the current profile after verifying you have access to it",
  description: "Sets the default workspace for the current profile after verifying you have access to it. Accepts a full UUID, a slug, or a short UUID prefix (≥4 hex chars) as shown in 'workspace list'. Subsequent commands without --workspace-id or MULTICA_WORKSPACE_ID will target this workspace.",
  inputSchema: workspace_switchSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/workspace/switch"
};


const workspace_updateSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  context: z.string().optional().describe("New workspace context (decodes \n, \r, \t, \\; pipe via --context-stdin to preserve literal backslashes)"),
  context_stdin: z.string().optional().describe("context from stdin (preserves multi-line content verbatim)"),
  description: z.string().optional().describe("New description (decodes \n, \r, \t, \\; pipe via --description-stdin to preserve literal backslashes)"),
  description_stdin: z.string().optional().describe("description from stdin (preserves multi-line content verbatim)"),
  issue_prefix: z.string().optional().describe("New issue prefix (uppercased server-side)"),
  name: z.string().optional().describe("New workspace name"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
}).passthrough();

export const workspace_updateCommand: CommandDefinition = {
  commandId: "workspace.update",
  title: "Update workspace metadata (admin/owner only)",
  description: "Update workspace metadata (admin/owner only)",
  inputSchema: workspace_updateSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/workspace/update"
};


export const workspaceCommands: readonly CommandDefinition[] = [
  workspace_createCommand,
  workspace_getCommand,
  workspace_listCommand,
  workspace_mcp_addCommand,
  workspace_mcp_listCommand,
  workspace_mcp_removeCommand,
  workspace_mcp_updateCommand,
  workspace_member_inviteCommand,
  workspace_member_listCommand,
  workspace_switchCommand,
  workspace_updateCommand
];
