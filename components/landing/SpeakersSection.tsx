import React from "react";
import { PaytmBadge, MicrosoftBadge } from "@/components/ui/Logos";
import { Video, Clock, CheckCircle2, Sparkles, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";

export function SpeakersSection() {
  return (
    <section id="speakers" className="py-16 sm:py-24 bg-white border-b border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0056D2] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            Industry Keynotes
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Learn From Engineers Building Scalable AI Systems
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Direct interactive virtual sessions with senior engineering leaders from Paytm and Microsoft, followed by live Q&A.
          </p>
        </div>

        {/* 2 Main Professional Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Speaker 1: Mr. Suman Mandal */}
          <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-50/70 via-white to-white p-7 sm:p-9 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-6">
              
              {/* Top Row: Session Tag & Company Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0056D2] text-xs font-bold">
                  <Video className="w-3.5 h-3.5" />
                  <span>Keynote 01 • Virtual Live</span>
                </div>
                <PaytmBadge className="scale-110" />
              </div>

              {/* Speaker Identity */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#002970] to-[#0056D2] text-white font-black text-2xl flex items-center justify-center shadow-md shadow-blue-900/10 group-hover:scale-105 transition-transform">
                  SM
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    Mr. Suman Mandal
                  </h3>
                  <div className="text-sm font-bold text-[#0056D2] mt-0.5">Program Lead</div>
                  <div className="text-xs text-slate-500 font-medium">Paytm</div>
                </div>
              </div>

              {/* Session Meta Card */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Clock className="w-4 h-4 text-[#0056D2]" />
                  <span>Duration: 1 Hour 15 Minutes (9:35 AM – 10:50 AM)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Deep-dive into production prompt engineering patterns, structured JSON schemas, and scaling AI services.
                </p>
              </div>

              {/* Takeaways */}
              <div className="space-y-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Core Topics Covered
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Prompt orchestration, context management, and few-shot calibration.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>How Paytm architects low-latency LLM microservices at scale.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Direct 10-minute student interactive Q&A session.</span>
                  </li>
                </ul>
              </div>

            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Interactive Virtual Live Stream</span>
              <span className="text-[#002970] font-bold">Session 1</span>
            </div>
          </div>

          {/* Speaker 2: Mr. Shivam Behl */}
          <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-50/70 via-white to-white p-7 sm:p-9 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-6">
              
              {/* Top Row: Session Tag & Company Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                  <Video className="w-3.5 h-3.5" />
                  <span>Keynote 02 • Virtual Live</span>
                </div>
                <MicrosoftBadge className="scale-110" />
              </div>

              {/* Speaker Identity */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform">
                  SB
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    Mr. Shivam Behl
                  </h3>
                  <div className="text-sm font-bold text-slate-800 mt-0.5">SDE-II</div>
                  <div className="text-xs text-slate-500 font-medium">Microsoft</div>
                </div>
              </div>

              {/* Session Meta Card */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Duration: 1 Hour 15 Minutes (11:15 AM – 12:30 PM)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  AI-assisted engineering, automated test generation, and deploying prototypes to enterprise cloud infrastructure.
                </p>
              </div>

              {/* Takeaways */}
              <div className="space-y-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Core Topics Covered
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>10x developer workflows using generative copilots and tools.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Best practices for reliable system architecture and clean code.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Direct 10-minute student interactive Q&A session.</span>
                  </li>
                </ul>
              </div>

            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Interactive Virtual Live Stream</span>
              <span className="text-indigo-900 font-bold">Session 2</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
