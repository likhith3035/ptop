"use client";

import React, { useState } from "react";
import { FAQ_ITEMS, CONTACT_PERSONS } from "@/lib/constants";
import { ChevronDown, HelpCircle, Mail, MapPin } from "lucide-react";

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0056D2] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Got Questions? We Have Answers.
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Everything you need to know about registration, prerequisites, the build challenge, and digital tickets.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 focus:outline-none hover:bg-slate-50/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-[#0056D2] shrink-0" />
                    <span className="text-sm font-bold text-slate-900">{item.q}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "transform rotate-180 text-[#0056D2]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Strip */}
        <div id="contact" className="mt-12 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Still have questions or need assistance with your registration?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CONTACT_PERSONS.map((cp, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100/70 text-[#0056D2] shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{cp.role}</div>
                  <div className="text-sm font-bold text-slate-900">{cp.name}</div>
                  <div className="text-xs text-slate-600">{cp.dept}</div>
                  <a
                    href={`mailto:${cp.email}`}
                    className="text-xs font-medium text-[#0056D2] hover:underline mt-1 inline-block"
                  >
                    {cp.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
