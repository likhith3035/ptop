import React from "react";
import { 
  Sparkles, 
  Code2, 
  Boxes, 
  Users2, 
  MonitorPlay, 
  Building2, 
  Gift 
} from "lucide-react";

const HIGHLIGHTS_DATA = [
  {
    icon: Sparkles,
    title: "Generative AI",
    desc: "From concepts to real applications",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100/80 hover:border-blue-300",
  },
  {
    icon: Code2,
    title: "Prompt Engineering",
    desc: "Learn techniques that actually work",
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-100/80 hover:border-sky-300",
  },
  {
    icon: Boxes,
    title: "AI-Assisted Development",
    desc: "Build faster with AI tools",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100/80 hover:border-indigo-300",
  },
  {
    icon: Users2,
    title: "Team Collaboration",
    desc: "Work with like-minded peers",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100/80 hover:border-emerald-300",
  },
  {
    icon: MonitorPlay,
    title: "Project Demonstration",
    desc: "Showcase what you build",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100/80 hover:border-amber-300",
  },
  {
    icon: Building2,
    title: "Industry Interaction",
    desc: "Learn from experts at Paytm and Microsoft",
    color: "text-[#002970]",
    bg: "bg-slate-100",
    border: "border-slate-200 hover:border-slate-400",
  },
  {
    icon: Gift,
    title: "Surprise Prizes",
    desc: "For the best projects",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100/80 hover:border-rose-300",
  },
];

export function HighlightsSection() {
  return (
    <section className="py-14 sm:py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Headline */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0056D2] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            Event Highlights
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Designed for Real Engineering Impact
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Every session and track is structured to equip students with practical, industry-standard capabilities.
          </p>
        </div>

        {/* 7-Card Grid from Poster */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {HIGHLIGHTS_DATA.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl bg-white border shadow-2xs hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${item.border} ${
                  idx === 6 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
