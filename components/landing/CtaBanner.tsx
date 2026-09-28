import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Ticket } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-r from-[#002970] via-[#0056D2] to-[#003ea1] text-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold text-sky-200 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
          <span>Limited to 100 Students • Seats Filling Quickly</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Ready to Build Your First <br />
          <span className="text-[#FACC15]">Production AI Application?</span>
        </h2>

        <p className="mt-4 text-base sm:text-lg text-sky-100 max-w-2xl mx-auto leading-relaxed">
          Join us on <strong>30 September 2026</strong> at Seminar Hall, New CSE Block. Get hands-on mentorship, collaborate in teams, and earn an authorized ISTE certificate.
        </p>

        {/* Pricing Summary */}
        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/15 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-200">ISTE Member Fee:</span>
            <span className="font-extrabold text-[#FACC15] text-base">₹50</span>
          </div>
          <span className="text-white/40">|</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-200">Non-ISTE Fee:</span>
            <span className="font-extrabold text-white text-base">₹100</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-[#002970] font-bold text-sm shadow-xl transition-all active:scale-[0.98]"
          >
            <Ticket className="w-4 h-4 text-[#0056D2]" />
            <span>Register Now for Workshop</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
          >
            <span>Access Participant Portal</span>
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-sky-200">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Instant Digital QR Ticket</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Secure Razorpay Gateway</span>
          </div>
        </div>

      </div>
    </section>
  );
}
