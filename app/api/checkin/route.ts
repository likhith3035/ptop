import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { verifyApiSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = verifyApiSession(req);
    if (!session || (session.role !== "coordinator" && session.role !== "admin")) {
      return NextResponse.json(
        { error: "Unauthorized. Staff coordinator session required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { token, coordinatorName, pin, confirmCash } = body;

    // Validate Scanner Shift PIN (Option 3)
    if (pin !== "1234") {
      return NextResponse.json(
        { error: "Invalid Scanner PIN. Must be 1234 to authorize gate check-in." },
        { status: 401 }
      );
    }

    if (!token || typeof token !== "string" || token.trim() === "") {
      return NextResponse.json({ error: "QR token or Registration ID is required." }, { status: 400 });
    }

    const operatorName =
      coordinatorName ||
      (session.role === "admin" ? "Admin Desk" : "Volunteer Gate Desk");

    const checkinResult = dbService.checkInParticipant(
      token.trim(),
      operatorName,
      Boolean(confirmCash)
    );

    if (!checkinResult.ticket) {
      return NextResponse.json(
        {
          success: false,
          alreadyCheckedIn: false,
          message: checkinResult.message,
          stats: checkinResult.stats,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: checkinResult.success,
      alreadyCheckedIn: checkinResult.alreadyCheckedIn,
      message: checkinResult.message,
      payment: checkinResult.payment,
      stats: checkinResult.stats,
      ticket: {
        ticketNumber: checkinResult.ticket.ticketNumber,
        registrationNumber: checkinResult.ticket.registrationNumber,
        participantName: checkinResult.ticket.participantName,
        rollNumber: checkinResult.ticket.rollNumber,
        branch: checkinResult.ticket.branch,
        year: checkinResult.ticket.year,
        attendanceStatus: checkinResult.ticket.attendanceStatus,
        checkedInAt: checkinResult.ticket.checkedInAt,
        checkedInBy: checkinResult.ticket.checkedInBy,
        isIsteMember: checkinResult.ticket.isIsteMember,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
