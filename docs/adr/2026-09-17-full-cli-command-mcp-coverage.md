# ADR 003: Full Multica CLI Command Coverage & Typed MCP Registry Architecture

- **Status**: Accepted
- **Date**: 2026-09-17
- **Authors**: Mika (Chief of Staff & Squad Leader), Multica Engineering Team
- **Scope**: Multica-MCP Full CLI Command Support
- **Supersedes**: N/A

---

## 1. Context and Problem Statement

The Multica platform provides a rich command-line interface (`multica` CLI) comprising 155 canonical subcommands across 21 functional domains (agent, autopilot, chat, issue, label, project, property, repo, skill, squad, workspace, daemon, runtime, attachment, auth, config, login, setup, update, user, version).

To allow AI agents, external IDEs (Claude Desktop, Cursor, Zed, Goose), and automated orchestration pipelines to access all platform functionality safely via the Model Context Protocol (MCP), Multica-MCP requires a complete, strongly-typed command registry that bridges 100% of the Multica CLI capabilities into MCP discovery tools, execution dispatchers, and resource endpoints.

---

## 2. Decision Drivers

1. **Complete Parity (100% CLI Coverage)**: Every single public leaf command in the Multica CLI must be addressable via the MCP interface.
2. **Strict Type Safety & Parameter Validation**: Using `zod` schemas for positional parameters, options/flags, and context metadata.
3. **Security & Risk Governance**: Enforcing risk classifications (`read_only`, `routine_write`, `destructive`, `credential`, `code_execution`, `device_admin`) with explicit workspace isolation and secret redaction.
4. **Resilient Dual Interface**: Exposing discovery (`multica_command_search`, `multica_command_describe`), meta-dispatcher (`multica_command_execute`), and URI resources (`multica://commands/{command_id}`).

---

## 3. Architecture & Modular Structure

The command definitions are partitioned into modular family packages within `src/commands/`:
- `agent.ts`: 19 commands (archive, avatar, copy, create, env get/set, get, list, mcp add/disable/enable/list/remove, restore, skills add/list/set, tasks, update)
- `autopilot.ts`: 12 commands (create, delete, get, list, runs, trigger, trigger-add, trigger-delete, trigger-list, trigger-rotate-url, trigger-update, update)
- `chat.ts`: 2 commands (history, thread)
- `issue.ts`: 34 commands (CRUD, assign, status, children, search, reorder, timeline, pull-requests, runs, run-messages, usage, rerun, cancel-task, comments, subscribers, labels, metadata, properties)
- `label.ts`: 5 commands (create, delete, get, list, update)
- `project.ts`: 10 commands (CRUD, status, resources add/list/remove/update)
- `property.ts`: 6 commands (archive, create, get, list, unarchive, update)
- `repo.ts`: 4 commands (add, checkout, list, remove)
- `skill.ts`: 11 commands (CRUD, import, refresh, search, files list/upsert/delete)
- `squad.ts`: 10 commands (CRUD, activity, members add/list/remove/set-role)
- `workspace.ts`: 11 commands (create, get, list, switch, update, members list/invite, mcp add/list/remove/update)
- `daemon.ts`: 6 commands (status, start, stop, restart, logs, disk-usage)
- `runtime.ts`: 12 commands (list, rename, delete, update, usage, activity, profile CRUD/set-path/unset-path)
- `system.ts`: 13 commands (attachment download/upload, auth logout/status, config set/show, login, setup cloud/self-host, update, user profile get/update, version)

Total registered commands: **155 canonical leaf commands**.

---

## 4. Consequences and Validation

- **Parity**: Achieved 100% parity against Multica CLI baseline.
- **Verification**: Complete test coverage via `test/registry.test.ts` ensuring all 155 commands are discoverable, validatable, and properly classified by risk and workspace requirements.
