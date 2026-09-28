import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QrScanner } from "@/components/coordinator/QrScanner";
import { ShieldCheck, LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Gate Scanner — Prompt to Production | NBKRIST",
  description: "Live Gate Check-in Scanner for NBKRIST Prompt to Production Workshop",
};

export default async function ScanPage() {
  const session = await getSession();

  // If not logged in as staff (admin or coordinator), redirect to login
  if (!session || (session.role !== "admin" && session.role !== "coordinator")) {
    redirect("/login");
  }

  const roleTitle = session.role === "admin" ? "Administrator" : "Volunteer Coordinator";

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFD] relative overflow-hidden">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Header Action Bar */}
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Link
                href={session.role === "admin" ? "/admin" : "/coordinator"}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                  Gate Admission Scanner
                </h1>
                <p className="text-[11px] text-slate-500">
                  Seminar Hall Entrance • {roleTitle} Shift
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{session.identifier}</span>
              </span>

              <a
                href="/api/auth/logout"
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-slate-600 transition-all"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Full-Feature QrScanner */}
          <QrScanner operatorRole={roleTitle} />

        </div>
      </main>

      <Footer />
    </div>
  );
}
