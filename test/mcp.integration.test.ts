import assert from "node:assert/strict";
import test from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/server.ts";
import { MulticaClient } from "../src/client.ts";

const context = { principal_id: "principal-a", connection_id: "connection-a", workspace_id: "workspace-a" };
const commandArgs: Record<string, Record<string, unknown>> = {
  "workspace.list": { connection_id: "connection-a" },
  "agent.get": { connection_id: "connection-a", workspace_id: "workspace-a", agent_id: "agent-a" },
  "agent.create": { connection_id: "connection-a", workspace_id: "workspace-a", name: "agent-a", runtime_id: "runtime-a" }
};

async function connectedClient(fetchImpl: typeof fetch) {
  const server = createServer(new MulticaClient({ baseUrl: "https://multica.test", token: "test-token", fetchImpl }));
  const client = new Client({ name: "integration-test", version: "1.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return { client, server };
}

function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });
}

test("MCP discovery exposes every registered command and resource", async () => {
  const { client, server } = await connectedClient(async () => jsonResponse({ data: [] }));
  const tools = await client.listTools();
  assert.deepEqual(tools.tools.map((tool) => tool.name), ["multica_command_search", "multica_command_describe", "multica_command_execute"]);
  const resources = await client.listResources();
  assert.equal(resources.resources.length, 3);
  await client.close();
  await server.close();
});

test("MCP dispatcher validates and routes all registered commands", async () => {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const { client, server } = await connectedClient(async (url, init = {}) => {
    calls.push({ url: String(url), init });
    return jsonResponse({ data: { ok: true } }, 200, { "x-request-id": "upstream-request" });
  });

  for (const [commandId, args] of Object.entries(commandArgs)) {
    const result = await client.callTool({ name: "multica_command_execute", arguments: { command_id: commandId, arguments: args, context } });
    assert.equal(result.isError, undefined, commandId);
    assert.match(String((result.content[0] as { text: string }).text), /"state":"succeeded"/);
  }
  assert.equal(calls.length, 3);
  for (const call of calls) {
    const headers = call.init.headers as Record<string, string>;
    assert.equal(headers["x-principal-id"], "principal-a");
    assert.equal(headers["x-connection-id"], "connection-a");
    assert.equal(headers.authorization, "Bearer test-token");
  }
  assert.match(calls[0].url, /connection_id=connection-a/);
  await client.close();
  await server.close();
});

test("MCP dispatcher blocks invalid, unknown, read-only, and cross-workspace requests", async () => {
  const { client, server } = await connectedClient(async () => jsonResponse({ data: { shouldNotRun: true } }));
  const unknown = await client.callTool({ name: "multica_command_execute", arguments: { command_id: "shell.exec", arguments: {}, context } });
  assert.equal(unknown.isError, true);
  assert.match(String((unknown.content[0] as { text: string }).text), /NOT_FOUND/);

  const invalid = await client.callTool({ name: "multica_command_execute", arguments: { command_id: "agent.create", arguments: { ...commandArgs["agent.create"], name: "" }, context } });
  assert.equal(invalid.isError, true);
  assert.match(String((invalid.content[0] as { text: string }).text), /VALIDATION_ERROR/);

  const readOnly = await client.callTool({ name: "multica_command_execute", arguments: { command_id: "agent.create", arguments: commandArgs["agent.create"], context: { ...context, read_only: true } } });
  assert.equal(readOnly.isError, true);
  assert.match(String((readOnly.content[0] as { text: string }).text), /FORBIDDEN/);

  const crossWorkspace = await client.callTool({ name: "multica_command_execute", arguments: { command_id: "agent.get", arguments: { ...commandArgs["agent.get"], workspace_id: "workspace-b" }, context } });
  assert.equal(crossWorkspace.isError, true);
  assert.match(String((crossWorkspace.content[0] as { text: string }).text), /FORBIDDEN/);

  const missingWorkspace = await client.callTool({ name: "multica_command_execute", arguments: { command_id: "agent.get", arguments: commandArgs["agent.get"], context: { principal_id: "principal-a", connection_id: "connection-a" } } });
  assert.equal(missingWorkspace.isError, true);
  assert.match(String((missingWorkspace.content[0] as { text: string }).text), /WORKSPACE_REQUIRED/);
  await client.close();
  await server.close();
});

test("MCP errors redact upstream bearer/API key material", async () => {
  const { client, server } = await connectedClient(async () => jsonResponse({ code: "UPSTREAM_ERROR", safe_message: "Bearer CANARY_TOKEN MULTICA_API_KEY=CANARY_KEY" }, 502));
  const result = await client.callTool({ name: "multica_command_execute", arguments: { command_id: "workspace.list", arguments: commandArgs["workspace.list"], context } });
  assert.equal(result.isError, true);
  const text = (result.content[0] as { text: string }).text;
  assert.doesNotMatch(text, /CANARY_TOKEN|CANARY_KEY/);
  assert.match(text, /\[REDACTED\]/);
  await client.close();
  await server.close();
});
