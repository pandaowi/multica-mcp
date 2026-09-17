import type { CommandDefinition } from "./types.js";
import { agentCommands } from "./commands/agent.js";
import { autopilotCommands } from "./commands/autopilot.js";
import { chatCommands } from "./commands/chat.js";
import { issueCommands } from "./commands/issue.js";
import { labelCommands } from "./commands/label.js";
import { projectCommands } from "./commands/project.js";
import { propertyCommands } from "./commands/property.js";
import { repoCommands } from "./commands/repo.js";
import { skillCommands } from "./commands/skill.js";
import { squadCommands } from "./commands/squad.js";
import { workspaceCommands } from "./commands/workspace.js";
import { daemonCommands } from "./commands/daemon.js";
import { runtimeCommands } from "./commands/runtime.js";
import { systemCommands } from "./commands/system.js";

export const registry: readonly CommandDefinition[] = [
  ...agentCommands,
  ...autopilotCommands,
  ...chatCommands,
  ...issueCommands,
  ...labelCommands,
  ...projectCommands,
  ...propertyCommands,
  ...repoCommands,
  ...skillCommands,
  ...squadCommands,
  ...workspaceCommands,
  ...daemonCommands,
  ...runtimeCommands,
  ...systemCommands,
];

function normalizeId(id: string): string {
  return id.toLowerCase().replace(/[-_]/g, ".");
}

export function getCommand(commandId: string): CommandDefinition | undefined {
  const target = normalizeId(commandId);
  return registry.find(
    (command) => command.commandId === commandId || normalizeId(command.commandId) === target
  );
}

export function searchCommands(query = ""): CommandDefinition[] {
  const needle = query.trim().toLowerCase();
  return registry.filter(
    (command) =>
      !needle ||
      `${command.commandId} ${command.title} ${command.description}`
        .toLowerCase()
        .includes(needle)
  );
}

export function describeCommand(commandId: string): Record<string, unknown> | undefined {
  const command = getCommand(commandId);
  if (!command) return undefined;
  return {
    command_id: command.commandId,
    title: command.title,
    description: command.description,
    risk: command.risk,
    requires_workspace: command.requiresWorkspace,
    requires_device: command.requiresDevice,
    input_schema: command.inputSchema,
  };
}
