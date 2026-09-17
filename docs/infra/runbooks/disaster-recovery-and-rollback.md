# Disaster Recovery, Rollback, and Incident Response Runbook

- **Document ID**: `RB-INFRA-003`
- **Scope**: Incident Mitigation, API Key Emergency Rotation, Rollback Procedures, and Crash Recovery
- **Author**: DevOps & SRE Team (`b1000000-0000-0000-0000-000000000004`)
- **Last Verified**: 2026-09-17

---

## 1. Fast Rollback Procedure

When a bad deployment causes regressions or high error rates:

### 1.1. Docker Compose Stack Rollback
```bash
# 1. Inspect previous known good image tag
docker images ghcr.io/pandaowi/multica-mcp

# 2. Modify docker-compose.prod.yml or set IMAGE_TAG
export MCP_IMAGE_TAG="v1.0.0"

# 3. Force recreate container with previous image
docker compose -f docker-compose.prod.yml up -d --no-deps multica-mcp

# 4. Verify healthy state
curl -s http://127.0.0.1:3000/healthz | jq .
```

### 1.2. Kubernetes Rollback
```bash
# Roll back to the previous deployment revision immediately
kubectl rollout undo deployment/multica-mcp-deployment -n multica-system

# Watch rollback status
kubectl rollout status deployment/multica-mcp-deployment -n multica-system
```

---

## 2. Emergency API Token Rotation Runbook

If `MULTICA_API_KEY` is suspected of compromise or expired:

1. **Generate New Token** in Multica platform dashboard:
   - Navigate to Multica Platform -> Settings -> API Keys -> Create Token.
   - Assign appropriate workspace scopes.
2. **Update Secrets Manager / Environment**:
   ```bash
   # In Kubernetes:
   kubectl create secret generic multica-mcp-credentials \
     --from-literal=MULTICA_API_KEY="new_sec_token_here" \
     --from-literal=MULTICA_WORKSPACE_ID="7564ba23-2da2-4ece-b009-6e1b1a4ba303" \
     --dry-run=client -o yaml | kubectl apply -n multica-system -f -

   # Trigger rolling restart to load new credentials:
   kubectl rollout restart deployment/multica-mcp-deployment -n multica-system
   ```
3. **Revoke Old Token**:
   - Return to Multica platform dashboard and revoke the compromised token.
4. **Audit Tool Logs**:
   - Search logs for unauthorized tool invocations during the exposure window.

---

## 3. Common Failure Modes and Troubleshooting

### 3.1. Upstream Multica Connectivity Outage
- **Symptom**: `/readyz` returns 503; tool calls fail with `UPSTREAM_UNAVAILABLE`.
- **Action**: Check network route to `MULTICA_SERVER_URL`. The MCP server automatically retries transient 5xx errors with exponential backoff up to `MULTICA_API_MAX_RETRIES`.

### 3.2. SSE Connection Dropping Behind Nginx
- **Symptom**: AI clients encounter frequent connection resets during streaming.
- **Root Cause**: Nginx buffering or aggressive timeout settings.
- **Resolution**: Ensure `proxy_buffering off;`, `proxy_read_timeout 3600s;`, and `proxy_set_header X-Accel-Buffering "no";` are present in `nginx.conf`.

### 3.3. Out-of-Memory (OOMKilled)
- **Symptom**: Pod exits with code 137.
- **Root Cause**: Excessive memory consumption during large issue batch queries.
- **Resolution**: Enforce server-side pagination (`limit: 50` max) and raise memory limits in `docker-compose.yml` to `1024M`.
