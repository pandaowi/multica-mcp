import { z } from "zod";
import type { CommandDefinition } from "../types.js";


const skill_createSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  config: z.string().optional().describe("Skill config as JSON string"),
  content: z.string().optional().describe("Skill content (SKILL.md body)"),
  content_file: z.string().optional().describe("Read skill content from a UTF-8 file. Mutually exclusive with --content and --content-stdin."),
  content_stdin: z.string().optional().describe("skill content from stdin. Mutually exclusive with --content and --content-file."),
  description: z.string().optional().describe("Skill description"),
  name: z.string().optional().describe("Skill name (required)"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
}).passthrough();

export const skill_createCommand: CommandDefinition = {
  commandId: "skill.create",
  title: "Create a new skill",
  description: "Create a new skill",
  inputSchema: skill_createSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/skill/create"
};


const skill_deleteSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  yes: z.string().optional().describe("confirmation prompt"),
}).passthrough();

export const skill_deleteCommand: CommandDefinition = {
  commandId: "skill.delete",
  title: "Delete a skill",
  description: "Delete a skill",
  inputSchema: skill_deleteSchema,
  risk: "destructive",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "DELETE",
  path: "/skill/delete"
};


const skill_files_deleteSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  skill_id: z.string().min(1).describe("Positional argument: skill_id"),
  file_id: z.string().min(1).describe("Positional argument: file_id"),
}).passthrough();

export const skill_files_deleteCommand: CommandDefinition = {
  commandId: "skill.files.delete",
  title: "Delete a skill file",
  description: "Delete a skill file",
  inputSchema: skill_files_deleteSchema,
  risk: "destructive",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "DELETE",
  path: "/skill/files/delete"
};


const skill_files_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  skill_id: z.string().min(1).describe("Positional argument: skill_id"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
  with_content: z.string().optional().describe("each file's body. Off by default: use it to read a file, not to list them."),
}).passthrough();

export const skill_files_listCommand: CommandDefinition = {
  commandId: "skill.files.list",
  title: "List files for a skill",
  description: "List files for a skill",
  inputSchema: skill_files_listSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/skill/files/list"
};


const skill_files_upsertSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  skill_id: z.string().min(1).describe("Positional argument: skill_id"),
  content: z.string().optional().describe("File content (required)"),
  content_file: z.string().optional().describe("Read file content from a UTF-8 file. Mutually exclusive with --content and --content-stdin."),
  content_stdin: z.string().optional().describe("file content from stdin. Mutually exclusive with --content and --content-file."),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  path: z.string().optional().describe("File path within the skill (required)"),
}).passthrough();

export const skill_files_upsertCommand: CommandDefinition = {
  commandId: "skill.files.upsert",
  title: "Create or update a skill file",
  description: "Create or update a skill file",
  inputSchema: skill_files_upsertSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/skill/files/upsert"
};


const skill_getSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  with_content: z.string().optional().describe("the SKILL.md body and every file body. Off by default: the response grows with the skill and large skills cannot be fetched this way over slow links."),
}).passthrough();

export const skill_getCommand: CommandDefinition = {
  commandId: "skill.get",
  title: "Get skill details and its file list (use --with-content for the bodies)",
  description: "Get skill details and its file list (use --with-content for the bodies)",
  inputSchema: skill_getSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/skill/get"
};


const skill_importSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  file: z.string().optional().describe("Path to a local skill archive (.skill or .zip) to import. Mutually exclusive with --url."),
  on_conflict: z.string().optional().describe("Conflict strategy when a skill with the same name exists: fail, overwrite, rename, or skip (default \"fail\")"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  url: z.string().optional().describe("URL to import from (clawhub.ai, skills.sh, or github.com). Mutually exclusive with --file."),
}).passthrough();

export const skill_importCommand: CommandDefinition = {
  commandId: "skill.import",
  title: "Import a skill from a URL (clawhub",
  description: "Import a skill from a URL (clawhub.ai, skills.sh, github.com) or a local .skill/.zip archive",
  inputSchema: skill_importSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/skill/import"
};


const skill_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
}).passthrough();

export const skill_listCommand: CommandDefinition = {
  commandId: "skill.list",
  title: "List skills in the workspace",
  description: "List skills in the workspace",
  inputSchema: skill_listSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/skill/list"
};


const skill_refreshSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
}).passthrough();

export const skill_refreshCommand: CommandDefinition = {
  commandId: "skill.refresh",
  title: "Re-download a skill from its imported source, preserving its id and agent assignments",
  description: "Re-download a skill from its imported source, preserving its id and agent assignments",
  inputSchema: skill_refreshSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/skill/refresh"
};


const skill_searchSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  query: z.string().min(1).describe("Positional argument: query"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
}).passthrough();

export const skill_searchCommand: CommandDefinition = {
  commandId: "skill.search",
  title: "Search for installable skills",
  description: "Search for installable skills",
  inputSchema: skill_searchSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/skill/search"
};


const skill_updateSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  config: z.string().optional().describe("New config as JSON string"),
  content: z.string().optional().describe("New content"),
  content_file: z.string().optional().describe("Read new content from a UTF-8 file. Mutually exclusive with --content and --content-stdin."),
  content_stdin: z.string().optional().describe("new content from stdin. Mutually exclusive with --content and --content-file."),
  description: z.string().optional().describe("New description"),
  name: z.string().optional().describe("New name"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
}).passthrough();

export const skill_updateCommand: CommandDefinition = {
  commandId: "skill.update",
  title: "Update a skill",
  description: "Update a skill",
  inputSchema: skill_updateSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/skill/update"
};


export const skillCommands: readonly CommandDefinition[] = [
  skill_createCommand,
  skill_deleteCommand,
  skill_files_deleteCommand,
  skill_files_listCommand,
  skill_files_upsertCommand,
  skill_getCommand,
  skill_importCommand,
  skill_listCommand,
  skill_refreshCommand,
  skill_searchCommand,
  skill_updateCommand
];
