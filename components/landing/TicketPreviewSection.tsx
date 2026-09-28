"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { NbkristLogo, IsteLogo, PaytmBadge } from "@/components/ui/Logos";
import QRCode from "qrcode";
import { 
  Ticket, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Download,
  Lock
} from "lucide-react";

export function TicketPreviewSection() {
  const [activeDemo, setActiveDemo] = useState<"demo1" | "demo2">("demo1");
  const [qrUrl, setQrUrl] = useState<string>("");

  const demoTickets = {
    demo1: {
      name: "YOUR NAME HERE",
      roll: "22031AXXXX",
      branch: "AI & DS / IT / CSE",
      year: "3rd Year",
      regId: "P2P-2026-SAMPLE",
      ticketNo: "TKT-SAMPLE-01",
      token: "https://ptop-event.nbkrist.org/verify/sample",
      isIste: true,
      status: "pending",
    },
    demo2: {
      name: "STUDENT NAME",
      roll: "23031AXXXX",
      branch: "Information Technology",
      year: "2nd Year",
      regId: "P2P-2026-SAMPLE-2",
      ticketNo: "TKT-SAMPLE-02",
      token: "https://ptop-event.nbkrist.org/verify/sample2",
      isIste: false,
      status: "checked_in",
    },
  };

  const current = demoTickets[activeDemo];

  useEffect(() => {
    QRCode.toDataURL(current.token, {
      width: 240,
      margin: 1,
      color: {
        dark: "#002970",
        light: "#FFFFFF",
      },
    }).then(setQrUrl).catch(console.error);
  }, [current.token]);

  return (
    <section id="ticket-preview" className="py-16 sm:py-20 bg-gradient-to-b from-white via-slate-50/80 to-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0056D2] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            High-Security Digital Credential
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Every Participant Receives an Official Digital QR Entry Pass
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Generated instantaneously upon payment verification. Contains your encrypted check-in token for venue admission at Seminar Hall.
          </p>

          {/* Interactive Toggle for Demo Pass */}
          <div className="mt-5 inline-flex p-1 rounded-xl bg-slate-200/80 border border-slate-300/60 text-xs font-bold">
            <button
              onClick={() => setActiveDemo("demo1")}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeDemo === "demo1" ? "bg-white text-[#0056D2] shadow-xs" : "text-slate-600"
              }`}
            >
              Demo: ISTE Participant
            </button>
            <button
              onClick={() => setActiveDemo("demo2")}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeDemo === "demo2" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
              }`}
            >
              Demo: Checked-in Participant
            </button>
          </div>
        </div>

        {/* Realistic High-Fidelity Hologram Pass Card */}
        <div className="max-w-2xl mx-auto rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden relative holo-card-sheen">
          
          {/* Top Bar with Paytm Blue Gradient */}
          <div className="bg-gradient-to-r from-[#002970] via-[#0056D2] to-[#00BAF2] p-6 text-white relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <NbkristLogo className="w-12 h-12 bg-white/10 p-1 rounded-full" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-sky-200">
                    N.B.K.R. Institute of Science & Technology
                  </div>
                  <h3 className="text-lg font-black tracking-tight mt-0.5">
                    Prompt to Production
                  </h3>
                  <div className="text-xs font-semibold text-white/90">
                    Paytm AI Workshop • Official Admission Pass
                  </div>
                </div>
              </div>

              <div className="text-right">
                <IsteLogo className="w-9 h-9 rounded-full bg-white p-0.5 ml-auto" />
                <span className="text-[10px] text-white/80 font-bold block mt-1 uppercase">
                  ISTE Chapter
                </span>
              </div>
            </div>
          </div>

          {/* Pass Body */}
          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            
            {/* Left Column: Details */}
            <div className="sm:col-span-7 space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Registered Participant
                </span>
                <div className="text-xl font-black text-slate-900">{current.name}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">ROLL NUMBER</span>
                  <span className="font-bold text-slate-800 font-mono">{current.roll}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">BRANCH & YEAR</span>
                  <span className="font-bold text-slate-800">{current.branch} • {current.year}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#0056D2]" />
                  <span className="font-semibold text-slate-900">30 September 2026 (Wednesday)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#0056D2]" />
                  <span>9:00 AM – 4:00 PM (Report 8:45 AM)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#0056D2]" />
                  <span>Seminar Hall, New CSE Block</span>
                </div>
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    current.status === "checked_in"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${current.status === "checked_in" ? "bg-emerald-600" : "bg-amber-500 animate-pulse"}`} />
                  <span>{current.status === "checked_in" ? "Verified & Checked In" : "Pending Check-in at Venue"}</span>
                </span>
                
                {current.isIste && (
                  <span className="text-[10px] font-bold bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
                    ISTE Member Pass
                  </span>
                )}
              </div>
            </div>

            {/* Right Column: Encrypted QR Code */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-200">
                {qrUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={qrUrl} alt="QR Code" className="w-36 h-36 object-contain" />
                ) : (
                  <div className="w-36 h-36 flex items-center justify-center text-xs text-slate-400">Loading...</div>
                )}
              </div>
              <div className="mt-2 font-mono font-bold text-xs text-slate-800">{current.ticketNo}</div>
              <div className="font-mono text-[10px] text-slate-500">{current.regId}</div>
            </div>

          </div>

          {/* Pass Footer */}
          <div className="px-6 py-3 bg-slate-100/90 border-t border-dashed border-slate-300 flex items-center justify-between text-[11px] text-slate-600">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>HMAC-SHA256 Token Protection</span>
            </span>
            <span className="font-mono text-slate-400">NBKRIST-ISTE-2026</span>
          </div>
        </div>

        {/* CTA underneath pass */}
        <div className="text-center mt-8">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#0056D2] hover:bg-[#0041a3] text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
          >
            <span>Register Now to Claim Your Pass</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
