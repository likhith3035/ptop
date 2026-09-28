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
      {/* THE OFFICIAL CERTIFICATE CANVAS                                 */}
      {/* Gradient border design inspired by modern hackathon certificates */}
      {/* ============================================================== */}
      <div 
        id="certificate-print-area"
        className="w-full bg-white rounded-3xl shadow-2xl relative overflow-hidden print:shadow-none print:rounded-none print:w-full print:max-w-none"
        style={{
          boxShadow: "0 25px 60px -12px rgba(0, 41, 112, 0.18)",
        }}
      >
        {/* Gradient Border Frame */}
        <div 
          className="p-[6px] sm:p-[8px] rounded-3xl print:p-[10px] print:rounded-none"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #fda085 100%)",
          }}
        >
          <div className="bg-white rounded-[20px] sm:rounded-[22px] print:rounded-none relative overflow-hidden">
            
            {/* Inner Decorative Border */}
            <div className="absolute inset-4 sm:inset-6 border-2 border-slate-200/70 rounded-2xl pointer-events-none print:inset-5" />
            <div className="absolute inset-5 sm:inset-7 border border-dashed border-slate-200/50 rounded-xl pointer-events-none print:inset-6" />

            {/* Decorative Corner Ornaments */}
            {/* Top-Left */}
            <div className="absolute top-6 left-6 sm:top-8 sm:left-8 w-16 h-16 sm:w-20 sm:h-20 opacity-[0.06] pointer-events-none">
              <svg viewBox="0 0 100 100" fill="none">
                <circle cx="10" cy="10" r="8" fill="#764ba2"/>
                <circle cx="30" cy="10" r="5" fill="#667eea"/>
                <circle cx="10" cy="30" r="5" fill="#f5576c"/>
                <circle cx="50" cy="10" r="3" fill="#fda085"/>
                <circle cx="10" cy="50" r="3" fill="#f093fb"/>
                <path d="M10 10 L50 10 L10 50 Z" fill="#667eea" opacity="0.5"/>
              </svg>
            </div>
            {/* Top-Right */}
            <div className="absolute top-6 right-6 sm:top-8 sm:right-8 w-16 h-16 sm:w-20 sm:h-20 opacity-[0.06] pointer-events-none rotate-90">
              <svg viewBox="0 0 100 100" fill="none">
                <circle cx="10" cy="10" r="8" fill="#764ba2"/>
                <circle cx="30" cy="10" r="5" fill="#667eea"/>
                <circle cx="10" cy="30" r="5" fill="#f5576c"/>
                <circle cx="50" cy="10" r="3" fill="#fda085"/>
                <circle cx="10" cy="50" r="3" fill="#f093fb"/>
                <path d="M10 10 L50 10 L10 50 Z" fill="#667eea" opacity="0.5"/>
              </svg>
            </div>
            {/* Bottom-Left */}
            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 w-16 h-16 sm:w-20 sm:h-20 opacity-[0.06] pointer-events-none -rotate-90">
              <svg viewBox="0 0 100 100" fill="none">
                <circle cx="10" cy="10" r="8" fill="#764ba2"/>
                <circle cx="30" cy="10" r="5" fill="#667eea"/>
                <circle cx="10" cy="30" r="5" fill="#f5576c"/>
                <circle cx="50" cy="10" r="3" fill="#fda085"/>
                <circle cx="10" cy="50" r="3" fill="#f093fb"/>
                <path d="M10 10 L50 10 L10 50 Z" fill="#667eea" opacity="0.5"/>
              </svg>
            </div>
            {/* Bottom-Right */}
            <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 w-16 h-16 sm:w-20 sm:h-20 opacity-[0.06] pointer-events-none rotate-180">
              <svg viewBox="0 0 100 100" fill="none">
                <circle cx="10" cy="10" r="8" fill="#764ba2"/>
                <circle cx="30" cy="10" r="5" fill="#667eea"/>
                <circle cx="10" cy="30" r="5" fill="#f5576c"/>
                <circle cx="50" cy="10" r="3" fill="#fda085"/>
                <circle cx="10" cy="50" r="3" fill="#f093fb"/>
                <path d="M10 10 L50 10 L10 50 Z" fill="#667eea" opacity="0.5"/>
              </svg>
            </div>

            {/* Subtle center watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] pointer-events-none">
              <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full border-[20px] border-[#002970]" />
            </div>

            {/* Certificate Content */}
            <div className="relative z-10 px-8 py-10 sm:px-16 sm:py-14 text-center space-y-6 sm:space-y-8 print:px-14 print:py-12">
              
              {/* Institution Logos Row */}
              <div className="flex items-center justify-center gap-6 sm:gap-10">
                <NbkristLogo className="w-14 h-14 sm:w-[72px] sm:h-[72px]" />
                <div className="flex items-center gap-3 sm:gap-4">
                  <IsteLogo className="w-10 h-10 sm:w-14 sm:h-14" />
                  <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                    <PaytmBadge className="h-5 sm:h-6" />
                  </div>
                </div>
              </div>

              {/* Institution Name */}
              <div className="space-y-1">
                <h3 className="text-[11px] sm:text-sm font-black tracking-[0.15em] text-[#002970] uppercase">
                  N.B.K.R. Institute of Science & Technology
                </h3>
                <p className="text-[9px] sm:text-[11px] text-slate-500 tracking-wider uppercase">
                  Autonomous • Accredited by NAAC with &apos;A&apos; Grade • Affiliated to JNTUA
                </p>
                <p className="text-[9px] sm:text-[11px] font-bold text-slate-700 tracking-wide">
                  Department of Information Technology & AI-DS
                </p>
              </div>

              {/* Certificate Title */}
              <div className="space-y-2 pt-2">
                <h2 
                  className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight"
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f5576c 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Certificate of Participation
                </h2>
              </div>

              {/* Presentation Line */}
              <p className="text-xs sm:text-[15px] text-slate-600 italic">
                This certificate is presented to
              </p>

              {/* ★ Student Name — HERO ★ */}
              <div className="py-1 sm:py-3">
                <div className="relative inline-block">
                  <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-black text-slate-900 tracking-tight px-4">
                    {studentName}
                  </h1>
                  {/* Underline accent */}
                  <div 
                    className="mt-2 h-[3px] sm:h-1 mx-auto rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #667eea 0%, #764ba2 30%, #f5576c 70%, #fda085 100%)",
                      width: "80%",
                    }}
                  />
                </div>
              </div>

              {/* Roll No & Year — Prominent Display */}
              <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Roll No:</span>
                  <span className="text-sm sm:text-lg font-black text-[#002970] font-mono tracking-wide">{rollNumber}</span>
                </div>
                <div className="w-px h-5 bg-slate-300 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Year:</span>
                  <span className="text-sm sm:text-lg font-black text-[#002970]">{year}</span>
                </div>
                <div className="w-px h-5 bg-slate-300 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Branch:</span>
                  <span className="text-sm sm:text-lg font-black text-[#002970]">{branch}</span>
                </div>
              </div>

              {/* Citation Body */}
              <p className="text-[11px] sm:text-sm text-slate-600 leading-relaxed max-w-3xl mx-auto">
                for demonstrating their skills by participating and attending the intensive hands-on technical workshop{" "}
                <strong className="text-[#002970] font-black">
                  &ldquo;PROMPT TO PRODUCTION: PAYTM AI WORKSHOP&rdquo;
                </strong>{" "}
                focusing on Production Prompt Engineering, Generative AI Fullstack Architectures, and Autonomous Developer Workflows,
                conducted at the Main Seminar Hall, N.B.K.R.I.S.T on{" "}
                <span className="font-bold text-slate-900">{certificate.issueDate || "30 September 2026"}</span>.
              </p>

              {/* Signatures & Seal Block */}
              <div className="pt-6 sm:pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 items-end max-w-4xl mx-auto border-t border-slate-200/80">
                
                {/* Signature 1 */}
                <div className="text-center space-y-1 pt-4">
                  <div className="h-8 sm:h-10 flex items-center justify-center text-slate-700 text-xs sm:text-sm italic font-serif">
                    Dr. K. Ramanjaneyulu
                  </div>
                  <div 
                    className="w-20 sm:w-28 mx-auto h-[2px] rounded-full"
                    style={{ background: "linear-gradient(90deg, transparent, #667eea, transparent)" }}
                  />
                  <div className="text-[9px] sm:text-[10px] font-bold text-slate-800 uppercase">Faculty Coordinator</div>
                  <div className="text-[8px] sm:text-[9px] text-slate-500">Dept of IT, NBKRIST</div>
                </div>

                {/* Signature 2 */}
                <div className="text-center space-y-1 pt-4">
                  <div className="h-8 sm:h-10 flex items-center justify-center text-slate-700 text-xs sm:text-sm italic font-serif">
                    Dr. V. Murali
                  </div>
                  <div 
                    className="w-20 sm:w-28 mx-auto h-[2px] rounded-full"
                    style={{ background: "linear-gradient(90deg, transparent, #764ba2, transparent)" }}
                  />
                  <div className="text-[9px] sm:text-[10px] font-bold text-slate-800 uppercase">Head of Department</div>
                  <div className="text-[8px] sm:text-[9px] text-slate-500">Dept of IT & AI&DS</div>
                </div>

                {/* Signature 3 */}
                <div className="text-center space-y-1 pt-4">
                  <div className="h-8 sm:h-10 flex items-center justify-center text-slate-700 text-xs sm:text-sm italic font-serif">
                    Suman Mandal
                  </div>
                  <div 
                    className="w-20 sm:w-28 mx-auto h-[2px] rounded-full"
                    style={{ background: "linear-gradient(90deg, transparent, #f5576c, transparent)" }}
                  />
                  <div className="text-[9px] sm:text-[10px] font-bold text-slate-800 uppercase">Lead AI Engineer</div>
                  <div className="text-[8px] sm:text-[9px] text-slate-500">Resource Speaker, Paytm</div>
                </div>

                {/* Signature 4 */}
                <div className="text-center space-y-1 pt-4">
                  <div className="h-8 sm:h-10 flex items-center justify-center text-slate-700 text-xs sm:text-sm italic font-serif">
                    Dr. P. M. Kishore
                  </div>
                  <div 
                    className="w-20 sm:w-28 mx-auto h-[2px] rounded-full"
                    style={{ background: "linear-gradient(90deg, transparent, #fda085, transparent)" }}
                  />
                  <div className="text-[9px] sm:text-[10px] font-bold text-slate-800 uppercase">Principal</div>
                  <div className="text-[8px] sm:text-[9px] text-slate-500">N.B.K.R.I.S.T (Autonomous)</div>
                </div>

              </div>

              {/* Certificate Footer / Verification Strip */}
              <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-between text-[9px] sm:text-[10px] text-slate-500 border-t border-slate-100 gap-2">
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

      </div>

    </div>
  );
}
