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

## 3. Core Registry & Tool Handlers

### 3.1. Command Search & Discovery (`multica_command_search`)
Enables dynamic discovery of supported Multica commands and tools with category and permission scope filters.

### 3.2. Command Description & Schema Introspection (`multica_command_describe`)
Returns the complete JSON Schema definition, parameter constraints, risk tier, and example payloads for any registered command.

### 3.3. Typed Execution Dispatcher (`multica_command_execute`)
Executes target commands against upstream Multica REST endpoints with full parameter validation and audit metadata attachment.

---

## 4. Secret Redaction & Invariant Enforcement

1. **`custom_env` Masking**: When querying agent definitions, plaintext environment variables are never returned in JSON payloads. Instead, boolean indicators (`has_custom_env: true`) and key counts (`custom_env_key_count: 5`) are provided.
2. **Bearer Token Scrubbing**: API tokens (`MULTICA_API_KEY`) and server connection strings are filtered out from all logged envelopes and error traces.
3. **Mention Loop Prevention**: Mentions matching `mention://agent/<uuid>` are evaluated against `allow_agent_triggers` before execution.

---

## 5. Verification & Testing

The backend runtime includes 100% test coverage for:
- Registry registration and schema validation
- Upstream `MulticaClient` connection context and timeout handling
- Secret redaction and error envelope formatting
