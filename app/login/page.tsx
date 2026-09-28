"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NbkristLogo, IsteLogo } from "@/components/ui/Logos";
import { 
  User, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  QrCode, 
  Sparkles,
  Ticket,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldAlert,
  Loader2
} from "lucide-react";

type RoleMode = "participant" | "coordinator" | "admin";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const roleParam = searchParams.get("role") as RoleMode | null;
  const errorParam = searchParams.get("error");

  const [roleMode, setRoleMode] = useState<RoleMode>(
    roleParam === "admin" || roleParam === "coordinator" ? roleParam : "participant"
  );
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  // Sync role if query parameter changes
  useEffect(() => {
    if (roleParam === "admin") {
      setRoleMode("admin");
    } else if (roleParam === "coordinator") {
      setRoleMode("coordinator");
    }
  }, [roleParam]);

  // Display initial error messages from query params
  useEffect(() => {
    if (errorParam === "auth_required") {
      setError("Confidential Area: Direct URL access is prohibited. Please sign in with authorized credentials.");
    } else if (errorParam === "admin_unauthorized") {
      setError("Unauthorized: Administrator privileges required. Please log in with admin credentials.");
    } else if (errorParam === "coordinator_unauthorized") {
      setError("Unauthorized: Staff Coordinator privileges required.");
    }
  }, [errorParam]);

  // Google Sign-In via Firebase
  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleLoading(true);

    try {
      const { auth, googleProvider, isFirebaseConfigured } = await import("@/lib/firebase/config");

      if (!isFirebaseConfigured() || !auth || !googleProvider) {
        setError(
          "Firebase credentials not detected. Please sign in below using your College Roll Number, or configure NEXT_PUBLIC_FIREBASE_* in your environment."
        );
        setIsGoogleLoading(false);
        return;
      }

      const { signInWithPopup } = await import("firebase/auth");
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user.email) {
        throw new Error("Unable to retrieve email from Google Account.");
      }

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          displayName: user.displayName,
          uid: user.uid,
          photoURL: user.photoURL,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create session from Google account.");
      }

      setAuthSuccess(true);
      setTimeout(() => {
        router.push(data.redirectUrl || "/dashboard");
        router.refresh();
      }, 500);
    } catch (err: unknown) {
      console.error("Google sign in error:", err);
      const msg = err instanceof Error ? err.message : "Google authentication was cancelled or failed.";
      if (msg.includes("popup-closed-by-user") || msg.includes("cancelled-popup-request")) {
        setError("Google sign-in popup was closed. Please try again or enter your Roll Number.");
      } else {
        setError(msg);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (roleMode === "participant") {
      if (!identifier.trim()) {
        setError("Please enter your College Roll Number or registered Email.");
        return;
      }
    } else if (roleMode === "coordinator") {
      if (!password.trim()) {
        setError("Please enter the coordinator password.");
        return;
      }
    } else if (roleMode === "admin") {
      if (!password.trim()) {
        setError("Please enter the confidential admin password.");
        return;
      }
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: roleMode,
          identifier: identifier.trim() || undefined,
          password: password.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Authentication failed. Please verify your credentials.");
        setIsLoading(false);
        return;
      }

      setAuthSuccess(true);
      setTimeout(() => {
        router.push(data.redirectUrl || "/dashboard");
        router.refresh();
      }, 300);
    } catch {
      setError("Network or server connection error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full">
      {/* Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Top Accent Bar based on active role */}
        <div 
          className={`absolute top-0 left-0 right-0 h-1.5 transition-colors ${
            roleMode === "admin" 
              ? "bg-gradient-to-r from-purple-600 via-rose-600 to-amber-500" 
              : roleMode === "coordinator" 
              ? "bg-gradient-to-r from-emerald-500 to-sky-500" 
              : "bg-gradient-to-r from-[#0056D2] to-[#00b9f5]"
          }`} 
        />

        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="flex items-center justify-center gap-3">
            <NbkristLogo className="w-12 h-12" />
            <IsteLogo className="w-9 h-9 rounded-full bg-white p-0.5" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Prompt to Production Portal
          </h1>
          <p className="text-xs text-slate-500">
            N.B.K.R. Institute of Science & Technology • Dept of IT & AI&DS
          </p>
        </div>

        {/* Role Mode Selector (3 Modes) */}
        <div className="p-1 rounded-2xl bg-slate-100 grid grid-cols-3 text-xs font-bold gap-1">
          <button
            type="button"
            onClick={() => {
              setRoleMode("participant");
              setError(null);
            }}
            className={`py-2 px-1 rounded-xl transition-all text-center ${
              roleMode === "participant" 
                ? "bg-white text-[#0056D2] shadow-xs" 
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Participant
          </button>

          <button
            type="button"
            onClick={() => {
              setRoleMode("coordinator");
              setError(null);
            }}
            className={`py-2 px-1 rounded-xl transition-all text-center ${
              roleMode === "coordinator" 
                ? "bg-white text-emerald-700 shadow-xs" 
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Coordinator
          </button>

          <button
            type="button"
            onClick={() => {
              setRoleMode("admin");
              setError(null);
            }}
            className={`py-2 px-1 rounded-xl transition-all text-center ${
              roleMode === "admin" 
                ? "bg-white text-purple-700 shadow-xs" 
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Admin
          </button>
        </div>

        {/* Role Information Banner */}
        <div className="text-[11px] px-3.5 py-2.5 rounded-xl flex items-center gap-2 border bg-slate-50 border-slate-200 text-slate-600">
          {roleMode === "participant" && (
            <>
              <Ticket className="w-4 h-4 text-[#0056D2] shrink-0" />
              <span>Access your Workshop Pass, QR Code & Submission status.</span>
            </>
          )}
          {roleMode === "coordinator" && (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Entrance desk console: live camera QR scanner & check-in.</span>
            </>
          )}
          {roleMode === "admin" && (
            <>
              <ShieldAlert className="w-4 h-4 text-purple-600 shrink-0" />
              <span className="font-semibold text-purple-900">
                Confidential Master Console: analytics, CSV export & controls.
              </span>
            </>
          )}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-800 text-xs border border-rose-200 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Google One-Click Login for Participants */}
        {roleMode === "participant" && (
          <div className="space-y-3 pt-1">
            <button
              type="button"
              disabled={isGoogleLoading || isLoading}
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-3 transition-all shadow-xs cursor-pointer disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                  <span>Connecting with Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27A7.18 7.18 0 0 1 4.9 12c0-.79.14-1.56.38-2.27V6.58H1.27A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.27 5.42l4.01-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider absolute">
                or sign in with roll number
              </span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Identifier field */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {roleMode === "participant" 
                ? "College Roll Number or Registered Email" 
                : roleMode === "coordinator" 
                ? "Coordinator Staff ID / Email" 
                : "Admin Identifier / Email"}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  roleMode === "participant" 
                    ? "e.g. 22031A0512 or student@nbkrist.org" 
                    : roleMode === "coordinator" 
                    ? "coordinator@nbkrist.org" 
                    : "admin@nbkrist.org"
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-base sm:text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900"
              />
            </div>
          </div>

          {/* Password field for Coordinator and Admin */}
          {roleMode !== "participant" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  {roleMode === "admin" ? "Confidential Admin Password" : "Coordinator Password"}
                </label>
                <span className="text-[10px] text-slate-400 font-medium">Strictly confidential</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter authorized password..."
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-base sm:text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || authSuccess}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-white ${
              roleMode === "admin" 
                ? "bg-purple-700 hover:bg-purple-800" 
                : roleMode === "coordinator" 
                ? "bg-emerald-700 hover:bg-emerald-800" 
                : "bg-[#0056D2] hover:bg-[#0041a3]"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : authSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Authorized! Redirecting...</span>
              </>
            ) : (
              <>
                <span>
                  {roleMode === "participant" 
                    ? "Access Participant Dashboard" 
                    : roleMode === "coordinator" 
                    ? "Enter Coordinator Console" 
                    : "Enter Admin Master Console"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="pt-2 text-center text-xs text-slate-500 space-y-2 border-t border-slate-100">
          {roleMode === "participant" ? (
            <div>
              Haven&apos;t registered yet?{" "}
              <Link href="/register" className="font-bold text-[#0056D2] hover:underline">
                Register for Workshop (₹50 / ₹100)
              </Link>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400">
              Staff console access is restricted to verified departmental coordinators and administrators.
            </div>
          )}
        </div>

      </div>

      <div className="mt-6 text-center text-xs text-slate-400">
        Prompt to Production – Paytm AI Workshop • 30 September 2026
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
        <Suspense fallback={
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#0056D2] mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading secure portal...</p>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
