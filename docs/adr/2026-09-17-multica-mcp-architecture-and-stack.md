# ADR 001: Multica-MCP Server Architecture, Technology Stack, and Transport Protocols

- **Status**: Accepted
- **Date**: 2026-09-17
- **Authors**: Architect (Lead System Architect)
- **Scope**: Multica-MCP Project Integration
- **Supersedes**: N/A

---

## 1. Context and Problem Statement

Multica is an autonomous agent collaboration and software engineering orchestration platform. As AI developer tooling rapidly converges around the **Model Context Protocol (MCP)** standard (initiated by Anthropic and adopted across industry IDEs such as Claude Desktop, Cursor, Zed, Goose, and custom AI agents), there is a critical need to provide an official, production-grade **Multica-MCP Server**.

The Multica-MCP server must allow external AI clients and agents to seamlessly inspect Multica entities (workspaces, projects, issues, comments, attachments, agents, squads, runtimes) and perform governed actions (create issues, triage bugs, orchestrate squads, query repositories) via standard MCP primitives (Tools, Resources, and Prompts).

### Key Architectural Challenges
1. **Diverse Client Topologies**: External desktop IDEs require low-latency `stdio` transport, whereas containerized squads or remote web agents need streamable network transports (`SSE` / HTTP streaming).
2. **Dual-Backend Connectivity**: The server must support both direct HTTP REST API integration (using Multica API tokens) and local Multica CLI bridging for existing terminal runtimes.
3. **Strict Platform Invariants**: Side-effecting mutations (e.g., mentions triggering paid agent runs, assigning squads, status transitions) must strictly adhere to Multica platform rules (see `AGENTS.md` and `multica-platform` skill).
4. **Docs-as-Code Compatibility**: Architecture, API schemas, and deployment patterns must be maintainable via Docs-as-Code standards.

---

## 2. Decision Drivers

- **Standardization**: 100% compliance with MCP Specification (v1.0+ / JSON-RPC 2.0).
- **Type Safety & Schema Validation**: Robust schema definitions with compile-time and runtime validation.
- **Developer Experience**: Zero-friction setup (e.g. `npx @multica/mcp-server` or standalone binary).
- **Extensibility**: Modular tool & resource registry enabling fast addition of new Multica platform endpoints.
- **Performance & Footprint**: Lightweight process startup and minimal memory footprint (< 50MB RAM).

---

## 3. Considered Options

### Option A: TypeScript / Node.js with Official `@modelcontextprotocol/sdk` and `Zod` (Selected)
- **Pros**:
  - Official, actively maintained MCP SDK with first-class TypeScript bindings.
  - Native `zod` integration generates JSON Schema for tools/prompts automatically.
  - Distribution via npm/npx (`npx -y @multica/mcp-server`) with zero compilation steps for users.
  - Dual transport support (`StdioServerTransport` and `SSEServerTransport` via Express / Fastify / Hono) out-of-the-box.
- **Cons**:
  - Requires Node.js runtime (v18+) if distributed unbundled.

### Option B: Go (Golang) MCP Server
- **Pros**: Single static binary compilation, high concurrency, low memory footprint.
- **Cons**: Community MCP SDK in Go is less mature than TypeScript; manual JSON Schema generation for complex parameters.

### Option C: Python MCP Server (`mcp` Python SDK)
- **Pros**: Standard Python ecosystem compatibility.
- **Cons**: Dependency management complexity (`pip`, `uv`, virtualenvs) for IDE integrations compared to `npx`.

---

## 4. Architectural Decisions

### 4.1. Core Tech Stack
1. **Runtime & Language**: TypeScript (Node.js 20+ LTS / Bun compatible).
2. **Protocol SDK**: `@modelcontextprotocol/sdk` (latest stable).
3. **Validation & Schemas**: `zod` v3.x for runtime input validation and automated tool parameter JSON Schema generation.
4. **HTTP & API Client**: `ky` / `axios` with automated bearer token auth, retry logic, and exponential backoff.
5. **Transports**:
   - **STDIO**: Default transport for desktop IDEs (Cursor, Claude Desktop, VS Code).
   - **SSE (Server-Sent Events) over HTTP**: For remote/dockerized server deployments.
6. **Packaging**: Compiled with the repository's strict TypeScript build to `dist/src/index.js`, published as `@multica/mcp-server`.

### 4.2. Layered Architecture Pattern
The server follows a 4-layer decoupled architecture:
```
┌────────────────────────────────────────────────────────┐
│                   MCP Client Layer                     │
│       (Claude Desktop / Cursor / External LLM)         │
└──────────────────────────┬─────────────────────────────┘
                           │ stdio / SSE (JSON-RPC 2.0)
┌──────────────────────────▼─────────────────────────────┐
│                 MCP Protocol Gateway                   │
│   (Capability Negotiation, Request Dispatch, Router)   │
├────────────────────────────────────────────────────────┤
│                  MCP Surface Layer                     │
│   ├── Tools Registry (Action Executions)               │
│   ├── Resources Registry (URI Template Readers)        │
│   └── Prompts Registry (Context Templates)             │
├────────────────────────────────────────────────────────┤
│              Security & Policy Guard Layer             │
│   ├── Role-based Permissions & Scope Filtering         │
│   ├── Side-effect & Mutation Confirmation Interceptors │
│   └── Secret Redaction (custom_env / mcp_config)       │
├────────────────────────────────────────────────────────┤
│           Multica Platform Connector Layer             │
│   ├── Multica REST API Client (Bearer Token Auth)      │
│   └── Local Multica CLI Process Adapter (Fallback)     │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP REST / Local CLI
┌──────────────────────────▼─────────────────────────────┐
│                 Multica Core Platform                  │
│       (Workspaces, Issues, Squads, Agents, Repos)      │
└────────────────────────────────────────────────────────┘
```

---

## 5. Consequences and Trade-offs

### Positive Consequences
- **Universal Compatibility**: Works seamlessly with any MCP client via stdio or SSE.
- **High Security**: Built-in mutation gates prevent unintended runs or budget exhaustion.
- **Maintainability**: Clear separation between MCP protocol mapping and Multica backend connectors.

### Negative Consequences / Risks & Mitigation
- **Risk**: Node.js environment requirement on client machine.
  - *Mitigation*: Deliver standalone binary builds via GitHub Releases (using `pkg` / `bun build --compile`) alongside the npm package.
- **Risk**: API Rate Limiting or network blips when querying Multica server.
  - *Mitigation*: Implement client-side in-memory caching for immutable resources and resilient retry backoff.
