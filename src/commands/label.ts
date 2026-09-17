import { z } from "zod";
import type { CommandDefinition } from "../types.js";


const label_createSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  color: z.string().optional().describe("Hex color like #3b82f6 (required)"),
  name: z.string().optional().describe("Label name (required)"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
}).passthrough();

export const label_createCommand: CommandDefinition = {
  commandId: "label.create",
  title: "Create a new label",
  description: "Create a new label",
  inputSchema: label_createSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/label/create"
};


const label_deleteSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
}).passthrough();

export const label_deleteCommand: CommandDefinition = {
  commandId: "label.delete",
  title: "Delete a label",
  description: "Delete a label",
  inputSchema: label_deleteSchema,
  risk: "destructive",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "DELETE",
  path: "/label/delete"
};


const label_getSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
}).passthrough();

export const label_getCommand: CommandDefinition = {
  commandId: "label.get",
  title: "Get label details",
  description: "Get label details",
  inputSchema: label_getSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/label/get"
};


const label_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  full_id: z.string().optional().describe("full UUIDs in table output"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
}).passthrough();

export const label_listCommand: CommandDefinition = {
  commandId: "label.list",
  title: "List labels in the workspace",
  description: "List labels in the workspace",
  inputSchema: label_listSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/label/list"
};


const label_updateSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  color: z.string().optional().describe("New hex color"),
  name: z.string().optional().describe("New name"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
}).passthrough();

export const label_updateCommand: CommandDefinition = {
  commandId: "label.update",
  title: "Update a label",
  description: "Update a label",
  inputSchema: label_updateSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/label/update"
};


export const labelCommands: readonly CommandDefinition[] = [
  label_createCommand,
  label_deleteCommand,
  label_getCommand,
  label_listCommand,
  label_updateCommand
];
