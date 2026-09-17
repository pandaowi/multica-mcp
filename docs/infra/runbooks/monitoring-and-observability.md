# Monitoring, Healthchecks, and Observability Runbook

- **Document ID**: `RB-INFRA-002`
- **Scope**: Metric Collection, Structured Logging, Health Probes, and Alerting Rules
- **Author**: DevOps & SRE Team (`b1000000-0000-0000-0000-000000000004`)
- **Last Verified**: 2026-09-17

---

## 1. Health Probes & Endpoint Contracts

When deployed in SSE / HTTP gateway mode, the server exposes the following endpoints:

| Endpoint | Method | Purpose | Normal Status Code | Degradation Behavior |
|---|---|---|---|---|
| `/healthz` | `GET` | Shallow liveness probe | `200 OK` | Fails if Node.js event loop blocks > 5s |
| `/readyz` | `GET` | Deep readiness probe | `200 OK` | Returns `503 Service Unavailable` if upstream Multica API is unreachable |
| `/metrics` | `GET` | Prometheus formatted metrics | `200 OK` | Standard Prometheus metric scraper |
| `/sse` | `GET` | MCP Server-Sent Events stream | `200 OK` (chunked stream) | Sustained streaming connection |

### Health Check Response Schema:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime_seconds": 36420,
  "transport": "sse",
  "multica_upstream": {
    "status": "connected",
    "latency_ms": 12
  },
  "memory": {
    "rss_mb": 45.2,
    "heap_used_mb": 28.1
  }
}
```

---

## 2. Structured Logging Guidelines

All logs in production are formatted as single-line JSON objects with standard fields:
- `timestamp`: ISO-8601 UTC timestamp (`2026-09-17T07:30:00.000Z`)
- `level`: `INFO`, `WARN`, `ERROR`, `DEBUG`
- `trace_id`: Correlation ID matching incoming MCP client request
- `client_type`: E.g. `claude-desktop`, `cursor`, `agentic-runner`
- `tool_name`: Name of executed MCP tool (e.g. `multica_issue_get`)
- `duration_ms`: Execution time in milliseconds
- `status`: `SUCCESS` or `ERROR`
- `redacted`: Boolean indicating secret sanitization was applied

### Example Log Entry:
```json
{"timestamp":"2026-09-17T07:30:01.120Z","level":"INFO","trace_id":"req_8f7b2c9a","tool_name":"multica_issue_get","duration_ms":18,"status":"SUCCESS","redacted":true,"workspace_id":"7564ba23-2da2-4ece-b009-6e1b1a4ba303"}
```

---

## 3. Key Prometheus Metrics & Alert Rules

```yaml
groups:
  - name: multica-mcp-alerts
    rules:
      # Alert when MCP Server error rate exceeds 5% over 5 minutes
      - alert: MulticaMCPHighErrorRate
        expr: sum(rate(multica_mcp_tool_invocations_total{status="error"}[5m])) / sum(rate(multica_mcp_tool_invocations_total[5m])) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate on Multica-MCP server (> 5%)"
          description: "Tool invocations are failing against upstream Multica platform."

      # Alert on high request latency (> 2000ms p95)
      - alert: MulticaMCPHighLatency
        expr: histogram_quantile(0.95, sum(rate(multica_mcp_tool_duration_seconds_bucket[5m])) by (le)) > 2.0
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Multica-MCP p95 latency exceeds 2 seconds"
          description: "Latency degradation detected on MCP tool router."

      # Alert on container restart loop
      - alert: MulticaMCPCrashLooping
        expr: rate(kube_pod_container_status_restarts_total{container="multica-mcp"}[15m]) > 2
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Multica-MCP pod is crashlooping"
          description: "Check OOMKilled events or invalid environment credentials."
```
