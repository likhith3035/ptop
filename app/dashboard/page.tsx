import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticipantDashboardClient } from "@/components/dashboard/ParticipantDashboardClient";
import { dbService } from "@/lib/db";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { Ticket, ArrowRight, UserCheck, AlertCircle, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();

  let profile = session?.identifier
    ? dbService.getProfileById(session.identifier) ||
      dbService.getProfileByUserId(session.identifier) ||
      dbService.getProfileByRollNumber(session.identifier) ||
      dbService.getProfileByEmail(session.identifier)
    : undefined;

  // If not logged in or profile not found
  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50/70">
        <Navbar />

        <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6">
          <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0056D2] flex items-center justify-center mx-auto border border-blue-100">
              <Ticket className="w-7 h-7" />
            </div>

            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Participant Dashboard
              </h1>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Please sign in with your registered College Roll Number or Email to access your official Digital Pass, QR code, and workshop submissions.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Link
                href="/login?role=participant"
                className="w-full py-3.5 px-4 rounded-xl bg-[#0056D2] hover:bg-[#0041a3] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In with Roll Number</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/register"
                className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
              >
                New Student? Register Now (₹50 / ₹100)
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const registration = dbService.getRegistrationByUserId(profile.userId) || {
    id: `reg_${profile.id}`,
    registrationNumber: `P2P-2026-${profile.rollNumber.slice(-4)}`,
    userId: profile.userId,
    participantId: profile.id,
    eventId: "evt_p2p_2026",
    amount: profile.isIsteMember ? 50 : 100,
    isIste: profile.isIsteMember,
    paymentMethod: "upi" as const,
    upiReference: "DIRECT_UPI",
    status: "confirmed" as const,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };

  const ticket = dbService.getTicketByUserId(profile.userId) || {
    id: `tkt_${profile.id}`,
    ticketNumber: `TKT-P2P-${profile.rollNumber.slice(-3)}`,
    registrationNumber: registration.registrationNumber,
    participantName: profile.fullName,
    rollNumber: profile.rollNumber,
    branch: profile.branch,
    year: profile.year,
    eventName: "Prompt to Production – Paytm AI Workshop",
    date: "30 September 2026",
    time: "9:00 AM – 4:00 PM",
    venue: "Seminar Hall, New CSE Block",
    qrToken: `tok_${profile.rollNumber}_p2p_2026`,
    isIsteMember: profile.isIsteMember,
    attendanceStatus: "pending" as const,
    createdAt: profile.createdAt,
  };

  const team = dbService.getTeamByUserId(profile.userId);
  const submission = dbService.getSubmissionByUserId(profile.userId);
  const announcements = dbService.getAnnouncements();
  const resources = dbService.getResources();
  const supportTickets = dbService.getSupportTicketsByUserId(profile.userId);
  const certificate = dbService.getCertificateByRollNumber(profile.rollNumber);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ParticipantDashboardClient
            eventConfig={dbService.getEventConfig()}
            profile={profile}
            registration={registration}
            ticket={ticket}
            team={team}
            submission={submission}
            announcements={announcements}
            resources={resources}
            supportTickets={supportTickets}
            certificate={certificate}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
