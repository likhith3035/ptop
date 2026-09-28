"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Ticket, Loader2, Search, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { DigitalTicket } from "@/types";
import { DigitalTicketCard } from "@/components/ticket/DigitalTicketCard";

export function TicketNotFoundRecovery({ id }: { id: string }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [recoveredTicket, setRecoveredTicket] = useState<DigitalTicket | null>(null);
  const [searchRoll, setSearchRoll] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function recover() {
      // 1. Check browser local storage for direct match
      if (typeof window !== "undefined") {
        try {
          const direct = localStorage.getItem(`ptop_ticket_${id}`);
          if (direct) {
            const parsed = JSON.parse(direct) as DigitalTicket;
            if (parsed && parsed.registrationNumber) {
              if (isMounted) {
                setRecoveredTicket(parsed);
                setLoading(false);
              }
              // Sync back to server in background
              fetch("/api/ticket/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticket: parsed }),
              }).catch(() => {});
              return;
            }
          }

          // Check active ticket
          const active = localStorage.getItem("ptop_active_ticket");
          if (active) {
            const parsed = JSON.parse(active) as DigitalTicket;
            if (
              parsed &&
              (parsed.registrationNumber.toUpperCase() === id.toUpperCase() ||
               parsed.rollNumber.toUpperCase() === id.toUpperCase() ||
               parsed.ticketNumber.toUpperCase() === id.toUpperCase())
            ) {
              if (isMounted) {
                setRecoveredTicket(parsed);
                setLoading(false);
              }
              fetch("/api/ticket/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticket: parsed }),
              }).catch(() => {});
              return;
            }
          }
        } catch (e) {
          console.warn("Local storage check error:", e);
        }
      }

      // 2. Poll API in case of DB replication latency
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          await new Promise((res) => setTimeout(res, attempt * 600));
          const res = await fetch(`/api/ticket/${encodeURIComponent(id)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.ticket && isMounted) {
              setRecoveredTicket(data.ticket);
              setLoading(false);
              return;
            }
          }
        } catch {
          // ignore error and continue
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    }

    recover();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Handle manual roll search
  const handleRollSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRoll.trim()) return;
    setSearching(true);
    setSearchError(null);

    try {
      const res = await fetch(`/api/ticket/${encodeURIComponent(searchRoll.trim().toUpperCase())}`);
      const data = await res.json();

      if (res.ok && data.success && data.ticket) {
        setRecoveredTicket(data.ticket);
        if (typeof window !== "undefined") {
          localStorage.setItem(`ptop_ticket_${data.ticket.registrationNumber}`, JSON.stringify(data.ticket));
        }
      } else {
        setSearchError(`No ticket found registered for roll number "${searchRoll.trim().toUpperCase()}".`);
      }
    } catch {
      setSearchError("Unable to reach ticket registry. Please check your network.");
    } finally {
      setSearching(false);
    }
  };

  // If recovering or searching
  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0056D2] mb-4">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Locating Your Digital Pass...</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Verifying registration reference <span className="font-mono font-semibold text-slate-700">{id}</span> with institutional database.
        </p>
      </div>
    );
  }

  // If ticket recovered successfully
  if (recoveredTicket) {
    return (
      <div className="space-y-4">
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">Digital Pass Verified & Restored Successfully</span>
          </div>
          <span className="text-[10px] bg-emerald-200/60 px-2 py-0.5 rounded font-mono font-bold">
            {recoveredTicket.registrationNumber}
          </span>
        </div>

        <DigitalTicketCard ticket={recoveredTicket} />
      </div>
    );
  }

  // If not found after recovery attempts
  return (
    <div className="max-w-md w-full mx-auto text-center p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-4">
        <Ticket className="w-7 h-7" />
      </div>
      <h2 className="text-xl font-black text-slate-900">Ticket Not Found</h2>
      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
        No digital pass matching &ldquo;<span className="font-mono font-bold text-slate-700">{id}</span>&rdquo; was located in the live registry.
      </p>

      {/* Manual Roll Number Lookup Tool */}
      <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Find Pass by Roll Number:
        </label>
        <form onSubmit={handleRollSearch} className="flex gap-2">
          <input
            type="text"
            value={searchRoll}
            onChange={(e) => setSearchRoll(e.target.value)}
            placeholder="e.g. 23KB1A3035"
            className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#0056D2]"
          />
          <button
            type="submit"
            disabled={searching || !searchRoll.trim()}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-50 flex items-center gap-1 cursor-pointer"
          >
            {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>Search</span>
          </button>
        </form>
        {searchError && (
          <p className="text-[11px] text-rose-600 font-semibold mt-2">{searchError}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Link
          href="/register"
          className="py-2.5 px-4 rounded-xl bg-[#0056D2] hover:bg-[#0041a3] text-white font-bold text-xs shadow-xs transition-all"
        >
          Register for Workshop
        </Link>
        <Link
          href="/"
          className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
