import { z } from "zod";
import type { CommandDefinition } from "../types.js";


const autopilot_createSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  agent: z.string().optional().describe("Assignee agent (name or ID) — required"),
  description: z.string().optional().describe("Autopilot description (used as the run prompt)"),
  issue_title_template: z.string().optional().describe("Template for issue titles (create_issue mode). Only {{date}} (UTC, YYYY-MM-DD) is interpolated; any other {{...}} token is rejected at create-time."),
  mode: z.string().optional().describe("Execution mode: create_issue or run_only (required)"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  project: z.string().optional().describe("Project ID (optional)"),
  subscriber: z.string().optional().describe("Member subscriber to notify for issues this autopilot creates (name or user ID; repeatable)"),
  title: z.string().optional().describe("Autopilot title (required)"),
}).passthrough();

export const autopilot_createCommand: CommandDefinition = {
  commandId: "autopilot.create",
  title: "Create a new autopilot",
  description: "Create a new autopilot",
  inputSchema: autopilot_createSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/autopilot/create"
};


const autopilot_deleteSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
}).passthrough();

export const autopilot_deleteCommand: CommandDefinition = {
  commandId: "autopilot.delete",
  title: "Delete an autopilot",
  description: "Delete an autopilot",
  inputSchema: autopilot_deleteSchema,
  risk: "destructive",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "DELETE",
  path: "/autopilot/delete"
};


const autopilot_getSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  show_secrets: z.string().optional().describe("live webhook credentials in JSON output (unsafe for logs)"),
}).passthrough();

export const autopilot_getCommand: CommandDefinition = {
  commandId: "autopilot.get",
  title: "Get autopilot details (webhook credentials redacted by default)",
  description: "Get autopilot details (webhook credentials redacted by default)",
  inputSchema: autopilot_getSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/autopilot/get"
};


const autopilot_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  full_id: z.string().optional().describe("full UUIDs in table output"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
  status: z.string().optional().describe("Filter by status (active, paused)"),
}).passthrough();

export const autopilot_listCommand: CommandDefinition = {
  commandId: "autopilot.list",
  title: "List autopilots in the workspace",
  description: "List autopilots in the workspace",
  inputSchema: autopilot_listSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/autopilot/list"
};


const autopilot_runsSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  limit: z.number().optional().describe("Max number of runs to return (default 20)"),
  offset: z.number().optional().describe("Pagination offset"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
}).passthrough();

export const autopilot_runsCommand: CommandDefinition = {
  commandId: "autopilot.runs",
  title: "List execution history for an autopilot",
  description: "List execution history for an autopilot",
  inputSchema: autopilot_runsSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/autopilot/runs"
};


const autopilot_triggerSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
}).passthrough();

export const autopilot_triggerCommand: CommandDefinition = {
  commandId: "autopilot.trigger",
  title: "Manually trigger an autopilot to run once",
  description: "Manually trigger an autopilot to run once",
  inputSchema: autopilot_triggerSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/autopilot/trigger"
};


const autopilot_trigger_addSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  autopilot_id: z.string().min(1).describe("Positional argument: autopilot_id"),
  cron: z.string().optional().describe("Cron expression (required for --kind schedule)"),
  kind: z.string().optional().describe("Trigger kind: schedule or webhook (default \"schedule\")"),
  label: z.string().optional().describe("Optional human-readable label"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  timezone: z.string().optional().describe("IANA timezone (default UTC; schedule only)"),
}).passthrough();

export const autopilot_trigger_addCommand: CommandDefinition = {
  commandId: "autopilot.trigger-add",
  title: "Add a schedule or webhook trigger to an autopilot",
  description: "Add a schedule or webhook trigger to an autopilot",
  inputSchema: autopilot_trigger_addSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/autopilot/trigger-add"
};


const autopilot_trigger_deleteSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  autopilot_id: z.string().min(1).describe("Positional argument: autopilot_id"),
  trigger_id: z.string().min(1).describe("Positional argument: trigger_id"),
}).passthrough();

export const autopilot_trigger_deleteCommand: CommandDefinition = {
  commandId: "autopilot.trigger-delete",
  title: "Delete a trigger",
  description: "Delete a trigger",
  inputSchema: autopilot_trigger_deleteSchema,
  risk: "destructive",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "DELETE",
  path: "/autopilot/trigger-delete"
};


const autopilot_trigger_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  autopilot_id: z.string().min(1).describe("Positional argument: autopilot_id"),
  full_id: z.string().optional().describe("full UUIDs in table output"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
}).passthrough();

export const autopilot_trigger_listCommand: CommandDefinition = {
  commandId: "autopilot.trigger-list",
  title: "List an autopilot's triggers (ids for trigger-update/-delete/-rotate-url)",
  description: "List an autopilot's triggers (ids for trigger-update/-delete/-rotate-url)",
  inputSchema: autopilot_trigger_listSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/autopilot/trigger-list"
};


const autopilot_trigger_rotate_urlSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  autopilot_id: z.string().min(1).describe("Positional argument: autopilot_id"),
  trigger_id: z.string().min(1).describe("Positional argument: trigger_id"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
}).passthrough();

export const autopilot_trigger_rotate_urlCommand: CommandDefinition = {
  commandId: "autopilot.trigger-rotate-url",
  title: "Rotate the webhook URL of a webhook trigger",
  description: "Rotate the webhook URL of a webhook trigger",
  inputSchema: autopilot_trigger_rotate_urlSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/autopilot/trigger-rotate-url"
};


const autopilot_trigger_updateSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  autopilot_id: z.string().min(1).describe("Positional argument: autopilot_id"),
  trigger_id: z.string().min(1).describe("Positional argument: trigger_id"),
  cron: z.string().optional().describe("New cron expression"),
  enabled: z.string().optional().describe("or disable the trigger (default true)"),
  label: z.string().optional().describe("New label"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  timezone: z.string().optional().describe("New IANA timezone"),
}).passthrough();

export const autopilot_trigger_updateCommand: CommandDefinition = {
  commandId: "autopilot.trigger-update",
  title: "Update an existing trigger",
  description: "Update an existing trigger",
  inputSchema: autopilot_trigger_updateSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/autopilot/trigger-update"
};


const autopilot_updateSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  agent: z.string().optional().describe("New assignee agent (name or ID)"),
  clear_subscribers: z.string().optional().describe("all autopilot subscribers"),
  description: z.string().optional().describe("New description"),
  issue_title_template: z.string().optional().describe("New issue title template. Only {{date}} (UTC, YYYY-MM-DD) is interpolated; any other {{...}} token is rejected."),
  mode: z.string().optional().describe("New execution mode (create_issue or run_only)"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  project: z.string().optional().describe("New project ID (use empty string to clear)"),
  status: z.string().optional().describe("New status (active, paused)"),
  subscriber: z.string().optional().describe("Replace subscribers with this member (name or user ID; repeatable)"),
  title: z.string().optional().describe("New title"),
}).passthrough();

export const autopilot_updateCommand: CommandDefinition = {
  commandId: "autopilot.update",
  title: "Update an autopilot",
  description: "Update an autopilot",
  inputSchema: autopilot_updateSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/autopilot/update"
};


export const autopilotCommands: readonly CommandDefinition[] = [
  autopilot_createCommand,
  autopilot_deleteCommand,
  autopilot_getCommand,
  autopilot_listCommand,
  autopilot_runsCommand,
  autopilot_triggerCommand,
  autopilot_trigger_addCommand,
  autopilot_trigger_deleteCommand,
  autopilot_trigger_listCommand,
  autopilot_trigger_rotate_urlCommand,
  autopilot_trigger_updateCommand,
  autopilot_updateCommand
];
