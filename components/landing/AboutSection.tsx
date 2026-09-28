import React from "react";
import Link from "next/link";
import { Users, Laptop, Clock, Award, ArrowRight, CheckCircle2 } from "lucide-react";

export function AboutSection() {
  return (
    <section id="workshop" className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Narrative from Poster */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#0056D2] rounded-full" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#0056D2]">
                ABOUT THE EVENT
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              A Hands-on <br />
              <span className="text-[#0056D2]">AI Learning Experience</span>
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              <strong>Prompt to Production</strong> is a one-day workshop designed for students who want to move from learning AI concepts to actually building real projects. Get hands-on exposure, learn from industry experts, collaborate with peers, and experience how AI can be used in real-world development.
            </p>

            <div className="space-y-3 pt-1 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Zero fluff — structured around real LLM systems, prompt engineering, and APIs.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Mentored afternoon sprint with live evaluation and surprise prizes.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Official participation certificate issued by the Department of IT & AI&DS and ISTE.</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#0056D2] hover:bg-[#0041a3] text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
              >
                <span>Know More & Register</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Visual & Stats Grid matching Poster */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Visual with Blue Block Accent from Poster */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/workshop-hall.jpg"
                alt="Students collaborating during workshop build"
                className="w-full h-56 sm:h-64 object-cover filter contrast-[1.03]"
              />
              
              {/* Solid Blue Graphic Block Accent on Left from Poster */}
              <div className="absolute top-0 left-0 w-4 h-full bg-[#0056D2]" />
            </div>

            {/* 4 Stats Cards matching Poster */}
            <div className="grid grid-cols-2 gap-4">
              
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-blue-50 text-[#0056D2] shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">2</div>
                  <div className="text-xs font-bold text-slate-800 mt-1">Expert Sessions</div>
                  <div className="text-[10px] text-slate-500">From Industry Leaders</div>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black text-slate-900 leading-tight">Hands-on</div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">Build Challenge</div>
                  <div className="text-[10px] text-slate-500">Mentored Sprint</div>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">100+</div>
                  <div className="text-xs font-bold text-slate-800 mt-1">Students Expected</div>
                  <div className="text-[10px] text-slate-500">Limited Capacity</div>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">8+</div>
                  <div className="text-xs font-bold text-slate-800 mt-1">Hours of Learning</div>
                  <div className="text-[10px] text-slate-500">Full Day Immersive</div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
