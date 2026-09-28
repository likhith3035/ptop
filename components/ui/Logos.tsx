import React from "react";
import Image from "next/image";

export function NbkristLogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <div className={`relative shrink-0 flex items-center justify-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/nbkrist-logo.png"
        alt="N.B.K.R. Institute of Science & Technology"
        className="w-full h-full object-contain filter drop-shadow-xs"
      />
    </div>
  );
}

export function IsteLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" stroke="#002970" strokeWidth="4" fill="#FFFFFF" />
      <circle cx="50" cy="50" r="40" stroke="#F59E0B" strokeWidth="2" />
      <circle cx="50" cy="50" r="28" stroke="#002970" strokeWidth="3" fill="#F8FAFC" />
      <path d="M47 38c0-8 6-12 6-12s-1 6 2 9c2 2 1 5-2 6-3 1-6-1-6-3z" fill="#EF4444" />
      <path d="M46 44h8l-2 16h-4z" fill="#002970" />
      <text x="50" y="74" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#002970" fontFamily="sans-serif">
        ISTE
      </text>
    </svg>
  );
}

export function PaytmBadge({ className = "h-6" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-0.5 font-black tracking-tighter ${className}`}>
      <span className="text-[#002970] text-base">Pay</span>
      <span className="text-[#00BAF2] text-base">tm</span>
    </div>
  );
}

export function MicrosoftBadge({ className = "h-5" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
        <div className="bg-[#F25022]"></div>
        <div className="bg-[#7FBA00]"></div>
        <div className="bg-[#00A4EF]"></div>
        <div className="bg-[#FFB900]"></div>
      </div>
      <span className="font-semibold text-slate-800 text-xs tracking-tight">Microsoft</span>
    </div>
  );
}
