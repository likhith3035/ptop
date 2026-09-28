import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CertificateView } from "@/components/certificate/CertificateView";
import { dbService } from "@/lib/db";
import Link from "next/link";
import { Award, ArrowLeft } from "lucide-react";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Query certificate by ID, certificateNumber, verificationCode, or roll number
  const certificate = await dbService.getCertificateAsync(id);

  if (!certificate) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-4">
              <Award className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Certificate Not Found</h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              No participation certificate matching &ldquo;<span className="font-mono font-bold text-slate-700">{id}</span>&rdquo; has been issued or published yet.
            </p>
            <p className="text-[11px] text-slate-400 mt-2">
              Certificates are generated and signed post-event for verified attendees who checked in at the Seminar Hall.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/"
                className="py-2.5 px-4 rounded-xl bg-[#0056D2] hover:bg-[#0041a3] text-white font-bold text-xs shadow-xs transition-all"
              >
                Return to Workshop Homepage
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const profile = dbService.getProfiles().find(
    (p) => p.id === certificate.participantId || p.rollNumber.toUpperCase() === certificate.rollNumber?.toUpperCase()
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-1 py-8 sm:py-12 print:p-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 print:max-w-none print:p-0">
          <CertificateView certificate={certificate} profile={profile} appUrl={appUrl} />
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
