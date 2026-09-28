import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import crypto from "crypto";

export const AUTH_COOKIE_NAME = "ptop_auth_session";
const AUTH_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || "ptop_event_nbkrist_secret_key_2026";

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ptopadmin";
export const COORDINATOR_PASSWORD = process.env.COORDINATOR_PASSWORD || "ptopcoordinator";

export interface AuthSession {
  role: "admin" | "coordinator" | "user";
  identifier: string;
  name?: string;
  authenticatedAt: number;
}

// Sign session token with HMAC-SHA256
export function createSessionToken(session: AuthSession): string {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

// Verify session token
export function verifySessionToken(token: string): AuthSession | null {
  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", AUTH_SECRET)
      .update(payload)
      .digest("base64url");

    if (signature !== expectedSignature) return null;

    const session: AuthSession = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8")
    );

    // 24 hour session expiration
    if (Date.now() - session.authenticatedAt > 24 * 60 * 60 * 1000) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

// Get current session in a Server Component or Route
export async function getSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

// Server-side strict guard for Admin routes (NO BYPASS)
export async function requireAdminSession(): Promise<AuthSession> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    redirect("/login?role=admin&error=auth_required");
  }

  const session = verifySessionToken(token);
  if (!session || session.role !== "admin") {
    redirect("/login?role=admin&error=admin_unauthorized");
  }

  return session;
}

// Server-side strict guard for Coordinator routes (NO BYPASS)
export async function requireCoordinatorSession(): Promise<AuthSession> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    redirect("/login?role=coordinator&error=auth_required");
  }

  const session = verifySessionToken(token);
  if (!session || (session.role !== "coordinator" && session.role !== "admin")) {
    redirect("/login?role=coordinator&error=coordinator_unauthorized");
  }

  return session;
}

// Helper to verify request session in API routes
export function verifyApiSession(req: NextRequest): AuthSession | null {
  const cookie = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!cookie) return null;
  return verifySessionToken(cookie);
}
