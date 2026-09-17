# Environment Variables & Configuration Reference

- **Document Version**: 1.0.0
- **Classification**: Internal / Operational Standard
- **Maintainer**: DevOps & SRE Team (`b1000000-0000-0000-0000-000000000004`)

---

## 1. Overview & Secret Hygiene

This document defines the complete environment variable matrix for the **Multica-MCP Server**. 

### Secret Hygiene Rules:
1. **No Hardcoded Credentials**: API keys, tokens, and private certificates must NEVER be committed to Git repositories or baked into Docker images.
2. **Environment Variable Isolation**: In containerized environments, pass sensitive variables via encrypted secrets manager (e.g. Kubernetes Secrets, AWS Secrets Manager, HashiCorp Vault, or Docker Secret files).
3. **Automated Sanitization**: The server runtime strictly suppresses and redacts secrets from error envelopes, stack traces, and debug logs.

---

## 2. Environment Variable Matrix

| Variable Name | Type | Default Value | Required | Sensitivity | Description |
|---|---|---|---|---|---|
| `NODE_ENV` | `string` | `production` | No | Low | Execution runtime mode (`development`, `production`, `test`). |
| `MULTICA_MCP_TRANSPORT` | `string` | `stdio` | No | Low | MCP transport layer (`stdio` for local CLI/IDE, `sse` for HTTP streaming). |
| `PORT` | `number` | `3000` | No | Low | Listening port when running in `sse` transport mode. |
| `HOST` | `string` | `0.0.0.0` | No | Low | Network bind interface for the HTTP/SSE server. |
| `MULTICA_SERVER_URL` | `string` | `http://127.0.0.1:8080` | Yes | Medium | Upstream Multica platform API gateway or core server URL. |
| `MULTICA_API_KEY` | `string` | - | Yes | **High (Secret)** | Bearer token / API Key for upstream Multica authentication. |
| `MULTICA_WORKSPACE_ID` | `string` (UUID) | - | Yes | Medium | Default target Workspace context UUID for tool invocations. |
| `MULTICA_PROJECT_ID` | `string` (UUID) | - | No | Low | Default Project UUID filter if restricting operations to a specific project. |
| `MULTICA_MCP_MODE` | `string` | `standard` | No | Low | Security governance profile: `read_only`, `standard`, or `admin`. |
| `MULTICA_MCP_ALLOW_AGENT_TRIGGERS`| `boolean` | `false` | No | Medium | Allow `mention://agent/` in comments to trigger real agent execution runs. |
| `MULTICA_MCP_REDACT_SECRETS` | `boolean` | `true` | No | High | Redact `custom_env` and sensitive configurations from responses. |
| `MULTICA_API_TIMEOUT_MS` | `number` | `10000` | No | Low | Upstream HTTP request timeout in milliseconds. |
| `MULTICA_API_MAX_RETRIES` | `number` | `3` | No | Low | Exponential backoff retry count for transient network failures. |
| `MULTICA_MCP_RATE_LIMIT_MAX` | `number` | `100` | No | Low | Max requests per IP window in HTTP/SSE gateway mode. |
| `MULTICA_MCP_RATE_LIMIT_WINDOW_MS` | `number` | `60000` | No | Low | Rate limit rolling window duration in milliseconds (default 1 min). |
| `MULTICA_MCP_LOG_LEVEL` | `string` | `info` | No | Low | Logging verbosity: `trace`, `debug`, `info`, `warn`, `error`, `silent`. |
| `MULTICA_MCP_JSON_LOGS` | `boolean` | `true` | No | Low | Output logs in structured JSON format for Logstash/Fluentd/Datadog ingestion. |

---

## 3. Operational Mode Details (`MULTICA_MCP_MODE`)

- **`read_only`**:
  - Only read operations (e.g. `multica_issue_get`, `multica_issue_list`, `multica_agent_list`) and resource discovery are permitted.
  - Any mutating tools return an immediate `PERMISSION_DENIED` error.
- **`standard`** (Recommended Default):
  - Standard developer tools allowed (issue creation, status updates, comment additions, repo checkout).
  - High-risk operations (e.g. agent deletion, squad restructuring) are gated or blocked.
- **`admin`**:
  - Full capability matrix enabled. Intended for automated CI/CD workers and cluster-level SRE automation.

---

## 4. Production Secret Injection Examples

### Kubernetes Secret Manifest
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: multica-mcp-credentials
  namespace: multica-system
type: Opaque
stringData:
  MULTICA_API_KEY: "prod_live_sec_xxxxxxxxxxxxxxxx"
  MULTICA_WORKSPACE_ID: "7564ba23-2da2-4ece-b009-6e1b1a4ba303"
```

### Docker Compose Secret File
```bash
# Create local secret file with 0600 permissions
touch .env.production
chmod 600 .env.production
```
