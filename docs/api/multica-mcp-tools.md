# Multica-MCP API & Tool Contract Specification

- **Version**: 1.0.0
- **Status**: Stable
- **Maintainer**: Architect Team

---

## 1. Overview

This document specifies the exact JSON-RPC 2.0 tool interface contracts exposed by the Multica-MCP server, input/output schemas (defined using `zod`), error response codes, and envelope structures.

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

## 3. Tool Specifications

### 3.1. Issue Management Tools

#### `multica_issue_get`
Retrieves a full issue record by UUID or issue identifier (e.g. `SWD-2`).

- **Input Parameters (`zod` schema)**:
  ```typescript
  {
    issue_id: z.string().describe("The UUID or human-readable identifier (e.g. 'SWD-2') of the issue.")
  }
  ```
- **Output Data Schema**:
  ```typescript
  {
    id: string;
    identifier: string;
    project_id: string;
    title: string;
    description: string;
    status: "todo" | "in_progress" | "in_review" | "done" | "blocked" | "backlog" | "cancelled";
    priority: "none" | "low" | "medium" | "high" | "urgent";
    assignee_id: string | null;
    assignee_type: "agent" | "squad" | "member" | null;
    parent_issue_id: string | null;
    stage: number | null;
    created_at: string;
    updated_at: string;
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

### 3.2. Comment & Collaboration Tools

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

### 3.3. Squad & Agent Exploration Tools

#### `multica_agent_list`
Lists agents in the workspace. Secrets (`custom_env`, `mcp_config`) are strictly redacted.

- **Output Data**:
  ```typescript
  Array<{
    id: string;
    name: string;
    description: string;
    model: string;
    skills: Array<{ id: string; name: string; description: string }>;
    has_custom_env: boolean;
    custom_env_key_count: number;
    max_concurrent_tasks: number;
    status: "idle" | "working";
  }>
  ```

#### `multica_squad_get`
Retrieves squad composition and leader routing rules.

- **Input Parameters**:
  ```typescript
  {
    squad_id: z.string().describe("Squad UUID")
  }
  ```
- **Output Data**:
  ```typescript
  {
    id: string;
    name: string;
    description: string;
    instructions: string;
    leader_id: string;
    member_count: number;
    members: Array<{
      member_id: string;
      member_type: "agent" | "member";
      role: string;
    }>;
  }
  ```
