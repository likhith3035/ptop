"use client";

import React, { useState } from "react";
import { SCHEDULE_TIMELINE } from "@/lib/constants";
import { downloadCalendarEvent } from "@/lib/calendar";
import { 
  Calendar, 
  Clock, 
  Download, 
  Sparkles, 
  Laptop, 
  Coffee, 
  Award, 
  CheckCircle2 
} from "lucide-react";

export function ScheduleSection() {
  const [filter, setFilter] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Items" },
    { id: "Speaker", label: "Expert Sessions" },
    { id: "Challenge", label: "Hands-on Build" },
    { id: "Break", label: "Breaks" },
  ];

  const filteredItems = filter === "all" 
    ? SCHEDULE_TIMELINE 
    : SCHEDULE_TIMELINE.filter(item => item.category === filter);

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Speaker":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-[#0056D2] border border-blue-200">Expert Session</span>;
      case "Challenge":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Build Challenge</span>;
      case "Break":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Refreshments</span>;
      case "Ceremony":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Ceremony</span>;
      case "Interactive":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">Live Q&A</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">General</span>;
    }
  };

  return (
    <section id="schedule" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0056D2] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Complete Program Schedule
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              One Day. 14 Curated Milestones.
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              30 September 2026 • 9:00 AM – 4:00 PM • Seminar Hall, New CSE Block
            </p>
          </div>

          <button
            onClick={downloadCalendarEvent}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-semibold shadow-xs hover:shadow transition-all self-start sm:self-auto"
          >
            <Download className="w-4 h-4 text-[#0056D2]" />
            <span>Add to Calendar (.ics)</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filter === cat.id
                  ? "bg-[#0056D2] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Timeline Stack */}
        <div className="space-y-3.5">
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-200 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-xs font-bold text-slate-800 shrink-0 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#0056D2]" />
                  <span>{item.time}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    {getCategoryBadge(item.category)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              {item.speaker && (
                <div className="sm:text-right shrink-0">
                  <span className="text-[11px] font-bold text-[#002970] bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100 block sm:inline-block">
                    {item.speaker}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between text-xs text-slate-600">
          <span>Reporting time is <strong>8:45 AM</strong>. Digital QR tickets will be verified at the entrance.</span>
          <span className="font-semibold text-[#0056D2] hidden sm:inline">ISTE Approved Timeline</span>
        </div>

      </div>
    </section>
  );
}
