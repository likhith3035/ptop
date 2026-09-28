import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Ticket ID or Registration Number required." }, { status: 400 });
    }

    const ticket = await dbService.getTicketAsync(id);

    if (!ticket) {
      return NextResponse.json({ error: `Ticket matching "${id}" not found.` }, { status: 404 });
    }

    return NextResponse.json({ success: true, ticket });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
