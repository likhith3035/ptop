import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { verifyApiSession } from "@/lib/auth";
import { syncEventConfigToRtdb } from "@/lib/firebase/rtdb";

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
    const { expectedParticipants, isteFee, nonIsteFee, isRegistrationOpen, isSubmissionOpen } = body;

    const updated = dbService.updateEventConfig({
      expectedParticipants: expectedParticipants !== undefined ? Number(expectedParticipants) : undefined,
      isteFee: isteFee !== undefined ? Number(isteFee) : undefined,
      nonIsteFee: nonIsteFee !== undefined ? Number(nonIsteFee) : undefined,
      isRegistrationOpen: isRegistrationOpen !== undefined ? Boolean(isRegistrationOpen) : undefined,
      isSubmissionOpen: isSubmissionOpen !== undefined ? Boolean(isSubmissionOpen) : undefined,
    });

    syncEventConfigToRtdb({
      isRegistrationOpen: updated.isRegistrationOpen,
      isSubmissionOpen: updated.isSubmissionOpen,
      expectedParticipants: updated.expectedParticipants,
    });

    return NextResponse.json({ success: true, eventConfig: updated });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
