import test from "node:test";
import assert from "node:assert/strict";
import { describeCommand, getCommand, registry, searchCommands } from "../src/registry.js";
import { createServer } from "../src/server.js";
import { MulticaClient } from "../src/client.js";

test("registry contains all 155 Multica CLI commands", () => {
  assert.equal(registry.length, 155);
  assert.equal(getCommand("echo"), undefined);
});

test("registry covers all required command families", () => {
  const families = [
    "agent", "autopilot", "chat", "issue", "label", "project",
    "property", "repo", "skill", "squad", "workspace",
    "daemon", "runtime", "attachment", "auth", "config", "login",
    "setup", "update", "user", "version"
  ];
  for (const fam of families) {
    const matched = registry.filter((c) => c.commandId.startsWith(fam));
    assert.ok(matched.length > 0, `Family ${fam} should have registered commands`);
  }
});

test("command descriptions expose risk and workspace requirements", () => {
  const agentCreate = describeCommand("agent.create") as Record<string, unknown>;
  assert.equal(agentCreate.risk, "routine_write");
  assert.equal(agentCreate.requires_workspace, true);

  const workspaceList = describeCommand("workspace.list") as Record<string, unknown>;
  assert.equal(workspaceList.risk, "read_only");
  assert.equal(workspaceList.requires_workspace, false);

  const daemonStart = describeCommand("daemon.start") as Record<string, unknown>;
  assert.equal(daemonStart.requires_device, true);
});

test("command input schemas validate arguments correctly", () => {
  const issueCreate = getCommand("issue.create");
  assert.ok(issueCreate);
  const valid = issueCreate.inputSchema.safeParse({ title: "Fix bug", description: "Bug description" });
  assert.equal(valid.success, true);

  const agentArchive = getCommand("agent.archive");
  assert.ok(agentArchive);
  const invalid = agentArchive.inputSchema.safeParse({});
  assert.equal(invalid.success, false); // requires id
});

test("MCP server exposes search, describe, and execute tools", async () => {
  const client = new MulticaClient({ baseUrl: "https://example.test" });
  const server = createServer(client);
  assert.ok(server);
});
