import { z } from "zod";
import type { CommandDefinition } from "../types.js";


const issue_assignSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  no_start: z.string().optional().describe("ownership without starting an agent run"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  to: z.string().optional().describe("Assignee name (member, agent, or squad; fuzzy match)"),
  to_id: z.string().optional().describe("Assignee UUID — member, agent, or squad (mutually exclusive with --to)"),
  unassign: z.string().optional().describe("current assignee"),
});

export const issue_assignCommand: CommandDefinition = {
  commandId: "issue.assign",
  title: "Assign an issue to a member, agent, or squad",
  description: "Assign an issue to a member, agent, or squad",
  inputSchema: issue_assignSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/issue/assign"
};


const issue_cancel_taskSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  run_id: z.string().min(1).describe("Positional argument: run_id"),
  issue: z.string().optional().describe("Issue ID/key to scope short run ID prefix resolution"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
});

export const issue_cancel_taskCommand: CommandDefinition = {
  commandId: "issue.cancel-task",
  title: "Cancel a single run by its ID",
  description: "Cancel a single run by its ID. Accepts the short ID prefix shown by `issue runs`. Use --issue to scope short-ID resolution to a specific issue when ambiguous. Triggers daemon-side interrupt of any in-flight agent so it stops emitting tool calls promptly.",
  inputSchema: issue_cancel_taskSchema,
  risk: "destructive",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/issue/cancel-task"
};


const issue_childrenSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  full_id: z.string().optional().describe("full UUIDs in table output"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const issue_childrenCommand: CommandDefinition = {
  commandId: "issue.children",
  title: "List an issue's sub-issues grouped by stage",
  description: "List an issue's sub-issues grouped by stage",
  inputSchema: issue_childrenSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/issue/children"
};


const issue_comment_addSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  issue_id: z.string().min(1).describe("Positional argument: issue_id"),
  allow_external_file: z.string().optional().describe("--content-file / --attachment to read a path outside the current working directory. Off by default so a stale file from another run/environment can't be picked up (MUL-4252)."),
  attachment: z.array(z.string()).optional().describe("File path(s) to attach (can be specified multiple times)"),
  content: z.string().optional().describe("Comment content (decodes \n, \r, \t, \\; pipe via --content-stdin for multi-line bodies or to preserve literal backslashes)"),
  content_file: z.string().optional().describe("Read comment content from a UTF-8 file (preserves multi-line content verbatim; use this on Windows when stdin piping mangles non-ASCII bytes). The path must be inside the current working directory unless --allow-external-file is set."),
  content_stdin: z.string().optional().describe("comment content from stdin (preserves multi-line content verbatim)"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  parent: z.string().optional().describe("Parent comment ID to reply under. A comment-triggered agent run must reply under its trigger comment; omitting --parent to post a top-level comment is rejected"),
});

export const issue_comment_addCommand: CommandDefinition = {
  commandId: "issue.comment.add",
  title: "Add a comment to an issue",
  description: "Add a comment to an issue",
  inputSchema: issue_comment_addSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/issue/comment/add"
};


const issue_comment_deleteSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  comment_id: z.string().min(1).describe("Positional argument: comment_id"),
});

export const issue_comment_deleteCommand: CommandDefinition = {
  commandId: "issue.comment.delete",
  title: "Delete a comment",
  description: "Delete a comment",
  inputSchema: issue_comment_deleteSchema,
  risk: "destructive",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "DELETE",
  path: "/issue/comment/delete"
};


const issue_comment_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  issue_id: z.string().min(1).describe("Positional argument: issue_id"),
  before: z.string().optional().describe("Cursor (RFC3339Nano timestamp). With --recent: thread cursor (last_activity_at). With --thread + --tail: reply cursor (reply created_at). Read from the X-Multica-Next-Before response header, printed on stderr as \"Next thread cursor\" / \"Next reply cursor\"; must be paired with --before-id."),
  before_id: z.string().optional().describe("Cursor UUID. With --recent: thread root UUID. With --thread + --tail: oldest reply UUID. Read from the X-Multica-Next-Before-Id response header; must be paired with --before."),
  compact: z.string().optional().describe("output only: drop response fields that carry no information for a reader — the issue_id echoed from the request path, source_task_id, updated_at when identical to created_at, null-valued fields, and empty arrays. Content and identity fields pass through untouched. Recommended for agent reads; composes with any mode."),
  full: z.string().optional().describe("hatch: return every comment in resolved threads verbatim. By default the complete-thread reads (default list, --recent, --thread without --tail) are folded — a resolved thread collapses to its root + conclusion, with the dropped count reported on the root — so you do not pay tokens for settled discussion. Pass --full when you need the folded discussion. No effect on --since/--tail/--roots-only reads, which are never folded."),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
  recent: z.number().optional().describe("Return the N most recently active threads. N caps THREADS, not comments: every thread carries its root plus EVERY descendant with no per-thread cap, so on an issue with fewer than N root threads this returns the entire history (minus folded resolved threads). Prefer two bounded reads: scan with --roots-only --summary, then open selected threads with --thread <id> --tail N. Use --before/--before-id from the previous response to scroll to older threads."),
  roots_only: z.string().optional().describe("return top-level comments (parent_id is null). Each root also carries reply_count + last_activity_at so you can triage which thread to open."),
  since: z.string().optional().describe("Only return comments created after this timestamp (RFC3339)"),
  summary: z.string().optional().describe("each comment's content to a short preview (sets content_truncated) so you can scan a list without pulling full bodies. Composes with any mode."),
  tail: z.number().optional().describe("Only valid with --thread. Cap reply count to the N most recent replies; the thread root is always included (even with --tail 0). Use --before/--before-id to scroll to older replies."),
  thread: z.string().optional().describe("Comment UUID — return the thread containing this comment (root + every descendant). May be a root or a reply id."),
});

export const issue_comment_listCommand: CommandDefinition = {
  commandId: "issue.comment.list",
  title: "List comments on an issue",
  description: "List comments on an issue",
  inputSchema: issue_comment_listSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/issue/comment/list"
};


const issue_comment_resolveSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  comment_id: z.string().min(1).describe("Positional argument: comment_id"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
});

export const issue_comment_resolveCommand: CommandDefinition = {
  commandId: "issue.comment.resolve",
  title: "Resolve a comment thread",
  description: "Resolve a comment thread",
  inputSchema: issue_comment_resolveSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/issue/comment/resolve"
};


const issue_comment_unresolveSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  comment_id: z.string().min(1).describe("Positional argument: comment_id"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
});

export const issue_comment_unresolveCommand: CommandDefinition = {
  commandId: "issue.comment.unresolve",
  title: "Unresolve a comment thread",
  description: "Unresolve a comment thread",
  inputSchema: issue_comment_unresolveSchema,
  risk: "destructive",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/issue/comment/unresolve"
};


const issue_createSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  allow_duplicate: z.string().optional().describe("creating an issue even when an active duplicate exists"),
  allow_external_file: z.string().optional().describe("--description-file / --attachment to read a path outside the current working directory. Off by default so a stale file from another run/environment can't be picked up (MUL-4252)."),
  assignee: z.string().optional().describe("Assignee name (member, agent, or squad; fuzzy match)"),
  assignee_id: z.string().optional().describe("Assignee UUID — member, agent, or squad (mutually exclusive with --assignee)"),
  attachment: z.array(z.string()).optional().describe("File path(s) to attach (can be specified multiple times)"),
  attachment_id: z.array(z.string()).optional().describe("Existing attachment UUID(s) to bind to the created issue (can be specified multiple times)"),
  description: z.string().optional().describe("Issue description (decodes \n, \r, \t, \\; pipe via --description-stdin to preserve literal backslashes)"),
  description_file: z.string().optional().describe("Read issue description from a UTF-8 file (preserves multi-line content verbatim; use this on Windows when stdin piping mangles non-ASCII bytes). The path must be inside the current working directory unless --allow-external-file is set."),
  description_stdin: z.string().optional().describe("issue description from stdin (preserves multi-line content verbatim)"),
  due_date: z.string().optional().describe("Due date (calendar day, YYYY-MM-DD)"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  parent: z.string().optional().describe("Parent issue ID"),
  priority: z.string().optional().describe("Issue priority"),
  project: z.string().optional().describe("Project ID"),
  stage: z.number().optional().describe("Stage ordinal (>=1) grouping this sub-issue into an ordered barrier group under its parent; omit for unstaged. The parent assignee is woken only when every sub-issue in a stage finishes."),
  start_date: z.string().optional().describe("Start date (calendar day, YYYY-MM-DD)"),
  status: z.string().optional().describe("Issue status"),
  title: z.string().optional().describe("Issue title (required)"),
});

export const issue_createCommand: CommandDefinition = {
  commandId: "issue.create",
  title: "Create a new issue",
  description: "Create a new issue",
  inputSchema: issue_createSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/issue/create"
};


const issue_getSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  resolve_properties: z.string().optional().describe("property list   JSON output only: replace the properties id map with the rows issue property list prints (property name and type, option and member names beside the stored ids). Omit for the raw map. No effect on --output table."),
});

export const issue_getCommand: CommandDefinition = {
  commandId: "issue.get",
  title: "Get issue details",
  description: "Get issue details",
  inputSchema: issue_getSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/issue/get"
};


const issue_label_addSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  issue_id: z.string().min(1).describe("Positional argument: issue_id"),
  label_id: z.string().min(1).describe("Positional argument: label_id"),
  full_id: z.string().optional().describe("full UUIDs in table output"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const issue_label_addCommand: CommandDefinition = {
  commandId: "issue.label.add",
  title: "Attach a label to an issue",
  description: "Attach a label to an issue",
  inputSchema: issue_label_addSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/issue/label/add"
};


const issue_label_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  issue_id: z.string().min(1).describe("Positional argument: issue_id"),
  full_id: z.string().optional().describe("full UUIDs in table output"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const issue_label_listCommand: CommandDefinition = {
  commandId: "issue.label.list",
  title: "List labels on an issue",
  description: "List labels on an issue",
  inputSchema: issue_label_listSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/issue/label/list"
};


const issue_label_removeSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  issue_id: z.string().min(1).describe("Positional argument: issue_id"),
  label_id: z.string().min(1).describe("Positional argument: label_id"),
  full_id: z.string().optional().describe("full UUIDs in table output"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const issue_label_removeCommand: CommandDefinition = {
  commandId: "issue.label.remove",
  title: "Remove a label from an issue",
  description: "Remove a label from an issue",
  inputSchema: issue_label_removeSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/issue/label/remove"
};


const issue_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  assignee: z.string().optional().describe("Filter by assignee name (member, agent, or squad; fuzzy match)"),
  assignee_id: z.string().optional().describe("Filter by assignee UUID — member, agent, or squad (mutually exclusive with --assignee)"),
  direction: z.string().optional().describe("Sort direction (asc or desc); requires --sort to be a non-position column or a property sort (position is always ascending)"),
  fields: z.string().optional().describe("JSON output only: comma-separated list of issue fields to include (e.g. id,title,status,priority). Filtering happens client-side after the full response is fetched, so this shrinks CLI output size and agent context cost, not network/server-side cost. Omit for the full issue object (default, unchanged). Valid fields: id, workspace_id, number, identifier, title, description, status, status_category, status_name, priority, assignee_type, assignee_id, creator_type, creator_id, parent_issue_id, project_id, position, stage, start_date, due_date, created_at, updated_at, revision, last_activity_at, metadata, properties, labels"),
  full_id: z.string().optional().describe("full UUIDs in table output"),
  limit: z.number().optional().describe("Page size, 1 to 100 (the server returns at most 100 issues per request; use --offset to page through more) (default 50)"),
  metadata: z.array(z.string()).optional().describe("Filter by metadata key=value (repeatable; combined with AND). Value is JSON-parsed: 'true'/'false' → bool, numbers → number, otherwise string. Wrap as '\"42\"' to force a string when the value would otherwise sniff as a number."),
  offset: z.number().optional().describe("Number of issues to skip (for pagination; while --output json reports has_more, advance it by the number of issues in that same response)"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
  priority: z.string().optional().describe("Filter by priority"),
  project: z.string().optional().describe("Filter by project ID"),
  property: z.string().optional().describe("Filter by custom property, written as \"Name=Value\" (repeatable, one value per flag). Name is a property name (case-insensitive) or its UUID. Value depends on the type: an option name or id for select and multi_select, true or false for checkbox, a member name, email, or id for actor types, and the value itself for text, url, number, and date (YYYY-MM-DD). Use __none__ to match issues where the property is unset; it works for every type, so an option or member actually named __none__ has to be given by id, as does a property whose name contains \"=\" or ends in <, > or ! (the >=, <=, and != spellings are reserved for comparison filters). Repeating a property matches ANY of its values; different properties must ALL match."),
  resolve_properties: z.string().optional().describe("property list   JSON output only: replace the properties id map with the rows issue property list prints (property name and type, option and member names beside the stored ids). Omit for the raw map. No effect on --output table."),
  sort: z.string().optional().describe("Sort column: position (default, manual board order), title, created_at, start_date, due_date, priority, or property:<name-or-id> to sort by a custom property (select properties sort by option order)"),
  status: z.string().optional().describe("Filter by status"),
});

export const issue_listCommand: CommandDefinition = {
  commandId: "issue.list",
  title: "List issues in the workspace",
  description: "List issues in the workspace",
  inputSchema: issue_listSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/issue/list"
};


const issue_metadata_deleteSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  issue_id: z.string().min(1).describe("Positional argument: issue_id"),
  key: z.string().optional().describe("Metadata key (required)"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const issue_metadata_deleteCommand: CommandDefinition = {
  commandId: "issue.metadata.delete",
  title: "Delete a single metadata key",
  description: "Delete a single metadata key",
  inputSchema: issue_metadata_deleteSchema,
  risk: "destructive",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "DELETE",
  path: "/issue/metadata/delete"
};


const issue_metadata_getSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  issue_id: z.string().min(1).describe("Positional argument: issue_id"),
  key: z.string().optional().describe("Metadata key (required)"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
});

export const issue_metadata_getCommand: CommandDefinition = {
  commandId: "issue.metadata.get",
  title: "Get a single metadata key value",
  description: "Get a single metadata key value",
  inputSchema: issue_metadata_getSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/issue/metadata/get"
};


const issue_metadata_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  issue_id: z.string().min(1).describe("Positional argument: issue_id"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const issue_metadata_listCommand: CommandDefinition = {
  commandId: "issue.metadata.list",
  title: "List all metadata keys on an issue",
  description: "List all metadata keys on an issue",
  inputSchema: issue_metadata_listSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/issue/metadata/list"
};


const issue_metadata_setSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  issue_id: z.string().min(1).describe("Positional argument: issue_id"),
  key: z.string().optional().describe("Metadata key (required)"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
  type: z.string().optional().describe("Force value type: string, number, or bool (default: auto-infer via JSON parsing)"),
  value: z.string().optional().describe("Metadata value (required)"),
});

export const issue_metadata_setCommand: CommandDefinition = {
  commandId: "issue.metadata.set",
  title: "Set a single metadata key value",
  description: "Set a single metadata key value. The value is JSON-parsed by default:",
  inputSchema: issue_metadata_setSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/issue/metadata/set"
};


const issue_property_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  issue_id: z.string().min(1).describe("Positional argument: issue_id"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const issue_property_listCommand: CommandDefinition = {
  commandId: "issue.property.list",
  title: "List custom property values set on an issue",
  description: "List custom property values set on an issue",
  inputSchema: issue_property_listSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/issue/property/list"
};


const issue_property_setSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  issue_id: z.string().min(1).describe("Positional argument: issue_id"),
  name: z.string().optional().describe("Property name or UUID (required)"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
  value: z.string().optional().describe("Property value (required; see --help for per-type forms)"),
});

export const issue_property_setCommand: CommandDefinition = {
  commandId: "issue.property.set",
  title: "Set a custom property value",
  description: "Set a custom property value. The property is addressed by --name",
  inputSchema: issue_property_setSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/issue/property/set"
};


const issue_property_unsetSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  issue_id: z.string().min(1).describe("Positional argument: issue_id"),
  name: z.string().optional().describe("Property name or UUID (required)"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const issue_property_unsetCommand: CommandDefinition = {
  commandId: "issue.property.unset",
  title: "Remove a custom property value from an issue",
  description: "Remove a custom property value from an issue",
  inputSchema: issue_property_unsetSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/issue/property/unset"
};


const issue_pull_requestsSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const issue_pull_requestsCommand: CommandDefinition = {
  commandId: "issue.pull-requests",
  title: "List pull requests linked to an issue",
  description: "List pull requests linked to an issue",
  inputSchema: issue_pull_requestsSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/issue/pull-requests"
};


const issue_reorderSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  after: z.string().optional().describe("Place the issue directly below this issue (same column)"),
  before: z.string().optional().describe("Place the issue directly above this issue (same column)"),
  bottom: z.string().optional().describe("the issue to the bottom of its status column"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  top: z.string().optional().describe("the issue to the top of its status column"),
});

export const issue_reorderCommand: CommandDefinition = {
  commandId: "issue.reorder",
  title: "Reposition an issue inside its current status column by computing a new",
  description: "Reposition an issue inside its current status column by computing a new",
  inputSchema: issue_reorderSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/issue/reorder"
};


const issue_rerunSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
});

export const issue_rerunCommand: CommandDefinition = {
  commandId: "issue.rerun",
  title: "Re-enqueue an issue's current agent assignment as a fresh run",
  description: "Re-enqueue an issue's current agent assignment as a fresh run",
  inputSchema: issue_rerunSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/issue/rerun"
};


const issue_run_messagesSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  run_id: z.string().min(1).describe("Positional argument: run_id"),
  issue: z.string().optional().describe("Issue ID/key to scope short run ID prefix resolution"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  since: z.number().optional().describe("Only return messages after this sequence number"),
});

export const issue_run_messagesCommand: CommandDefinition = {
  commandId: "issue.run-messages",
  title: "List messages for an execution",
  description: "List messages for an execution",
  inputSchema: issue_run_messagesSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/issue/run-messages"
};


const issue_runsSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  issue_id: z.string().min(1).describe("Positional argument: issue_id"),
  active: z.string().optional().describe("in-flight runs (queued, dispatched, running, waiting_local_directory) instead of the full execution history. Answers \"is an agent working on this right now\" without pulling every past run."),
  full_id: z.string().optional().describe("full run UUIDs in table output"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
  siblings: z.string().optional().describe("to this issue's sub-issue family — its parent (or itself, when it has no parent) plus every child of that parent — so you can see whether another run is already working alongside you before starting overlapping code or PR work. Implies --active. Returns a compact per-run row (run, issue, agent, status, started) rather than the full execution-log record. Ordered running-first, newest-first within a status, and capped at 20 rows; when the cap truncates the answer the CLI says so on stderr, so a short list is never mistaken for a complete one. Advisory only: it reports work in flight, it does not reserve or serialise anything."),
});

export const issue_runsCommand: CommandDefinition = {
  commandId: "issue.runs",
  title: "List agent runs for an issue",
  description: "List agent runs for an issue.",
  inputSchema: issue_runsSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/issue/runs"
};


const issue_searchSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  query: z.string().min(1).describe("Positional argument: query"),
  include_closed: z.string().optional().describe("done and cancelled issues"),
  limit: z.number().optional().describe("Maximum number of results to return (default 20)"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const issue_searchCommand: CommandDefinition = {
  commandId: "issue.search",
  title: "Search issues in the current workspace",
  description: "Search issues in the current workspace. The query matches issue titles,",
  inputSchema: issue_searchSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/issue/search"
};


const issue_statusSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  status: z.string().min(1).describe("Positional argument: status"),
  no_start: z.string().optional().describe("status without starting an agent run"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const issue_statusCommand: CommandDefinition = {
  commandId: "issue.status",
  title: "Change an issue's status",
  description: "Change an issue's status. The argument is a status KEY, not its display name.",
  inputSchema: issue_statusSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/issue/status"
};


const issue_subscriber_addSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  issue_id: z.string().min(1).describe("Positional argument: issue_id"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  user: z.string().optional().describe("Member or agent name to subscribe (fuzzy match; defaults to the caller)"),
  user_id: z.string().optional().describe("Member or agent UUID to subscribe (mutually exclusive with --user)"),
});

export const issue_subscriber_addCommand: CommandDefinition = {
  commandId: "issue.subscriber.add",
  title: "Subscribe a user or agent to an issue (defaults to the caller)",
  description: "Subscribe a user or agent to an issue (defaults to the caller)",
  inputSchema: issue_subscriber_addSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "POST",
  path: "/issue/subscriber/add"
};


const issue_subscriber_listSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  issue_id: z.string().min(1).describe("Positional argument: issue_id"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const issue_subscriber_listCommand: CommandDefinition = {
  commandId: "issue.subscriber.list",
  title: "List subscribers of an issue",
  description: "List subscribers of an issue",
  inputSchema: issue_subscriber_listSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/issue/subscriber/list"
};


const issue_subscriber_removeSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  issue_id: z.string().min(1).describe("Positional argument: issue_id"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  user: z.string().optional().describe("Member or agent name to unsubscribe (fuzzy match; defaults to the caller)"),
  user_id: z.string().optional().describe("Member or agent UUID to unsubscribe (mutually exclusive with --user)"),
});

export const issue_subscriber_removeCommand: CommandDefinition = {
  commandId: "issue.subscriber.remove",
  title: "Unsubscribe a user or agent from an issue (defaults to the caller)",
  description: "Unsubscribe a user or agent from an issue (defaults to the caller)",
  inputSchema: issue_subscriber_removeSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/issue/subscriber/remove"
};


const issue_timelineSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  action: z.array(z.string()).optional().describe("Only return activities with these actions (repeatable or comma-separated). Implies --activity-only, since comments carry no action. Known actions: created, status_changed, priority_changed, assignee_changed, title_changed, description_updated, start_date_changed, due_date_changed, task_completed, task_failed, squad_leader_evaluated."),
  activity_only: z.string().optional().describe("comments and return every activity record — including the task_completed / task_failed entries the server already writes, not just field changes. Much cheaper to read than the full timeline; use --action when you want only state transitions."),
  full_id: z.string().optional().describe("full UUIDs in table output"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
  since: z.string().optional().describe("Only return entries created after this timestamp (RFC3339)"),
  tail: z.number().optional().describe("Only return the N most recent entries (applied after every other filter)"),
});

export const issue_timelineCommand: CommandDefinition = {
  commandId: "issue.timeline",
  title: "Chronological history of an issue: the activity log — status / priority /",
  description: "Chronological history of an issue: the activity log — status / priority /",
  inputSchema: issue_timelineSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/issue/timeline"
};


const issue_updateSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  id: z.string().min(1).describe("Positional argument: id"),
  allow_external_file: z.string().optional().describe("--description-file to read a path outside the current working directory. Off by default so a stale temp file from another run/environment can't be picked up (MUL-4252)."),
  assignee: z.string().optional().describe("New assignee name (member, agent, or squad; fuzzy match)"),
  assignee_id: z.string().optional().describe("New assignee UUID — member, agent, or squad (mutually exclusive with --assignee)"),
  description: z.string().optional().describe("New description (decodes \n, \r, \t, \\; pipe via --description-stdin to preserve literal backslashes)"),
  description_file: z.string().optional().describe("Read new description from a UTF-8 file (preserves multi-line content verbatim; use this on Windows when stdin piping mangles non-ASCII bytes). The path must be inside the current working directory unless --allow-external-file is set."),
  description_stdin: z.string().optional().describe("new description from stdin (preserves multi-line content verbatim)"),
  due_date: z.string().optional().describe("New due date (calendar day, YYYY-MM-DD)"),
  no_start: z.string().optional().describe("the update without starting an agent run"),
  output: z.string().optional().describe("Output format: table or json (default \"json\")"),
  parent: z.string().optional().describe("Parent issue ID (use --parent \"\" to clear)"),
  position: z.string().optional().describe("reorder       Ordering position within the board column (lower sorts first); prefer issue reorder for relative moves"),
  priority: z.string().optional().describe("New priority"),
  project: z.string().optional().describe("Project ID"),
  stage: z.string().optional().describe("create --stage   Stage ordinal (>=1) for this sub-issue; see issue create --stage"),
  start_date: z.string().optional().describe("New start date (calendar day, YYYY-MM-DD; pass empty string to clear)"),
  status: z.string().optional().describe("New status"),
  title: z.string().optional().describe("New title"),
});

export const issue_updateCommand: CommandDefinition = {
  commandId: "issue.update",
  title: "Update an issue",
  description: "Update an issue",
  inputSchema: issue_updateSchema,
  risk: "routine_write",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "PATCH",
  path: "/issue/update"
};


const issue_usageSchema = z.object({
  connection_id: z.string().optional(),
  workspace_id: z.string().optional(),
  issue_id: z.string().min(1).describe("Positional argument: issue_id"),
  output: z.string().optional().describe("Output format: table or json (default \"table\")"),
});

export const issue_usageCommand: CommandDefinition = {
  commandId: "issue.usage",
  title: "Show aggregated token usage for an issue",
  description: "Show aggregated token usage for an issue",
  inputSchema: issue_usageSchema,
  risk: "read_only",
  requiresWorkspace: true,
  requiresDevice: false,
  method: "GET",
  path: "/issue/usage"
};


export const issueCommands: readonly CommandDefinition[] = [
  issue_assignCommand,
  issue_cancel_taskCommand,
  issue_childrenCommand,
  issue_comment_addCommand,
  issue_comment_deleteCommand,
  issue_comment_listCommand,
  issue_comment_resolveCommand,
  issue_comment_unresolveCommand,
  issue_createCommand,
  issue_getCommand,
  issue_label_addCommand,
  issue_label_listCommand,
  issue_label_removeCommand,
  issue_listCommand,
  issue_metadata_deleteCommand,
  issue_metadata_getCommand,
  issue_metadata_listCommand,
  issue_metadata_setCommand,
  issue_property_listCommand,
  issue_property_setCommand,
  issue_property_unsetCommand,
  issue_pull_requestsCommand,
  issue_reorderCommand,
  issue_rerunCommand,
  issue_run_messagesCommand,
  issue_runsCommand,
  issue_searchCommand,
  issue_statusCommand,
  issue_subscriber_addCommand,
  issue_subscriber_listCommand,
  issue_subscriber_removeCommand,
  issue_timelineCommand,
  issue_updateCommand,
  issue_usageCommand
];
