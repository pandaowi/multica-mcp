import test from "node:test";
import assert from "node:assert/strict";
import { MulticaClient, redact } from "../src/client.ts";

test("redacts secret-shaped fields in redact utility", () => {
  assert.deepEqual(redact({ token: "canary", nested: { password: "secret" } }), {
    token: "[REDACTED]",
    nested: { password: "[REDACTED]" },
  });
});

test("client uses connection context and returns request id", async () => {
  const client = new MulticaClient({
    baseUrl: "https://example.test",
    token: "secret",
    fetchImpl: async (_url, init) => {
      assert.equal((init.headers as Record<string, string>)["x-connection-id"], "conn-a");
      return new Response(JSON.stringify({ data: { ok: true } }), {
        status: 200,
        headers: { "content-type": "application/json", "x-request-id": "req-a" },
      });
    },
  });
  const result = await client.execute(
    { method: "POST", path: "/agents" },
    { name: "agent" },
    { principalId: "p", connectionId: "conn-a" }
  );
  assert.equal(result.request_id, "req-a");
});

test("client preserves credential fields verbatim in outbound payload", async () => {
  let capturedBody = "";
  const client = new MulticaClient({
    baseUrl: "https://example.test",
    fetchImpl: async (_url, init) => {
      capturedBody = init.body as string;
      return new Response(JSON.stringify({ data: { status: "ok" } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    },
  });
  await client.execute(
    { method: "POST", path: "/login" },
    { token: "mul_secret_token_123" },
    { principalId: "p", connectionId: "conn-b" }
  );
  assert.equal(JSON.parse(capturedBody).token, "mul_secret_token_123");
});
