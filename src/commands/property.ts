import { z } from "zod";
import type { CommandDefinition } from "../types.js";


const property_archiveSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id_or_name: z.string().min(1).describe("Positional argument: id_or_name"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const property_archiveCommand: CommandDefinition = {
  commandId: "property.archive",
  title: "Archive a property definition (hidden from pickers; values preserved)",
  description: "Archive a property definition (hidden from pickers; values preserved)",
  inputSchema: property_archiveSchema,
  risk: "destructive",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "DELETE",
  path: "/property/archive"
};


const property_createSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  description: z.string().optional().describe("Property description"),
  icon: z.string().optional().describe("Property icon key from the Web picker (for example, flag, tag, or shield)"),
  name: z.string().optional().describe("Property name (required)"),
  option: z.string().optional().describe("Select option as \"Name\" or \"Name:#rrggbb\" (repeatable; select types only)"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
  type: z.string().optional().describe("Property type: text, number, select, multi_select, date, checkbox, url, actor, multi_actor (required)"),
});

export const property_createCommand: CommandDefinition = {
  commandId: "property.create",
  title: "Create a property definition",
  description: "Create a property definition. Types: text, number, select, multi_select,",
  inputSchema: property_createSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/property/create"
};


const property_getSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id_or_name: z.string().min(1).describe("Positional argument: id_or_name"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
});

export const property_getCommand: CommandDefinition = {
  commandId: "property.get",
  title: "Show one property definition",
  description: "Show one property definition",
  inputSchema: property_getSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/property/get"
};


const property_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  include_archived: z.string().optional().describe("archived properties"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const property_listCommand: CommandDefinition = {
  commandId: "property.list",
  title: "List property definitions",
  description: "List property definitions",
  inputSchema: property_listSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/property/list"
};


const property_unarchiveSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id_or_name: z.string().min(1).describe("Positional argument: id_or_name"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const property_unarchiveCommand: CommandDefinition = {
  commandId: "property.unarchive",
  title: "Restore an archived property definition",
  description: "Restore an archived property definition",
  inputSchema: property_unarchiveSchema,
  risk: "destructive",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "DELETE",
  path: "/property/unarchive"
};


const property_updateSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id_or_name: z.string().min(1).describe("Positional argument: id_or_name"),
  description: z.string().optional().describe("New property description"),
  icon: z.string().optional().describe("New property icon key from the Web picker; pass an empty value to clear"),
  name: z.string().optional().describe("New property name"),
  option: z.string().optional().describe("Replacement option list as \"Name\" or \"Name:#rrggbb\" (repeatable)"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const property_updateCommand: CommandDefinition = {
  commandId: "property.update",
  title: "Update a property definition",
  description: "Update a property definition. --option flags REPLACE the full option list;",
  inputSchema: property_updateSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/property/update"
};


export const propertyCommands: readonly CommandDefinition[] = [
  property_archiveCommand,
  property_createCommand,
  property_getCommand,
  property_listCommand,
  property_unarchiveCommand,
  property_updateCommand
];
