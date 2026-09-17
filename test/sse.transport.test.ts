import assert from "node:assert/strict";
import test from "node:test";
import type { AddressInfo } from "node:net";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { createServer } from "../src/server.ts";
import { MulticaClient } from "../src/client.ts";
import { startSseServer } from "../src/transports/sse.ts";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

test("HTTP/SSE transport server health endpoint and MCP communication", async () => {
  const mockClient = new MulticaClient({
    baseUrl: "https://multica.test",
    token: "test-token",
    fetchImpl: async () => jsonResponse({ data: [] }),
  });

  const httpServer = startSseServer(() => createServer(mockClient), {
    port: 0,
    host: "127.0.0.1",
  });

  await new Promise<void>((resolve) => {
    if (httpServer.listening) resolve();
    else httpServer.on("listening", resolve);
  });

  const address = httpServer.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  // 1. Health check endpoint test
  const healthRes = await fetch(`${baseUrl}/health`);
  assert.equal(healthRes.status, 200);
  const healthData = await healthRes.json() as { status: string; transport: string };
  assert.equal(healthData.status, "ok");
  assert.equal(healthData.transport, "sse");

  // 2. SSE Client connection and MCP tools listing
  const clientTransport = new SSEClientTransport(new URL(`${baseUrl}/sse`));
  const mcpClient = new Client({ name: "sse-integration-test", version: "1.0.0" });
  await mcpClient.connect(clientTransport);

  const tools = await mcpClient.listTools();
  assert.ok(tools.tools.length >= 3);
  assert.ok(tools.tools.some((t) => t.name === "multica_command_search"));
  assert.ok(tools.tools.some((t) => t.name === "multica_command_describe"));
  assert.ok(tools.tools.some((t) => t.name === "multica_command_execute"));

  // 3. Tool execution over SSE
  const searchResult = await mcpClient.callTool({
    name: "multica_command_search",
    arguments: { query: "workspace" },
  });
  assert.equal(searchResult.isError, undefined);
  assert.ok(Array.isArray(JSON.parse((searchResult.content[0] as { text: string }).text)));

  await mcpClient.close();
  await new Promise<void>((resolve, reject) => {
    httpServer.close((err) => (err ? reject(err) : resolve()));
  });
});
