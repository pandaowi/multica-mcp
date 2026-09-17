# ADR 002: Security, Secret Redaction, and Mutation Governance in Multica-MCP

- **Status**: Accepted
- **Date**: 2026-09-17
- **Authors**: Architect (Lead System Architect)
- **Scope**: Security, Permission Scopes, Secret Redaction, and Side-Effect Safety
- **Supersedes**: N/A

---

## 1. Context and Problem Statement

When an AI model is connected to the Multica platform via MCP, it gains tool-calling capabilities that can inspect data, mutate project states, create issues, post comments, or trigger agent runs.

In Multica, certain actions have significant side-effects:
1. **Agent Mentions (`mention://agent/<id>`)**: Enqueue an actual paid agent execution run. Uncontrolled mentions can trigger costly agent loops or unbounded background executions.
2. **Confidential Agent Secrets**: Multica agent entities contain `custom_env` (process environment variables) and `mcp_config` (MCP server credentials). According to Multica security rules, agent actors and external tools must **never** receive plaintext `custom_env` or unredacted `mcp_config`.
3. **Workspace Modification**: Modifying squad rosters, deleting resources, or altering custom issue properties can disrupt collaborative workflows.

Therefore, Multica-MCP must implement a strict **Security and Mutation Governance Model**.

---

## 2. Decision Drivers

- **Zero Secret Leakage**: Strict adherence to Multica platform security invariants (redacted secrets on read).
- **Least Privilege Access**: Configurable execution modes (`read_only`, `standard`, `admin`).
- **Mutation Safety & Dry-Run Support**: Ability to simulate mutations before applying them.
- **Auditability**: Traceable logging of all MCP tool invocations with sanitized payloads.

---

## 3. Key Decisions

### 3.1. Permission Scopes & Execution Modes
Multica-MCP server supports three operation profiles via configuration (`MULTICA_MCP_MODE`):

| Mode | Allowed Tool Categories | Typical Use Case |
|---|---|---|
| `read_only` (Default for exploration) | Resource reads, list/get queries for issues, squads, agents, projects | Code reviews, context querying in IDEs |
| `standard` | Read tools + Safe mutations (Create/update issues, post comments, check out repos) | Daily engineering workflows, interactive pair programming |
| `admin` | Full tool access including squad management, agent updates, and workspace configuration | CI/CD pipelines, DevOps orchestration |

### 3.2. Strict Secret Redaction & Invariant Enforcement
The Multica-MCP server intercepts all resource and tool responses before returning them to the MCP client:
1. **`custom_env`**: Plaintext values are never returned. Only `has_custom_env` (boolean) and `custom_env_key_count` (integer) are exposed.
2. **`mcp_config`**: Sanitized or redacted unless explicitly permitted by human owner credentials.
3. **Token Sanitization**: Multica API tokens (`MULTICA_API_KEY`, `MULTICA_SERVER_URL`) are scrubbed from logs and stack traces.

### 3.3. Side-Effect & Mention Guard
When the `multica_issue_comment_add` or `multica_issue_create` tools are invoked:
1. The tool parameters are scanned for agent mention patterns (`mention://agent/<id>`).
2. If `allow_agent_triggers` is false (default in interactive mode), the MCP server either warns the caller or formats agent references as inert plain text to prevent accidental agent run dispatches.
3. Every mutating tool accepts a `--dry-run` parameter allowing the LLM to inspect the payload and expected impact before committing.

### 3.4. Authentication Strategy
1. **Environment Variable Auth**: Standard `MULTICA_API_KEY` and `MULTICA_WORKSPACE_ID`.
2. **CLI Profile Integration**: Automatically read active tokens from `~/.multica/config.json` when running in a local environment where the user has already executed `multica login`.

---

## 4. Consequences and Trade-offs

### Positive Consequences
- Guarantees compliance with Multica platform security rules.
- Protects workspace budgets from inadvertent agent cascade loops.
- Provides a clear security posture for enterprise deployments.

### Negative Consequences
- Slightly increases validation overhead on each tool invocation (minimal, < 2ms).
