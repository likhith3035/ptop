"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { NbkristLogo, IsteLogo } from "@/components/ui/Logos";
import { Menu, X, ArrowRight, UserCircle, QrCode, Sparkles } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-2.5"
          : "bg-white border-b border-slate-100 py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Institutional Branding with Real College Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group focus:outline-none min-w-0">
            <NbkristLogo className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 transition-transform duration-200 group-hover:scale-105" />
            
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-[13px] font-black text-[#002970] tracking-tight leading-tight line-clamp-1">
                  N.B.K.R. Institute of Science & Technology
                </span>
                <span className="hidden md:inline-flex px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-50 text-[#0056D2] border border-blue-200">
                  Autonomous
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold text-slate-600 leading-tight">
                <span>Department of IT & AI&DS</span>
                <span className="text-slate-300">•</span>
                <span className="text-amber-600 font-bold hidden sm:inline">In Association with ISTE</span>
              </div>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-slate-700">
            <Link href="/#workshop" className="hover:text-[#0056D2] transition-colors py-1">
              Workshop
            </Link>
            <Link href="/#speakers" className="hover:text-[#0056D2] transition-colors py-1">
              Speakers
            </Link>
            <Link href="/#learn" className="hover:text-[#0056D2] transition-colors py-1">
              Curriculum
            </Link>
            <Link href="/#schedule" className="hover:text-[#0056D2] transition-colors py-1">
              Schedule
            </Link>
            <Link href="/#ticket-preview" className="hover:text-[#0056D2] transition-colors py-1">
              Digital Pass
            </Link>
            <Link href="/#faq" className="hover:text-[#0056D2] transition-colors py-1">
              FAQ
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-[#0056D2] rounded-xl hover:bg-slate-50 transition-colors"
            >
              <UserCircle className="w-4 h-4 text-slate-500" />
              <span>Sign In</span>
            </Link>

            <Link
              href="/register"
              className="relative group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#002970] via-[#0056D2] to-[#004bbd] text-white text-xs font-bold tracking-wide shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
            >
              <span>Register Now</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 text-[10px] font-black">
                ₹50 / ₹100
              </span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-1.5 shrink-0">
            <Link
              href="/register"
              className="px-2.5 py-1.5 rounded-lg bg-[#0056D2] text-white text-[11px] font-bold shadow-xs whitespace-nowrap"
            >
              Register (₹50)
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[62px] z-50 bg-black/50 backdrop-blur-sm sm:hidden animate-in fade-in duration-200">
          <div className="bg-white border-b border-slate-200 px-6 py-6 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <IsteLogo className="w-8 h-8" />
              <div>
                <div className="text-xs font-bold text-slate-900">ISTE Student Chapter</div>
                <div className="text-[11px] text-slate-500">Dept of IT & AI&DS Desk</div>
              </div>
            </div>

            <nav className="flex flex-col gap-2.5 text-sm font-semibold text-slate-800">
              <Link
                href="/#workshop"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Workshop Overview
              </Link>
              <Link
                href="/#speakers"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Distinguished Industry Speakers
              </Link>
              <Link
                href="/#learn"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Curriculum & Outcomes
              </Link>
              <Link
                href="/#schedule"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Full Day Schedule (14 Milestones)
              </Link>
              <Link
                href="/#ticket-preview"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Digital Pass Preview
              </Link>
              <Link
                href="/#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                FAQ & Venue Location
              </Link>
            </nav>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#002970] to-[#0056D2] text-white font-bold text-sm shadow-md"
              >
                <span>Register for Workshop (₹50 / ₹100)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-semibold text-xs hover:bg-slate-50"
              >
                <UserCircle className="w-4 h-4 text-slate-500" />
                <span>Sign in / Access My Pass</span>
              </Link>
              <Link
                href="/scan"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                <QrCode className="w-4 h-4 text-[#0056D2]" />
                <span>Gate Admission Scanner (Staff)</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
