import { z } from "zod";
import type { CommandDefinition } from "../types.js";


const daemon_disk_usageSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  all_profiles: z.string().optional().describe("every workspace root (default root + all ~/.multica/profiles/* roots, incl. the Desktop app's) and report a combined total"),
  by_task: z.boolean().optional().describe("Per-run view (default; mutually exclusive with --by-workspace)"),
  by_workspace: z.string().optional().describe("output by workspace instead of by run"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
  top: z.number().optional().describe("Keep only the largest N entries (per root in --all-profiles mode)"),
  workspaces_root: z.string().optional().describe("Override the workspaces root path (default: same as the daemon)"),
}).passthrough();

export const daemon_disk_usageCommand: CommandDefinition = {
  commandId: "daemon.disk-usage",
  title: "Walks the daemon's workspaces root and reports per-run or per-workspace disk usage",
  description: "Walks the daemon's workspaces root and reports per-run or per-workspace disk usage.",
  inputSchema: daemon_disk_usageSchema,
  risk: "device_admin",
  requiresWorkspace: false,
  requiresDevice: true,
  method: "POST",
  path: "/daemon/disk-usage"
};


const daemon_logsSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),

}).passthrough();

export const daemon_logsCommand: CommandDefinition = {
  commandId: "daemon.logs",
  title: "Show daemon logs",
  description: "Show daemon logs",
  inputSchema: daemon_logsSchema,
  risk: "device_admin",
  requiresWorkspace: false,
  requiresDevice: true,
  method: "POST",
  path: "/daemon/logs"
};


const daemon_restartSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  agent_timeout: z.string().optional().describe("Absolute per-run wall-clock cap; 0 = no cap, rely on the watchdogs (env: MULTICA_AGENT_TIMEOUT)"),
  auto_update_interval: z.string().optional().describe("How often to poll GitHub for a newer release (env: MULTICA_DAEMON_AUTO_UPDATE_INTERVAL)"),
  codex_handshake_timeout: z.string().optional().describe("Codex app-server startup RPC timeout (env: MULTICA_CODEX_HANDSHAKE_TIMEOUT)"),
  codex_semantic_inactivity_timeout: z.string().optional().describe("Codex semantic inactivity timeout (env: MULTICA_CODEX_SEMANTIC_INACTIVITY_TIMEOUT)"),
  daemon_id: z.string().optional().describe("Unique daemon identifier (env: MULTICA_DAEMON_ID)"),
  device_name: z.string().optional().describe("Human-readable device name (env: MULTICA_DAEMON_DEVICE_NAME)"),
  foreground: z.string().optional().describe("in the foreground instead of background"),
  heartbeat_interval: z.string().optional().describe("Heartbeat interval (env: MULTICA_DAEMON_HEARTBEAT_INTERVAL)"),
  max_concurrent_tasks: z.number().optional().describe("Maximum concurrent runs (env: MULTICA_DAEMON_MAX_CONCURRENT_TASKS)"),
  no_auto_reload: z.string().optional().describe("restarting when the multica binary on disk changes version (env: MULTICA_DAEMON_AUTO_RELOAD=false)"),
  no_auto_update: z.string().optional().describe("periodic CLI self-update (env: MULTICA_DAEMON_AUTO_UPDATE=false)"),
  poll_interval: z.string().optional().describe("Run poll interval (env: MULTICA_DAEMON_POLL_INTERVAL)"),
  runtime_name: z.string().optional().describe("Runtime display name (env: MULTICA_AGENT_RUNTIME_NAME)"),
  workspaces_root: z.string().optional().describe("Base directory for run workspaces (env: MULTICA_WORKSPACES_ROOT)"),
  ws_claim_poll_interval: z.string().optional().describe("Healthy WebSocket claim safety-poll upper bound (env: MULTICA_DAEMON_WS_CLAIM_POLL_INTERVAL)"),
}).passthrough();

export const daemon_restartCommand: CommandDefinition = {
  commandId: "daemon.restart",
  title: "Restart the running daemon (stop + start)",
  description: "Restart the running daemon (stop + start)",
  inputSchema: daemon_restartSchema,
  risk: "destructive",
  requiresWorkspace: false,
  requiresDevice: true,
  method: "POST",
  path: "/daemon/restart"
};


const daemon_startSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  agent_timeout: z.string().optional().describe("Absolute per-run wall-clock cap; 0 = no cap, rely on the watchdogs (env: MULTICA_AGENT_TIMEOUT)"),
  auto_update_interval: z.string().optional().describe("How often to poll GitHub for a newer release (env: MULTICA_DAEMON_AUTO_UPDATE_INTERVAL)"),
  codex_handshake_timeout: z.string().optional().describe("Codex app-server startup RPC timeout (env: MULTICA_CODEX_HANDSHAKE_TIMEOUT)"),
  codex_semantic_inactivity_timeout: z.string().optional().describe("Codex semantic inactivity timeout (env: MULTICA_CODEX_SEMANTIC_INACTIVITY_TIMEOUT)"),
  daemon_id: z.string().optional().describe("Unique daemon identifier (env: MULTICA_DAEMON_ID)"),
  device_name: z.string().optional().describe("Human-readable device name (env: MULTICA_DAEMON_DEVICE_NAME)"),
  foreground: z.string().optional().describe("in the foreground instead of background"),
  heartbeat_interval: z.string().optional().describe("Heartbeat interval (env: MULTICA_DAEMON_HEARTBEAT_INTERVAL)"),
  max_concurrent_tasks: z.number().optional().describe("Maximum concurrent runs (env: MULTICA_DAEMON_MAX_CONCURRENT_TASKS)"),
  no_auto_reload: z.string().optional().describe("restarting when the multica binary on disk changes version (env: MULTICA_DAEMON_AUTO_RELOAD=false)"),
  no_auto_update: z.string().optional().describe("periodic CLI self-update (env: MULTICA_DAEMON_AUTO_UPDATE=false)"),
  poll_interval: z.string().optional().describe("Run poll interval (env: MULTICA_DAEMON_POLL_INTERVAL)"),
  runtime_name: z.string().optional().describe("Runtime display name (env: MULTICA_AGENT_RUNTIME_NAME)"),
  workspaces_root: z.string().optional().describe("Base directory for run workspaces (env: MULTICA_WORKSPACES_ROOT)"),
  ws_claim_poll_interval: z.string().optional().describe("Healthy WebSocket claim safety-poll upper bound (env: MULTICA_DAEMON_WS_CLAIM_POLL_INTERVAL)"),
}).passthrough();

export const daemon_startCommand: CommandDefinition = {
  commandId: "daemon.start",
  title: "Start the daemon process that polls for runs and executes them using local agent CLIs (Claude, Codex)",
  description: "Start the daemon process that polls for runs and executes them using local agent CLIs (Claude, Codex).",
  inputSchema: daemon_startSchema,
  risk: "device_admin",
  requiresWorkspace: false,
  requiresDevice: true,
  method: "POST",
  path: "/daemon/start"
};


const daemon_statusSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
}).passthrough();

export const daemon_statusCommand: CommandDefinition = {
  commandId: "daemon.status",
  title: "Show daemon status",
  description: "Show daemon status",
  inputSchema: daemon_statusSchema,
  risk: "routine_write",
  requiresWorkspace: false,
  requiresDevice: true,
  method: "PATCH",
  path: "/daemon/status"
};


const daemon_stopSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),

}).passthrough();

export const daemon_stopCommand: CommandDefinition = {
  commandId: "daemon.stop",
  title: "Stop the running daemon",
  description: "Stop the running daemon",
  inputSchema: daemon_stopSchema,
  risk: "destructive",
  requiresWorkspace: false,
  requiresDevice: true,
  method: "POST",
  path: "/daemon/stop"
};


export const daemonCommands: readonly CommandDefinition[] = [
  daemon_disk_usageCommand,
  daemon_logsCommand,
  daemon_restartCommand,
  daemon_startCommand,
  daemon_statusCommand,
  daemon_stopCommand
];
