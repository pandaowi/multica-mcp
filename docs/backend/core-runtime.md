## Core runtime

The implementation is split into a registry, policy-aware MCP surface, and upstream client. The registry owns canonical command IDs and Zod schemas. The server validates and authorizes requests before dispatch. `MulticaClient` is the only upstream boundary and sends a connection ID plus a generated request ID; the upstream token is read from process configuration and never from model input.

The initial adapter set covers workspace listing, agent reads, and agent creation. Additional CLI/API adapters must be added to `src/registry.ts` with a typed schema and risk classification before being exposed. Raw shell execution is intentionally not part of the interface.
