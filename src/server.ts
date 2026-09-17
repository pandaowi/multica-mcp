import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { describeCommand, getCommand, registry, searchCommands } from "./registry.js";
import { MulticaClient } from "./client.js";
import type { ExecutionContext } from "./types.js";

const contextSchema = z.object({
  principal_id: z.string().min(1),
  connection_id: z.string().min(1),
  workspace_id: z.string().optional(),
  device_id: z.string().optional(),
  read_only: z.boolean().optional(),
});

export function createServer(client: MulticaClient): McpServer {
  const server = new McpServer({ name: "multica-mcp", version: "0.1.0" });

  server.registerTool(
    "multica_command_search",
    {
      description: "Search the verified Multica command registry.",
      inputSchema: { query: z.string().optional() },
    },
    async ({ query }) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(
            searchCommands(query).map((command) => ({
              command_id: command.commandId,
              title: command.title,
              description: command.description,
              risk: command.risk,
            }))
          ),
        },
      ],
    })
  );

  server.registerTool(
    "multica_command_describe",
    {
      description: "Describe a registered command and its validated input schema.",
      inputSchema: { command_id: z.string().min(1) },
    },
    async ({ command_id }) => {
      const result = describeCommand(command_id);
      if (!result) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: JSON.stringify({
                code: "NOT_FOUND",
                safe_message: "Command is not registered",
              }),
            },
          ],
        };
      }
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
  );

  server.registerTool(
    "multica_command_execute",
    {
      description: "Execute a registered Multica command; raw shell commands are not supported.",
      inputSchema: {
        command_id: z.string().min(1),
        arguments: z.record(z.unknown()),
        context: contextSchema,
      },
    },
    async ({ command_id, arguments: args, context }) => {
      const command = getCommand(command_id);
      if (!command) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: JSON.stringify({
                code: "NOT_FOUND",
                safe_message: "Command is not registered",
              }),
            },
          ],
        };
      }

      const parsed = command.inputSchema.safeParse(args);
      if (!parsed.success) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: JSON.stringify({
                code: "VALIDATION_ERROR",
                safe_message: "Arguments failed schema validation",
                field_errors: parsed.error.flatten().fieldErrors,
              }),
            },
          ],
        };
      }

      if (command.requiresWorkspace && !context.workspace_id) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: JSON.stringify({
                code: "WORKSPACE_REQUIRED",
                safe_message: "An explicit workspace is required",
              }),
            },
          ],
        };
      }

      if (command.requiresDevice && !context.device_id) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: JSON.stringify({
                code: "DEVICE_REQUIRED",
                safe_message: "An explicit device context is required",
              }),
            },
          ],
        };
      }

      if (context.read_only && command.risk !== "read_only") {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: JSON.stringify({
                code: "FORBIDDEN",
                safe_message: "Connection policy is read-only",
              }),
            },
          ],
        };
      }

      try {
        const executionContext: ExecutionContext = {
          principalId: context.principal_id,
          connectionId: context.connection_id,
          workspaceId: context.workspace_id,
          deviceId: context.device_id,
          readOnly: context.read_only,
        };
        const result = await client.execute(
          command,
          parsed.data as Record<string, unknown>,
          executionContext
        );
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text:
                error instanceof Error
                  ? error.message
                  : JSON.stringify({
                      code: "UPSTREAM_ERROR",
                      safe_message: "Multica request failed",
                    }),
            },
          ],
        };
      }
    }
  );

  for (const command of registry) {
    server.resource(
      `multica-command-${command.commandId.replaceAll(".", "-")}`,
      `multica://commands/${command.commandId}`,
      { description: command.description, mimeType: "application/json" },
      async (uri) => ({
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(describeCommand(command.commandId)),
          },
        ],
      })
    );
  }

  return server;
}
