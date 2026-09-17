import test from "node:test";
import assert from "node:assert/strict";
import { describeCommand, getCommand, searchCommands } from "../src/registry.ts";

test("registry only exposes known commands", () => { assert.equal(getCommand("echo"), undefined); assert.equal(searchCommands("agent").length, 2); });
test("command descriptions expose risk and workspace requirements", () => { const result = describeCommand("agent.create") as Record<string, unknown>; assert.equal(result.risk, "routine_write"); assert.equal(result.requires_workspace, true); });
