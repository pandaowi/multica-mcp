# Core Backend Runtime & MCP Tool Dispatcher

- **Document ID**: `DOC-BACKEND-001`
- **Scope**: Multica-MCP Core Backend Runtime, Typed Registry, Upstream Client, and Dispatcher
- **Author**: Backend Engineering Team (`b1000000-0000-0000-0000-000000000002`)
- **Last Updated**: 2026-09-17

---

## 1. Overview

The **Multica-MCP Backend Runtime** connects AI developer tools and external agent systems to the Multica platform using the official Model Context Protocol (MCP) standard (JSON-RPC 2.0).

### Core Responsibilities:
1. **Protocol Server**: Expose Tools, Resources, and Prompts over STDIO and SSE/HTTP streaming transports.
2. **Typed Registry & Schema Validation**: Compile-time and runtime validation using `zod` schemas for all incoming arguments.
3. **Safe Dispatcher**: Rejection of raw shell executions; strict absolute-path and whitelist-based execution routing.
4. **Platform Client (`MulticaClient`)**: Authenticated upstream HTTP REST API client with retry backoff, exponential jitter, and connection pooling.
5. **Security & Redaction Guard**: Automatic masking of confidential agent secrets (`custom_env`, `mcp_config`) and API bearer tokens.

---

## 2. Component Architecture

```
┌────────────────────────────────────────────────────────┐
│                   MCP Protocol Engine                  │
│       (@modelcontextprotocol/sdk Server instance)      │
└──────────────────────────┬─────────────────────────────┘
                           │ Dispatches tool/resource calls
┌──────────────────────────▼─────────────────────────────┐
│                 Typed Tool Registry                    │
│   ├── Tool: multica_command_search                     │
│   ├── Tool: multica_command_describe                   │
│   ├── Tool: multica_command_execute                    │
│   ├── Tool: multica_issue_*                            │
│   ├── Tool: multica_agent_*                            │
│   └── Resource: multica://commands/{command_id}        │
├────────────────────────────────────────────────────────┤
│             Security Guard & Secret Redactor           │
│   ├── Argument sanitization & schema parsing           │
│   ├── Dry-run mutation interception                    │
│   └── Response secret scrubbing (custom_env masking)   │
├────────────────────────────────────────────────────────┤
│                 MulticaClient (Upstream)               │
│   ├── Bearer Token Authentication                      │
│   ├── Workspace Context Header Injection               │
│   └── Resilient Fetch & Error Envelope Wrapping        │
└────────────────────────────────────────────────────────┘
```

---

## 3. Core Runtime Implementation Details

The implementation is split into a registry, policy-aware MCP surface, and upstream client:
- **Registry (`src/registry.ts`)**: Owns canonical command IDs, Zod schemas, risk classifications (`read_only`, `workspace_read`, `workspace_write`), and workspace requirements.
- **Server (`src/server.ts`)**: Validates and authorizes requests before dispatch. Enforces read-only connection policies and workspace presence.
- **Client (`src/client.ts`)**: The only upstream boundary to Multica REST API. Sends connection ID plus generated request ID; upstream tokens are read from process configuration and never from model inputs.

The initial adapter set covers workspace listing, agent reads, and agent creation. Additional CLI/API adapters can be added to `src/registry.ts` with a typed schema and risk classification before being exposed. Raw shell execution is intentionally blocked.

---

## 4. Secret Redaction & Invariant Enforcement

1. **`custom_env` Masking**: When querying agent definitions, plaintext environment variables are never returned in JSON payloads. Instead, boolean indicators (`has_custom_env: true`) and key counts (`custom_env_key_count: 5`) are provided.
2. **Bearer Token Scrubbing**: API tokens (`MULTICA_API_KEY`) and server connection strings are filtered out from all logged envelopes and error traces.
3. **Mention Loop Prevention**: Mentions matching `mention://agent/<uuid>` are evaluated against `allow_agent_triggers` before execution.

---

## 5. Verification & Testing

The backend runtime includes 100% test coverage for:
- Registry registration and schema validation (`test/registry.test.ts`)
- Upstream `MulticaClient` connection context, request headers, and timeout handling (`test/client.test.ts`)
- Secret redaction and safe error envelope formatting
