import { z } from "zod";
import type { CommandDefinition } from "../types.js";


const chat_historySchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  before: z.string().optional().describe("Opaque cursor (a next_cursor from a prior page) to read older messages"),
  limit: z.number().optional().describe("Maximum number of messages to return (the server clamps the range)"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
}).passthrough();

export const chat_historyCommand: CommandDefinition = {
  commandId: "chat.history",
  title: "Show the overview of the chat channel (e",
  description: "Show the overview of the chat channel (e.g. Slack) this conversation is in: the",
  inputSchema: chat_historySchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/chat/history"
};


const chat_threadSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  before: z.string().optional().describe("Opaque cursor (a next_cursor from a prior page) to read older messages"),
  limit: z.number().optional().describe("Maximum number of messages to return (the server clamps the range)"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
}).passthrough();

export const chat_threadCommand: CommandDefinition = {
  commandId: "chat.thread",
  title: "Read the messages of a single thread",
  description: "Read the messages of a single thread.",
  inputSchema: chat_threadSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/chat/thread"
};


export const chatCommands: readonly CommandDefinition[] = [
  chat_historyCommand,
  chat_threadCommand
];
