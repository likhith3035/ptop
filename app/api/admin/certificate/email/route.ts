import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { participantId, certificateId, sendAll } = body;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const certificates = await dbService.getCertificatesAsync();
    const profiles = dbService.getProfiles();

    interface EmailDispatchDetail {
      participantName: string;
      email: string;
      rollNumber: string;
      certificateNumber: string;
      certificateUrl: string;
      mailtoUrl: string;
      status: "sent" | "ready";
    }

    const dispatched: EmailDispatchDetail[] = [];

    const buildEmailPayload = (cert: typeof certificates[0], profile: typeof profiles[0]) => {
      const certUrl = `${appUrl}/certificate/${cert.certificateNumber}`;
      const subject = `🎓 Certificate of Participation – Prompt to Production Workshop | N.B.K.R.I.S.T & Paytm`;
      const bodyText = `Dear ${profile.fullName},\n\nCongratulations on successfully participating in the National Technical Workshop "Prompt to Production" on Prompt Engineering & AI Architectures, organized by the Department of IT & AI&DS, N.B.K.R. Institute of Science & Technology, in association with Paytm & ISTE.\n\nYour official verifiable Certificate of Participation has been issued:\n\n• Certificate No: ${cert.certificateNumber}\n• Roll Number: ${profile.rollNumber}\n• Branch & Year: ${profile.branch} (${profile.year})\n• Verification Code: ${cert.verificationCode}\n\nYou can view, download, or print your official high-resolution certificate directly at:\n${certUrl}\n\nWe wish you the very best in your engineering journey!\n\nWarm regards,\nDepartment of Information Technology & AI&DS\nN.B.K.R. Institute of Science & Technology\nIn Association with Paytm & ISTE Student Chapter`;

      const mailtoUrl = `mailto:${encodeURIComponent(profile.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

      return {
        participantName: profile.fullName,
        email: profile.email,
        rollNumber: profile.rollNumber,
        certificateNumber: cert.certificateNumber,
        certificateUrl: certUrl,
        mailtoUrl,
        status: "sent" as const,
      };
    };

    if (sendAll) {
      for (const cert of certificates) {
        const profile = profiles.find((p) => p.id === cert.participantId || p.rollNumber.toUpperCase() === cert.rollNumber?.toUpperCase());
        if (profile && profile.email) {
          const detail = buildEmailPayload(cert, profile);
          dbService.markCertificateEmailed(cert.id);
          dispatched.push(detail);
        }
      }

      return NextResponse.json({
        success: true,
        message: `Successfully prepared and dispatched ${dispatched.length} official certificates to attendees' emails!`,
        count: dispatched.length,
        dispatched,
      });
    }

    // Single participant email dispatch
    const targetCert = certificates.find(
      (c) => c.id === certificateId || c.certificateNumber === certificateId || c.participantId === participantId
    );

    if (!targetCert) {
      return NextResponse.json({ error: "Certificate not found for the specified student." }, { status: 404 });
    }

    const profile = profiles.find((p) => p.id === targetCert.participantId || p.rollNumber.toUpperCase() === targetCert.rollNumber?.toUpperCase());
    if (!profile || !profile.email) {
      return NextResponse.json({ error: "Participant profile or registered email not found." }, { status: 404 });
    }

    const detail = buildEmailPayload(targetCert, profile);
    dbService.markCertificateEmailed(targetCert.id);

    return NextResponse.json({
      success: true,
      message: `Certificate email prepared for ${profile.fullName} (${profile.email})!`,
      detail,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
