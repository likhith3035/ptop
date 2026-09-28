import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { DigitalTicket } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticket } = body as { ticket: DigitalTicket };

    if (!ticket || !ticket.registrationNumber) {
      return NextResponse.json({ error: "Invalid ticket payload" }, { status: 400 });
    }

    dbService.syncTicket(ticket);
    return NextResponse.json({ success: true, message: "Ticket synced successfully" });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
