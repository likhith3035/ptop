"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Laptop, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Lock,
  Copy,
  Check,
  QrCode,
  Banknote,
  User,
  Mail,
  Phone,
  Hash,
  Award,
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  CheckCheck
} from "lucide-react";
import { IsteLogo, NbkristLogo, PaytmBadge } from "@/components/ui/Logos";
import { UPI_CONFIG } from "@/lib/constants";
import confetti from "canvas-confetti";

interface FormState {
  fullName: string;
  email: string;
  mobile: string;
  rollNumber: string;
  year: "1st Year" | "2nd Year" | "3rd Year" | "4th Year";
  branch: "IT" | "AI&DS" | "CSE" | "ECE" | "EEE" | "MECH" | "CIVIL" | "OTHER";
  section: string;
  isIsteMember: boolean;
  isteNumber: string;
  hasLaptop: boolean;
  linkedinUrl: string;
  paymentMethod: "upi" | "cash_at_desk";
  upiReference: string;
}

const BRANCHES: Array<FormState["branch"]> = [
  "AI&DS",
  "IT",
  "CSE",
  "ECE",
  "EEE",
  "MECH",
  "CIVIL",
  "OTHER"
];

const YEARS: Array<FormState["year"]> = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year"
];

export function RegistrationForm() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    mobile: "",
    rollNumber: "",
    year: "3rd Year",
    branch: "AI&DS",
    section: "A",
    isIsteMember: false,
    isteNumber: "",
    hasLaptop: true,
    linkedinUrl: "",
    paymentMethod: "upi",
    upiReference: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [upiQrUrl, setUpiQrUrl] = useState<string>("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [passQrPreviewUrl, setPassQrPreviewUrl] = useState<string>("");

  // Fee calculation (matches server rules)
  const currentFee = form.isIsteMember ? 50 : 100;

  // Build standard UPI intent deep-link
  const upiIntentUri = `upi://pay?pa=${encodeURIComponent(UPI_CONFIG.upiId)}&pn=${encodeURIComponent(
    UPI_CONFIG.payeeName
  )}&am=${currentFee}&cu=INR&tn=Prompt%20to%20Production%20Pass`;

  // Generate Payment QR Code dynamically based on calculated fee
  useEffect(() => {
    QRCode.toDataURL(upiIntentUri, {
      width: 260,
      margin: 1,
      color: {
        dark: "#002970",
        light: "#FFFFFF",
      },
    })
      .then(setUpiQrUrl)
      .catch((err) => console.error("Error creating UPI QR:", err));
  }, [upiIntentUri]);

  // Generate live pass preview QR code
  useEffect(() => {
    const previewToken = `P2P-PREVIEW-${form.rollNumber ? form.rollNumber.toUpperCase() : "LIVE"}`;
    QRCode.toDataURL(previewToken, {
      width: 140,
      margin: 1,
      color: {
        dark: "#0B1329",
        light: "#FFFFFF",
      },
    })
      .then(setPassQrPreviewUrl)
      .catch(() => {});
  }, [form.rollNumber]);

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_CONFIG.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2200);
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      errs.fullName = "Please enter your full name as it should appear on your official certificate.";
    }

    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Please enter a valid student email address.";
    }

    const cleanMobile = form.mobile.replace(/\s+/g, "");
    if (!cleanMobile || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      errs.mobile = "Please enter a valid 10-digit Indian mobile number.";
    }

    if (!form.rollNumber.trim() || form.rollNumber.trim().length < 5) {
      errs.rollNumber = "Please enter your official college Roll Number (e.g. 22031A0512).";
    }

    if (!form.section.trim()) {
      errs.section = "Specify section.";
    }

    if (form.isIsteMember && (!form.isteNumber.trim() || form.isteNumber.trim().length < 3)) {
      errs.isteNumber = "ISTE Student Membership number is required to claim the ₹50 fee.";
    }

    if (form.paymentMethod === "upi" && (!form.upiReference.trim() || form.upiReference.trim().length < 6)) {
      errs.upiReference = "Enter the 12-digit UPI Reference / UTR number from your payment receipt.";
    }

    if (form.linkedinUrl.trim()) {
      try {
        new URL(form.linkedinUrl);
      } catch {
        errs.linkedinUrl = "Please enter a valid URL starting with https://";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);

    if (!validate()) {
      // Smooth scroll to top of form on validation error
      window.scrollTo({ top: 300, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.ticket) {
        setGlobalError(data.error || "Registration could not be completed. Please check your inputs.");
        setIsSubmitting(false);
        return;
      }

      // Celebratory Confetti blast
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#002970", "#0056D2", "#00BAF2", "#FACC15", "#10B981"]
      });

      // Secure local offline backup: Guarantee ticket is instantly accessible even on serverless cold starts
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`ptop_ticket_${data.ticket.registrationNumber}`, JSON.stringify(data.ticket));
          localStorage.setItem("ptop_active_ticket", JSON.stringify(data.ticket));
          localStorage.setItem("ptop_my_roll", form.rollNumber.trim().toUpperCase());
        } catch (e) {
          console.warn("Could not save ticket to localStorage:", e);
        }
      }

      // Redirect directly to the generated Digital Ticket Pass
      router.push(`/ticket/${data.ticket.registrationNumber}`);
    } catch {
      setGlobalError("Network connection interrupted. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* ============================================================== */}
      {/* LEFT COLUMN: INTERACTIVE FORM CONSOLE (7 cols)                 */}
      {/* ============================================================== */}
      <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-9 relative overflow-hidden">
        
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#002970] via-[#0056D2] to-[#00BAF2]" />

        {/* Console Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-7 border-b border-slate-100 gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center p-1.5 shadow-xs">
              <NbkristLogo className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0056D2] block">
                N.B.K.R.I.S.T • Autonomous
              </span>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Workshop Registration Console
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-900 border border-amber-200/80 flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>Limited 100 Seats</span>
            </span>
          </div>
        </div>

        {globalError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="leading-relaxed font-semibold">{globalError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* ------------------------------------------------------------ */}
          {/* STEP 1: PARTICIPANT IDENTITY                                  */}
          {/* ------------------------------------------------------------ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#002970] text-white inline-flex items-center justify-center text-[10px] font-black">
                  1
                </span>
                <span>Personal & College Credentials</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Step 1 of 3</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Full Name (Printed on Certificate)
                  </span>
                  <span className="text-rose-500 font-mono text-xs">*</span>
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="e.g. K. Harish Kumar"
                  className={`w-full px-4 py-3 rounded-2xl border text-base sm:text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                    errors.fullName ? "border-rose-400 bg-rose-50/20" : "border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white"
                  }`}
                />
                {errors.fullName && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.fullName}</p>}
              </div>

              {/* College Roll Number */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-slate-400" />
                    College Roll Number
                  </span>
                  <span className="text-rose-500 font-mono text-xs">*</span>
                </label>
                <input
                  type="text"
                  value={form.rollNumber}
                  onChange={(e) => setForm({ ...form, rollNumber: e.target.value.toUpperCase() })}
                  placeholder="e.g. 22031A0512"
                  className={`w-full px-4 py-3 rounded-2xl border text-base sm:text-sm font-mono text-slate-900 uppercase font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                    errors.rollNumber ? "border-rose-400 bg-rose-50/20" : "border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white"
                  }`}
                />
                {errors.rollNumber && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.rollNumber}</p>}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    WhatsApp Mobile Number
                  </span>
                  <span className="text-rose-500 font-mono text-xs">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-slate-400 font-mono select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    placeholder="9491803089"
                    maxLength={10}
                    className={`w-full pl-12 pr-4 py-3 rounded-2xl border text-base sm:text-sm font-mono text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                      errors.mobile ? "border-rose-400 bg-rose-50/20" : "border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white"
                    }`}
                  />
                </div>
                {errors.mobile && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.mobile}</p>}
              </div>

              {/* Email Address */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Student Email Address
                  </span>
                  <span className="text-rose-500 font-mono text-xs">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="student@nbkrist.org"
                  className={`w-full px-4 py-3 rounded-2xl border text-base sm:text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                    errors.email ? "border-rose-400 bg-rose-50/20" : "border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white"
                  }`}
                />
                {errors.email && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.email}</p>}
              </div>

            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* STEP 2: ACADEMIC PROFILE & WORKSHOP PREPAREDNESS             */}
          {/* ------------------------------------------------------------ */}
          <div className="pt-6 border-t border-slate-100 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#002970] text-white inline-flex items-center justify-center text-[10px] font-black">
                  2
                </span>
                <span>Academic Profile & Discounts</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Step 2 of 3</span>
            </div>

            {/* Department / Branch Chip Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                Department / Branch <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {BRANCHES.map((b) => {
                  const isSelected = form.branch === b;
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setForm({ ...form, branch: b })}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-[#002970] text-white shadow-md shadow-blue-950/20 scale-[1.02]"
                          : "bg-slate-100/80 hover:bg-slate-200 text-slate-700 border border-slate-200/60"
                      }`}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Year of Study & Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Year of Study <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {YEARS.map((y) => {
                    const isSelected = form.year === y;
                    return (
                      <button
                        key={y}
                        type="button"
                        onClick={() => setForm({ ...form, year: y })}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-[#0056D2] text-white shadow-sm scale-[1.02]"
                            : "bg-slate-100/80 hover:bg-slate-200 text-slate-700 border border-slate-200/60"
                        }`}
                      >
                        {y.replace(" Year", "")}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Section <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.section}
                  onChange={(e) => setForm({ ...form, section: e.target.value.toUpperCase() })}
                  placeholder="e.g. A"
                  maxLength={4}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50/50 text-center font-bold text-base sm:text-xs uppercase focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>

            {/* Laptop Logistics Card */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-slate-700 shrink-0">
                <Laptop className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="font-bold text-xs text-slate-900 block">
                  Bringing Laptop to Seminar Hall?
                </span>
                <span className="text-[11px] text-slate-500 block leading-relaxed mt-0.5">
                  Recommended for the 90-minute Hands-on AI Build Challenge.
                </span>
                <div className="mt-3 flex items-center gap-4 text-xs font-semibold">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-800">
                    <input
                      type="radio"
                      name="hasLaptop"
                      checked={form.hasLaptop === true}
                      onChange={() => setForm({ ...form, hasLaptop: true })}
                      className="text-[#0056D2] focus:ring-0"
                    />
                    <span>Yes, I will bring my laptop</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input
                      type="radio"
                      name="hasLaptop"
                      checked={form.hasLaptop === false}
                      onChange={() => setForm({ ...form, hasLaptop: false })}
                      className="text-[#0056D2] focus:ring-0"
                    />
                    <span>No (pair with teammate)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Golden ISTE Membership Concession Card */}
            <div className={`p-4.5 rounded-2xl border transition-all ${
              form.isIsteMember 
                ? "border-amber-300 bg-gradient-to-br from-amber-50/90 to-yellow-50/50 shadow-sm" 
                : "border-slate-200 bg-slate-50/60"
            }`}>
              <div className="flex items-start gap-3.5">
                <div className="p-1 rounded-xl bg-white border border-amber-200/70 shadow-2xs shrink-0">
                  <IsteLogo className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">
                      ISTE Student Chapter Member?
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 shadow-2xs">
                      50% OFF (Pay ₹50)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Enrolled ISTE chapter members pay ₹50 instead of regular ₹100.
                  </span>
                  
                  <div className="mt-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-900 select-none">
                      <input
                        type="checkbox"
                        checked={form.isIsteMember}
                        onChange={(e) => setForm({ ...form, isIsteMember: e.target.checked })}
                        className="rounded w-4 h-4 text-[#0056D2] focus:ring-0"
                      />
                      <span>Yes, I am an enrolled ISTE Member (Concession Applied)</span>
                    </label>

                    {form.isIsteMember && (
                      <div className="mt-3 animate-in fade-in slide-in-from-top-1">
                        <input
                          type="text"
                          value={form.isteNumber}
                          onChange={(e) => setForm({ ...form, isteNumber: e.target.value.toUpperCase() })}
                          placeholder="Enter ISTE Member ID (e.g. ISTE-AP-2024-XXXX)"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-base sm:text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-200 bg-white ${
                            errors.isteNumber ? "border-rose-400 bg-rose-50/30" : "border-amber-300"
                          }`}
                        />
                        {errors.isteNumber && (
                          <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.isteNumber}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ------------------------------------------------------------ */}
          {/* STEP 3: ZERO-FEE DIRECT CHECKOUT                             */}
          {/* ------------------------------------------------------------ */}
          <div className="pt-6 border-t border-slate-100 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#002970] text-white inline-flex items-center justify-center text-[10px] font-black">
                  3
                </span>
                <span>Registration Fee & Payment Option</span>
              </h3>
              
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs text-slate-500 font-medium">Final Fee:</span>
                <span className="text-lg font-black text-[#002970]">₹{currentFee}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                  Zero Gateway Fee
                </span>
              </div>
            </div>

            {/* Payment Method Selector Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              <button
                type="button"
                onClick={() => setForm({ ...form, paymentMethod: "upi" })}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                  form.paymentMethod === "upi"
                    ? "border-[#0056D2] bg-blue-50/40 ring-2 ring-blue-100 shadow-sm"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${form.paymentMethod === "upi" ? "bg-[#0056D2] text-white" : "bg-slate-100 text-slate-600"}`}>
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">
                    Instant UPI QR / Transfer
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5 leading-snug">
                    Zero charges with GPay, PhonePe, or Paytm. Enter 12-digit UTR to confirm.
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, paymentMethod: "cash_at_desk" })}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                  form.paymentMethod === "cash_at_desk"
                    ? "border-[#0056D2] bg-blue-50/40 ring-2 ring-blue-100 shadow-sm"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${form.paymentMethod === "cash_at_desk" ? "bg-[#0056D2] text-white" : "bg-slate-100 text-slate-600"}`}>
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">
                    Pay at Venue Desk (Cash)
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5 leading-snug">
                    Confirm pass now; pay ₹{currentFee} cash on 30 Sept at Seminar Hall desk.
                  </span>
                </div>
              </button>

            </div>

            {/* UPI Payment Terminal Box */}
            {form.paymentMethod === "upi" ? (
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-[#0A1428] text-white border border-slate-800 shadow-lg space-y-4">
                
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  
                  {/* Dynamic QR Viewfinder */}
                  <div className="relative p-2.5 bg-white rounded-2xl shadow-md shrink-0 flex flex-col items-center">
                    {/* Viewfinder brackets */}
                    <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#00BAF2]" />
                    <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#00BAF2]" />
                    <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#00BAF2]" />
                    <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#00BAF2]" />

                    {upiQrUrl ? (
                      <img
                        src={upiQrUrl}
                        alt="Official UPI QR Code"
                        className="w-36 h-36 rounded-lg object-contain"
                      />
                    ) : (
                      <div className="w-36 h-36 flex items-center justify-center text-slate-400">
                        <Loader2 className="w-6 h-6 animate-spin text-[#0056D2]" />
                      </div>
                    )}
                    <span className="text-[10px] font-black text-slate-900 mt-1 font-mono uppercase tracking-wider">
                      Pay ₹{currentFee}
                    </span>
                  </div>

                  {/* Payment Details & Copy Field */}
                  <div className="flex-1 space-y-3 text-left w-full">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase tracking-widest font-black block mb-1">
                        Department UPI ID
                      </span>
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md">
                        <span className="font-mono font-bold text-xs text-sky-300 flex-1 truncate">
                          {UPI_CONFIG.upiId}
                        </span>
                        <button
                          type="button"
                          onClick={copyUpiId}
                          className="px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-[10px] flex items-center gap-1 transition-all active:scale-95 shrink-0"
                        >
                          {copiedUpi ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Smartphone Intent Link */}
                    <a
                      href={upiIntentUri}
                      className="sm:hidden inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#00BAF2] to-[#0056D2] text-slate-950 font-black text-xs shadow-md"
                    >
                      <span>Open in GPay / PhonePe / Paytm</span>
                      <ExternalLink className="w-3 h-3 text-slate-950" />
                    </a>

                    <div className="text-[11px] text-slate-300 leading-relaxed space-y-0.5">
                      <p>1. Open Google Pay, PhonePe, or Paytm and transfer <strong>₹{currentFee}</strong>.</p>
                      <p>2. Copy the <strong>12-digit UPI Reference / UTR Number</strong> from receipt.</p>
                    </div>

                    {/* 12-Digit UTR Field */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider mb-1">
                        12-Digit UPI Transaction / UTR Number <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.upiReference}
                        onChange={(e) => setForm({ ...form, upiReference: e.target.value.replace(/[^0-9a-zA-Z]/g, "") })}
                        placeholder="e.g. 426819201948"
                        maxLength={18}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-base sm:text-xs font-mono font-bold text-white bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all ${
                          errors.upiReference ? "border-rose-400 bg-rose-950/30" : "border-white/20"
                        }`}
                      />
                      {errors.upiReference && (
                        <p className="text-[10px] text-rose-400 mt-1 font-semibold">{errors.upiReference}</p>
                      )}
                    </div>

                  </div>

                </div>

              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-2">
                <div className="font-bold flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-amber-700" />
                  <span>Pay at Seminar Hall Entrance Desk (Cash on 30 Sept)</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Your Digital QR Pass will be issued immediately! You can present your pass and hand over <strong>₹{currentFee} cash</strong> to the desk coordinator at 8:45 AM before seating.
                </p>
              </div>
            )}

          </div>

          {/* Submit Action Button */}
          <div className="pt-5 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#002970] via-[#0056D2] to-[#0041a3] hover:opacity-95 text-white font-black text-sm tracking-wide shadow-xl shadow-blue-900/20 hover:shadow-2xl transition-all active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Issuing Your Official Digital QR Pass...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration & Issue Digital Ticket (₹{currentFee})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Official Department System • Zero Surcharges • NBKRIST Verified</span>
            </div>
          </div>

        </form>

      </div>

      {/* ============================================================== */}
      {/* RIGHT COLUMN: STICKY "LIVE HOLOGRAPHIC PASS MATERIALIZATION"   */}
      {/* ============================================================== */}
      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
        
        {/* Pass Materialization Box */}
        <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-b from-[#0B1329] via-[#0F1E3D] to-[#0B1329] p-6 text-white shadow-2xl relative overflow-hidden holo-card-sheen">
          
          {/* Top Live Badge */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-300">
                Live Pass Materialization
              </span>
            </div>

            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 border border-white/10 text-white/80">
              {form.isIsteMember ? "ISTE CONCESSION" : "GENERAL TICKET"}
            </span>
          </div>

          {/* Pass Card Preview Body */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-4">
            
            {/* College & Department Branding */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white p-1 shrink-0 flex items-center justify-center">
                  <NbkristLogo className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-white/95 uppercase tracking-wide">
                    NBKRIST • IT & AI&DS
                  </h4>
                  <p className="text-[9px] text-sky-300/80 font-mono">
                    Prompt to Production Workshop
                  </p>
                </div>
              </div>

              <div className="w-7 h-7 rounded-full bg-white p-0.5 shrink-0 flex items-center justify-center">
                <IsteLogo className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Live Student Identity Display */}
            <div className="pt-2 border-t border-white/10">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black block">
                Attendee Name
              </span>
              <div className="text-base font-black tracking-tight text-white uppercase truncate mt-0.5">
                {form.fullName.trim() || "STUDENT NAME"}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-xs font-bold text-sky-400">
                  {form.rollNumber.trim() || "ROLL NUMBER"}
                </span>
                <span className="text-white/30">•</span>
                <span className="text-[11px] font-bold text-amber-300">
                  {form.branch} ({form.year.replace(" Year", "Y")})
                </span>
              </div>
            </div>

            {/* Event Logistics Badge Strip */}
            <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-white/10 text-white/80">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>30 Sept 2026</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>9:00 AM – 4:00 PM</span>
              </div>
              <div className="col-span-2 flex items-center gap-1.5 text-white/70">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="truncate">Seminar Hall, New CSE Block</span>
              </div>
            </div>

            {/* QR Scanner Live Thumbnail */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
                  Security Pass Token
                </span>
                <div className="text-xs font-mono font-bold text-white">
                  P2P-2026-PASS
                </div>
                <div className="text-[9px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCheck className="w-3 h-3" />
                  <span>Instant Check-in Ready</span>
                </div>
              </div>

              <div className="p-1.5 rounded-xl bg-white shrink-0 shadow-sm">
                {passQrPreviewUrl ? (
                  <img
                    src={passQrPreviewUrl}
                    alt="Pass Preview QR"
                    className="w-16 h-16 object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 bg-slate-200 animate-pulse rounded" />
                )}
              </div>
            </div>

          </div>

          <p className="text-[10px] text-white/50 text-center mt-3 font-mono">
            Encrypted NBKRIST Verification Token • Live Preview
          </p>

        </div>

        {/* What You Get Included Box */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3.5">
          <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-[#0056D2]" />
            <span>Included With Your Pass</span>
          </h4>

          <ul className="text-xs text-slate-600 space-y-2.5 font-medium">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Authorized Certificate:</strong> Issued jointly by Department of IT & AI&DS and ISTE.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Paytm & Microsoft Mentoring:</strong> Direct interaction with Mr. Suman Mandal & Mr. Shivam Behl.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Afternoon AI Build Challenge:</strong> Mentored hands-on coding sprint with surprise prizes.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Refreshments & Lunch:</strong> Full-day tea breaks and networking lunch provided at venue.
              </span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
}
