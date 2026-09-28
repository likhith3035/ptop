import { NextRequest, NextResponse } from "next/server";
import { 
  AUTH_COOKIE_NAME, 
  ADMIN_PASSWORD, 
  COORDINATOR_PASSWORD, 
  createSessionToken 
} from "@/lib/auth";
import { dbService } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, identifier, password } = body;

    if (!role) {
      return NextResponse.json(
        { error: "Role is required (admin, coordinator, or participant)." },
        { status: 400 }
      );
    }

    // --- ADMIN AUTHENTICATION ---
    if (role === "admin") {
      if (!password || password !== ADMIN_PASSWORD) {
        return NextResponse.json(
          { error: "Invalid admin password. Confidential access restricted." },
          { status: 401 }
        );
      }

      const token = createSessionToken({
        role: "admin",
        identifier: identifier?.trim() || "admin@nbkrist.org",
        name: "Workshop Administrator",
        authenticatedAt: Date.now(),
      });

      const response = NextResponse.json({
        success: true,
        redirectUrl: "/admin",
        role: "admin",
      });

      response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return response;
    }

    // --- COORDINATOR AUTHENTICATION ---
    if (role === "coordinator") {
      if (!password || password !== COORDINATOR_PASSWORD) {
        return NextResponse.json(
          { error: "Invalid coordinator password. Staff access restricted." },
          { status: 401 }
        );
      }

      const token = createSessionToken({
        role: "coordinator",
        identifier: identifier?.trim() || "coordinator@nbkrist.org",
        name: "Event Coordinator",
        authenticatedAt: Date.now(),
      });

      const response = NextResponse.json({
        success: true,
        redirectUrl: "/coordinator",
        role: "coordinator",
      });

      response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return response;
    }

    // --- PARTICIPANT AUTHENTICATION ---
    if (role === "participant") {
      if (!identifier || !identifier.trim()) {
        return NextResponse.json(
          { error: "Please enter your College Roll Number or registered Email." },
          { status: 400 }
        );
      }

      const cleanId = identifier.trim().toLowerCase();
      const profiles = dbService.getProfiles();
      const found = profiles.find(
        (p) =>
          p.rollNumber?.toLowerCase() === cleanId ||
          p.email?.toLowerCase() === cleanId
      );

      const token = createSessionToken({
        role: "user",
        identifier: found ? found.id : cleanId,
        name: found ? found.fullName : cleanId,
        authenticatedAt: Date.now(),
      });

      const response = NextResponse.json({
        success: true,
        redirectUrl: "/dashboard",
        role: "user",
        profile: found || null,
      });

      response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid role specified." }, { status: 400 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
