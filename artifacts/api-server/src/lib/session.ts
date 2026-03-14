import type { Request } from "express";

export function resolveSessionId(req: Request, fallback?: string): string | null {
  if (req.isAuthenticated()) {
    return req.user.id;
  }
  return fallback || null;
}
