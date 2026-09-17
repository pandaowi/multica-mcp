import { z } from "zod";
import type { CommandDefinition } from "./types.js";

const agentCreate = z.object({
  connection_id: z.string().min(1), workspace_id: z.string().min(1), name: z.string().min(1).max(120),
  runtime_id: z.string().min(1), instructions: z.string().max(100_000).optional(), idempotency_key: z.string().uuid().optional()
}).strict();

const workspaceList = z.object({ connection_id: z.string().min(1), cursor: z.string().optional(), limit: z.number().int().min(1).max(100).default(50) }).strict();

const agentGet = z.object({ connection_id: z.string().min(1), workspace_id: z.string().min(1), agent_id: z.string().min(1) }).strict();

export const registry: readonly CommandDefinition[] = [
  { commandId: "workspace.list", title: "List workspaces", description: "List workspaces authorized for the connection.", inputSchema: workspaceList, risk: "read_only", requiresWorkspace: false, requiresDevice: false, method: "GET", path: "/workspaces" },
  { commandId: "agent.get", title: "Get agent", description: "Read an agent in an explicit workspace.", inputSchema: agentGet, risk: "read_only", requiresWorkspace: true, requiresDevice: false, method: "GET", path: "/agents" },
  { commandId: "agent.create", title: "Create agent", description: "Create an agent in an explicit workspace.", inputSchema: agentCreate, risk: "routine_write", requiresWorkspace: true, requiresDevice: false, method: "POST", path: "/agents" }
];

export function getCommand(commandId: string): CommandDefinition | undefined { return registry.find((command) => command.commandId === commandId); }

export function searchCommands(query = ""): CommandDefinition[] {
  const needle = query.trim().toLowerCase();
  return registry.filter((command) => !needle || `${command.commandId} ${command.title} ${command.description}`.toLowerCase().includes(needle));
}

export function describeCommand(commandId: string): Record<string, unknown> | undefined {
  const command = getCommand(commandId);
  if (!command) return undefined;
  return { command_id: command.commandId, title: command.title, description: command.description, risk: command.risk, requires_workspace: command.requiresWorkspace, requires_device: command.requiresDevice, input_schema: command.inputSchema }; 
}
