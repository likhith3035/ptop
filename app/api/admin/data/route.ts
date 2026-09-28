import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { verifyApiSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = verifyApiSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin credentials required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { password, mode, participantId } = body;

    // Strict password verification (must match "delete")
    if (!password || password.trim() !== "delete") {
      return NextResponse.json(
        { error: "Incorrect deletion password. Access denied." },
        { status: 403 }
      );
    }

    if (mode === "all") {
      await dbService.deleteAllData();
      return NextResponse.json({
        success: true,
        message: "All participant records, tickets, attendance, and certificates have been permanently wiped.",
        stats: dbService.getAdminStats(),
      });
    }

    if (mode === "single") {
      if (!participantId || typeof participantId !== "string") {
        return NextResponse.json(
          { error: "participantId is required for individual deletion." },
          { status: 400 }
        );
      }

      const deleted = await dbService.deleteParticipant(participantId);
      if (!deleted) {
        return NextResponse.json(
          { error: "Participant not found." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Participant record permanently deleted.",
        stats: dbService.getAdminStats(),
      });
    }

    return NextResponse.json(
      { error: "Invalid deletion mode. Must be 'all' or 'single'." },
      { status: 400 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
