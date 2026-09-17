import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { MulticaClient } from "./client.js";
import { createServer } from "./server.js";

const server = createServer(
  new MulticaClient({
    baseUrl: process.env.MULTICA_SERVER_URL ?? process.env.MULTICA_API_URL ?? "https://api.multica.dev",
    token: process.env.MULTICA_API_KEY ?? process.env.MULTICA_API_TOKEN,
  })
);

await server.connect(new StdioServerTransport());
