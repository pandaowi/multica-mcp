# Multica MCP

Multica MCP is a Model Context Protocol server that exposes a verified, typed subset of Multica commands to MCP clients such as Claude Desktop and Cursor. The server validates command arguments and workspace scope before calling the configured Multica API. It does not execute arbitrary shell commands.

## Prerequisites

- Node.js 20 or newer (Node.js 22 LTS is recommended).
- npm 10 or newer.
- A Multica API connection and token provisioned through a trusted local channel. Never paste a token into a prompt or commit it to a file.
- Claude Desktop or Cursor for MCP client integration (optional).

Check the local runtime with:

```bash
node --version
npm --version
```

## Install and build

From the repository root:

```bash
npm ci
npm run build
npm test
```

The compiled server is `dist/index.js`. The build is strict TypeScript and the test suite runs without Multica credentials by using a fake upstream client.

## Configuration

The stdio server reads these environment variables. `MULTICA_API_TOKEN` is sent only to the upstream API and is never a tool argument.

| Variable | Required | Description |
| --- | --- | --- |
| `MULTICA_SERVER_URL` | No | Multica API base URL. Defaults to `https://api.multica.dev`. |
| `MULTICA_API_KEY` | Yes for live execution | Token/key for the provisioned Multica connection. |
| `MULTICA_WORKSPACE_ID` | Recommended | Default workspace context for deployment configuration. |

Run it manually:

```bash
MULTICA_SERVER_URL="https://api.multica.dev" \
MULTICA_API_KEY="<token-from-secure-storage>" \
node dist/index.js
```

## Claude Desktop (stdio)

Build the project first, then add the server to Claude Desktop's MCP configuration. Use an absolute path for `cwd` and `command`:

```json
{
  "mcpServers": {
    "multica": {
      "command": "node",
      "args": ["/absolute/path/to/multica-mcp/dist/index.js"],
      "env": {
        "MULTICA_SERVER_URL": "https://api.multica.dev",
        "MULTICA_API_KEY": "${MULTICA_API_KEY}"
      }
    }
  }
}
```

If the client does not expand environment placeholders, inject the value through the operating system's secret manager or a local launcher script. Do not commit a literal token to this JSON file.

## Cursor (stdio)

In Cursor, open MCP settings and add the equivalent server entry to `mcp.json`:

```json
{
  "mcpServers": {
    "multica": {
      "command": "node",
      "args": ["/absolute/path/to/multica-mcp/dist/index.js"],
      "env": {
        "MULTICA_SERVER_URL": "https://api.multica.dev",
        "MULTICA_API_KEY": "<inject-from-secure-storage>"
      }
    }
  }
}
```

Restart the client after changing the configuration and verify that the Multica tools appear in its MCP tools panel.

## Docker Compose / SSE deployment

The repository includes `Dockerfile` and `docker-compose.yml` for the planned non-root gateway deployment. The Compose profile is configured for port 3000 and `--transport sse`, but the current `src/index.ts` entrypoint implements stdio only; the authenticated HTTP/SSE transport must be wired before this profile is used in production. Do not point a client at an SSE URL until that transport is implemented and protected by authentication.

When the SSE transport is available, start the gateway with:

```bash
export MULTICA_SERVER_URL="https://api.multica.dev"
export MULTICA_API_KEY="<inject-from-secure-storage>"
export MULTICA_WORKSPACE_ID="<workspace-id>"
docker compose up --build -d
curl http://localhost:3000/healthz
```

The Compose service binds port 3000 and uses `MULTICA_SERVER_URL`, `MULTICA_API_KEY`, and `MULTICA_WORKSPACE_ID` from the environment. Prefer Docker secrets or an external secret manager over a `.env` file for production.

The intended future client shape is:

```json
{
  "mcpServers": {
    "multica": {
      "url": "https://mcp.example.com/mcp"
    }
  }
}
```

Inject `MULTICA_API_KEY` through a Docker secret or external secret manager, bind the service to an internal network, terminate TLS at a trusted proxy, and require per-user authentication. Never place the token in `docker-compose.yml`, an image layer, command arguments, or logs. The gateway must not spawn Claude, Cursor, Codex, or any other coding-agent binary.

## Available tools and resources

| Tool/resource | Purpose |
| --- | --- |
| `multica_command_search` | Search the verified command registry by ID or description. |
| `multica_command_describe` | Inspect a command's risk class, scope requirements, and input schema. |
| `multica_command_execute` | Execute one registered command after schema, workspace, and read-only policy checks. Raw shell/argv input is rejected. |
| `multica://commands/{command_id}` | Read a registered command definition as JSON. |

The initial registry includes:

- `workspace.list` — list authorized workspaces.
- `agent.get` — read an agent in an explicit workspace.
- `agent.create` — create an agent in an explicit workspace.

Every execution context must identify a `principal_id` and `connection_id`; workspace-dependent commands also require an explicit `workspace_id`. A read-only connection cannot execute write commands.

## Troubleshooting

- **No tools appear:** run `npm run build`, confirm the absolute `dist/index.js` path, and restart the MCP client.
- **`AUTH_REQUIRED`:** provide a valid token through the environment and verify the API URL.
- **`WORKSPACE_REQUIRED`:** include the explicit workspace ID in the tool context.
- **`FORBIDDEN`:** verify connection ownership and read-only policy; do not attempt to bypass policy with extra arguments.
- **SSE connection fails:** confirm the HTTP/SSE transport has been wired into the release; the current entrypoint is stdio-only even though Compose documents the planned SSE command.

See `docs/api/multica-mcp-tools.md` for the tool contract and `docs/backend/core-runtime.md` for the runtime boundaries.
