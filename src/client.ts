import { randomUUID } from "node:crypto";
import type { ExecutionContext, ResultEnvelope } from "./types.js";

const SECRET_KEYS = /token|secret|password|authorization|api[-_]?key/i;

export function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        SECRET_KEYS.test(key) ? "[REDACTED]" : redact(item),
      ])
    );
  }
  return value;
}

export interface MulticaClientOptions {
  baseUrl: string;
  token?: string;
  fetchImpl?: typeof fetch;
}

export class MulticaClient {
  private readonly fetchImpl: typeof fetch;

  constructor(private readonly options: MulticaClientOptions) {
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async execute(
    command: { method: string; path: string },
    args: Record<string, unknown>,
    context: ExecutionContext
  ): Promise<ResultEnvelope> {
    const query =
      command.method === "GET"
        ? `?${new URLSearchParams(
            Object.entries(args)
              .filter(([, value]) => value !== undefined)
              .map(([key, value]) => [key, String(value)] as [string, string])
          )}`
        : "";
    const url = new URL(
      `${command.path}${query}`,
      this.options.baseUrl.endsWith("/")
        ? this.options.baseUrl
        : `${this.options.baseUrl}/`
    );
    const body = command.method === "GET" ? undefined : JSON.stringify(args);
    const headers: Record<string, string> = {
      accept: "application/json",
      "x-request-id": randomUUID(),
      "x-connection-id": context.connectionId,
    };
    if (body) headers["content-type"] = "application/json";
    if (this.options.token) headers.authorization = `Bearer ${this.options.token}`;

    const response = await this.fetchImpl(url, {
      method: command.method,
      headers,
      body,
    });
    const requestId =
      response.headers.get("x-request-id") ?? headers["x-request-id"];
    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      payload = undefined;
    }

    if (!response.ok) {
      const error =
        payload && typeof payload === "object"
          ? (payload as Record<string, unknown>)
          : {};
      throw new Error(
        JSON.stringify({
          code:
            error.code ??
            (response.status === 401
              ? "AUTH_REQUIRED"
              : response.status === 403
              ? "FORBIDDEN"
              : "UPSTREAM_ERROR"),
          retryable: response.status >= 500 || response.status === 429,
          safe_message: error.safe_message ?? "Multica request failed",
          request_id: requestId,
        })
      );
    }

    return {
      ...(payload && typeof payload === "object"
        ? (payload as ResultEnvelope)
        : { data: payload }),
      request_id: requestId,
      state: "succeeded",
      warnings: [],
    };
  }
}
