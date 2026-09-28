import React from "react";
import { 
  Brain, 
  Terminal, 
  Code, 
  Rocket, 
  Layers, 
  Users, 
  Presentation, 
  CheckCircle2 
} from "lucide-react";

const LEARNING_MODULES = [
  {
    icon: Brain,
    title: "Generative AI Fundamentals",
    desc: "Understand tokenization, context windows, temperature, and foundational model mechanics without unnecessary academic jargon.",
  },
  {
    icon: Terminal,
    title: "Prompt Engineering",
    desc: "Master system design prompts, dynamic context injection, few-shot demonstration patterns, and structured JSON output generation.",
  },
  {
    icon: Code,
    title: "AI-Assisted Development",
    desc: "Harness modern IDE copilots and generative toolchains to refactor, debug, write tests, and ship resilient code at 5x velocity.",
  },
  {
    icon: Rocket,
    title: "Rapid Prototyping",
    desc: "Transform rough concepts into functional, interactive full-stack web applications within hours using modern web stacks.",
  },
  {
    icon: Layers,
    title: "AI Application Development",
    desc: "Connect LLM endpoints to databases, business logic, APIs, and authorization guards with robust error and edge-case handling.",
  },
  {
    icon: Users,
    title: "Team-Based Development",
    desc: "Collaborate effectively under hackathon sprint conditions, coordinate Git repositories, and parallelize implementation tasks.",
  },
  {
    icon: Presentation,
    title: "Project Demonstration",
    desc: "Articulate your product value proposition, present live working software, and handle technical inquiries from industry judges.",
  },
  {
    icon: CheckCircle2,
    title: "Production-Oriented AI Development",
    desc: "Learn real-world constraints: cost control, prompt injection defense, rate-limiting, observability, and deployment pipelines.",
  },
];

export function WhatYouWillLearnSection() {
  return (
    <section id="learn" className="py-16 sm:py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0056D2] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Curriculum & Outcomes
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            What Participants Will Master
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Structured step-by-step to transition you from an AI consumer to an AI builder and production deployer.
          </p>
        </div>

        {/* 8-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {LEARNING_MODULES.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-[#0056D2] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600 font-semibold">
                  <span>Module 0{idx + 1}</span>
                  <span className="text-blue-600">Practical Skill</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
