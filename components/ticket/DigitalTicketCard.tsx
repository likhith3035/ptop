"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { DigitalTicket } from "@/types";
import { NbkristLogo, IsteLogo, PaytmBadge } from "@/components/ui/Logos";
import { downloadCalendarEvent } from "@/lib/calendar";
import QRCode from "qrcode";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Download, 
  Printer, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Laptop,
  Share2,
  Lock
} from "lucide-react";

export function DigitalTicketCard({ ticket }: { ticket: DigitalTicket }) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ticket.qrToken) {
      QRCode.toDataURL(ticket.qrToken, {
        width: 280,
        margin: 1.5,
        color: {
          dark: "#002970",
          light: "#FFFFFF",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("QR Generation error", err));
    }
  }, [ticket.qrToken]);

  const handlePrint = () => {
    window.print();
  };

  const isCheckedIn = ticket.attendanceStatus === "checked_in";

  return (
    <div className="space-y-6">
      
      {/* Top Banner Alert */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong>Registration Confirmed & Verified!</strong> Your official entry ticket has been issued.
          </span>
        </div>
        <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-emerald-200/70 text-emerald-950 font-bold text-xs font-mono">
          {ticket.registrationNumber}
        </span>
      </div>

      {/* Printable Digital Ticket Card */}
      <div
        ref={ticketRef}
        className="rounded-3xl border border-slate-200/90 bg-white shadow-xl overflow-hidden print:shadow-none print:border-slate-400 holo-card-sheen"
      >
        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-[#002970] via-[#0056D2] to-[#00BAF2] p-6 sm:p-8 text-white relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <NbkristLogo className="w-14 h-14 bg-white p-1.5 rounded-2xl shadow-sm" />
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-sky-200">
                  N.B.K.R. Institute of Science & Technology
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                  Prompt to Production
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-semibold text-white/95">Paytm AI Workshop</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/20 font-mono font-bold">
                    Official Entry Pass
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end">
              <IsteLogo className="w-10 h-10 rounded-full bg-white p-0.5" />
              <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider mt-1">
                ISTE Chapter
              </span>
            </div>
          </div>
        </div>

        {/* Ticket Body: Two-Column Pass Layout */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white">
          
          {/* Left Column: Participant Details */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Participant Name
              </span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                {ticket.participantName}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Roll Number
                </span>
                <span className="text-sm font-bold text-slate-800 font-mono">
                  {ticket.rollNumber}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Branch & Year
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {ticket.branch} • {ticket.year}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Registration Ref
                </span>
                <span className="text-sm font-bold text-[#0056D2] font-mono">
                  {ticket.registrationNumber}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0056D2] shrink-0" />
                <span className="font-semibold text-slate-900">30 September 2026 (Wednesday)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0056D2] shrink-0" />
                <span>9:00 AM – 4:00 PM (Reporting at 8:45 AM)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0056D2] shrink-0" />
                <span>Seminar Hall, New CSE Block, NBKRIST Vidyanagar</span>
              </div>
            </div>

            {/* Attendance Status Pill */}
            <div className="flex items-center gap-3 pt-1">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                  isCheckedIn
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-amber-100 text-amber-800 border border-amber-300"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isCheckedIn ? "bg-emerald-600" : "bg-amber-500 animate-pulse"
                  }`}
                />
                <span>{isCheckedIn ? "Checked In at Venue" : "Pending Check-in on Event Day"}</span>
              </div>

              {ticket.isIsteMember && (
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                  ISTE Member Pass
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Secure High-Contrast QR Code */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-200">
              {qrDataUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={qrDataUrl}
                  alt={`QR Ticket for ${ticket.participantName}`}
                  className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
                  Generating QR...
                </div>
              )}
            </div>

            <div className="mt-3 text-xs font-bold text-slate-800 font-mono tracking-wider">
              {ticket.ticketNumber}
            </div>

            <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] leading-tight">
              Present this QR to coordinator at Seminar Hall entrance.
            </p>

            <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-400">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Cryptographically signed ticket token</span>
            </div>
          </div>

        </div>

        {/* Ticket Perforation / Barcode Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-dashed border-slate-300 flex items-center justify-between text-[11px] text-slate-600">
          <span>Department of IT & AI&DS • In Association with ISTE</span>
          <span className="font-mono">{ticket.id}</span>
        </div>
      </div>

      {/* Ticket Action Buttons (Hidden when printing) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              `🎓 Here is my official Digital Entry Pass for Prompt to Production — Paytm AI Workshop at NBKRIST!\n\nStudent: ${ticket.participantName} (${ticket.rollNumber})\nRegistration: ${ticket.registrationNumber}\nTicket: ${ticket.ticketNumber}\nDate: 30 September 2026\nVenue: Seminar Hall, New CSE Block\n\nView Pass & QR Code: ${typeof window !== "undefined" ? window.location.href : ""}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-all active:scale-[0.98]"
          >
            <Share2 className="w-4 h-4" />
            <span>Share on WhatsApp</span>
          </a>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-all active:scale-[0.98]"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={downloadCalendarEvent}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs shadow-xs transition-all active:scale-[0.98]"
          >
            <Calendar className="w-4 h-4 text-[#0056D2]" />
            <span>Add to Calendar</span>
          </button>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0056D2] hover:bg-[#0041a3] text-white font-semibold text-xs shadow-xs transition-all"
        >
          <span>Go to Participant Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
