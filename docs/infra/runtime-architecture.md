# Container Runtime & Infrastructure Architecture

- **Document ID**: `ARCH-INFRA-001`
- **Scope**: Containerization Topology, Isolation Boundaries, Network Security, and Non-Root Execution
- **Author**: DevOps & SRE Team (`b1000000-0000-0000-0000-000000000004`)
- **Last Verified**: 2026-09-17

---

## 1. Containerization Strategy

The Multica-MCP server container image is designed with a defense-in-depth security approach:

```
┌────────────────────────────────────────────────────────┐
│               Build Stage (node:20-alpine)             │
│   ├── Compiler & Dependencies (npm ci, build)          │
│   └── Artifact compilation (dist/index.js)             │
└──────────────────────────┬─────────────────────────────┘
                           │ Copy artifacts only
┌──────────────────────────▼─────────────────────────────┐
│              Production Runner (node:20-alpine)        │
│   ├── Minimal footprint (~85 MB compressed)            │
│   ├── Unprivileged user (multica:multica UID 10001)    │
│   ├── Process Supervisor: dumb-init (PID 1)            │
│   └── Exposes: Port 3000 (SSE/HTTP) / STDIO            │
└────────────────────────────────────────────────────────┘
```

---

## 2. Security Hardening Controls

1. **Non-Root Execution**:
   - The container runs strictly as user `multica` (UID/GID `10001`).
   - Root privilege escalation is prevented via Docker `security_opt: [no-new-privileges:true]`.
2. **Signal Handling & Zombie Process Reaping**:
   - Wrapped with `dumb-init` to ensure clean shutdown when receiving `SIGTERM` / `SIGINT` from Docker/Kubernetes orchestrators.
3. **Network Isolation**:
   - When deployed in production via Docker Compose or Kubernetes, the backend MCP container resides on an `internal` network with no direct internet exposure, accessible only through the hardened Nginx reverse proxy.
4. **Read-Only Root Filesystem**:
   - Supports execution with `read_only: true` on rootfs, using mounted volumes or tmpfs for `/tmp` and `/app/logs`.
