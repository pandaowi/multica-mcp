import { z } from "zod";
import type { CommandDefinition } from "../types.js";


const squad_activitySchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  issue_id: z.string().min(1).describe("Positional argument: issue_id"),
  outcome: z.string().min(1).describe("Positional argument: outcome"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
  reason: z.string().optional().describe("Short explanation of the decision"),
}).strict();

export const squad_activityCommand: CommandDefinition = {
  commandId: "squad.activity",
  title: "Record the squad leader's evaluation decision for an issue",
  description: "Record the squad leader's evaluation decision for an issue.",
  inputSchema: squad_activitySchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/squad/activity"
};


const squad_createSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  description: z.string().optional().describe("Squad description"),
  leader: z.string().optional().describe("Leader agent (name or ID) — required"),
  name: z.string().optional().describe("Squad name (required)"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
}).strict();

export const squad_createCommand: CommandDefinition = {
  commandId: "squad.create",
  title: "Create a new squad",
  description: "Create a new squad",
  inputSchema: squad_createSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/squad/create"
};


const squad_deleteSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  squad_id: z.string().min(1).describe("Positional argument: squad_id"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
}).strict();

export const squad_deleteCommand: CommandDefinition = {
  commandId: "squad.delete",
  title: "Delete (archive) a squad",
  description: "Delete (archive) a squad",
  inputSchema: squad_deleteSchema,
  risk: "destructive",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "DELETE",
  path: "/squad/delete"
};


const squad_getSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  squad_id: z.string().min(1).describe("Positional argument: squad_id"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
}).strict();

export const squad_getCommand: CommandDefinition = {
  commandId: "squad.get",
  title: "Get squad details",
  description: "Get squad details",
  inputSchema: squad_getSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/squad/get"
};


const squad_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
}).strict();

export const squad_listCommand: CommandDefinition = {
  commandId: "squad.list",
  title: "List squads in the workspace",
  description: "List squads in the workspace",
  inputSchema: squad_listSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/squad/list"
};


const squad_member_addSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  squad_id: z.string().min(1).describe("Positional argument: squad_id"),
  member_id: z.string().optional().describe("Member or agent ID (required)"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  role: z.string().optional().describe("Role in the squad (default \"member\")"),
  type: z.string().optional().describe("Member type: agent or member (default \"agent\")"),
}).strict();

export const squad_member_addCommand: CommandDefinition = {
  commandId: "squad.member.add",
  title: "Add a member to a squad",
  description: "Add a member to a squad",
  inputSchema: squad_member_addSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/squad/member/add"
};


const squad_member_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  squad_id: z.string().min(1).describe("Positional argument: squad_id"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
}).strict();

export const squad_member_listCommand: CommandDefinition = {
  commandId: "squad.member.list",
  title: "List members of a squad",
  description: "List members of a squad",
  inputSchema: squad_member_listSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/squad/member/list"
};


const squad_member_removeSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  squad_id: z.string().min(1).describe("Positional argument: squad_id"),
  member_id: z.string().optional().describe("Member or agent ID (required)"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
  type: z.string().optional().describe("Member type: agent or member (default \"agent\")"),
}).strict();

export const squad_member_removeCommand: CommandDefinition = {
  commandId: "squad.member.remove",
  title: "Remove a member from a squad",
  description: "Remove a member from a squad",
  inputSchema: squad_member_removeSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/squad/member/remove"
};


const squad_member_set_roleSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  squad_id: z.string().min(1).describe("Positional argument: squad_id"),
  member_id: z.string().optional().describe("Member or agent ID (required)"),
  member_type: z.string().optional().describe("Member type: agent or member (default \"agent\")"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  role: z.string().optional().describe("New role in the squad (required)"),
}).strict();

export const squad_member_set_roleCommand: CommandDefinition = {
  commandId: "squad.member.set-role",
  title: "Change a squad member's role",
  description: "Change a squad member's role",
  inputSchema: squad_member_set_roleSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/squad/member/set-role"
};


const squad_updateSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  squad_id: z.string().min(1).describe("Positional argument: squad_id"),
  avatar_url: z.string().optional().describe("New avatar URL"),
  description: z.string().optional().describe("New description"),
  instructions: z.string().optional().describe("New instructions"),
  leader: z.string().optional().describe("New leader agent (name or ID)"),
  name: z.string().optional().describe("New name"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
}).strict();

export const squad_updateCommand: CommandDefinition = {
  commandId: "squad.update",
  title: "Update a squad",
  description: "Update a squad",
  inputSchema: squad_updateSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/squad/update"
};


export const squadCommands: readonly CommandDefinition[] = [
  squad_activityCommand,
  squad_createCommand,
  squad_deleteCommand,
  squad_getCommand,
  squad_listCommand,
  squad_member_addCommand,
  squad_member_listCommand,
  squad_member_removeCommand,
  squad_member_set_roleCommand,
  squad_updateCommand
];
