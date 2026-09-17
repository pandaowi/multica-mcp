import { z } from "zod";

export const RiskClass = z.enum(["read_only", "routine_write", "destructive", "credential", "code_execution", "device_admin"]);
export type RiskClass = z.infer<typeof RiskClass>;

export const ResultEnvelope = z.object({
  operation_id: z.string().optional(),
  state: z.enum(["queued", "running", "awaiting_user_action", "succeeded", "failed", "cancelled", "outcome_unknown"]).default("succeeded"),
  data: z.unknown().optional(),
  warnings: z.array(z.string()).default([]),
  next_cursor: z.string().nullable().optional(),
  cli_version: z.string().optional(),
  request_id: z.string().optional()
});
export type ResultEnvelope = z.infer<typeof ResultEnvelope>;

export const ErrorEnvelope = z.object({
  code: z.string(), retryable: z.boolean().default(false), safe_message: z.string(), field_errors: z.record(z.string()).optional()
});

export interface CommandDefinition<T extends z.ZodTypeAny = z.ZodTypeAny> {
  commandId: string;
  title: string;
  description: string;
  inputSchema: T;
  risk: RiskClass;
  requiresWorkspace: boolean;
  requiresDevice: boolean;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
}

export interface ExecutionContext {
  principalId: string;
  connectionId: string;
  workspaceId?: string;
  readOnly?: boolean;
  deviceId?: string;
}
