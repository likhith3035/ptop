"use client";

import React, { useState, useEffect } from "react";
import { 
  EventConfig, 
  DigitalTicket, 
  ParticipantProfile, 
  Registration, 
  PaymentRecord, 
  Team, 
  ProjectSubmission, 
  AnnouncementItem,
  ResourceItem,
  CertificateItem
} from "@/types";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Settings, 
  ShieldCheck, 
  Bell, 
  Award, 
  Download, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Filter, 
  ChevronRight,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  LogOut,
  QrCode,
  Mail,
  Send,
  ExternalLink,
  Check,
  Edit2,
  UserPlus,
  X,
  Trash2,
  AlertTriangle,
  KeyRound,
  Lock,
  Unlock,
  Clock,
  GitBranch,
  Star
} from "lucide-react";
import { QrScanner } from "@/components/coordinator/QrScanner";

interface AdminDashboardProps {
  eventConfig: EventConfig;
  stats: {
    totalRegistrations: number;
    confirmedRegistrations: number;
    isteParticipants: number;
    nonIsteParticipants: number;
    checkedInParticipants: number;
    totalTeams: number;
    totalSubmissions: number;
    openSupportTickets: number;
    totalRevenue: number;
    capacity: number;
  };
  tickets: DigitalTicket[];
  profiles: ParticipantProfile[];
  registrations: Registration[];
  payments: PaymentRecord[];
  teams: Team[];
  submissions: ProjectSubmission[];
  announcements: AnnouncementItem[];
  resources: ResourceItem[];
  certificates?: CertificateItem[];
}

export function AdminDashboardClient({
  eventConfig: initialConfig,
  stats: initialStats,
  tickets: initialTickets,
  profiles: initialProfiles = [],
  registrations: initialRegistrations = [],
  payments,
  teams,
  submissions: initialSubmissions,
  announcements: initialAnnouncements,
  resources,
  certificates: initialCertificates = [],
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "scanner" | "participants" | "payments" | "event" | "coordinators" | "announcements" | "submissions" | "certificates"
  >("overview");

  // Core Data State
  const [profiles, setProfiles] = useState<ParticipantProfile[]>(initialProfiles);
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);
  const [tickets, setTickets] = useState<DigitalTicket[]>(initialTickets);
  const [stats, setStats] = useState(initialStats);

  // Event Config Form State
  const [config, setConfig] = useState<EventConfig>(initialConfig);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configMessage, setConfigMessage] = useState<string | null>(null);

  // Participant Table Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [attendanceFilter, setAttendanceFilter] = useState("ALL");

  // Announcement Form State
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(initialAnnouncements);
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annPriority, setAnnPriority] = useState<"normal" | "urgent">("normal");
  const [isPostingAnn, setIsPostingAnn] = useState(false);

  // Submissions State & Controls
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>(initialSubmissions);
  const [subSearchQuery, setSubSearchQuery] = useState("");
  const [subStatusFilter, setSubStatusFilter] = useState("ALL");
  const [isTogglingSubmissions, setIsTogglingSubmissions] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<{
    id: string;
    projectName: string;
    teamName?: string;
    score: number;
    feedback: string;
  } | null>(null);
  const [isSubmittingGrade, setIsSubmittingGrade] = useState(false);
  const [gradeMessage, setGradeMessage] = useState<string | null>(null);

  // Certificates State
  const [certificates, setCertificates] = useState<CertificateItem[]>(initialCertificates);
  const [isGeneratingCerts, setIsGeneratingCerts] = useState(false);
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [certActionMessage, setCertActionMessage] = useState<string | null>(null);
  const [certSearch, setCertSearch] = useState("");

  // Edit Modal State
  const [editingProfile, setEditingProfile] = useState<{
    id: string;
    fullName: string;
    rollNumber: string;
    branch: string;
    year: string;
    email: string;
  } | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Manual Entry State
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualForm, setManualForm] = useState({
    fullName: "", rollNumber: "", branch: "IT", year: "2nd Year", email: "", mobile: "", section: "A"
  });
  const [isAddingManual, setIsAddingManual] = useState(false);

  // Delete Modal State & Logic (Password required: "delete")
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    mode: "all" | "single";
    targetId?: string;
    targetName?: string;
    targetRoll?: string;
  }>({
    isOpen: false,
    mode: "all",
  });
  const [deletePasswordInput, setDeletePasswordInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const executeDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deletePasswordInput.trim() !== "delete") {
      setDeleteError("Incorrect password! You must type 'delete' to proceed.");
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: deletePasswordInput.trim(),
          mode: deleteModal.mode,
          participantId: deleteModal.targetId,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setDeleteError(data.error || "Failed to execute deletion.");
      } else {
        setDeleteSuccess(data.message || "Deletion successful.");
        if (deleteModal.mode === "all") {
          setProfiles([]);
          setTickets([]);
          setRegistrations([]);
          setCertificates([]);
          if (data.stats) setStats(data.stats);
        } else if (deleteModal.mode === "single" && deleteModal.targetId) {
          const id = deleteModal.targetId;
          const roll = deleteModal.targetRoll?.toUpperCase();
          setProfiles((prev) => prev.filter((p) => p.id !== id && p.rollNumber.toUpperCase() !== roll));
          setTickets((prev) => prev.filter((t) => t.id !== id && t.rollNumber.toUpperCase() !== roll));
          setRegistrations((prev) => prev.filter((r) => r.participantId !== id));
          setCertificates((prev) => prev.filter((c) => c.participantId !== id && c.rollNumber?.toUpperCase() !== roll));
          if (data.stats) setStats(data.stats);
        }
        setTimeout(() => {
          setDeleteModal({ isOpen: false, mode: "all" });
          setDeletePasswordInput("");
          setDeleteSuccess(null);
        }, 1000);
      }
    } catch {
      setDeleteError("Network error while trying to delete.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Realtime Database listeners for live check-in counters and project submissions
  useEffect(() => {
    let unsubStats: (() => void) | null = null;
    let unsubSubs: (() => void) | null = null;
    let unsubAtt: (() => void) | null = null;
    let isMounted = true;

    const connectRtdb = async () => {
      try {
        const { rtdb } = await import("@/lib/firebase/config");
        if (!rtdb) return;

        const { ref, onValue } = await import("firebase/database");

        // 1. Live stats listener (checked in count updates on gate scans)
        const statsRef = ref(rtdb, "stats");
        unsubStats = onValue(statsRef, (snapshot) => {
          if (!isMounted) return;
          if (snapshot.exists()) {
            const data = snapshot.val();
            if (data && typeof data.checkedIn === "number") {
              setStats((prev) => ({
                ...prev,
                checkedInParticipants: data.checkedIn,
              }));
            }
          }
        });

        // 2. Live submissions listener (new submissions appear in real time)
        const subsRef = ref(rtdb, "submissions");
        unsubSubs = onValue(subsRef, (snapshot) => {
          if (!isMounted) return;
          if (snapshot.exists()) {
            const data = snapshot.val();
            if (data && typeof data === "object") {
              const liveSubs = Object.values(data) as ProjectSubmission[];
              if (liveSubs.length > 0) {
                setSubmissions((prev) => {
                  const map = new Map(prev.map((s) => [s.id, s]));
                  for (const s of liveSubs) {
                    map.set(s.id, s);
                  }
                  return Array.from(map.values());
                });
              }
            }
          }
        });

        // 3. Live individual attendance listener
        const attRef = ref(rtdb, "attendance");
        unsubAtt = onValue(attRef, (snapshot) => {
          if (!isMounted) return;
          if (snapshot.exists()) {
            const data = snapshot.val();
            if (data && typeof data === "object") {
              const checkedInTicketNums = new Set(Object.keys(data));
              setTickets((prev) =>
                prev.map((t) =>
                  checkedInTicketNums.has(t.ticketNumber)
                    ? { ...t, attendanceStatus: "checked_in" }
                    : t
                )
              );
            }
          }
        });
      } catch {
        // Non-blocking fallback
      }
    };

    connectRtdb();

    return () => {
      isMounted = false;
      if (unsubStats) unsubStats();
      if (unsubSubs) unsubSubs();
      if (unsubAtt) unsubAtt();
    };
  }, []);

  // Filtered Participants
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBranch = branchFilter === "ALL" || t.branch === branchFilter;
    const matchesAttendance =
      attendanceFilter === "ALL" ||
      (attendanceFilter === "CHECKED_IN" && t.attendanceStatus === "checked_in") ||
      (attendanceFilter === "PENDING" && t.attendanceStatus === "pending");

    return matchesSearch && matchesBranch && matchesAttendance;
  });

  // CSV Export Functionality
  const exportToCSV = () => {
    const headers = [
      "Registration Number",
      "Full Name",
      "Roll Number",
      "Branch",
      "Year",
      "ISTE Member",
      "Fee (INR)",
      "Payment Mode",
      "UPI Reference / UTR",
      "Attendance Status",
      "Ticket Number"
    ];

    const rows = filteredTickets.map((t) => {
      const reg = registrations.find((r) => r.registrationNumber === t.registrationNumber);
      return [
        `"${t.registrationNumber}"`,
        `"${t.participantName}"`,
        `"${t.rollNumber}"`,
        `"${t.branch}"`,
        `"${t.year}"`,
        `"${t.isIsteMember ? "Yes" : "No"}"`,
        `"${reg?.amount || (t.isIsteMember ? 50 : 100)}"`,
        `"${reg?.paymentMethod === "cash_at_desk" ? "Cash at Venue Desk" : "Direct UPI"}"`,
        `"${reg?.upiReference || "N/A"}"`,
        `"${t.attendanceStatus}"`,
        `"${t.ticketNumber}"`,
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Prompt_to_Production_Attendees_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save Event Configuration
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    setConfigMessage(null);
    try {
      const res = await fetch("/api/admin/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedParticipants: config.expectedParticipants,
          isteFee: config.isteFee,
          nonIsteFee: config.nonIsteFee,
          isRegistrationOpen: config.isRegistrationOpen,
          isSubmissionOpen: config.isSubmissionOpen,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setConfig(data.eventConfig);
        setConfigMessage("Event configuration updated successfully!");
      }
    } catch {
      setConfigMessage("Failed to update event configuration.");
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Toggle Submissions Open / Closed
  const handleToggleSubmissions = async () => {
    setIsTogglingSubmissions(true);
    const nextVal = !config.isSubmissionOpen;
    try {
      const res = await fetch("/api/admin/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSubmissionOpen: nextVal }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setConfig(data.eventConfig);
      }
    } catch (err) {
      console.error("Toggle submission error", err);
    } finally {
      setIsTogglingSubmissions(false);
    }
  };

  // Save Grade / Evaluation for a submission
  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;
    setIsSubmittingGrade(true);
    setGradeMessage(null);
    try {
      const res = await fetch("/api/submission", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: gradingSubmission.id,
          score: gradingSubmission.score,
          feedback: gradingSubmission.feedback,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.submissions) {
          setSubmissions(data.submissions);
        } else if (data.submission) {
          setSubmissions((prev) =>
            prev.map((s) => (s.id === data.submission.id ? data.submission : s))
          );
        }
        setGradeMessage("Grade and evaluation feedback saved successfully!");
        setTimeout(() => {
          setGradingSubmission(null);
          setGradeMessage(null);
        }, 1200);
      }
    } catch (err) {
      console.error("Error saving grade", err);
    } finally {
      setIsSubmittingGrade(false);
    }
  };

  // Export Submissions to CSV
  const exportSubmissionsCSV = () => {
    const headers = [
      "Project Name",
      "Team Name",
      "Submitter Name",
      "Roll Number",
      "Branch",
      "Email",
      "Problem Statement",
      "Architecture / Prompts",
      "Technologies",
      "GitHub Repo",
      "Live Demo",
      "Presentation Link",
      "Status",
      "Jury Score (100)",
      "Jury Feedback",
      "Submission Timestamp",
    ];

    const rows = submissions.map((s) => [
      `"${s.projectName.replace(/"/g, '""')}"`,
      `"${(s.teamName || "N/A").replace(/"/g, '""')}"`,
      `"${(s.submitterName || "N/A").replace(/"/g, '""')}"`,
      `"${(s.rollNumber || "N/A").replace(/"/g, '""')}"`,
      `"${(s.branch || "N/A").replace(/"/g, '""')}"`,
      `"${(s.email || "N/A").replace(/"/g, '""')}"`,
      `"${s.problemStatement.replace(/"/g, '""')}"`,
      `"${(s.projectDescription || "").replace(/"/g, '""')}"`,
      `"${(s.technologiesUsed || []).join(", ").replace(/"/g, '""')}"`,
      `"${s.githubUrl || ""}"`,
      `"${s.liveDemoUrl || ""}"`,
      `"${s.presentationUrl || ""}"`,
      `"${s.status}"`,
      `"${s.evaluationScore ?? "Unscored"}"`,
      `"${(s.evaluationFeedback || "").replace(/"/g, '""')}"`,
      `"${new Date(s.updatedAt || s.createdAt).toLocaleString("en-IN")}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Prompt_to_Production_Submissions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Post Announcement
  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    setIsPostingAnn(true);
    try {
      const res = await fetch("/api/admin/announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: annTitle.trim(),
          content: annContent.trim(),
          priority: annPriority,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAnnouncements([data.announcement, ...announcements]);
        setAnnTitle("");
        setAnnContent("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPostingAnn(false);
    }
  };

  // Generate All Certificates
  const handleGenerateAllCerts = async () => {
    setIsGeneratingCerts(true);
    setCertActionMessage(null);
    try {
      const res = await fetch("/api/admin/certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generateAll: true }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCertificates(data.certificates);
        setCertActionMessage(data.message || "All certificates generated successfully!");
      }
    } catch {
      setCertActionMessage("Failed to generate certificates. Please try again.");
    } finally {
      setIsGeneratingCerts(false);
    }
  };

  // Generate Single Certificate
  const handleGenerateSingleCert = async (participantId: string) => {
    try {
      const res = await fetch("/api/admin/certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.certificate) {
        setCertificates([...certificates.filter((c) => c.participantId !== participantId), data.certificate]);
        setCertActionMessage(`Certificate generated for participant!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Send All Certificates Email
  const handleSendAllEmails = async () => {
    setIsSendingEmails(true);
    setCertActionMessage(null);
    try {
      const res = await fetch("/api/admin/certificate/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sendAll: true }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCertActionMessage(`🎉 ${data.message}`);
        // Refresh certificates to update emailedAt
        const certRes = await fetch("/api/admin/certificate");
        const certData = await certRes.json();
        if (certData.certificates) {
          setCertificates(certData.certificates);
        }
      }
    } catch {
      setCertActionMessage("Failed to dispatch emails. Please try again.");
    } finally {
      setIsSendingEmails(false);
    }
  };

  // Send Single Email
  const handleSendSingleEmail = async (certId: string, email: string) => {
    try {
      const res = await fetch("/api/admin/certificate/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificateId: certId }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.detail?.mailtoUrl) {
        setCertActionMessage(`Email dispatched to ${email}! Opening email composer...`);
        window.open(data.detail.mailtoUrl, "_blank");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Edit Profile & Issue/Regenerate Certificate
  const handleEditSaveAndIssue = async (issueCert: boolean = true) => {
    if (!editingProfile) return;
    setIsSavingEdit(true);
    setCertActionMessage(null);
    try {
      const res = await fetch("/api/admin/certificate", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId: editingProfile.id,
          overrides: {
            fullName: editingProfile.fullName,
            rollNumber: editingProfile.rollNumber,
            branch: editingProfile.branch,
            year: editingProfile.year,
          },
          issueCert,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCertActionMessage(data.message);
        if (data.certificate) {
          setCertificates([
            ...certificates.filter((c) => c.participantId !== editingProfile.id),
            data.certificate,
          ]);
        }
        setEditingProfile(null);
        // Refresh certificate data
        const certRes = await fetch("/api/admin/certificate");
        const certData = await certRes.json();
        if (certData.certificates) setCertificates(certData.certificates);
      }
    } catch (e) {
      console.error(e);
      setCertActionMessage("Failed to update profile.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Manual Entry — Add Walk-in Participant & Issue Certificate
  const handleManualEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.fullName.trim() || !manualForm.rollNumber.trim()) return;
    setIsAddingManual(true);
    setCertActionMessage(null);
    try {
      const res = await fetch("/api/admin/certificate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manualForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCertActionMessage(data.message);
        if (data.certificate) {
          setCertificates([...certificates, data.certificate]);
        }
        setManualForm({ fullName: "", rollNumber: "", branch: "IT", year: "2nd Year", email: "", mobile: "", section: "A" });
        setShowManualEntry(false);
      }
    } catch (e) {
      console.error(e);
      setCertActionMessage("Failed to add manual entry.");
    } finally {
      setIsAddingManual(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner with Key Highlights */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-white">
              Administrator Master Console
            </span>
            <span className="text-xs text-slate-500">• N.B.K.R.I.S.T & ISTE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Prompt to Production Event Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time analytics, participant registry, payment verification, and coordinator permissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setActiveTab("scanner")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#002970] to-[#0056D2] hover:opacity-90 text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <QrCode className="w-4 h-4 text-[#00BAF2]" />
            <span>Open Gate Scanner</span>
          </button>

          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#0056D2]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setDeleteError(null);
              setDeleteSuccess(null);
              setDeletePasswordInput("");
              setDeleteModal({
                isOpen: true,
                mode: "all",
              });
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 text-rose-700 text-xs font-bold shadow-xs transition-all cursor-pointer"
            title="Wipe all attendee data with password confirmation"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Delete All Data</span>
          </button>

          <a
            href="/api/auth/logout"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-slate-700 text-xs font-bold shadow-xs transition-all"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Sign Out</span>
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Registered</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.totalRegistrations}</div>
          <span className="text-[11px] text-slate-500">Cap: {config.expectedParticipants}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">ISTE Members</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{stats.isteParticipants}</div>
          <span className="text-[11px] text-slate-500">₹{config.isteFee} fee tier</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Non-ISTE</span>
          <div className="text-2xl font-black text-slate-800 mt-1">{stats.nonIsteParticipants}</div>
          <span className="text-[11px] text-slate-500">₹{config.nonIsteFee} fee tier</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Checked In</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{stats.checkedInParticipants}</div>
          <span className="text-[11px] text-slate-500">At Seminar Hall</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Teams Formed</span>
          <div className="text-2xl font-black text-indigo-600 mt-1">{teams.length}</div>
          <span className="text-[11px] text-slate-500">{submissions.length} Submissions</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Total Revenue</span>
          <div className="text-2xl font-black text-[#002970] mt-1">₹{stats.totalRevenue}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">100% Reconciled</span>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-semibold no-scrollbar">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === "overview" ? "bg-[#0056D2] text-white shadow-xs" : "bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          Overview & Quick Actions
        </button>
        <button
          onClick={() => setActiveTab("scanner")}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "scanner" ? "bg-[#002970] text-white shadow-xs" : "bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          <QrCode className="w-3.5 h-3.5 text-sky-400" />
          <span>Gate Entry Scanner</span>
        </button>
        <button
          onClick={() => setActiveTab("participants")}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === "participants" ? "bg-[#0056D2] text-white shadow-xs" : "bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          Participants & Tickets ({tickets.length})
        </button>
        <button
          onClick={() => setActiveTab("event")}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === "event" ? "bg-[#0056D2] text-white shadow-xs" : "bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          Event Rules & Fees
        </button>
        <button
          onClick={() => setActiveTab("announcements")}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === "announcements" ? "bg-[#0056D2] text-white shadow-xs" : "bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          Post Announcements ({announcements.length})
        </button>
        <button
          onClick={() => setActiveTab("submissions")}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === "submissions" ? "bg-[#0056D2] text-white shadow-xs" : "bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          Challenge Submissions ({submissions.length})
        </button>
        <button
          onClick={() => setActiveTab("certificates")}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "certificates" ? "bg-amber-600 text-white shadow-xs" : "bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-300" />
          <span>Certificates & Emails ({certificates.length})</span>
        </button>
      </div>

      {/* TAB: GATE ENTRY SCANNER */}
      {activeTab === "scanner" && (
        <div className="max-w-2xl mx-auto py-2">
          <QrScanner operatorRole="Administrator" />
        </div>
      )}

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Quick Participant Summary */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Recent Registrations</h3>
                <button
                  onClick={() => setActiveTab("participants")}
                  className="text-xs font-semibold text-[#0056D2] hover:underline"
                >
                  View All Registry →
                </button>
              </div>

              <div className="divide-y divide-slate-100 mt-2">
                {tickets.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600">No Registrations Yet</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Real attendee registrations will automatically appear here as students complete enrollment.
                    </p>
                  </div>
                ) : (
                  tickets.slice(0, 5).map((t) => (
                    <div key={t.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{t.participantName}</div>
                        <div className="text-slate-500 font-mono text-[11px]">{t.rollNumber} • {t.branch}</div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-slate-700 block">{t.registrationNumber}</span>
                        <span
                          className={`text-[10px] font-bold ${
                            t.attendanceStatus === "checked_in" ? "text-emerald-600" : "text-amber-600"
                          }`}
                        >
                          {t.attendanceStatus === "checked_in" ? "Checked In" : "Pending Check-in"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Controls Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Event Status Switch</h3>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">Registration Status:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      config.isRegistrationOpen ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {config.isRegistrationOpen ? "OPEN" : "CLOSED"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">Capacity Utilization:</span>
                  <span className="font-bold text-slate-900">
                    {Math.round((initialStats.confirmedRegistrations / config.expectedParticipants) * 100)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">ISTE Concession:</span>
                  <span className="font-bold text-[#0056D2]">₹{config.isteFee}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab("event")}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs shadow-xs"
              >
                Modify Event Parameters
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: PARTICIPANTS REGISTRY TABLE */}
      {activeTab === "participants" && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Verified Participant Registry</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {filteredTickets.length} of {tickets.length} total participants.
              </p>
            </div>

            {/* Search Input & Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Name / Roll / Reg ID..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="flex-1 sm:flex-none px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="ALL">All Branches</option>
                  <option value="AI&DS">AI & DS</option>
                  <option value="IT">IT</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                </select>

                <select
                  value={attendanceFilter}
                  onChange={(e) => setAttendanceFilter(e.target.value)}
                  className="flex-1 sm:flex-none px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="ALL">All Attendance</option>
                  <option value="CHECKED_IN">Checked In</option>
                  <option value="PENDING">Pending Check-in</option>
                </select>

                <button
                  onClick={() => {
                    setDeleteError(null);
                    setDeleteSuccess(null);
                    setDeletePasswordInput("");
                    setDeleteModal({
                      isOpen: true,
                      mode: "all",
                    });
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  title="Permanently wipe all participants"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Delete All</span>
                </button>
              </div>
            </div>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[680px] text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 font-bold text-slate-600 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Registration Ref</th>
                  <th className="p-3.5">Full Name</th>
                  <th className="p-3.5">Roll Number</th>
                  <th className="p-3.5">Branch & Year</th>
                  <th className="p-3.5">ISTE Status</th>
                  <th className="p-3.5">Attendance</th>
                  <th className="p-3.5 text-right">Ticket</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-10 text-center text-slate-400">
                      <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700 text-xs">No Registered Participants Found</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Once students register on the website, their verified records will appear here.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-[#0056D2]">{t.registrationNumber}</td>
                      <td className="p-3.5 font-bold text-slate-900">{t.participantName}</td>
                      <td className="p-3.5 font-mono text-slate-600">{t.rollNumber}</td>
                      <td className="p-3.5">{t.branch} • {t.year}</td>
                      <td className="p-3.5">
                        {t.isIsteMember ? (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                            ISTE Member
                          </span>
                        ) : (
                          <span className="text-slate-400">Non-ISTE</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        {t.attendanceStatus === "checked_in" ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            Checked In
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right font-mono text-slate-500">{t.ticketNumber}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => {
                            setDeleteError(null);
                            setDeleteSuccess(null);
                            setDeletePasswordInput("");
                            setDeleteModal({
                              isOpen: true,
                              mode: "single",
                              targetId: t.id,
                              targetName: t.participantName,
                              targetRoll: t.rollNumber,
                            });
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors inline-flex items-center gap-1 font-semibold text-[11px] cursor-pointer"
                          title={`Delete ${t.participantName}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: EVENT CONFIG & FEES */}
      {activeTab === "event" && (
        <div className="max-w-2xl p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Event Configuration & Capacity</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Admin controls to configure ticket limits, pricing tiers, and enrollment status.
            </p>
          </div>

          {configMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{configMessage}</span>
            </div>
          )}

          <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                Expected Max Capacity (Students)
              </label>
              <input
                type="number"
                value={config.expectedParticipants}
                onChange={(e) => setConfig({ ...config, expectedParticipants: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Registrations will automatically close once confirmed count reaches this limit.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                  ISTE Member Fee (₹)
                </label>
                <input
                  type="number"
                  value={config.isteFee}
                  onChange={(e) => setConfig({ ...config, isteFee: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Non-ISTE Student Fee (₹)
                </label>
                <input
                  type="number"
                  value={config.nonIsteFee}
                  onChange={(e) => setConfig({ ...config, nonIsteFee: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Registration Portal Status</span>
                <span className="text-[11px] text-slate-500">Allow new students to enroll and submit payment.</span>
              </div>
              <button
                type="button"
                onClick={() => setConfig({ ...config, isRegistrationOpen: !config.isRegistrationOpen })}
                className={`px-4 py-1.5 rounded-xl font-bold transition-all ${
                  config.isRegistrationOpen ? "bg-emerald-600 text-white" : "bg-slate-300 text-slate-700"
                }`}
              >
                {config.isRegistrationOpen ? "Active (Open)" : "Closed"}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Build Challenge Submissions Status</span>
                <span className="text-[11px] text-slate-500">Allow participants to submit GitHub repos, live demos, and solutions.</span>
              </div>
              <button
                type="button"
                onClick={() => setConfig({ ...config, isSubmissionOpen: !config.isSubmissionOpen })}
                className={`px-4 py-1.5 rounded-xl font-bold transition-all ${
                  config.isSubmissionOpen ? "bg-emerald-600 text-white" : "bg-slate-300 text-slate-700"
                }`}
              >
                {config.isSubmissionOpen ? "Active (Open)" : "Closed (Locked)"}
              </button>
            </div>

            <button
              type="submit"
              disabled={isSavingConfig}
              className="py-3 px-6 rounded-xl bg-[#0056D2] hover:bg-[#0041a3] text-white font-bold text-xs shadow-xs flex items-center gap-2"
            >
              {isSavingConfig ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Update Event Parameters</span>}
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: POST ANNOUNCEMENTS */}
      {activeTab === "announcements" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <form onSubmit={handlePostAnnouncement} className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Broadcast New Advisory</h3>
            
            <div>
              <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">Title</label>
              <input
                type="text"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                placeholder="e.g. Wi-Fi Access Credentials"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">Message Content</label>
              <textarea
                rows={4}
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                placeholder="Important advisory for all participants..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">Priority</label>
              <select
                value={annPriority}
                onChange={(e) => setAnnPriority(e.target.value as "normal" | "urgent")}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isPostingAnn || !annTitle.trim() || !annContent.trim()}
              className="w-full py-2.5 rounded-xl bg-[#0056D2] text-white font-bold text-xs shadow-xs"
            >
              {isPostingAnn ? "Publishing..." : "Publish to Student Dashboards"}
            </button>
          </form>

          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Live Published Announcements</h3>
            {announcements.map((ann) => (
              <div key={ann.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{ann.title}</span>
                  {ann.priority === "urgent" && (
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                      Urgent
                    </span>
                  )}
                </div>
                <p className="text-slate-600">{ann.content}</p>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 5: SUBMISSIONS & EVALUATION */}
      {activeTab === "submissions" && (
        <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          
          {/* Header & Primary Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-700" />
                  <span>Jury Review & Evaluation Hub</span>
                </span>
                <span className="text-xs text-slate-500">• Afternoon Build Sprint</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                Build Challenge Project Submissions
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review submitted code repositories, live prototypes, and prompt architectures. Grade teams out of 100 for awards.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Submission Master Toggle Button */}
              <button
                onClick={handleToggleSubmissions}
                disabled={isTogglingSubmissions}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer ${
                  config.isSubmissionOpen
                    ? "bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                {isTogglingSubmissions ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : config.isSubmissionOpen ? (
                  <Lock className="w-4 h-4 text-rose-600" />
                ) : (
                  <Unlock className="w-4 h-4 text-white" />
                )}
                <span>{config.isSubmissionOpen ? "Lock Submissions" : "Open Submissions"}</span>
              </button>

              {/* Export Submissions to CSV */}
              <button
                onClick={exportSubmissionsCSV}
                disabled={submissions.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-[#0056D2]" />
                <span>Export Submissions CSV</span>
              </button>
            </div>
          </div>

          {/* Master Switch Alert Banner */}
          <div
            className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              config.isSubmissionOpen
                ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                : "bg-slate-50 border-slate-200 text-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  config.isSubmissionOpen ? "bg-emerald-200 text-emerald-800" : "bg-slate-200 text-slate-600"
                }`}
              >
                {config.isSubmissionOpen ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>
              <div>
                <span className="font-bold block">
                  {config.isSubmissionOpen
                    ? "Submission Portal is currently OPEN (Accepting Projects)"
                    : "Submission Portal is currently LOCKED (Closed for Students)"}
                </span>
                <span className="text-[11px] text-slate-500">
                  {config.isSubmissionOpen
                    ? "Participants on /dashboard can now finalize their GitHub repos and live demo URLs."
                    : "Participants see a locked countdown banner informing them submissions open at 1:45 PM."}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white border border-slate-200 shadow-2xs font-mono">
                {submissions.length} Total Submissions
              </span>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
              <button
                onClick={() => setSubStatusFilter("ALL")}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  subStatusFilter === "ALL" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All ({submissions.length})
              </button>
              <button
                onClick={() => setSubStatusFilter("submitted")}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  subStatusFilter === "submitted" ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-800 hover:bg-blue-100"
                }`}
              >
                Under Review ({submissions.filter((s) => s.status === "submitted").length})
              </button>
              <button
                onClick={() => setSubStatusFilter("evaluated")}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  subStatusFilter === "evaluated" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                }`}
              >
                Evaluated ({submissions.filter((s) => s.status === "evaluated").length})
              </button>
              <button
                onClick={() => setSubStatusFilter("draft")}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  subStatusFilter === "draft" ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-800 hover:bg-amber-100"
                }`}
              >
                Drafts ({submissions.filter((s) => s.status === "draft").length})
              </button>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={subSearchQuery}
                onChange={(e) => setSubSearchQuery(e.target.value)}
                placeholder="Search project, team, roll..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-base sm:text-xs"
              />
            </div>
          </div>

          {/* Submissions List */}
          <div className="space-y-4">
            {submissions.length === 0 ? (
              <div className="py-14 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700 text-sm">No Project Submissions Received Yet</p>
                <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                  When the afternoon Build Challenge begins, open the submission portal above so student teams can submit their repositories.
                </p>
              </div>
            ) : (
              submissions
                .filter((sub) => {
                  const q = subSearchQuery.toLowerCase();
                  const matchesSearch =
                    sub.projectName.toLowerCase().includes(q) ||
                    (sub.teamName && sub.teamName.toLowerCase().includes(q)) ||
                    (sub.submitterName && sub.submitterName.toLowerCase().includes(q)) ||
                    (sub.rollNumber && sub.rollNumber.toLowerCase().includes(q));

                  const matchesFilter =
                    subStatusFilter === "ALL" || sub.status === subStatusFilter;

                  return matchesSearch && matchesFilter;
                })
                .map((sub) => {
                  const timestampStr = new Date(sub.updatedAt || sub.createdAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={sub.id}
                      className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 shadow-xs space-y-4 text-xs transition-all"
                    >
                      {/* Top Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {sub.teamName || "Solo Build"}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="font-semibold text-slate-800">
                              {sub.submitterName || "Participant"}
                            </span>
                            {sub.rollNumber && (
                              <span className="font-mono text-slate-500">({sub.rollNumber})</span>
                            )}
                            {sub.branch && (
                              <span className="text-slate-400">• {sub.branch}</span>
                            )}
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                            {sub.projectName}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{timestampStr}</span>
                          </div>

                          {sub.status === "evaluated" ? (
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                              <span>{sub.evaluationScore}/100</span>
                            </span>
                          ) : sub.status === "submitted" ? (
                            <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 font-bold text-xs">
                              Submitted
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs">
                              Draft
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Problem Statement & Architecture */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                            Problem Statement
                          </span>
                          <p className="text-slate-800 leading-relaxed font-medium">
                            {sub.problemStatement}
                          </p>
                        </div>

                        <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                            Architecture & Prompt Pipeline
                          </span>
                          <p className="text-slate-700 leading-relaxed">
                            {sub.projectDescription || "No architecture description provided."}
                          </p>
                        </div>
                      </div>

                      {/* Tech Stack Chips */}
                      {sub.technologiesUsed && sub.technologiesUsed.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
                            Technologies & APIs
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {sub.technologiesUsed.map((t, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-medium text-[11px]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Evaluation Feedback Note if present */}
                      {sub.evaluationFeedback && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs">
                          <span className="font-bold uppercase text-[10px] text-emerald-800 tracking-wider block">
                            Jury Score & Feedback ({sub.evaluationScore}/100)
                          </span>
                          <p className="mt-0.5">{sub.evaluationFeedback}</p>
                        </div>
                      )}

                      {/* Action Links & Evaluation Trigger */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                        <div className="flex flex-wrap items-center gap-2">
                          {sub.githubUrl && (
                            <a
                              href={sub.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-all"
                            >
                              <GitBranch className="w-3.5 h-3.5 text-sky-400" />
                              <span>GitHub Repo</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </a>
                          )}

                          {sub.liveDemoUrl && (
                            <a
                              href={sub.liveDemoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Live Demo</span>
                            </a>
                          )}

                          {sub.presentationUrl && (
                            <a
                              href={sub.presentationUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs transition-all"
                            >
                              <span>Slides / Video</span>
                            </a>
                          )}
                        </div>

                        <div>
                          <button
                            onClick={() =>
                              setGradingSubmission({
                                id: sub.id,
                                projectName: sub.projectName,
                                teamName: sub.teamName,
                                score: sub.evaluationScore ?? 85,
                                feedback: sub.evaluationFeedback || "",
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-900 font-bold text-xs transition-all cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{sub.status === "evaluated" ? "Update Grade" : "Grade Submission"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}

      {/* TAB 6: CERTIFICATES & EMAIL DISPATCH */}
      {activeTab === "certificates" && (
        <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          
          {/* Header & Primary Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-700" />
                  <span>Credential Issuance Console</span>
                </span>
                <span className="text-xs text-slate-500">• N.B.K.R.I.S.T & ISTE</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                Official Certificates & Direct Email Dispatch
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Generate verified certificates with participant names, roll numbers, and official signatures. Edit incorrect data before issuing.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowManualEntry(!showManualEntry)}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Manual Entry</span>
              </button>

              <button
                onClick={handleGenerateAllCerts}
                disabled={isGeneratingCerts || profiles.length === 0}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isGeneratingCerts ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
                <span>Generate All</span>
              </button>

              <button
                onClick={handleSendAllEmails}
                disabled={isSendingEmails || certificates.length === 0}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0056D2] hover:bg-[#0041a3] text-white font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isSendingEmails ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Email All</span>
              </button>

              <button
                onClick={() => {
                  setDeleteError(null);
                  setDeleteSuccess(null);
                  setDeletePasswordInput("");
                  setDeleteModal({
                    isOpen: true,
                    mode: "all",
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold text-xs shadow-xs transition-all cursor-pointer"
                title="Wipe all attendee data"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Delete All</span>
              </button>
            </div>
          </div>

          {certActionMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{certActionMessage}</span>
            </div>
          )}

          {/* Manual Entry Form (Collapsible) */}
          {showManualEntry && (
            <form onSubmit={handleManualEntry} className="p-5 rounded-2xl bg-violet-50 border border-violet-200 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-violet-900 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-violet-600" />
                  Manual Certificate Entry
                </h3>
                <button type="button" onClick={() => setShowManualEntry(false)} className="text-violet-500 hover:text-violet-800">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-violet-700 text-[11px]">
                For walk-in participants or late additions not registered online. This creates a profile and issues a certificate immediately.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-violet-800 uppercase tracking-wider mb-1">Full Name *</label>
                  <input type="text" required value={manualForm.fullName} onChange={(e) => setManualForm({...manualForm, fullName: e.target.value})}
                    placeholder="e.g. Likhith Kami" className="w-full px-3.5 py-2.5 rounded-xl border border-violet-300 bg-white text-base sm:text-xs" />
                </div>
                <div>
                  <label className="block font-bold text-violet-800 uppercase tracking-wider mb-1">Roll Number *</label>
                  <input type="text" required value={manualForm.rollNumber} onChange={(e) => setManualForm({...manualForm, rollNumber: e.target.value})}
                    placeholder="e.g. 22B01A1234" className="w-full px-3.5 py-2.5 rounded-xl border border-violet-300 bg-white text-base sm:text-xs font-mono" />
                </div>
                <div>
                  <label className="block font-bold text-violet-800 uppercase tracking-wider mb-1">Branch *</label>
                  <select value={manualForm.branch} onChange={(e) => setManualForm({...manualForm, branch: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-violet-300 bg-white text-base sm:text-xs">
                    <option value="IT">IT</option>
                    <option value="AI&DS">AI & DS</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-violet-800 uppercase tracking-wider mb-1">Year *</label>
                  <select value={manualForm.year} onChange={(e) => setManualForm({...manualForm, year: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-violet-300 bg-white text-base sm:text-xs">
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-violet-800 uppercase tracking-wider mb-1">Email</label>
                  <input type="email" value={manualForm.email} onChange={(e) => setManualForm({...manualForm, email: e.target.value})}
                    placeholder="optional" className="w-full px-3.5 py-2.5 rounded-xl border border-violet-300 bg-white text-base sm:text-xs" />
                </div>
                <div>
                  <label className="block font-bold text-violet-800 uppercase tracking-wider mb-1">Mobile</label>
                  <input type="tel" value={manualForm.mobile} onChange={(e) => setManualForm({...manualForm, mobile: e.target.value})}
                    placeholder="optional" className="w-full px-3.5 py-2.5 rounded-xl border border-violet-300 bg-white text-base sm:text-xs" />
                </div>
              </div>
              <button type="submit" disabled={isAddingManual || !manualForm.fullName.trim() || !manualForm.rollNumber.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-xs transition-all disabled:opacity-50">
                {isAddingManual ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
                <span>Add & Issue Certificate</span>
              </button>
            </form>
          )}

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Students</span>
              <span className="text-lg font-black text-slate-900">{profiles.length}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Checked In</span>
              <span className="text-lg font-black text-emerald-600">
                {tickets.filter((t) => t.attendanceStatus === "checked_in").length}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Certificates Issued</span>
              <span className="text-lg font-black text-amber-600">{certificates.length}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Generation</span>
              <span className="text-lg font-black text-slate-500">
                {Math.max(0, profiles.length - certificates.length)}
              </span>
            </div>
          </div>

          {/* Participant Certificate Roster */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-slate-900">
                Attendee Certificate Directory ({profiles.length})
              </h3>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={certSearch}
                  onChange={(e) => setCertSearch(e.target.value)}
                  placeholder="Filter name, roll, email..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-base sm:text-xs"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[780px] text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-50 font-bold text-slate-600 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">Student Name</th>
                    <th className="p-3.5">Roll Number</th>
                    <th className="p-3.5">Branch & Year</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Certificate</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {profiles.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-slate-400">
                        <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold text-slate-700">No Participants Registered Yet</p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          When students enroll on the website, their names and certificate issuance controls will appear here.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    profiles
                      .filter((p) => {
                        const q = certSearch.toLowerCase();
                        return (
                          p.fullName.toLowerCase().includes(q) ||
                          p.rollNumber.toLowerCase().includes(q) ||
                          p.email.toLowerCase().includes(q)
                        );
                      })
                      .map((p) => {
                        const ticket = tickets.find(
                          (t) => t.rollNumber.toUpperCase() === p.rollNumber.toUpperCase()
                        );
                        const cert = certificates.find(
                          (c) => c.participantId === p.id || c.rollNumber?.toUpperCase() === p.rollNumber.toUpperCase()
                        );
                        const isCheckedIn = ticket?.attendanceStatus === "checked_in";

                        return (
                          <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="p-3.5 font-bold text-slate-900">{p.fullName}</td>
                            <td className="p-3.5 font-mono text-slate-600">{p.rollNumber}</td>
                            <td className="p-3.5">{p.branch} • {p.year}</td>
                            <td className="p-3.5 font-mono text-slate-500 text-[11px]">{p.email}</td>
                            <td className="p-3.5">
                              {isCheckedIn ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                  Checked In
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="p-3.5">
                              {cert ? (
                                <span className="font-mono text-amber-700 font-bold text-[11px]">
                                  {cert.certificateNumber}
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[11px]">Not Generated</span>
                              )}
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* ✏️ Edit Button */}
                                <button
                                  onClick={() => setEditingProfile({
                                    id: p.id,
                                    fullName: p.fullName,
                                    rollNumber: p.rollNumber,
                                    branch: p.branch,
                                    year: p.year,
                                    email: p.email,
                                  })}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-violet-50 border border-violet-200 hover:bg-violet-100 text-violet-800 font-semibold text-[10px] transition-all cursor-pointer"
                                  title="Edit details before issuing certificate"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span className="hidden sm:inline">Edit</span>
                                </button>

                                {cert ? (
                                  <>
                                    <a
                                      href={`/certificate/${cert.certificateNumber}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[10px] transition-all"
                                    >
                                      <span>Preview</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>

                                    <button
                                      onClick={() => handleSendSingleEmail(cert.id, p.email)}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-800 font-semibold text-[10px] transition-all cursor-pointer"
                                    >
                                      <Mail className="w-3 h-3 text-[#0056D2]" />
                                      <span>{cert.emailedAt ? "Resend" : "Mail"}</span>
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => handleGenerateSingleCert(p.id)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] transition-all cursor-pointer"
                                  >
                                    <Award className="w-3 h-3" />
                                    <span>Issue</span>
                                  </button>
                                )}

                                {/* 🗑️ Delete Participant Button */}
                                <button
                                  onClick={() => {
                                    setDeleteError(null);
                                    setDeleteSuccess(null);
                                    setDeletePasswordInput("");
                                    setDeleteModal({
                                      isOpen: true,
                                      mode: "single",
                                      targetId: p.id,
                                      targetName: p.fullName,
                                      targetRoll: p.rollNumber,
                                    });
                                  }}
                                  className="inline-flex items-center gap-1 p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title={`Delete ${p.fullName} and certificate`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================= */}
      {/* JURY EVALUATION & SCORING MODAL                               */}
      {/* ============================================================= */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Grade Project Submission</h3>
                  <p className="text-[11px] text-slate-500">{gradingSubmission.projectName} • {gradingSubmission.teamName || "Solo Build"}</p>
                </div>
              </div>
              <button
                onClick={() => setGradingSubmission(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveGrade}>
              <div className="p-5 space-y-4 text-xs">
                {gradeMessage && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{gradeMessage}</span>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Jury Score (0 – 100 Points) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      required
                      value={gradingSubmission.score}
                      onChange={(e) =>
                        setGradingSubmission({
                          ...gradingSubmission,
                          score: Math.min(100, Math.max(0, Number(e.target.value))),
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-200 font-mono"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                      / 100
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Rubric: Prompt Engineering (30), Code Architecture (30), Execution (20), Demo (20).
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Evaluation Feedback & Jury Comments
                  </label>
                  <textarea
                    rows={4}
                    value={gradingSubmission.feedback}
                    onChange={(e) =>
                      setGradingSubmission({
                        ...gradingSubmission,
                        feedback: e.target.value,
                      })
                    }
                    placeholder="e.g. Excellent agentic prompt architecture. The live prototype on Vercel is snappy. Clean GitHub commit history."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="p-5 border-t border-slate-200 flex items-center justify-end gap-2.5 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingGrade}
                  className="px-6 py-2.5 rounded-xl bg-[#0056D2] hover:bg-[#0041a3] text-white text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingGrade ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4 fill-white" />}
                  <span>Save Evaluation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* EDIT PROFILE MODAL (Full screen on mobile, centered on desktop) */}
      {/* ============================================================= */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg, #667eea08, #764ba208, #f5576c08)" }}
            >
              <div>
                <div className="flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-violet-600" />
                  <h3 className="text-sm font-bold text-slate-900">Edit Participant Details</h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Correct the data below. Changes reflect on the certificate.</p>
              </div>
              <button
                onClick={() => setEditingProfile(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs max-h-[60vh] overflow-y-auto">
              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">Full Name (on certificate)</label>
                <input
                  type="text"
                  value={editingProfile.fullName}
                  onChange={(e) => setEditingProfile({...editingProfile, fullName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">Roll Number</label>
                <input
                  type="text"
                  value={editingProfile.rollNumber}
                  onChange={(e) => setEditingProfile({...editingProfile, rollNumber: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">Branch</label>
                  <select
                    value={editingProfile.branch}
                    onChange={(e) => setEditingProfile({...editingProfile, branch: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                  >
                    <option value="IT">IT</option>
                    <option value="AI&DS">AI & DS</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">Year</label>
                  <select
                    value={editingProfile.year}
                    onChange={(e) => setEditingProfile({...editingProfile, year: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              {/* Info banner */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>This will update the actual profile.</strong> If a certificate was already issued, it will be regenerated with the corrected data.
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-5 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-slate-50">
              <button
                onClick={() => handleEditSaveAndIssue(true)}
                disabled={isSavingEdit || !editingProfile.fullName.trim()}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSavingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
                <span>Save & Issue Certificate</span>
              </button>
              <button
                onClick={() => handleEditSaveAndIssue(false)}
                disabled={isSavingEdit}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-all cursor-pointer"
              >
                <span>Save Only</span>
              </button>
              <button
                onClick={() => setEditingProfile(null)}
                className="sm:w-auto inline-flex items-center justify-center px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 font-semibold text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 🔴 DELETE CONFIRMATION MODAL WITH PASSWORD CHECK ("delete")     */}
      {/* ============================================================= */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {deleteModal.mode === "all"
                      ? "Delete All Event Data"
                      : `Delete: ${deleteModal.targetName || "Participant"}`}
                  </h3>
                  <p className="text-[11px] text-rose-600 font-medium">
                    Permanent Deletion • Irreversible Action
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeleteModal({ isOpen: false, mode: "all" })}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning Description */}
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs leading-relaxed space-y-1">
              {deleteModal.mode === "all" ? (
                <p>
                  <strong>Are you sure you want to delete ALL event data?</strong> This will permanently erase every registered student profile, admission ticket, payment record, gate attendance, and certificate from Supabase and the server database.
                </p>
              ) : (
                <p>
                  Are you sure you want to permanently delete <strong>{deleteModal.targetName}</strong> {deleteModal.targetRoll ? `(${deleteModal.targetRoll})` : ""}? Their profile, admission pass, and certificate will be wiped immediately.
                </p>
              )}
            </div>

            {/* Password Input Form */}
            <form onSubmit={executeDelete} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                    <span>Confirmation Password</span>
                  </label>
                  <span className="text-[11px] font-mono font-bold text-rose-600 bg-rose-100/70 px-2 py-0.5 rounded">
                    Password: delete
                  </span>
                </div>
                <input
                  type="text"
                  autoFocus
                  required
                  value={deletePasswordInput}
                  onChange={(e) => {
                    setDeletePasswordInput(e.target.value);
                    setDeleteError(null);
                  }}
                  placeholder="Type 'delete' to confirm"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 placeholder:text-slate-400 placeholder:font-sans"
                />
              </div>

              {deleteError && (
                <div className="p-3 rounded-xl bg-rose-100 text-rose-800 text-xs font-semibold border border-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{deleteError}</span>
                </div>
              )}

              {deleteSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{deleteSuccess}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeleteModal({ isOpen: false, mode: "all" })}
                  disabled={isDeleting}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDeleting || deletePasswordInput.trim() !== "delete"}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Confirm Deletion</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
