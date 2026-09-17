# Multica-MCP API & Tool Contract Specification

- **Version**: 1.0.0
- **Status**: Stable
- **Maintainer**: Software Engineering Team

---

## 1. Overview

This document specifies the JSON-RPC 2.0 tool interface contracts exposed by the Multica-MCP server, input/output schemas (defined using `zod`), error response codes, and envelope structures.

---

## 2. Standard Envelope & Error Response Format

All MCP Tool executions return a structured JSON response wrapped in standard MCP content objects:

```json
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"data\": { ... },\n  \"meta\": { ... }\n}"
    }
  ],
  "isError": false
}
```

When an error occurs:
```json
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": false,\n  \"error\": {\n    \"code\": \"NOT_FOUND\",\n    \"message\": \"Issue SWD-999 not found in active workspace.\",\n    \"details\": null\n  }\n}"
    }
  ],
  "isError": true
}
```

---

## 3. Core MCP Surface

The server exposes a verified command registry through three discovery/dispatch tools and one resource per registered command. `multica_command_execute` accepts only a registered `command_id`; it never accepts raw shell strings or arbitrary argv.

### Core Discovery & Dispatch Tools:

- **`multica_command_search({ query? })`**: Returns command IDs, titles, descriptions, and risk classes to support context-bounded tool discovery.
- **`multica_command_describe({ command_id })`**: Returns the command's risk class, scope requirements, and Zod-derived JSON input schema.
- **`multica_command_execute({ command_id, arguments, context })`**: Validates arguments, requires explicit workspace scope where applicable, enforces read-only policy, and returns a sanitized result envelope.

`context` contains `principal_id`, `connection_id`, optional `workspace_id`/`device_id`, and an optional `read_only` policy. The server-side connection maps to the Multica credential; credentials are never accepted as tool arguments.

Resources use `multica://commands/{command_id}` and contain the same command description used by discovery.

---

## 4. Entity Management Tool Specifications

### 4.1. Issue Management Tools

#### `multica_issue_get`
Retrieves a full issue record by UUID or issue identifier (e.g. `SWD-2`).

- **Input Parameters (`zod` schema)**:
  ```typescript
  {
    issue_id: z.string().describe("The UUID or human-readable identifier (e.g. 'SWD-2') of the issue.")
  }
  ```

#### `multica_issue_list`
Lists issues in a workspace or project with optional filters.

- **Input Parameters**:
  ```typescript
  {
    project_id?: z.string().optional().describe("Filter issues by Project ID"),
    status?: z.enum(["todo", "in_progress", "in_review", "done", "blocked", "backlog", "cancelled"]).optional(),
    assignee_id?: z.string().optional().describe("Filter by Assignee Agent/Squad/Member UUID"),
    limit?: z.number().min(1).max(50).default(20),
    offset?: z.number().min(0).default(0)
  }
  ```

#### `multica_issue_create`
Creates a new issue or sub-issue in the active project/workspace.

- **Input Parameters**:
  ```typescript
  {
    title: z.string().min(1).max(255).describe("Issue title"),
    description: z.string().describe("Markdown issue description (no H1 # prefix)"),
    project_id?: z.string().optional().describe("Target Project UUID"),
    parent_issue_id?: z.string().optional().describe("Parent issue UUID if creating a sub-task"),
    stage?: z.number().int().min(1).optional().describe("Execution stage number for sub-task order"),
    priority?: z.enum(["none", "low", "medium", "high", "urgent"]).default("medium"),
    status?: z.enum(["todo", "in_progress", "backlog"]).default("todo"),
    assignee_id?: z.string().optional().describe("Assignee UUID"),
    assignee_type?: z.enum(["agent", "squad", "member"]).optional()
  }
  ```

#### `multica_issue_status`
Transitions an issue status.

- **Input Parameters**:
  ```typescript
  {
    issue_id: z.string().describe("Target Issue UUID"),
    status: z.enum(["todo", "in_progress", "in_review", "done", "blocked", "backlog", "cancelled"]),
    no_start?: z.boolean().default(false).describe("If true, updates status without triggering fresh agent run")
  }
  ```

---

### 4.2. Comment & Collaboration Tools

#### `multica_issue_comment_list`
Reads comment threads with summary or deep thread inspection.

- **Input Parameters**:
  ```typescript
  {
    issue_id: z.string().describe("Target Issue UUID"),
    roots_only?: z.boolean().default(false).describe("List top-level comment threads only"),
    summary?: z.boolean().default(false).describe("Include clipped previews and reply count"),
    thread_id?: z.string().optional().describe("Specific comment thread UUID to expand"),
    tail?: z.number().min(1).max(100).default(30).describe("Fetch N newest replies in thread")
  }
  ```

#### `multica_issue_comment_add`
Posts a comment or thread reply. Agent mention guards are enforced automatically.

- **Input Parameters**:
  ```typescript
  {
    issue_id: z.string().describe("Target Issue UUID"),
    content: z.string().describe("Markdown comment body"),
    parent_comment_id?: z.string().optional().describe("Parent Comment UUID if replying to a thread"),
    allow_agent_triggers?: z.boolean().default(false).describe("Must be explicitly true to permit mention://agent/ triggers")
  }
  ```

---

### 4.3. Squad & Agent Exploration Tools

#### `multica_agent_list`
Lists agents in the workspace. Secrets (`custom_env`, `mcp_config`) are strictly redacted.

#### `multica_squad_get`
Retrieves squad composition and leader routing rules.
