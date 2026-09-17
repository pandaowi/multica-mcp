import { z } from "zod";
import type { CommandDefinition } from "../types.js";


const runtime_activitySchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  runtime_id: z.string().min(1).describe("Positional argument: runtime_id"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const runtime_activityCommand: CommandDefinition = {
  commandId: "runtime.activity",
  title: "Get hourly run activity for a runtime",
  description: "Get hourly run activity for a runtime",
  inputSchema: runtime_activitySchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/runtime/activity"
};


const runtime_deleteSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  runtime_id: z.string().min(1).describe("Positional argument: runtime_id"),
  cascade: z.string().optional().describe("active agents from the runtime, cancel their runs, then delete the runtime"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const runtime_deleteCommand: CommandDefinition = {
  commandId: "runtime.delete",
  title: "Delete a runtime registration from the workspace",
  description: "Delete a runtime registration from the workspace.",
  inputSchema: runtime_deleteSchema,
  risk: "destructive",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "DELETE",
  path: "/runtime/delete"
};


const runtime_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const runtime_listCommand: CommandDefinition = {
  commandId: "runtime.list",
  title: "List runtimes in the workspace",
  description: "List runtimes in the workspace",
  inputSchema: runtime_listSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/runtime/list"
};


const runtime_profile_createSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  command_name: z.string().optional().describe("Executable the daemon resolves on PATH (required)"),
  description: z.string().optional().describe("Optional description"),
  display_name: z.string().optional().describe("Human-readable profile name (required)"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  protocol_family: z.string().optional().describe("Supported backend the profile routes to (required)"),
});

export const runtime_profile_createCommand: CommandDefinition = {
  commandId: "runtime.profile.create",
  title: "Create a custom runtime profile",
  description: "Create a custom runtime profile",
  inputSchema: runtime_profile_createSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/runtime/profile/create"
};


const runtime_profile_deleteSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  profile_id: z.string().min(1).describe("Positional argument: profile_id"),
});

export const runtime_profile_deleteCommand: CommandDefinition = {
  commandId: "runtime.profile.delete",
  title: "Delete a custom runtime profile",
  description: "Delete a custom runtime profile",
  inputSchema: runtime_profile_deleteSchema,
  risk: "destructive",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "DELETE",
  path: "/runtime/profile/delete"
};


const runtime_profile_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const runtime_profile_listCommand: CommandDefinition = {
  commandId: "runtime.profile.list",
  title: "List custom runtime profiles in the workspace",
  description: "List custom runtime profiles in the workspace",
  inputSchema: runtime_profile_listSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/runtime/profile/list"
};


const runtime_profile_set_pathSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  profile_id: z.string().min(1).describe("Positional argument: profile_id"),
  path: z.string().optional().describe("Absolute path to the executable on this machine (required)"),
});

export const runtime_profile_set_pathCommand: CommandDefinition = {
  commandId: "runtime.profile.set-path",
  title: "Pin a per-machine executable path for a runtime profile (local only)",
  description: "Pin a per-machine executable path for a runtime profile (local only)",
  inputSchema: runtime_profile_set_pathSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/runtime/profile/set-path"
};


const runtime_profile_unset_pathSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  profile_id: z.string().min(1).describe("Positional argument: profile_id"),
});

export const runtime_profile_unset_pathCommand: CommandDefinition = {
  commandId: "runtime.profile.unset-path",
  title: "Remove a per-machine executable path override for a runtime profile",
  description: "Remove a per-machine executable path override for a runtime profile",
  inputSchema: runtime_profile_unset_pathSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/runtime/profile/unset-path"
};


const runtime_profile_updateSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  profile_id: z.string().min(1).describe("Positional argument: profile_id"),
  command_name: z.string().optional().describe("New command name"),
  description: z.string().optional().describe("New description"),
  display_name: z.string().optional().describe("New display name"),
  enabled: z.string().optional().describe("or disable the profile (default true)"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
});

export const runtime_profile_updateCommand: CommandDefinition = {
  commandId: "runtime.profile.update",
  title: "Update a custom runtime profile (protocol family is immutable)",
  description: "Update a custom runtime profile (protocol family is immutable)",
  inputSchema: runtime_profile_updateSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/runtime/profile/update"
};


const runtime_renameSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  runtime_id: z.string().min(1).describe("Positional argument: runtime_id"),
  name: z.string().min(1).describe("Positional argument: name"),
  machine: z.string().optional().describe("the name to every runtime on the same machine"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const runtime_renameCommand: CommandDefinition = {
  commandId: "runtime.rename",
  title: "Set (or clear) a runtime's custom display name",
  description: "Set (or clear) a runtime's custom display name.",
  inputSchema: runtime_renameSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/runtime/rename"
};


const runtime_updateSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  runtime_id: z.string().min(1).describe("Positional argument: runtime_id"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  target_version: z.string().optional().describe("Target version to update to (required)"),
  wait: z.string().optional().describe("for update to complete (poll until done)"),
});

export const runtime_updateCommand: CommandDefinition = {
  commandId: "runtime.update",
  title: "Initiate a CLI update on a runtime",
  description: "Initiate a CLI update on a runtime",
  inputSchema: runtime_updateSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/runtime/update"
};


const runtime_usageSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  runtime_id: z.string().min(1).describe("Positional argument: runtime_id"),
  days: z.number().optional().describe("Number of days of usage data to retrieve (max 365) (default 90)"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const runtime_usageCommand: CommandDefinition = {
  commandId: "runtime.usage",
  title: "Get token usage for a runtime",
  description: "Get token usage for a runtime",
  inputSchema: runtime_usageSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/runtime/usage"
};


export const runtimeCommands: readonly CommandDefinition[] = [
  runtime_activityCommand,
  runtime_deleteCommand,
  runtime_listCommand,
  runtime_profile_createCommand,
  runtime_profile_deleteCommand,
  runtime_profile_listCommand,
  runtime_profile_set_pathCommand,
  runtime_profile_unset_pathCommand,
  runtime_profile_updateCommand,
  runtime_renameCommand,
  runtime_updateCommand,
  runtime_usageCommand
];
