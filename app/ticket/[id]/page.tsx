import React from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DigitalTicketCard } from "@/components/ticket/DigitalTicketCard";
import { dbService } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Ticket } from "lucide-react";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Retrieve ticket from server db service by registration number or id
  const ticket =
    dbService.getTicketByRegistrationNumber(id) ||
    dbService.getTickets().find((t) => t.id === id || t.qrToken === id);

  if (!ticket) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Ticket Not Found</h2>
            <p className="text-xs text-slate-500 mt-2">
              No digital ticket matching &ldquo;<span className="font-mono">{id}</span>&rdquo; was found in our verified registry.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/register"
                className="py-2.5 px-4 rounded-xl bg-[#0056D2] text-white font-semibold text-xs shadow-xs"
              >
                Register for Workshop
              </Link>
              <Link
                href="/"
                className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-medium text-xs"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFD] relative overflow-hidden">
      <Navbar />

      {/* Ambient background glows */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-blue-100/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-tech-dots opacity-40 pointer-events-none -z-10" />

      <main className="flex-1 py-10 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back link */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Workshop Overview</span>
            </Link>
          </div>

          <DigitalTicketCard ticket={ticket} />

        </div>
      </main>

      <Footer />
    </div>
  );
}
