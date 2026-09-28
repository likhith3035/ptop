import React from "react";
import Link from "next/link";
import { NbkristLogo, IsteLogo, PaytmBadge } from "@/components/ui/Logos";
import { MapPin, Calendar, Clock, Mail, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Institutional & Event Identity */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <NbkristLogo className="w-14 h-14 bg-white p-1.5 rounded-2xl shadow-sm" />
              <div>
                <h3 className="text-white font-bold text-sm tracking-tight leading-tight">
                  N.B.K.R. Institute of Science & Technology
                </h3>
                <p className="text-xs text-sky-400 font-medium">Department of IT & AI&DS</p>
                <p className="text-[11px] text-slate-400">Autonomous • Accredited by NAAC & NBA</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mt-1">
              <strong>Prompt to Production</strong> — an intensive, one-day AI workshop organized in association with the <strong>ISTE Student Chapter</strong>, bringing industry engineering standards from Paytm and Microsoft to students.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <IsteLogo className="w-8 h-8 rounded-full bg-white p-0.5" />
              <div className="text-[11px] text-slate-300">
                <span className="font-semibold text-white">ISTE Approved</span>
                <span className="block text-slate-400">Institutional Student Chapter</span>
              </div>
            </div>
          </div>

          {/* Col 2: Event Logistics */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Event Details</h4>
            <div className="flex flex-col gap-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-white">30 September 2026</span>
                  <span className="block text-slate-400">Wednesday (Full Day Workshop)</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-white">9:00 AM – 4:00 PM</span>
                  <span className="block text-slate-400">Reporting by 8:45 AM</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-white">Seminar Hall</span>
                  <span className="block text-slate-400">New CSE Block, NBKRIST Campus, Vidyanagar, AP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Navigation & Sections */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Quick Links</h4>
            <ul className="flex flex-col gap-2 text-xs text-slate-400">
              <li>
                <Link href="/#workshop" className="hover:text-white transition-colors">About Workshop</Link>
              </li>
              <li>
                <Link href="/#speakers" className="hover:text-white transition-colors">Distinguished Speakers</Link>
              </li>
              <li>
                <Link href="/#schedule" className="hover:text-white transition-colors">Event Timeline</Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">FAQs & Queries</Link>
              </li>
              <li>
                <Link href="/register" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">
                  Registration Portal (₹50 / ₹100)
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">Student & Faculty Sign In</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Portals & Security */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Verification & Administration</h4>
            <ul className="flex flex-col gap-2 text-xs text-slate-400">
              <li>
                <Link href="/coordinator" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Coordinator Desk & QR Scanner</span>
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>Administrative Control Panel</span>
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Participant Dashboard Access
                </Link>
              </li>
            </ul>

            <div className="mt-3 p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
              <p className="text-slate-300 font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>Contact Organizer Desk</span>
              </p>
              <p className="text-slate-400 text-[11px] mt-1">it_aids@nbkrist.org</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 N.B.K.R. Institute of Science & Technology. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Organized by Dept of IT & AI&DS</span>
            <span>•</span>
            <span>In Association with ISTE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
