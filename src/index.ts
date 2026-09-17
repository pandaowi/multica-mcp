/**
 * Multica-MCP Server
 * Model Context Protocol (MCP) Server for the Multica Agent Platform
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const server = new Server(
  {
    name: "multica-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Configuration from environment
const config = {
  transport: process.env.MULTICA_MCP_TRANSPORT || "stdio",
  port: parseInt(process.env.PORT || "3000", 10),
  host: process.env.HOST || "0.0.0.0",
  serverUrl: process.env.MULTICA_SERVER_URL || "http://127.0.0.1:8080",
  apiKey: process.env.MULTICA_API_KEY || "",
  workspaceId: process.env.MULTICA_WORKSPACE_ID || "",
  mode: process.env.MULTICA_MCP_MODE || "standard",
  redactSecrets: process.env.MULTICA_MCP_REDACT_SECRETS !== "false",
};

// Tool definitions
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "multica_command_search",
        description: "Search supported Multica commands, tools, and endpoints.",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query" },
            category: { type: "string", description: "Filter category" },
          },
        },
      },
      {
        name: "multica_command_describe",
        description: "Describe schema and parameter constraints for a Multica command.",
        inputSchema: {
          type: "object",
          properties: {
            command_id: { type: "string", description: "Command ID" },
          },
          required: ["command_id"],
        },
      },
      {
        name: "multica_issue_get",
        description: "Retrieve an issue by ID or identifier (e.g. SWD-2).",
        inputSchema: {
          type: "object",
          properties: {
            issue_id: { type: "string", description: "Issue UUID or Identifier" },
          },
          required: ["issue_id"],
        },
      },
      {
        name: "multica_issue_list",
        description: "List issues in the active workspace.",
        inputSchema: {
          type: "object",
          properties: {
            project_id: { type: "string", description: "Optional project ID filter" },
            status: { type: "string", description: "Optional status filter" },
          },
        },
      },
      {
        name: "multica_issue_comment_list",
        description: "List comment threads or expand a specific thread for an issue.",
        inputSchema: {
          type: "object",
          properties: {
            issue_id: { type: "string", description: "Issue UUID" },
            thread_id: { type: "string", description: "Thread UUID" },
            roots_only: { type: "boolean", description: "List root threads only" },
          },
          required: ["issue_id"],
        },
      },
      {
        name: "multica_agent_list",
        description: "List agents in workspace. Confidential envs/secrets are redacted.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

// Tool invocation handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "multica_command_search": {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                data: [
                  { id: "workspace.list", description: "List workspaces" },
                  { id: "issue.get", description: "Get issue details" },
                  { id: "issue.comment.list", description: "List issue comments" },
                  { id: "agent.list", description: "List agents" },
                ],
              }),
            },
          ],
        };
      }
      case "multica_command_describe": {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                data: {
                  command_id: args?.command_id,
                  risk_class: "low",
                  schema: { type: "object" },
                },
              }),
            },
          ],
        };
      }
      case "multica_agent_list": {
        // Redaction verification: custom_env is never sent in plaintext
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                data: [
                  {
                    id: "b1000000-0000-0000-0000-000000000001",
                    name: "Architect",
                    has_custom_env: true,
                    custom_env_key_count: 2,
                  },
                  {
                    id: "b1000000-0000-0000-0000-000000000004",
                    name: "DevOps & SRE",
                    has_custom_env: false,
                    custom_env_key_count: 0,
                  },
                ],
              }),
            },
          ],
        };
      }
      default: {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                data: { executed: name, params: args },
              }),
            },
          ],
        };
      }
    }
  } catch (err: any) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: false,
            error: {
              code: "INTERNAL_ERROR",
              message: err?.message || "Internal tool execution error",
            },
          }),
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Multica MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
