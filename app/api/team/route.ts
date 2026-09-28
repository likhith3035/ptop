import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, teamName, inviteCode, userId } = body;

    const effectiveUserId = userId || "usr_demo_1";

    if (action === "create") {
      if (!teamName || typeof teamName !== "string" || teamName.trim().length < 3) {
        return NextResponse.json({ error: "Team name must be at least 3 characters." }, { status: 400 });
      }
      const result = dbService.createTeam(teamName.trim(), effectiveUserId);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, team: result.team });
    }

    if (action === "join") {
      if (!inviteCode || typeof inviteCode !== "string") {
        return NextResponse.json({ error: "Valid team invite code is required." }, { status: 400 });
      }
      const result = dbService.joinTeam(inviteCode.trim(), effectiveUserId);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, team: result.team });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
