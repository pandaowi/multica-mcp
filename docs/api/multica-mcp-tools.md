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

---

## 5. Full Multica CLI Command Registry (155 Commands)

The server integrates the full catalog of **155 canonical Multica CLI subcommands** across 21 families into the typed MCP registry (`src/registry.ts` and `src/commands/*.ts`), exposed through discovery (`multica_command_search`, `multica_command_describe`), meta-dispatcher (`multica_command_execute`), and URI resources (`multica://commands/{command_id}`).

### Registered Command Families:
1. **`agent`** (19 commands): `agent.archive`, `agent.avatar`, `agent.copy`, `agent.create`, `agent.env.get`, `agent.env.set`, `agent.get`, `agent.list`, `agent.mcp.add`, `agent.mcp.disable`, `agent.mcp.enable`, `agent.mcp.list`, `agent.mcp.remove`, `agent.restore`, `agent.skills.add`, `agent.skills.list`, `agent.skills.set`, `agent.tasks`, `agent.update`
2. **`autopilot`** (12 commands): `autopilot.create`, `autopilot.delete`, `autopilot.get`, `autopilot.list`, `autopilot.runs`, `autopilot.trigger`, `autopilot.trigger.add`, `autopilot.trigger.delete`, `autopilot.trigger.list`, `autopilot.trigger.rotate_url`, `autopilot.trigger.update`, `autopilot.update`
3. **`chat`** (2 commands): `chat.history`, `chat.thread`
4. **`issue`** (34 commands): `issue.assign`, `issue.cancel_task`, `issue.children`, `issue.comment.add`, `issue.comment.delete`, `issue.comment.list`, `issue.comment.resolve`, `issue.comment.unresolve`, `issue.create`, `issue.get`, `issue.label.add`, `issue.label.list`, `issue.label.remove`, `issue.list`, `issue.metadata.delete`, `issue.metadata.get`, `issue.metadata.list`, `issue.metadata.set`, `issue.property.list`, `issue.property.set`, `issue.property.unset`, `issue.pull_requests`, `issue.reorder`, `issue.rerun`, `issue.run_messages`, `issue.runs`, `issue.search`, `issue.status`, `issue.subscriber.add`, `issue.subscriber.list`, `issue.subscriber.remove`, `issue.timeline`, `issue.update`, `issue.usage`
5. **`label`** (5 commands): `label.create`, `label.delete`, `label.get`, `label.list`, `label.update`
6. **`project`** (10 commands): `project.create`, `project.delete`, `project.get`, `project.list`, `project.resource.add`, `project.resource.list`, `project.resource.remove`, `project.resource.update`, `project.status`, `project.update`
7. **`property`** (6 commands): `property.archive`, `property.create`, `property.get`, `property.list`, `property.unarchive`, `property.update`
8. **`repo`** (4 commands): `repo.add`, `repo.checkout`, `repo.list`, `repo.remove`
9. **`skill`** (11 commands): `skill.create`, `skill.delete`, `skill.files.delete`, `skill.files.list`, `skill.files.upsert`, `skill.get`, `skill.import`, `skill.list`, `skill.refresh`, `skill.search`, `skill.update`
10. **`squad`** (10 commands): `squad.activity`, `squad.create`, `squad.delete`, `squad.get`, `squad.list`, `squad.member.add`, `squad.member.list`, `squad.member.remove`, `squad.member.set_role`, `squad.update`
11. **`workspace`** (11 commands): `workspace.create`, `workspace.get`, `workspace.list`, `workspace.mcp.add`, `workspace.mcp.list`, `workspace.mcp.remove`, `workspace.mcp.update`, `workspace.member.invite`, `workspace.member.list`, `workspace.switch`, `workspace.update`
12. **`daemon`** (6 commands): `daemon.disk_usage`, `daemon.logs`, `daemon.restart`, `daemon.start`, `daemon.status`, `daemon.stop`
13. **`runtime`** (12 commands): `runtime.activity`, `runtime.delete`, `runtime.list`, `runtime.profile.create`, `runtime.profile.delete`, `runtime.profile.list`, `runtime.profile.set_path`, `runtime.profile.unset_path`, `runtime.profile.update`, `runtime.rename`, `runtime.update`, `runtime.usage`
14. **`attachment`** (2 commands): `attachment.download`, `attachment.upload`
15. **`auth`** (2 commands): `auth.logout`, `auth.status`
16. **`config`** (2 commands): `config.set`, `config.show`
17. **`login`** (1 command): `login`
18. **`setup`** (2 commands): `setup.cloud`, `setup.self_host`
19. **`update`** (1 command): `update`
20. **`user`** (2 commands): `user.profile.get`, `user.profile.update`
21. **`version`** (1 command): `version`

