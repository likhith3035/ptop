"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { IsteLogo, PaytmBadge, MicrosoftBadge, NbkristLogo } from "@/components/ui/Logos";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Code,
  ShieldCheck,
  Zap
} from "lucide-react";

export function HeroSection() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const eventTime = new Date("2026-09-30T09:00:00+05:30").getTime();
    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, eventTime - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F2F6FC] via-white to-white pt-6 pb-16 lg:pt-10 lg:pb-24 border-b border-slate-100">
      
      {/* Subtle modern geometric background accents from poster */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none -z-10"
        style={{
          backgroundImage: "radial-gradient(#002970 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-blue-300/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Association Eyebrow Strip matching Poster */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-xl bg-white shadow-2xs border border-slate-200 flex items-center gap-2 px-2.5 py-1">
              <NbkristLogo className="w-6 h-6" />
              <span className="text-xs font-bold text-[#002970]">
                N.B.K.R. Institute of Science & Technology
              </span>
            </div>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <span>Department of IT & AI&DS</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
              <IsteLogo className="w-4 h-4" />
              <span>ISTE Student Chapter (Vidyanagar)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Event Core Identity matching Poster */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 text-[#0056D2] text-xs font-bold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0056D2]" />
              <span>IN ASSOCIATION WITH ISTE • LEARN / BUILD / COLLABORATE</span>
            </div>

            {/* Main Headline matching Poster with yellow brush underline */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.06]">
                Prompt to{" "}
                <span className="relative inline-block text-[#002970]">
                  Production
                  {/* Poster's Yellow Graphic Accent */}
                  <span className="absolute left-0 bottom-1.5 w-full h-3 bg-[#FACC15] -z-10 rounded-full opacity-90 transform -rotate-1"></span>
                </span>
              </h1>
              
              <div className="flex items-center gap-3 pt-1 flex-wrap">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#002970]">
                  Paytm AI Workshop
                </span>
              </div>
            </div>

            {/* Poster Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              A hands-on workshop to explore <strong>Generative AI</strong>, <strong>Prompt Engineering</strong>, and <strong>AI-assisted Development</strong> with industry experts from <span className="font-semibold text-slate-900">Paytm</span> and <span className="font-semibold text-slate-900">Microsoft</span>. Learn, build real projects, and turn your ideas into production.
            </p>

            {/* Key Metadata Cards matching Poster */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-[#0056D2] shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">30 September 2026</div>
                  <div className="text-[11px] text-slate-500 font-medium">Wednesday • Full Day</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-[#0056D2] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">9:00 AM – 4:00 PM</div>
                  <div className="text-[11px] text-slate-500 font-medium">Reporting by 8:45 AM</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-[#0056D2] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">Seminar Hall</div>
                  <div className="text-[11px] text-slate-500 font-medium">New CSE Block, NBKRIST</div>
                </div>
              </div>
            </div>

            {/* Action Buttons matching Poster */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#0056D2] hover:bg-[#0041a3] text-white text-sm font-extrabold shadow-md hover:shadow-lg transition-all active:scale-[0.98] text-center"
              >
                <span>Register Now</span>
                <span className="px-2 py-0.5 rounded bg-[#FACC15] text-slate-950 text-xs font-black">
                  ₹50 / ₹100
                </span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>

              <a
                href="#schedule"
                className="inline-flex items-center justify-center px-6 py-4 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold transition-all shadow-2xs"
              >
                View Schedule
              </a>
            </div>

            {/* Social Proof + Countdown Bar */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-xl bg-blue-50 text-[#0056D2] border border-blue-100 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-slate-700">
                  <strong className="text-slate-900 font-bold">100 Seats Maximum</strong> • Seminar Hall
                </div>
              </div>

              {/* Live Mini Countdown */}
              <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-[#002970] bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                <Clock className="w-3.5 h-3.5 text-[#0056D2]" />
                <span>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s remaining</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Poster-Composition Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Yellow Geometric Backing Block from Poster */}
              <div className="absolute -top-4 right-10 w-24 h-24 bg-[#FACC15] rounded-2xl -z-10 transform rotate-3" />
              <div className="absolute -bottom-6 right-0 w-20 h-28 bg-[#FACC15] rounded-2xl -z-10" />

              {/* Main Photo: Workshop Students in Seminar Hall */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/workshop-hall.jpg"
                  alt="Students participating in Prompt to Production AI Workshop"
                  className="w-full h-64 sm:h-72 object-cover filter brightness-[1.02] contrast-[1.05]"
                />

                {/* Floating "Build Learn Collaborate" Card from Poster */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-lg border border-slate-200 text-slate-900 text-xs font-extrabold flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#0056D2] animate-pulse" />
                  <span>Build • Learn • Collaborate</span>
                </div>

                {/* Dark gradient overlay on bottom of photo */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 text-white">
                  <div className="text-xs font-bold">Hands-on AI Engineering Sprint</div>
                  <div className="text-[11px] text-sky-200">Department of IT & AI&DS Lab</div>
                </div>
              </div>

              {/* Overlapping Campus Architecture Photo from Poster */}
              <div className="relative -mt-14 ml-8 sm:ml-12 w-4/5 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/campus.jpg"
                  alt="N.B.K.R. Institute of Science & Technology Campus"
                  className="w-full h-36 object-cover"
                />
                
                {/* Poster's Campus Caption Overlay */}
                <div className="absolute bottom-2 left-2 bg-[#002970]/90 backdrop-blur-xs text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                  N.B.K.R.I.S.T Vidyanagar
                </div>
              </div>

              {/* Floating Yellow Badge: "AI Ideas To Impact" from Poster */}
              <div className="absolute top-1/2 left-2 sm:-left-5 bg-[#FACC15] text-slate-950 px-4 py-2 rounded-xl shadow-xl border border-amber-300 font-black text-xs uppercase tracking-tight flex items-center gap-1.5 transform -rotate-3 z-20">
                <Sparkles className="w-4 h-4 text-amber-950" />
                <span>AI Ideas To Impact</span>
              </div>

              {/* Hand-written whimsical annotation note from Poster */}
              <div className="absolute -bottom-5 left-10 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600 shadow-sm z-20 flex items-center gap-1">
                <span>⚡ Students • Community • Real Projects</span>
              </div>

              {/* Dotted Grid Matrix from Poster */}
              <div 
                className="absolute -top-2 -right-4 w-20 h-24 opacity-40 pointer-events-none -z-10"
                style={{
                  backgroundImage: "radial-gradient(#002970 2px, transparent 2px)",
                  backgroundSize: "10px 10px",
                }}
              />

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
