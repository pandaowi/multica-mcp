import { z } from "zod";
import type { CommandDefinition } from "../types.js";


const attachment_downloadSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  attachment_id: z.string().min(1).describe("Positional argument: attachment_id"),
}).passthrough();

export const attachment_downloadCommand: CommandDefinition = {
  commandId: "attachment.download",
  title: "Download an attachment by its ID to a local file",
  description: "Download an attachment by its ID to a local file.",
  inputSchema: attachment_downloadSchema,
  risk: "read_only",
  requiresWorkspace: false,
  requiresDevice: false,
  method: "GET",
  path: "/attachment/download"
};


const attachment_uploadSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  path: z.string().min(1).describe("Positional argument: path"),
  task: z.string().optional().describe("Chat task id to attach to (defaults to MULTICA_TASK_ID)"),
}).passthrough();

export const attachment_uploadCommand: CommandDefinition = {
  commandId: "attachment.upload",
  title: "Upload a local file so it is attached to the reply of the current chat task",
  description: "Upload a local file so it is attached to the reply of the current chat task.",
  inputSchema: attachment_uploadSchema,
  risk: "routine_write",
  requiresWorkspace: false,
  requiresDevice: false,
  method: "POST",
  path: "/attachment/upload"
};


const auth_logoutSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),

}).passthrough();

export const auth_logoutCommand: CommandDefinition = {
  commandId: "auth.logout",
  title: "Remove stored authentication token",
  description: "Remove stored authentication token",
  inputSchema: auth_logoutSchema,
  risk: "destructive",
  requiresWorkspace: false,
  requiresDevice: false,
  method: "POST",
  path: "/auth/logout"
};


const auth_statusSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),

}).passthrough();

export const auth_statusCommand: CommandDefinition = {
  commandId: "auth.status",
  title: "Show current authentication status",
  description: "Show current authentication status",
  inputSchema: auth_statusSchema,
  risk: "routine_write",
  requiresWorkspace: false,
  requiresDevice: false,
  method: "PATCH",
  path: "/auth/status"
};


const config_setSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  key: z.string().min(1).describe("Positional argument: key"),
  value: z.string().min(1).describe("Positional argument: value"),
}).passthrough();

export const config_setCommand: CommandDefinition = {
  commandId: "config.set",
  title: "Supported keys: server_url, app_url, workspace_id, device_name, runtime_name, workspaces_root, max_concurrent_tasks, poll_interval, ws_claim_poll_interval, heartbeat_interval, agent_timeout, codex_semantic_inactivity_timeout, codex_handshake_timeout, disable_auto_update, auto_update_check_interval, disable_auto_reload",
  description: "Supported keys: server_url, app_url, workspace_id, device_name, runtime_name, workspaces_root, max_concurrent_tasks, poll_interval, ws_claim_poll_interval, heartbeat_interval, agent_timeout, codex_semantic_inactivity_timeout, codex_handshake_timeout, disable_auto_update, auto_update_check_interval, disable_auto_reload.",
  inputSchema: config_setSchema,
  risk: "routine_write",
  requiresWorkspace: false,
  requiresDevice: false,
  method: "PATCH",
  path: "/config/set"
};


const config_showSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),

}).passthrough();

export const config_showCommand: CommandDefinition = {
  commandId: "config.show",
  title: "Show current CLI configuration",
  description: "Show current CLI configuration",
  inputSchema: config_showSchema,
  risk: "read_only",
  requiresWorkspace: false,
  requiresDevice: false,
  method: "GET",
  path: "/config/show"
};


const loginSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  callback_host: z.string().optional().describe("Host/IP the OAuth callback URL points at when the browser can reach this CLI directly. For SSH-only machines, use the printed tunnel hint instead."),
  token: z.boolean().optional().describe("string[=\"prompt\"]   Authenticate using a personal access token (mul_... user PAT or mcn_... Cloud Node PAT). Pass --token mul_... / --token mcn_... to supply it inline, or --token alone to be prompted interactively."),
}).passthrough();

export const loginCommand: CommandDefinition = {
  commandId: "login",
  title: "Log in to Multica, then automatically discover and watch all your workspaces",
  description: "Log in to Multica, then automatically discover and watch all your workspaces.",
  inputSchema: loginSchema,
  risk: "credential",
  requiresWorkspace: false,
  requiresDevice: false,
  method: "POST",
  path: "/login"
};


const setup_cloudSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  callback_host: z.string().optional().describe("Host/IP the OAuth callback URL points at when the browser can reach this CLI directly. For SSH-only machines, use the printed tunnel hint instead."),
}).passthrough();

export const setup_cloudCommand: CommandDefinition = {
  commandId: "setup.cloud",
  title: "Explicitly configures the CLI to connect to Multica Cloud (multica",
  description: "Explicitly configures the CLI to connect to Multica Cloud (multica.ai).",
  inputSchema: setup_cloudSchema,
  risk: "routine_write",
  requiresWorkspace: false,
  requiresDevice: false,
  method: "PATCH",
  path: "/setup/cloud"
};


const setup_self_hostSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  app_url: z.string().optional().describe("Frontend app URL (e.g. https://app.internal.co) (env: MULTICA_APP_URL)"),
  callback_host: z.string().optional().describe("Host/IP the OAuth callback URL points at when the browser can reach this CLI directly. For SSH-only machines, use the printed tunnel hint instead."),
  frontend_port: z.number().optional().describe("Frontend port (used when --app-url is not set) (default 3000)"),
  port: z.number().optional().describe("Backend server port (used when --server-url is not set) (default 8080)"),
  server_url: z.string().optional().describe("Backend server URL (e.g. https://api.internal.co) (env: MULTICA_SERVER_URL)"),
}).passthrough();

export const setup_self_hostCommand: CommandDefinition = {
  commandId: "setup.self-host",
  title: "Configures the CLI to connect to a self-hosted Multica server",
  description: "Configures the CLI to connect to a self-hosted Multica server.",
  inputSchema: setup_self_hostSchema,
  risk: "routine_write",
  requiresWorkspace: false,
  requiresDevice: false,
  method: "PATCH",
  path: "/setup/self-host"
};


const updateSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  download_timeout: z.string().optional().describe("Maximum time to wait for the release archive download (default 2m0s)"),
}).passthrough();

export const updateCommand: CommandDefinition = {
  commandId: "update",
  title: "Update multica to the latest version",
  description: "Update multica to the latest version",
  inputSchema: updateSchema,
  risk: "routine_write",
  requiresWorkspace: false,
  requiresDevice: false,
  method: "PATCH",
  path: "/update"
};


const user_profile_getSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
}).passthrough();

export const user_profile_getCommand: CommandDefinition = {
  commandId: "user.profile.get",
  title: "Show your current user profile",
  description: "Show your current user profile",
  inputSchema: user_profile_getSchema,
  risk: "read_only",
  requiresWorkspace: false,
  requiresDevice: false,
  method: "GET",
  path: "/user/profile/get"
};


const user_profile_updateSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  allow_external_file: z.string().optional().describe("--description-file to read a path outside the current working directory. Off by default so a stale temp file from another run/environment can't be picked up (MUL-4252)."),
  clear: z.string().optional().describe("the profile description (equivalent to --description \"\")"),
  description: z.string().optional().describe("New profile description (decodes \n, \r, \t, \\; pipe via --description-stdin to preserve literal backslashes)"),
  description_file: z.string().optional().describe("Read description from a UTF-8 file (preserves multi-line content verbatim; use this on Windows when stdin piping mangles non-ASCII bytes). The path must be inside the current working directory unless --allow-external-file is set."),
  description_stdin: z.string().optional().describe("description from stdin (preserves multi-line content verbatim)"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
}).passthrough();

export const user_profile_updateCommand: CommandDefinition = {
  commandId: "user.profile.update",
  title: "Set the personal profile description that gets injected into agent briefs as `## Requesting User`",
  description: "Set the personal profile description that gets injected into agent briefs as `## Requesting User`. Pass an empty value to clear it.",
  inputSchema: user_profile_updateSchema,
  risk: "routine_write",
  requiresWorkspace: false,
  requiresDevice: false,
  method: "PATCH",
  path: "/user/profile/update"
};


const versionSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  output: z.string().optional().describe("Output format: text or json (default \"text\")"),
}).passthrough();

export const versionCommand: CommandDefinition = {
  commandId: "version",
  title: "Print version information",
  description: "Print version information",
  inputSchema: versionSchema,
  risk: "read_only",
  requiresWorkspace: false,
  requiresDevice: false,
  method: "GET",
  path: "/version"
};


export const systemCommands: readonly CommandDefinition[] = [
  attachment_downloadCommand,
  attachment_uploadCommand,
  auth_logoutCommand,
  auth_statusCommand,
  config_setCommand,
  config_showCommand,
  loginCommand,
  setup_cloudCommand,
  setup_self_hostCommand,
  updateCommand,
  user_profile_getCommand,
  user_profile_updateCommand,
  versionCommand
];
