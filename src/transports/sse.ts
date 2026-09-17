import http from "node:http";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export interface SseServerOptions {
  port?: number;
  host?: string;
  endpoint?: string;
}

export function startSseServer(
  serverFactory: () => McpServer,
  options: SseServerOptions = {}
): http.Server {
  const port = options.port ?? Number(process.env.PORT ?? 3000);
  const host = options.host ?? process.env.HOST ?? "0.0.0.0";
  const endpoint = options.endpoint ?? "/message";

  const transports = new Map<string, SSEServerTransport>();

  const httpServer = http.createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

    if (req.method === "GET" && (url.pathname === "/health" || url.pathname === "/healthz")) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", transport: "sse" }));
      return;
    }

    if (req.method === "GET" && url.pathname === "/sse") {
      const transport = new SSEServerTransport(endpoint, res);
      const server = serverFactory();
      transports.set(transport.sessionId, transport);
      transport.onclose = () => {
        transports.delete(transport.sessionId);
      };
      await server.connect(transport);
      return;
    }

    if (req.method === "POST" && url.pathname === endpoint) {
      const sessionId = url.searchParams.get("sessionId");
      if (!sessionId || !transports.has(sessionId)) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Invalid or missing sessionId");
        return;
      }
      const transport = transports.get(sessionId)!;
      await transport.handlePostMessage(req, res);
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  });

  httpServer.listen(port, host, () => {
    console.error(`Multica MCP SSE Server listening on http://${host}:${port}`);
  });

  return httpServer;
}
