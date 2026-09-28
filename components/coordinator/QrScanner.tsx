"use client";

import React, { useState, useEffect, useRef } from "react";
import jsQR from "jsqr";
import { 
  Camera, 
  CameraOff, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Loader2, 
  Lock, 
  Unlock, 
  Banknote, 
  Users, 
  X, 
  Smartphone, 
  SwitchCamera, 
  Image as ImageIcon, 
  UploadCloud, 
  HelpCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { scannerAudio } from "@/lib/audio";

interface ScanResult {
  success: boolean;
  alreadyCheckedIn: boolean;
  message: string;
  payment?: {
    method: "upi" | "cash_at_desk";
    amount: number;
    upiReference?: string;
    status: string;
  };
  stats?: {
    total: number;
    checkedIn: number;
    remaining: number;
  };
  ticket?: {
    ticketNumber: string;
    registrationNumber: string;
    participantName: string;
    rollNumber: string;
    branch: string;
    year: string;
    attendanceStatus: string;
    checkedInAt?: string;
    checkedInBy?: string;
    isIsteMember?: boolean;
  };
}

interface AdmittedStudent {
  name: string;
  rollNumber: string;
  branch: string;
  time: string;
  paymentMethod: string;
  amount: number;
}

export function QrScanner({ operatorRole = "Volunteer" }: { operatorRole?: string }) {
  // Terminal Shift Unlock
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);

  // Scanner state
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [manualInput, setManualInput] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [lastScannedToken, setLastScannedToken] = useState<string | null>(null);
  const [pendingCashToken, setPendingCashToken] = useState<string | null>(null);
  const [isDecodingFile, setIsDecodingFile] = useState<boolean>(false);
  
  // Stats and history
  const [gateStats, setGateStats] = useState<{ total: number; checkedIn: number; remaining: number }>({
    total: 100,
    checkedIn: 0,
    remaining: 100
  });
  const [recentAdmissions, setRecentAdmissions] = useState<AdmittedStudent[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Check saved session unlock on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("ptop_scanner_shift_unlocked");
    if (saved === "1234") {
      setIsUnlocked(true);
    }
  }, []);

  const handlePinDigit = (digit: string) => {
    if (pinInput.length >= 4) return;
    const newPin = pinInput + digit;
    setPinInput(newPin);
    setPinError(null);

    if (newPin.length === 4) {
      if (newPin === "1234") {
        scannerAudio.playUnlock();
        setIsUnlocked(true);
        sessionStorage.setItem("ptop_scanner_shift_unlocked", "1234");
        setPinInput("");
        setPinError(null);
      } else {
        scannerAudio.playDuplicate();
        setPinError("Incorrect PIN. Enter 1234 to unlock.");
        setTimeout(() => setPinInput(""), 800);
      }
    }
  };

  const handleLockTerminal = () => {
    stopCamera();
    setIsUnlocked(false);
    sessionStorage.removeItem("ptop_scanner_shift_unlocked");
    setPinInput("");
    setLastResult(null);
  };

  // Safe Universal Camera Start (Works with iOS Safari, Chrome, and desktop)
  const startCamera = async (mode = facingMode) => {
    setCameraError(null);

    // Check for Secure Context / getUserMedia availability
    if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(
        "Live camera streaming requires an HTTPS connection or localhost. Use the 'Snap with Phone Camera' button below — it works 100% on every mobile phone!"
      );
      setCameraActive(false);
      return;
    }

    try {
      if (videoRef.current && videoRef.current.srcObject) {
        stopCamera();
      }

      // Try ideal constraints first
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: mode } },
          audio: false,
        });
      } catch {
        // Fallback to basic video constraint
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.setAttribute("webkit-playsinline", "true");
        videoRef.current.muted = true;

        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setCameraActive(true);
              scanFrame();
            })
            .catch(() => {
              setCameraError("Camera playback was paused by your browser. Tap 'Open Scanner' to resume.");
              setCameraActive(false);
            });
        }
      }
    } catch {
      setCameraError(
        "Camera access was blocked or denied. Please grant permission in browser settings, or use the failsafe 'Snap with Phone Camera' button below."
      );
      setCameraActive(false);
    }
  };

  const toggleCameraFacing = () => {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
    if (cameraActive) {
      startCamera(nextMode);
    }
  };

  const stopCamera = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const scanFrame = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          canvas.height = videoRef.current.videoHeight;
          canvas.width = videoRef.current.videoWidth;
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code && code.data && code.data !== lastScannedToken) {
            setLastScannedToken(code.data);
            verifyToken(code.data);
          }
        }
      }
    }
    animationFrameId.current = requestAnimationFrame(scanFrame);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Failsafe Photo Scanner (Native Mobile Camera & WhatsApp Screenshot upload)
  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsDecodingFile(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setIsDecodingFile(false);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "attemptBoth",
        });

        setIsDecodingFile(false);
        if (code && code.data) {
          verifyToken(code.data);
        } else {
          scannerAudio.playDuplicate();
          setLastResult({
            success: false,
            alreadyCheckedIn: false,
            message: "No QR code could be detected in this photo. Please retake closer with good lighting.",
          });
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Reset input so user can scan same file again if needed
    e.target.value = "";
  };

  const verifyToken = async (tokenString: string, confirmCash = false) => {
    setIsVerifying(true);
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: tokenString,
          pin: "1234",
          coordinatorName: `${operatorRole} (Gate)`,
          confirmCash,
        }),
      });

      const data: ScanResult = await res.json();
      setLastResult(data);

      if (data.stats) {
        setGateStats(data.stats);
      }

      if (data.alreadyCheckedIn) {
        scannerAudio.playDuplicate();
        setPendingCashToken(null);
      } else if (data.success && data.ticket) {
        // If cash at desk and not yet confirmed
        if (data.payment?.method === "cash_at_desk" && !confirmCash && data.payment?.status !== "paid") {
          scannerAudio.playCashAlert();
          setPendingCashToken(tokenString);
        } else {
          scannerAudio.playSuccess();
          setPendingCashToken(null);

          // Add to recent admissions
          setRecentAdmissions((prev) => [
            {
              name: data.ticket!.participantName,
              rollNumber: data.ticket!.rollNumber,
              branch: data.ticket!.branch,
              time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
              paymentMethod: data.payment?.method || "upi",
              amount: data.payment?.amount || 50,
            },
            ...prev.slice(0, 9),
          ]);
        }
      } else {
        scannerAudio.playDuplicate();
        setPendingCashToken(null);
      }
    } catch {
      scannerAudio.playDuplicate();
      setLastResult({
        success: false,
        alreadyCheckedIn: false,
        message: "Network error during check-in. Please retry.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleManualLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    verifyToken(manualInput.trim());
  };

  const handleConfirmCashAndAdmit = () => {
    if (!pendingCashToken) return;
    verifyToken(pendingCashToken, true);
  };

  // --------------------------------------------------------------------------
  // LOCKED TERMINAL SCREEN (Option 3)
  // --------------------------------------------------------------------------
  if (!isUnlocked) {
    return (
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl max-w-sm sm:max-w-md mx-auto text-center space-y-6">
        
        <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-[#00BAF2] flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#00BAF2] bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800/80">
            Seminar Hall Gate Terminal
          </span>
          <h3 className="text-xl font-black tracking-tight mt-3 text-white">
            Scanner Locked
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
            Enter the 4-digit Staff PIN (<strong>1234</strong>) to unlock the scanner shift for {operatorRole}.
          </p>
        </div>

        {/* 4-Digit Display Indicator */}
        <div className="flex items-center justify-center gap-3.5 py-2">
          {[0, 1, 2, 3].map((idx) => {
            const hasChar = pinInput.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border transition-all ${
                  hasChar
                    ? "bg-[#00BAF2] border-[#00BAF2] shadow-sm shadow-sky-400/50 scale-125"
                    : "border-slate-700 bg-slate-800/80"
                }`}
              />
            );
          })}
        </div>

        {pinError && (
          <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold animate-in shake">
            {pinError}
          </div>
        )}

        {/* Large Touch-First Mobile Numpad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto pt-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handlePinDigit(num)}
              className="h-14 sm:h-16 rounded-2xl bg-slate-800/90 hover:bg-slate-700 active:bg-[#0056D2] text-white font-mono font-bold text-2xl active:scale-95 transition-all border border-slate-700/60 shadow-sm flex items-center justify-center select-none"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPinInput("")}
            className="h-14 sm:h-16 rounded-2xl bg-slate-800/40 hover:bg-slate-800 active:scale-95 text-slate-400 font-bold text-xs flex items-center justify-center select-none"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handlePinDigit("0")}
            className="h-14 sm:h-16 rounded-2xl bg-slate-800/90 hover:bg-slate-700 active:bg-[#0056D2] text-white font-mono font-bold text-2xl active:scale-95 transition-all border border-slate-700/60 shadow-sm flex items-center justify-center select-none"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => setPinInput((prev) => prev.slice(0, -1))}
            className="h-14 sm:h-16 rounded-2xl bg-slate-800/40 hover:bg-slate-800 active:scale-95 text-slate-400 font-bold text-sm flex items-center justify-center select-none"
          >
            ⌫
          </button>
        </div>

        <p className="text-[11px] text-slate-500 font-mono">
          Authorized for Admin & Coordinators
        </p>

      </div>
    );
  }

  // --------------------------------------------------------------------------
  // UNLOCKED SCANNER TERMINAL INTERFACE
  // --------------------------------------------------------------------------
  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      
      {/* Hidden file inputs for Native Camera & Gallery uploads */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        onChange={handleImageFile}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*"
        ref={galleryInputRef}
        onChange={handleImageFile}
        className="hidden"
      />

      {/* Top Shift Status & Live Gate Progress Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <span className="text-xs font-black text-slate-900 block leading-tight">
                Gate Scanner Active
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {operatorRole} • PIN 1234
              </span>
            </div>
          </div>

          <button
            onClick={handleLockTerminal}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all active:scale-95 shrink-0"
          >
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Lock</span>
          </button>

        </div>

        {/* Live Gate Counter Bar */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#0056D2]" />
              <span>Admitted: <strong className="text-slate-900">{gateStats.checkedIn}</strong> of {gateStats.total}</span>
            </span>
            <span className="text-slate-500 font-mono text-[11px]">
              {gateStats.remaining} remaining
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#002970] via-[#0056D2] to-[#00BAF2] rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(5, (gateStats.checkedIn / (gateStats.total || 100)) * 100))}%`,
              }}
            />
          </div>
        </div>

      </div>

      {/* Main Touch-First Scanner Action Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-md space-y-4">
        
        {/* Fast Action Buttons Grid (Designed for Mobile Thumbs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* PRIMARY FAILSAFE: Snap with Phone Camera */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            disabled={isDecodingFile || isVerifying}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-[#002970] via-[#0056D2] to-[#0041a3] hover:opacity-95 text-white font-extrabold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Camera className="w-5 h-5 text-[#00BAF2]" />
            <span>Snap QR with Phone Camera</span>
          </button>

          {/* SECONDARY: Live Video Stream / Gallery */}
          <div className="flex gap-2">
            {!cameraActive ? (
              <button
                type="button"
                onClick={() => startCamera()}
                className="flex-1 py-4 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
              >
                <Smartphone className="w-4 h-4 text-[#0056D2]" />
                <span>Live Video Mode</span>
              </button>
            ) : (
              <div className="flex-1 flex gap-2">
                <button
                  type="button"
                  onClick={toggleCameraFacing}
                  className="flex-1 py-4 px-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200"
                >
                  <SwitchCamera className="w-4 h-4 text-[#0056D2]" />
                  <span>Flip</span>
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="flex-1 py-4 px-2 rounded-2xl bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <CameraOff className="w-4 h-4" />
                  <span>Pause</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="py-4 px-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200 flex items-center justify-center"
              title="Pick from Photo Gallery / WhatsApp Screenshot"
            >
              <ImageIcon className="w-4 h-4 text-slate-600" />
            </button>
          </div>

        </div>

        {/* Video Viewport for Live Mode */}
        {cameraActive && (
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 aspect-[4/3] sm:aspect-video max-w-lg mx-auto flex items-center justify-center border-2 border-[#0056D2] shadow-2xl mt-4">
            <video ref={videoRef} playsInline muted autoPlay className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />

            {/* Target Reticle */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-52 h-52 sm:w-60 sm:h-60 border-2 border-white/60 rounded-3xl relative shadow-inner">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#00BAF2] rounded-tl-xl -mt-1 -ml-1"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#00BAF2] rounded-tr-xl -mt-1 -mr-1"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#00BAF2] rounded-bl-xl -mb-1 -ml-1"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#00BAF2] rounded-br-xl -mb-1 -mr-1"></div>
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#00BAF2] to-transparent shadow-[0_0_8px_#00BAF2] animate-pulse mt-28" />
              </div>
            </div>

            <div className="absolute bottom-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-4 py-1 rounded-full flex items-center gap-1.5">
              <span>Align QR inside square</span>
            </div>
          </div>
        )}

        {cameraError && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed font-medium">
              {cameraError}
            </div>
          </div>
        )}

        {(isVerifying || isDecodingFile) && (
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-[#002970] text-xs font-bold flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#0056D2]" />
            <span>{isDecodingFile ? "Scanning photo for QR token..." : "Verifying ticket in database..."}</span>
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* OUTCOME BANNER (GREEN ADMITTED / RED REJECT / AMBER CASH)    */}
        {/* ------------------------------------------------------------ */}
        {lastResult && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            
            {/* CASH COLLECTION PROMPT */}
            {pendingCashToken && lastResult.ticket && (
              <div className="p-5 sm:p-6 rounded-3xl bg-amber-400 text-slate-950 border-2 border-amber-500 shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-slate-950 text-amber-400 shrink-0">
                    <Banknote className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider block">
                      Gate Payment Action Required
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black tracking-tight">
                      COLLECT ₹{lastResult.payment?.amount || 50} IN CASH
                    </h4>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/10 text-xs font-medium space-y-1">
                  <div><strong>Student:</strong> {lastResult.ticket.participantName}</div>
                  <div><strong>Roll Number:</strong> <span className="font-mono font-bold">{lastResult.ticket.rollNumber}</span> ({lastResult.ticket.branch})</div>
                  <div><strong>Ticket Tier:</strong> {lastResult.ticket.isIsteMember ? "ISTE Concession (₹50)" : "General Student (₹100)"}</div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmCashAndAdmit}
                  disabled={isVerifying}
                  className="w-full py-4 px-4 rounded-2xl bg-slate-950 hover:bg-slate-900 active:bg-slate-800 text-white font-black text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Confirm ₹{lastResult.payment?.amount || 50} Cash Received & Admit</span>
                </button>
              </div>
            )}

            {/* DUPLICATE PASS ALERT (RED SCREEN) */}
            {!pendingCashToken && lastResult.alreadyCheckedIn && (
              <div className="p-5 sm:p-6 rounded-3xl bg-rose-600 text-white border-2 border-rose-700 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-2xl bg-white/20 shrink-0">
                    <AlertTriangle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-200 block">
                      Security Alert • Duplicate Scan
                    </span>
                    <h4 className="text-lg sm:text-xl font-black tracking-tight">
                      DENY ENTRY — PASS ALREADY USED
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-rose-100 font-medium leading-relaxed">
                  {lastResult.message}
                </p>

                {lastResult.ticket && (
                  <div className="p-3.5 rounded-2xl bg-white/10 text-xs font-mono space-y-0.5">
                    <div>Student: <strong>{lastResult.ticket.participantName}</strong></div>
                    <div>Roll: {lastResult.ticket.rollNumber} • {lastResult.ticket.branch}</div>
                    <div>Ticket ID: {lastResult.ticket.ticketNumber}</div>
                  </div>
                )}
              </div>
            )}

            {/* SUCCESSFUL ADMISSION (GREEN SCREEN) */}
            {!pendingCashToken && lastResult.success && !lastResult.alreadyCheckedIn && lastResult.ticket && (
              <div className="p-5 sm:p-6 rounded-3xl bg-emerald-600 text-white border-2 border-emerald-700 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-2xl bg-white/20 shrink-0">
                      <CheckCircle2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200 block">
                        Verified & Admitted
                      </span>
                      <h4 className="text-xl font-black tracking-tight">
                        {lastResult.ticket.participantName}
                      </h4>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-xl bg-white text-emerald-950 font-black text-xs font-mono">
                    ADMITTED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-white/20">
                  <div>
                    <span className="text-emerald-200 text-[10px] block">ROLL NUMBER</span>
                    <span className="font-mono font-bold text-sm">{lastResult.ticket.rollNumber}</span>
                  </div>
                  <div>
                    <span className="text-emerald-200 text-[10px] block">BRANCH & YEAR</span>
                    <span className="font-bold">{lastResult.ticket.branch} • {lastResult.ticket.year}</span>
                  </div>
                </div>

                <div className="text-[11px] text-emerald-100 flex items-center justify-between pt-1">
                  <span>Payment: {lastResult.payment?.method === "upi" ? "UPI Online (Verified)" : "Cash at Desk (Received)"}</span>
                  <span className="font-mono">Pass: {lastResult.ticket.ticketNumber}</span>
                </div>
              </div>
            )}

            {/* TICKET NOT FOUND (INVALID CODE) */}
            {!lastResult.success && !lastResult.alreadyCheckedIn && (
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 text-xs flex items-center gap-2.5">
                <X className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="font-medium">{lastResult.message}</span>
              </div>
            )}

          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* MANUAL ROLL NUMBER / TOKEN SEARCH FALLBACK                   */}
        {/* ------------------------------------------------------------ */}
        <div className="pt-3 border-t border-slate-100">
          <form onSubmit={handleManualLookup} className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Manual Check-in (Type Roll Number)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value.toUpperCase())}
                placeholder="e.g. 22031A0512"
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 text-base sm:text-sm font-mono font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="submit"
                disabled={isVerifying || !manualInput.trim()}
                className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold text-xs transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Verify</span>
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Recent Admissions Feed */}
      {recentAdmissions.length > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#0056D2]" />
            <span>Recent Admissions ({recentAdmissions.length})</span>
          </h4>

          <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
            {recentAdmissions.map((s, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{s.name}</span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {s.rollNumber} • {s.branch}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {s.time}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {s.paymentMethod === "upi" ? "UPI" : "Cash"} ₹{s.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
