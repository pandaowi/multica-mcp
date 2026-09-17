# MCP–Multica CLI Integration Test Report

- **Date**: 2026-09-17
- **Scope**: MCP discovery, command dispatch, validation/policy guards, upstream request context, and error sanitization.
- **Test method**: MCP SDK `Client` with linked in-memory transports and a deterministic fake Multica upstream; no live credentials or production side effects.

## Execution

| Check | Result |
|---|---|
| `npm ci` | PASS |
| `npm run build` | PASS |
| Existing unit tests | PASS (4/4) |
| MCP discovery tools/resources | PASS |
| Dispatch of every registered command (`workspace.list`, `agent.get`, `agent.create`) | PASS (3/3) |
| Unknown command rejection | PASS |
| Schema validation rejection | PASS |
| Read-only write rejection | PASS |
| Missing workspace rejection | PASS |
| Cross-workspace argument/context mismatch rejection | PASS |
| Principal and connection headers forwarded upstream | PASS |
| Upstream bearer/API-key redaction in MCP errors | PASS |
| Full automated suite | PASS (8/8) |

## Findings and fixes

1. The upstream request carried `connection_id` but not `principal_id`. The client now sends both `x-connection-id` and `x-principal-id`, preserving identity context for authorization and audit.
2. Workspace-dependent commands accepted an argument workspace different from the execution context. The dispatcher now returns `FORBIDDEN` before upstream execution when they differ.
3. Upstream `safe_message` values could expose bearer/API-key material. Error messages now redact those patterns before returning the MCP error envelope.
4. The TypeScript build emits `dist/src/index.js`, while Docker and README referenced `dist/index.js`. The Docker entrypoint and client setup documentation now use the actual compiled path.

## Coverage limits

The repository registry currently contains three commands; the broader OpenSpec CLI parity matrix remains explicitly planned and is not claimed as implemented. Live staging execution was not performed because no Multica credential or staging endpoint was provisioned for this run.
