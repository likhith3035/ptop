import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { ShieldCheck, Calendar, MapPin, Users, HelpCircle, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { NbkristLogo, IsteLogo } from "@/components/ui/Logos";

export const metadata = {
  title: "Register — Prompt to Production | Paytm AI Workshop",
  description: "Secure your pass for the Prompt to Production Paytm AI Workshop on 30 September 2026 at NBKRIST.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFD] relative overflow-hidden">
      <Navbar />

      {/* Ambient background glows */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-blue-100/40 via-sky-50/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-tech-dots opacity-40 pointer-events-none -z-10" />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Top Eyebrow & Hero Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-4">
            
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/90 shadow-2xs backdrop-blur-md">
              <NbkristLogo className="w-4 h-4" />
              <span className="text-[11px] font-extrabold text-[#002970] tracking-wide uppercase">
                NBKRIST • Department of IT & AI&DS
              </span>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700">
                <IsteLogo className="w-3.5 h-3.5 rounded-full bg-white" />
                <span>ISTE Chapter</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Prompt to Production <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#002970] via-[#0056D2] to-[#00BAF2] bg-clip-text text-transparent">
                Workshop Pass Registration
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Step into the future of software engineering. Learn Prompt Engineering and AI architectures directly from leaders at Paytm & Microsoft, build in an afternoon sprint, and earn your verified certificate.
            </p>

            {/* Quick Meta Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-semibold text-slate-700">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-[#0056D2]" />
                <span>30 September 2026 (Wednesday)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-[#0056D2]" />
                <span>9:00 AM – 4:00 PM</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-[#0056D2]" />
                <span>Seminar Hall, New CSE Block</span>
              </span>
            </div>

          </div>

          {/* Interactive Registration Form & Live Pass Materialization */}
          <RegistrationForm />

          {/* Bottom Guidelines & Help Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5">
              <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0056D2]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">
                Official Credentialing
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your entry ticket features a cryptographically unique QR token. Present it upon arrival at Seminar Hall for high-speed automated check-in.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">
                Team Build Challenge
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Teams of 2 to 4 students can compete in the 90-minute hands-on build. You can form or invite teammates in your student dashboard after enrolling.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">
                Need Assistance?
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Have questions regarding ISTE membership or payment confirmation? Reach out to the Faculty & Student Desk at <strong className="text-slate-800">it_aids@nbkrist.org</strong>.
              </p>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
