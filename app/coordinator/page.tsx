import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QrScanner } from "@/components/coordinator/QrScanner";
import { dbService } from "@/lib/db";
import { requireCoordinatorSession } from "@/lib/auth";
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  Search, 
  ShieldCheck, 
  HelpCircle, 
  Laptop,
  Check,
  LogOut
} from "lucide-react";
import Link from "next/link";

export default async function CoordinatorDashboardPage() {
  // STRICT CONFIDENTIAL GUARD: Zero bypass permitted.
  // Direct access is blocked; unauthenticated requests are redirected immediately to /login.
  const session = await requireCoordinatorSession();

  const stats = dbService.getAdminStats();
  const tickets = dbService.getTickets();
  const profiles = dbService.getProfiles();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-200/80 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-[#0056D2]">
                  Staff Portal
                </span>
                <span className="text-xs text-slate-500">• Seminar Hall Entrance Desk</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Coordinator Operations Console
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                N.B.K.R. Institute of Science & Technology • Dept of IT & AI&DS
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Authorized: {session.identifier}</span>
              </span>

              <a
                href="/api/auth/logout"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-slate-700 text-xs font-bold shadow-xs transition-all"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Sign Out</span>
              </a>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Checked In Today</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-600 mt-2">
                {stats.checkedInParticipants}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                of {stats.confirmedRegistrations} confirmed students
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Pending Check-in</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-3xl font-black text-amber-600 mt-2">
                {Math.max(0, stats.confirmedRegistrations - stats.checkedInParticipants)}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Expected at entrance desk</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Total Registered</span>
                <Users className="w-4 h-4 text-[#0056D2]" />
              </div>
              <div className="text-3xl font-black text-slate-900 mt-2">
                {stats.confirmedRegistrations}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Capacity: {stats.capacity} seats</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Support Inquiries</span>
                <HelpCircle className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-3xl font-black text-indigo-600 mt-2">
                {stats.openSupportTickets}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Participant requests</p>
            </div>
          </div>

          {/* Main Workspace Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 7 Columns: Scanner Component */}
            <div className="lg:col-span-7 space-y-6">
              <QrScanner />
            </div>

            {/* Right 5 Columns: Participant Registry List */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">
                    Live Check-in Registry ({tickets.length})
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">Real-time status</span>
                </div>

                <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto mt-2">
                  {tickets.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs">
                      <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700">No Participants Registered Yet</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Attendee roster will automatically populate here in real-time as students register.
                      </p>
                    </div>
                  ) : (
                    tickets.map((t) => {
                      const isChecked = t.attendanceStatus === "checked_in";
                      return (
                        <div key={t.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="font-bold text-slate-900">{t.participantName}</div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {t.rollNumber} • {t.branch} ({t.year})
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            {isChecked ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                <Check className="w-3 h-3" />
                                <span>Checked In</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium text-[10px]">
                                Pending
                              </span>
                            )}
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {t.registrationNumber}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
