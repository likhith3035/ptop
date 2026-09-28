import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { verifyApiSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = verifyApiSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Confidential administrator session required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, content, priority } = body;

    if (!title || title.trim().length < 3) {
      return NextResponse.json({ error: "Announcement title is required." }, { status: 400 });
    }

    if (!content || content.trim().length < 5) {
      return NextResponse.json({ error: "Announcement content is required." }, { status: 400 });
    }

    const ann = dbService.createAnnouncement(title, content, priority || "normal");
    return NextResponse.json({ success: true, announcement: ann });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
