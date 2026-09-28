import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, category, subject, message } = body;

    const effectiveUserId = userId || "usr_demo_1";

    if (!subject || subject.trim().length < 4) {
      return NextResponse.json({ error: "Please enter a specific subject for your inquiry." }, { status: 400 });
    }

    if (!message || message.trim().length < 10) {
      return NextResponse.json({ error: "Please provide detailed details in your message." }, { status: 400 });
    }

    const ticket = dbService.createSupportTicket(
      effectiveUserId,
      category || "Other",
      subject,
      message
    );

    return NextResponse.json({ success: true, ticket });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
