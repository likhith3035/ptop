import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DigitalTicketCard } from "@/components/ticket/DigitalTicketCard";
import { TicketNotFoundRecovery } from "@/components/ticket/TicketNotFoundRecovery";
import { dbService } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Award, ExternalLink } from "lucide-react";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Retrieve ticket from server db service or direct Supabase lookup
  const ticket = await dbService.getTicketAsync(id);

  if (!ticket) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <TicketNotFoundRecovery id={id} />
        </main>
        <Footer />
      </div>
    );
  }

  // Check if participant has an issued certificate
  const certificate = dbService.getCertificateByRollNumber(ticket.rollNumber);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFD] relative overflow-hidden">
      <Navbar />

      {/* Ambient background glows */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-blue-100/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-tech-dots opacity-40 pointer-events-none -z-10" />

      <main className="flex-1 py-10 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          {/* Back link */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Workshop Overview</span>
            </Link>
          </div>

          {/* Certificate banner if issued */}
          {certificate && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-50 to-amber-500/10 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                    Official Certificate Issued!
                  </h4>
                  <p className="text-[11px] text-amber-800 font-medium">
                    Certificate No: <span className="font-mono font-bold">{certificate.certificateNumber}</span>
                  </p>
                </div>
              </div>

              <Link
                href={`/certificate/${certificate.certificateNumber}`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-all"
              >
                <span>View & Print Certificate</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          <DigitalTicketCard ticket={ticket} />

        </div>
      </main>

      <Footer />
    </div>
  );
}
