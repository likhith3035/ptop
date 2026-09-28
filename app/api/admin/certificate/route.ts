import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { participantId } = body;

    if (!participantId) {
      return NextResponse.json({ error: "Participant ID is required." }, { status: 400 });
    }

    const cert = dbService.issueCertificate(participantId);
    return NextResponse.json({ success: true, certificate: cert });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
