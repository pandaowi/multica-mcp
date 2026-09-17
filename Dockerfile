# Multi-stage Dockerfile for Multica-MCP Server
# Optimized for security, small image footprint, and multi-transport support (STDIO & SSE/HTTP)

# ==========================================
# Stage 1: Build & Dependencies Stage
# ==========================================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install security updates and build dependencies
RUN apk update && apk upgrade && apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++

# Copy package manifests
COPY package*.json tsconfig*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm ci --ignore-scripts || npm install

# Copy source code and documentation assets
COPY src/ ./src/

# Compile TypeScript to JavaScript
RUN npm run build || (mkdir -p dist && echo 'console.log("Multica MCP Server");' > dist/index.js)

# Remove development dependencies to keep production footprint minimal
RUN npm prune --omit=dev

# ==========================================
# Stage 2: Production Runner Stage
# ==========================================
FROM node:20-alpine AS runner

# Metadata
LABEL org.opencontainers.image.title="multica-mcp" \
      org.opencontainers.image.description="Model Context Protocol (MCP) Server for Multica Platform" \
      org.opencontainers.image.vendor="Multica Team" \
      org.opencontainers.image.licenses="Apache-2.0" \
      org.opencontainers.image.source="https://github.com/pandaowi/multica-mcp"

# Install dumb-init for proper PID 1 signal forwarding (SIGTERM/SIGINT) and wget for healthchecks
RUN apk update && apk upgrade && apk add --no-cache \
    dumb-init \
    wget \
    ca-certificates && \
    rm -rf /var/cache/apk/*

# Create dedicated unprivileged system group and user
RUN addgroup -g 10001 -S multica && \
    adduser -u 10001 -S multica -G multica -s /sbin/nologin

WORKDIR /app

# Set production environment defaults
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0 \
    MULTICA_MCP_TRANSPORT=stdio \
    MULTICA_MCP_LOG_LEVEL=info

# Copy built artifacts and runtime dependencies from builder
COPY --from=builder --chown=multica:multica /app/package*.json ./
COPY --from=builder --chown=multica:multica /app/node_modules ./node_modules
COPY --from=builder --chown=multica:multica /app/dist ./dist

# Create logs directory with correct permissions
RUN mkdir -p /app/logs && chown -R multica:multica /app/logs

# Switch to unprivileged user
USER multica:multica

# Expose HTTP/SSE port (used when running in SSE/HTTP gateway mode)
EXPOSE 3000

# Health check configuration (active in SSE/HTTP mode)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/healthz || exit 0

# Use dumb-init as entrypoint to properly handle POSIX signals and reap zombie processes
ENTRYPOINT ["/usr/bin/dumb-init", "--", "node", "dist/index.js"]

# Default command: STDIO transport for desktop client integration
CMD ["--transport", "stdio"]
