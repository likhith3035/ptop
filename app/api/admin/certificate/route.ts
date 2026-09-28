import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";

export async function GET() {
  try {
    const certificates = await dbService.getCertificatesAsync();
    const profiles = dbService.getProfiles();
    const tickets = dbService.getTickets();

    // Map all profiles with attendance and certificate status
    const roster = profiles.map((p) => {
      const ticket = tickets.find(
        (t) => t.rollNumber.toUpperCase() === p.rollNumber.toUpperCase()
      );
      const cert = certificates.find((c) => c.participantId === p.id || c.rollNumber?.toUpperCase() === p.rollNumber.toUpperCase());
      return {
        id: p.id,
        fullName: p.fullName,
        email: p.email,
        rollNumber: p.rollNumber,
        branch: p.branch,
        year: p.year,
        isIsteMember: p.isIsteMember,
        attendanceStatus: ticket?.attendanceStatus || "pending",
        hasCertificate: Boolean(cert),
        certificate: cert || null,
      };
    });

    return NextResponse.json({
      success: true,
      totalParticipants: profiles.length,
      totalCertificates: certificates.length,
      roster,
      certificates,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { participantId, generateAll } = body;

    if (generateAll) {
      const result = await dbService.generateAllCertificates();
      return NextResponse.json({
        success: true,
        message: `Successfully generated ${result.generated} official certificates with verified student names!`,
        generatedCount: result.generated,
        certificates: result.certificates,
      });
    }

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
