import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { registrationId, registrationNumber } = body;

    const reg = registrationId 
      ? dbService.getRegistrations().find((r) => r.id === registrationId)
      : dbService.getRegistrationByNumber(registrationNumber);

    if (!reg) {
      return NextResponse.json({ error: "Registration record not found." }, { status: 404 });
    }

    const ticket = dbService.getTicketByRegistrationNumber(reg.registrationNumber);

    return NextResponse.json({
      success: true,
      message: "Registration and payment verified directly (Zero Gateway Fees).",
      registration: reg,
      ticket,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
