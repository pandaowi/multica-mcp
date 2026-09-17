import { z } from "zod";
import type { CommandDefinition } from "../types.js";


const agent_archiveSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
});

export const agent_archiveCommand: CommandDefinition = {
  commandId: "agent.archive",
  title: "Archive an agent",
  description: "Archive an agent",
  inputSchema: agent_archiveSchema,
  risk: "destructive",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "DELETE",
  path: "/agent/archive"
};


const agent_avatarSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  file: z.string().optional().describe("Path to the avatar image file (required)"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
});

export const agent_avatarCommand: CommandDefinition = {
  commandId: "agent.avatar",
  title: "Upload an avatar image for an agent",
  description: "Upload an avatar image for an agent",
  inputSchema: agent_avatarSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/agent/avatar"
};


const agent_copySchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  source_agent_id: z.string().min(1).describe("Positional argument: source_agent_id"),
  custom_args: z.string().optional().describe("Override custom CLI arguments as a JSON array."),
  custom_env: z.string().optional().describe("Set custom_env on the copy as a JSON object (never copied from the source). Prefer --custom-env-stdin/--custom-env-file for secrets. Pass '{}' for an empty map."),
  custom_env_file: z.string().optional().describe("Read --custom-env from a file path (suggested mode: 0600). Mutually exclusive with --custom-env and --custom-env-stdin."),
  custom_env_stdin: z.string().optional().describe("--custom-env from stdin. Mutually exclusive with --custom-env and --custom-env-file."),
  description: z.string().optional().describe("Override the copied description"),
  instructions: z.string().optional().describe("Override the copied instructions"),
  max_concurrent_tasks: z.number().optional().describe("Override maximum concurrent tasks (default 6)"),
  mcp_config: z.string().optional().describe("Set mcp_config on the copy as a JSON object (never copied from the source). Prefer --mcp-config-stdin/--mcp-config-file for secrets."),
  mcp_config_file: z.string().optional().describe("Read --mcp-config from a file path (suggested mode: 0600). Mutually exclusive with --mcp-config and --mcp-config-stdin."),
  mcp_config_stdin: z.string().optional().describe("--mcp-config from stdin. Mutually exclusive with --mcp-config and --mcp-config-file."),
  model: z.string().optional().describe("Model identifier for the copy. Required when --runtime-id selects a different runtime (pass \"\" to accept the target runtime default). Empty otherwise = runtime default."),
  name: z.string().optional().describe("Name for the new agent (default: \"<source name> (copy)\")"),
  no_skills: z.string().optional().describe("not copy the source agent's workspace skill assignments."),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  permission_mode: z.string().optional().describe("Override invocation permission mode: private or public_to. Authoritative over --visibility."),
  public_to_member: z.array(z.string()).optional().describe("public_to: allow the given member user id(s) to invoke the copy. Repeatable."),
  public_to_workspace: z.boolean().optional().describe("public_to: allow every workspace member to invoke the copy."),
  runtime_config: z.string().optional().describe("Set runtime_config on the copy as a JSON string (never copied from the source)."),
  runtime_id: z.string().optional().describe("Target runtime ID (default: the source agent's runtime). A different value forks the agent onto that runtime."),
  service_tier: z.string().optional().describe("Override Codex service tier. Not carried across a runtime change unless set here."),
  thinking_level: z.string().optional().describe("Override thinking level. Not carried across a runtime change unless set here."),
  visibility: z.string().optional().describe("Override visibility: private or workspace (legacy; mapped to --permission-mode)"),
});

export const agent_copyCommand: CommandDefinition = {
  commandId: "agent.copy",
  title: "Copy an existing agent's portable configuration into a brand-new agent",
  description: "Copy an existing agent's portable configuration into a brand-new agent.",
  inputSchema: agent_copySchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/agent/copy"
};


const agent_createSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  custom_args: z.string().optional().describe("Custom CLI arguments as JSON array. For model selection prefer --model; some providers (codex app-server, openclaw) reject --model in custom_args."),
  custom_env: z.string().optional().describe("Custom environment variables as JSON object, e.g. '{\"KEY\":\"value\"}'. Treated as secret material — never logged by the CLI, but values passed on the command line are visible to shell history and 'ps'; prefer --custom-env-stdin or --custom-env-file for real secrets. Pass '{}' to set an empty map."),
  custom_env_file: z.string().optional().describe("Read the --custom-env JSON object from a file path (suggested mode: 0600). Mutually exclusive with --custom-env and --custom-env-stdin."),
  custom_env_stdin: z.string().optional().describe("the --custom-env JSON object from stdin. Keeps secrets out of shell history and 'ps'. Mutually exclusive with --custom-env and --custom-env-file."),
  description: z.string().optional().describe("Agent description"),
  instructions: z.string().optional().describe("Agent instructions"),
  max_concurrent_tasks: z.number().optional().describe("Maximum concurrent runs (1-50) (default 6)"),
  mcp_config: z.string().optional().describe("MCP server configuration as a JSON object, e.g. '{\"mcpServers\":{\"shortcut\":{...}}}'. Treated as secret material (MCP entries often carry API tokens) — never logged by the CLI, but values passed on the command line are visible to shell history and 'ps'; prefer --mcp-config-stdin or --mcp-config-file for real secrets."),
  mcp_config_file: z.string().optional().describe("Read the --mcp-config JSON object from a file path (suggested mode: 0600). Mutually exclusive with --mcp-config and --mcp-config-stdin."),
  mcp_config_stdin: z.string().optional().describe("the --mcp-config JSON object from stdin. Keeps secrets out of shell history and 'ps'. Mutually exclusive with --mcp-config and --mcp-config-file."),
  model: z.string().optional().describe("Model identifier (e.g. claude-sonnet-4-6, openai/gpt-4o). Prefer this over passing --model in --custom-args."),
  name: z.string().optional().describe("Agent name (required)"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  permission_mode: z.string().optional().describe("Invocation permission mode: private (owner only) or public_to (allow-list via --public-to-*). Authoritative over --visibility when set."),
  public_to_member: z.array(z.string()).optional().describe("public_to: allow the given member user id(s) to invoke this agent. Repeatable."),
  public_to_workspace: z.boolean().optional().describe("public_to: allow every workspace member to invoke this agent."),
  runtime_config: z.string().optional().describe("Runtime config as JSON string"),
  runtime_id: z.string().optional().describe("Runtime ID (required)"),
  service_tier: z.string().optional().describe("Codex execution speed: empty = inherit local Codex configuration; default = explicit Standard when supported by the daemon's installed Codex CLI; a catalog tier such as priority = explicit Fast."),
  thinking_level: z.string().optional().describe("Reasoning/effort level for the agent's runtime (e.g. Claude: low|medium|high|xhigh|max; Codex values come from the runtime model catalog). The set is runtime/model-specific; malformed values are rejected server-side and the daemon validates the exact model/level pair. Some runtimes (e.g. hermes) expose no reasoning control and reject every value. Empty = runtime default."),
  visibility: z.string().optional().describe("Visibility: private or workspace (legacy; mapped to --permission-mode. private->private, workspace->public_to+workspace target) (default \"private\")"),
});

export const agent_createCommand: CommandDefinition = {
  commandId: "agent.create",
  title: "Create a new agent",
  description: "Create a new agent",
  inputSchema: agent_createSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/agent/create"
};


const agent_env_getSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  agent_id: z.string().min(1).describe("Positional argument: agent_id"),
  output: z.string().optional().describe("Output format: json or table (default \"json\")"),
});

export const agent_env_getCommand: CommandDefinition = {
  commandId: "agent.env.get",
  title: "Print an agent's custom_env as a JSON map (agent owner or workspace owner/admin; every call is recorded)",
  description: "Print an agent's custom_env as a JSON map (agent owner or workspace owner/admin; every call is recorded)",
  inputSchema: agent_env_getSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/agent/env/get"
};


const agent_env_setSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  agent_id: z.string().min(1).describe("Positional argument: agent_id"),
  custom_env: z.string().optional().describe("Replacement custom_env as a JSON object, e.g. '{\"KEY\":\"value\"}'. Values equal to '****' preserve the existing entry. Treated as secret material — values passed on the command line are visible to shell history and 'ps'; prefer --custom-env-stdin or --custom-env-file for real secrets. Pass '{}' to clear all keys."),
  custom_env_file: z.string().optional().describe("Read the replacement custom_env JSON object from a file path (suggested mode: 0600). Mutually exclusive with --custom-env and --custom-env-stdin."),
  custom_env_stdin: z.string().optional().describe("the replacement custom_env JSON object from stdin. Keeps secrets out of shell history and 'ps'. Mutually exclusive with --custom-env and --custom-env-file."),
  output: z.string().optional().describe("Output format: json or table (default \"json\")"),
});

export const agent_env_setCommand: CommandDefinition = {
  commandId: "agent.env.set",
  title: "Replace an agent's custom_env (agent owner or workspace owner/admin; values equal to **** preserve the existing entry)",
  description: "Replace an agent's custom_env (agent owner or workspace owner/admin; values equal to **** preserve the existing entry)",
  inputSchema: agent_env_setSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/agent/env/set"
};


const agent_getSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
});

export const agent_getCommand: CommandDefinition = {
  commandId: "agent.get",
  title: "Get agent details",
  description: "Get agent details",
  inputSchema: agent_getSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/agent/get"
};


const agent_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  include_archived: z.string().optional().describe("archived agents"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const agent_listCommand: CommandDefinition = {
  commandId: "agent.list",
  title: "List agents in the workspace",
  description: "List agents in the workspace",
  inputSchema: agent_listSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/agent/list"
};


const agent_mcp_addSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  agent_id: z.string().min(1).describe("Positional argument: agent_id"),
  server_id: z.string().min(1).describe("Positional argument: server_id"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const agent_mcp_addCommand: CommandDefinition = {
  commandId: "agent.mcp.add",
  title: "Assigns a workspace MCP server to this agent, enabled",
  description: "Assigns a workspace MCP server to this agent, enabled. Take the server id from 'multica workspace mcp list'. Adding one twice is a no-op.",
  inputSchema: agent_mcp_addSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/agent/mcp/add"
};


const agent_mcp_disableSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  agent_id: z.string().min(1).describe("Positional argument: agent_id"),
  server_id: z.string().min(1).describe("Positional argument: server_id"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const agent_mcp_disableCommand: CommandDefinition = {
  commandId: "agent.mcp.disable",
  title: "Stops the agent from receiving this server without dropping the assignment, so turning it back on later is one command",
  description: "Stops the agent from receiving this server without dropping the assignment, so turning it back on later is one command.",
  inputSchema: agent_mcp_disableSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/agent/mcp/disable"
};


const agent_mcp_enableSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  agent_id: z.string().min(1).describe("Positional argument: agent_id"),
  server_id: z.string().min(1).describe("Positional argument: server_id"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const agent_mcp_enableCommand: CommandDefinition = {
  commandId: "agent.mcp.enable",
  title: "Turn an assigned MCP server back on for this agent",
  description: "Turn an assigned MCP server back on for this agent",
  inputSchema: agent_mcp_enableSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/agent/mcp/enable"
};


const agent_mcp_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  agent_id: z.string().min(1).describe("Positional argument: agent_id"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const agent_mcp_listCommand: CommandDefinition = {
  commandId: "agent.mcp.list",
  title: "List the workspace MCP servers assigned to an agent",
  description: "List the workspace MCP servers assigned to an agent",
  inputSchema: agent_mcp_listSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/agent/mcp/list"
};


const agent_mcp_removeSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  agent_id: z.string().min(1).describe("Positional argument: agent_id"),
  server_id: z.string().min(1).describe("Positional argument: server_id"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const agent_mcp_removeCommand: CommandDefinition = {
  commandId: "agent.mcp.remove",
  title: "Removes the assignment",
  description: "Removes the assignment. The workspace library entry itself is untouched and other agents keep theirs.",
  inputSchema: agent_mcp_removeSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/agent/mcp/remove"
};


const agent_restoreSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
});

export const agent_restoreCommand: CommandDefinition = {
  commandId: "agent.restore",
  title: "Restore an archived agent",
  description: "Restore an archived agent",
  inputSchema: agent_restoreSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/agent/restore"
};


const agent_skills_addSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  agent_id: z.string().min(1).describe("Positional argument: agent_id"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  skill_ids: z.array(z.string()).optional().describe("Skill IDs to add (comma-separated)"),
});

export const agent_skills_addCommand: CommandDefinition = {
  commandId: "agent.skills.add",
  title: "Add skills to an agent without replacing existing assignments",
  description: "Add skills to an agent without replacing existing assignments",
  inputSchema: agent_skills_addSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/agent/skills/add"
};


const agent_skills_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  agent_id: z.string().min(1).describe("Positional argument: agent_id"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const agent_skills_listCommand: CommandDefinition = {
  commandId: "agent.skills.list",
  title: "List skills assigned to an agent",
  description: "List skills assigned to an agent",
  inputSchema: agent_skills_listSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/agent/skills/list"
};


const agent_skills_setSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  agent_id: z.string().min(1).describe("Positional argument: agent_id"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  skill_ids: z.array(z.string()).optional().describe("Skill IDs to assign (comma-separated)"),
});

export const agent_skills_setCommand: CommandDefinition = {
  commandId: "agent.skills.set",
  title: "Set skills for an agent (replaces all current assignments)",
  description: "Set skills for an agent (replaces all current assignments)",
  inputSchema: agent_skills_setSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/agent/skills/set"
};


const agent_tasksSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const agent_tasksCommand: CommandDefinition = {
  commandId: "agent.tasks",
  title: "List runs for an agent",
  description: "List runs for an agent",
  inputSchema: agent_tasksSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/agent/tasks"
};


const agent_updateSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  custom_args: z.string().optional().describe("New custom CLI arguments as JSON array. For model selection prefer --model; some providers (codex app-server, openclaw) reject --model in custom_args."),
  description: z.string().optional().describe("New description"),
  instructions: z.string().optional().describe("New instructions"),
  max_concurrent_tasks: z.number().optional().describe("New max concurrent runs (1-50)"),
  mcp_config: z.string().optional().describe("New MCP server configuration as a JSON object, e.g. '{\"mcpServers\":{...}}'. Pass 'null' to clear. Treated as secret material — never logged by the CLI, but values passed on the command line are visible to shell history and 'ps'; prefer --mcp-config-stdin or --mcp-config-file for real secrets."),
  mcp_config_file: z.string().optional().describe("Read the --mcp-config JSON from a file path (suggested mode: 0600). Mutually exclusive with --mcp-config and --mcp-config-stdin."),
  mcp_config_stdin: z.string().optional().describe("the --mcp-config JSON from stdin. Keeps secrets out of shell history and 'ps'. Mutually exclusive with --mcp-config and --mcp-config-file."),
  model: z.string().optional().describe("New model identifier. Pass an empty string to clear and fall back to the runtime default."),
  name: z.string().optional().describe("New name"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  permission_mode: z.string().optional().describe("New invocation permission mode: private or public_to. Authoritative over --visibility. Owner-only."),
  public_to_member: z.array(z.string()).optional().describe("public_to: allow the given member user id(s) to invoke this agent. Repeatable."),
  public_to_workspace: z.boolean().optional().describe("public_to: allow every workspace member to invoke this agent."),
  runtime_config: z.string().optional().describe("New runtime config as JSON string"),
  runtime_id: z.string().optional().describe("New runtime ID"),
  service_tier: z.string().optional().describe("New Codex execution speed: default = explicit Standard when supported by the daemon's installed Codex CLI; a catalog tier such as priority = explicit Fast. Pass an empty string to clear and inherit local Codex configuration."),
  status: z.string().optional().describe("New status"),
  thinking_level: z.string().optional().describe("New reasoning/effort level for the agent's runtime (e.g. Claude: low|medium|high|xhigh|max; Codex values come from the runtime model catalog). The set is runtime/model-specific; malformed values are rejected server-side and the daemon validates the exact model/level pair. Some runtimes (e.g. hermes) expose no reasoning control and reject every value. Pass an empty string to clear and fall back to the runtime default."),
  visibility: z.string().optional().describe("New visibility: private or workspace (legacy; mapped to --permission-mode)"),
});

export const agent_updateCommand: CommandDefinition = {
  commandId: "agent.update",
  title: "Update an agent",
  description: "Update an agent",
  inputSchema: agent_updateSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/agent/update"
};


export const agentCommands: readonly CommandDefinition[] = [
  agent_archiveCommand,
  agent_avatarCommand,
  agent_copyCommand,
  agent_createCommand,
  agent_env_getCommand,
  agent_env_setCommand,
  agent_getCommand,
  agent_listCommand,
  agent_mcp_addCommand,
  agent_mcp_disableCommand,
  agent_mcp_enableCommand,
  agent_mcp_listCommand,
  agent_mcp_removeCommand,
  agent_restoreCommand,
  agent_skills_addCommand,
  agent_skills_listCommand,
  agent_skills_setCommand,
  agent_tasksCommand,
  agent_updateCommand
];
