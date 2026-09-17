import { z } from "zod";
import type { CommandDefinition } from "../types.js";


const project_createSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  description: z.string().optional().describe("Project description"),
  due_date: z.string().optional().describe("Due date (calendar day, YYYY-MM-DD)"),
  icon: z.string().optional().describe("Project icon (emoji)"),
  lead: z.string().optional().describe("Lead name (member or agent)"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  repo: z.string().optional().describe("Attach a github_repo resource by URL (may be repeated)"),
  start_date: z.string().optional().describe("Start date (calendar day, YYYY-MM-DD)"),
  status: z.string().optional().describe("Project status"),
  title: z.string().optional().describe("Project title (required)"),
});

export const project_createCommand: CommandDefinition = {
  commandId: "project.create",
  title: "Create a new project",
  description: "Create a new project",
  inputSchema: project_createSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/project/create"
};


const project_deleteSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
});

export const project_deleteCommand: CommandDefinition = {
  commandId: "project.delete",
  title: "Delete a project",
  description: "Delete a project",
  inputSchema: project_deleteSchema,
  risk: "destructive",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "DELETE",
  path: "/project/delete"
};


const project_getSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
});

export const project_getCommand: CommandDefinition = {
  commandId: "project.get",
  title: "Get project details",
  description: "Get project details",
  inputSchema: project_getSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/project/get"
};


const project_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  full_id: z.string().optional().describe("full UUIDs in table output"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
  status: z.string().optional().describe("Filter by status"),
});

export const project_listCommand: CommandDefinition = {
  commandId: "project.list",
  title: "List projects in the workspace",
  description: "List projects in the workspace",
  inputSchema: project_listSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/project/list"
};


const project_resource_addSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  project_id: z.string().min(1).describe("Positional argument: project_id"),
  daemon_id: z.string().optional().describe("Shortcut: id of the daemon that owns the local path (only used when --type local_directory)"),
  default_branch_hint: z.string().optional().describe("Shortcut: optional default branch hint (only used when --type github_repo)"),
  execution_mode: z.string().optional().describe("Shortcut: how runs share the directory — in_place (default, one run at a time) or worktree (each run gets its own git worktree; requires a git repo) (only used when --type local_directory)"),
  label: z.string().optional().describe("Optional human-readable label"),
  local_path: z.string().optional().describe("Shortcut: absolute path to the working directory (only used when --type local_directory)"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  ref: z.string().optional().describe("Generic JSON resource_ref payload, or a github_repo checkout ref when used with --url"),
  ref_label: z.string().optional().describe("Shortcut: optional label embedded in resource_ref (only used when --type local_directory)"),
  type: z.string().optional().describe("Resource type (e.g. github_repo, local_directory — see docs) (default \"github_repo\")"),
  url: z.string().optional().describe("Shortcut: the repo URL (only used when --type github_repo)"),
});

export const project_resource_addCommand: CommandDefinition = {
  commandId: "project.resource.add",
  title: "Attach a resource to a project (e",
  description: "Attach a resource to a project (e.g. --type github_repo --url <url>)",
  inputSchema: project_resource_addSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/project/resource/add"
};


const project_resource_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  project_id: z.string().min(1).describe("Positional argument: project_id"),
  full_id: z.string().optional().describe("full UUIDs in table output"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const project_resource_listCommand: CommandDefinition = {
  commandId: "project.resource.list",
  title: "List resources attached to a project",
  description: "List resources attached to a project",
  inputSchema: project_resource_listSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/project/resource/list"
};


const project_resource_removeSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  project_id: z.string().min(1).describe("Positional argument: project_id"),
  resource_id: z.string().min(1).describe("Positional argument: resource_id"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const project_resource_removeCommand: CommandDefinition = {
  commandId: "project.resource.remove",
  title: "Detach a resource from a project",
  description: "Detach a resource from a project",
  inputSchema: project_resource_removeSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/project/resource/remove"
};


const project_resource_updateSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  project_id: z.string().min(1).describe("Positional argument: project_id"),
  resource_id: z.string().min(1).describe("Positional argument: resource_id"),
  clear_label: z.string().optional().describe("the human-readable label"),
  daemon_id: z.string().optional().describe("Shortcut: new daemon id (local_directory)"),
  default_branch_hint: z.string().optional().describe("Shortcut: new default branch hint (github_repo)"),
  execution_mode: z.string().optional().describe("Shortcut: new execution mode — in_place or worktree (local_directory)"),
  label: z.string().optional().describe("New human-readable label; pass an empty string to clear"),
  local_path: z.string().optional().describe("Shortcut: new absolute local path (local_directory)"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  position: z.number().optional().describe("New display position"),
  ref: z.string().optional().describe("Generic JSON resource_ref payload, or a github_repo checkout ref"),
  ref_label: z.string().optional().describe("Shortcut: new label embedded in resource_ref (local_directory)"),
  url: z.string().optional().describe("Shortcut: new repo URL (github_repo)"),
});

export const project_resource_updateCommand: CommandDefinition = {
  commandId: "project.resource.update",
  title: "Edit an attached resource (ref payload, label, or position)",
  description: "Edit an attached resource (ref payload, label, or position)",
  inputSchema: project_resource_updateSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/project/resource/update"
};


const project_statusSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  status: z.string().min(1).describe("Positional argument: status"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const project_statusCommand: CommandDefinition = {
  commandId: "project.status",
  title: "Change project status",
  description: "Change project status",
  inputSchema: project_statusSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/project/status"
};


const project_updateSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  description: z.string().optional().describe("New description"),
  due_date: z.string().optional().describe("New due date (calendar day, YYYY-MM-DD; pass empty string to clear)"),
  icon: z.string().optional().describe("New icon (emoji)"),
  lead: z.string().optional().describe("New lead name (member or agent)"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  start_date: z.string().optional().describe("New start date (calendar day, YYYY-MM-DD; pass empty string to clear)"),
  status: z.string().optional().describe("New status"),
  title: z.string().optional().describe("New title"),
});

export const project_updateCommand: CommandDefinition = {
  commandId: "project.update",
  title: "Update a project",
  description: "Update a project",
  inputSchema: project_updateSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/project/update"
};


export const projectCommands: readonly CommandDefinition[] = [
  project_createCommand,
  project_deleteCommand,
  project_getCommand,
  project_listCommand,
  project_resource_addCommand,
  project_resource_listCommand,
  project_resource_removeCommand,
  project_resource_updateCommand,
  project_statusCommand,
  project_updateCommand
];
