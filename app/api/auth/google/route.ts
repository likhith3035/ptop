import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, createSessionToken } from "@/lib/auth";
import { dbService } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, displayName, uid, photoURL } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Valid email is required from Google authentication." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const profiles = dbService.getProfiles();
    const foundProfile = profiles.find(
      (p) => p.email?.toLowerCase() === cleanEmail
    );

    // Resolve user identifier
    const userId = foundProfile ? foundProfile.userId : `usr_g_${uid || Date.now()}`;
    const name = foundProfile ? foundProfile.fullName : (displayName || cleanEmail.split("@")[0]);

    // Create session token
    const token = createSessionToken({
      role: "user",
      identifier: foundProfile ? foundProfile.id : userId,
      name,
      authenticatedAt: Date.now(),
    });

    const isRegistered = Boolean(foundProfile);
    const redirectUrl = isRegistered 
      ? "/dashboard" 
      : `/register?email=${encodeURIComponent(cleanEmail)}&name=${encodeURIComponent(name)}`;

    const response = NextResponse.json({
      success: true,
      redirectUrl: "/dashboard",
      isRegistered,
      profile: foundProfile || null,
      suggestedRedirect: redirectUrl,
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
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
