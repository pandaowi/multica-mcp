import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { MulticaClient } from "./client.js";
import { createServer } from "./server.js";
import { startSseServer } from "./transports/sse.js";

function getClient(): MulticaClient {
  return new MulticaClient({
    baseUrl: process.env.MULTICA_SERVER_URL ?? process.env.MULTICA_API_URL ?? "https://api.multica.dev",
    token: process.env.MULTICA_API_KEY ?? process.env.MULTICA_API_TOKEN,
  });
}

const args = process.argv.slice(2);
const transportArgIndex = args.indexOf("--transport");
const transportFlag = transportArgIndex !== -1 ? args[transportArgIndex + 1] : undefined;
const portArgIndex = args.indexOf("--port");
const portFlag = portArgIndex !== -1 ? Number(args[portArgIndex + 1]) : undefined;
const hostArgIndex = args.indexOf("--host");
const hostFlag = hostArgIndex !== -1 ? args[hostArgIndex + 1] : undefined;

const transportMode = transportFlag ?? process.env.MULTICA_MCP_TRANSPORT ?? "stdio";

if (transportMode === "sse" || transportMode === "http") {
  startSseServer(() => createServer(getClient()), {
    port: portFlag,
    host: hostFlag,
  });
} else {
  const server = createServer(getClient());
  await server.connect(new StdioServerTransport());
}
