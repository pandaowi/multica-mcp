## Core MCP surface

The server exposes a verified command registry through three tools and one resource per registered command. `multica_command_execute` accepts only a registered `command_id`; it never accepts a shell string or arbitrary argv.

### Tools

- `multica_command_search({ query? })` returns command IDs, descriptions, risk classes, and supports context-bounded discovery.
- `multica_command_describe({ command_id })` returns the command's risk, scope requirements, and Zod-derived input schema.
- `multica_command_execute({ command_id, arguments, context })` validates arguments, requires explicit workspace scope where applicable, enforces read-only policy, and returns a result envelope or a safe error envelope.

`context` contains `principal_id`, `connection_id`, optional `workspace_id`/`device_id`, and an optional `read_only` policy. The server-side connection maps to the Multica credential; credentials are never accepted as tool arguments.

Resources use `multica://commands/{command_id}` and contain the same command description used by discovery.
