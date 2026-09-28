"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Printer, 
  Share2, 
  Check, 
  ArrowLeft, 
  Award, 
  ShieldCheck, 
  ExternalLink,
  Mail,
  Download
} from "lucide-react";
import { CertificateItem, ParticipantProfile } from "@/types";
import { NbkristLogo, IsteLogo, PaytmBadge } from "@/components/ui/Logos";

interface CertificateViewProps {
  certificate: CertificateItem;
  profile?: ParticipantProfile;
  appUrl: string;
}

export function CertificateView({ certificate, profile, appUrl }: CertificateViewProps) {
  const [copied, setCopied] = useState(false);

  const verificationUrl = `${appUrl}/certificate/${certificate.certificateNumber}`;
  const studentName = profile?.fullName || certificate.participantName;
  const rollNumber = profile?.rollNumber || certificate.rollNumber || "VERIFIED ATTENDEE";
  const branch = profile?.branch || certificate.branch || "Information Technology";
  const year = profile?.year || "B.Tech";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const emailSubject = encodeURIComponent(`🎓 Certificate of Participation – Prompt to Production Paytm AI Workshop`);
  const emailBody = encodeURIComponent(
    `Hello ${studentName},\n\nHere is your official verified Certificate of Participation for the Prompt to Production Workshop conducted by N.B.K.R.I.S.T in association with Paytm & ISTE:\n\nCertificate No: ${certificate.certificateNumber}\nRoll No: ${rollNumber}\nVerification Link: ${verificationUrl}\n\nCongratulations!`
  );
  const mailtoLink = `mailto:${encodeURIComponent(profile?.email || "")}?subject=${emailSubject}&body=${emailBody}`;

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar (Hidden during printing) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Official Credential
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {certificate.certificateNumber}
              </span>
            </div>
            <h1 className="text-sm font-bold text-slate-900 mt-0.5">
              Verified Certificate of Participation
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? "Link Copied!" : "Copy Share Link"}</span>
          </button>

          {profile?.email && (
            <a
              href={mailtoLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-800 text-xs font-semibold transition-all"
            >
              <Mail className="w-3.5 h-3.5 text-[#0056D2]" />
              <span>Email Certificate</span>
            </a>
          )}

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0056D2] hover:bg-[#0041a3] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF (A4)</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* THE OFFICIAL CERTIFICATE CANVAS (A4 Landscape Optimized)        */}
      {/* ============================================================== */}
      <div 
        id="certificate-print-area"
        className="w-full bg-white rounded-3xl border-4 border-[#C8A251] shadow-2xl relative overflow-hidden p-8 sm:p-14 text-center print:border-8 print:p-12 print:shadow-none print:rounded-none print:w-full print:max-w-none"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 41, 112, 0.15)",
        }}
      >
        {/* Ornate Inner Double Border */}
        <div className="absolute inset-3 sm:inset-5 border-2 border-[#C8A251]/60 pointer-events-none rounded-2xl print:inset-4" />
        <div className="absolute inset-5 sm:inset-7 border border-[#002970]/15 pointer-events-none rounded-xl print:inset-6" />

        {/* Subtle Watermark Institutional Crest */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
          <div className="w-96 h-96 rounded-full border-16 border-[#002970]" />
        </div>

        {/* Certificate Content Wrapper */}
        <div className="relative z-10 space-y-6">
          
          {/* Institution Logos & Banner */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200/80 max-w-4xl mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
              <NbkristLogo className="w-full h-full object-contain" />
            </div>

            <div className="flex-1 text-center">
              <span className="text-[10px] sm:text-xs font-black tracking-widest text-[#002970] uppercase block">
                N.B.K.R. Institute of Science & Technology
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 block uppercase tracking-wider">
                Autonomous • Accredited by NAAC with &apos;A&apos; Grade • Affiliated to JNTUA
              </span>
              <span className="text-[9px] sm:text-[11px] font-bold text-slate-800 block mt-0.5">
                Department of Information Technology & Department of AI & DS
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                <IsteLogo className="w-full h-full object-contain" />
              </div>
              <div className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                <PaytmBadge className="h-5" />
              </div>
            </div>
          </div>

          {/* Certificate Main Title */}
          <div className="space-y-1.5 pt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[10px] sm:text-xs font-black uppercase tracking-widest">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>National Level Technical Workshop</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#002970] tracking-tight uppercase font-serif">
              Certificate of Participation
            </h2>

            <p className="text-xs sm:text-sm font-serif italic text-slate-600 max-w-xl mx-auto">
              This is to certify and honor the commendable active participation of
            </p>
          </div>

          {/* Participant Name (Hero Highlight) */}
          <div className="py-2 sm:py-4">
            <div className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight underline decoration-[#C8A251] decoration-3 underline-offset-8">
              {studentName}
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold text-slate-600 mt-3 flex items-center justify-center gap-3">
              <span>Roll No: {rollNumber}</span>
              <span>•</span>
              <span>{branch}</span>
              <span>•</span>
              <span>{year}</span>
            </div>
          </div>

          {/* Citation Body */}
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl mx-auto text-center font-serif">
            for successfully attending the intensive hands-on technical workshop{" "}
            <strong className="text-[#002970] font-sans font-black">
              &ldquo;PROMPT TO PRODUCTION: PAYTM AI WORKSHOP&rdquo;
            </strong>{" "}
            focusing on Production Prompt Engineering, Generative AI Fullstack Architectures, and Autonomous Developer Workflows, conducted at the Main Seminar Hall, N.B.K.R.I.S.T on{" "}
            <span className="font-bold text-slate-900 font-sans">{certificate.issueDate || "11 April 2026"}</span>.
          </p>

          {/* Signatures & Seal Block */}
          <div className="pt-8 sm:pt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 items-end max-w-4xl mx-auto border-t border-slate-200/80">
            
            {/* Signature 1 */}
            <div className="text-center space-y-1">
              <div className="h-10 flex items-center justify-center font-serif italic text-slate-700 text-sm">
                Dr. K. Ramanjaneyulu
              </div>
              <div className="w-28 mx-auto border-b border-slate-400" />
              <div className="text-[10px] font-bold text-slate-800 uppercase">Faculty Coordinator</div>
              <div className="text-[9px] text-slate-500">Dept of IT, NBKRIST</div>
            </div>

            {/* Signature 2 */}
            <div className="text-center space-y-1">
              <div className="h-10 flex items-center justify-center font-serif italic text-slate-700 text-sm">
                Dr. V. Murali
              </div>
              <div className="w-28 mx-auto border-b border-slate-400" />
              <div className="text-[10px] font-bold text-slate-800 uppercase">Head of Department</div>
              <div className="text-[9px] text-slate-500">Dept of IT & AI&DS</div>
            </div>

            {/* Signature 3 */}
            <div className="text-center space-y-1">
              <div className="h-10 flex items-center justify-center font-serif italic text-slate-700 text-sm">
                Suman Mandal
              </div>
              <div className="w-28 mx-auto border-b border-slate-400" />
              <div className="text-[10px] font-bold text-slate-800 uppercase">Lead AI Engineer</div>
              <div className="text-[9px] text-slate-500">Resource Speaker, Paytm</div>
            </div>

            {/* Signature 4 */}
            <div className="text-center space-y-1">
              <div className="h-10 flex items-center justify-center font-serif italic text-slate-700 text-sm">
                Dr. P. M. Kishore
              </div>
              <div className="w-28 mx-auto border-b border-slate-400" />
              <div className="text-[10px] font-bold text-slate-800 uppercase">Principal</div>
              <div className="text-[9px] text-slate-500">N.B.K.R.I.S.T (Autonomous)</div>
            </div>

          </div>

          {/* Certificate Footer / Verification Strip */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 border-t border-slate-100 gap-2">
            <div className="flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verifiable Credential: {certificate.verificationCode}</span>
            </div>
            
            <div className="font-mono">
              Certificate No: <strong className="text-slate-800">{certificate.certificateNumber}</strong>
            </div>

            <div className="text-slate-400">
              Verified & Issued under Institutional Seal
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
