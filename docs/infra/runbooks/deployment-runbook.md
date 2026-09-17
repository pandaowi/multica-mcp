# Deployment & Operational Runbook

- **Document ID**: `RB-INFRA-001`
- **Scope**: Multica-MCP Server Deployment, Container Lifecycle, Reverse Proxy, and Production Rollouts
- **Author**: DevOps & SRE Team (`b1000000-0000-0000-0000-000000000004`)
- **Last Verified**: 2026-09-17

---

## 1. Overview & Supported Topologies

Multica-MCP supports two distinct deployment topologies:
1. **Desktop / Local STDIO Mode**: Executed as a sub-process by desktop AI IDEs (Claude Desktop, Cursor, VS Code, Goose).
2. **Server-Sent Events (SSE) / HTTP Gateway Mode**: Deployed as a high-availability containerized microservice behind an SSL-terminating reverse proxy (Nginx, Traefik, or Cloud Load Balancer).

---

## 2. Deployment Topology A: Local STDIO Mode

### 2.1. Direct NPX Execution
```bash
npx -y @multica/mcp-server --transport stdio
```

### 2.2. Isolated Docker Container STDIO
Running via Docker ensures zero local node environment dependencies:
```bash
docker run -i --rm \
  -e MULTICA_SERVER_URL="https://api.multica.ai" \
  -e MULTICA_API_KEY="sec_api_xxxxxxxx" \
  -e MULTICA_WORKSPACE_ID="7564ba23-2da2-4ece-b009-6e1b1a4ba303" \
  -e MULTICA_MCP_MODE="standard" \
  ghcr.io/pandaowi/multica-mcp:latest \
  --transport stdio
```

---

## 3. Deployment Topology B: Docker Compose with Nginx Reverse Proxy (SSE Mode)

### 3.1. Prerequisites
- Docker Engine >= 24.0.0 & Docker Compose V2
- Valid SSL/TLS Certificate & Private Key (or Let's Encrypt / Certbot setup)
- Upstream Multica platform network accessibility

### 3.2. Step-by-Step Deployment Procedure

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pandaowi/multica-mcp.git /opt/multica-mcp
   cd /opt/multica-mcp
   ```

2. **Configure Environment Secrets**:
   ```bash
   cp .env.example .env.production
   chmod 600 .env.production
   # Edit .env.production with production API keys and Workspace ID
   nano .env.production
   ```

3. **Install SSL Certificates**:
   ```bash
   mkdir -p docker/nginx/ssl
   cp /etc/ssl/certs/multica-mcp.crt docker/nginx/ssl/server.crt
   cp /etc/ssl/private/multica-mcp.key docker/nginx/ssl/server.key
   chmod 600 docker/nginx/ssl/server.key
   ```

4. **Build and Launch the Stack**:
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```

5. **Verify Service Health**:
   ```bash
   docker compose -f docker-compose.prod.yml ps
   curl -I https://localhost/healthz -k
   ```

---

## 4. Deployment Topology C: Kubernetes Production Deployment

### 4.1. Kubernetes Deployment Manifest (`k8s/deployment.yaml`)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: multica-mcp-deployment
  namespace: multica-system
  labels:
    app.kubernetes.io/name: multica-mcp
    app.kubernetes.io/part-of: multica-platform
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: multica-mcp
  template:
    metadata:
      labels:
        app: multica-mcp
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
        runAsGroup: 10001
        fsGroup: 10001
      containers:
        - name: multica-mcp
          image: ghcr.io/pandaowi/multica-mcp:1.0.0
          imagePullPolicy: IfNotPresent
          command: ["/usr/bin/dumb-init", "--", "node", "dist/src/index.js"]
          args: ["--transport", "sse", "--port", "3000", "--host", "0.0.0.0"]
          ports:
            - containerPort: 3000
              name: http-sse
          envFrom:
            - secretRef:
                name: multica-mcp-credentials
            - configMapRef:
                name: multica-mcp-config
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 1000m
              memory: 512Mi
          livenessProbe:
            httpGet:
              path: /healthz
              port: 3000
            initialDelaySeconds: 15
            periodSeconds: 20
          readinessProbe:
            httpGet:
              path: /healthz
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
```

---

## 5. Zero-Downtime Rolling Upgrades

When releasing a new version:
1. Trigger automated CI/CD tag release: `git tag v1.1.0 && git push origin v1.1.0`.
2. Wait for image build and SBOM generation in GitHub Actions.
3. Update Kubernetes image tag or pull latest docker image:
   ```bash
   docker compose -f docker-compose.prod.yml pull multica-mcp
   docker compose -f docker-compose.prod.yml up -d --no-deps --build multica-mcp
   ```
4. Verify graceful SSE reconnection of active clients.
