"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  DigitalTicket, 
  ParticipantProfile, 
  Registration, 
  Team, 
  ProjectSubmission, 
  SupportTicket, 
  AnnouncementItem, 
  ResourceItem,
  CertificateItem 
} from "@/types";
import { DigitalTicketCard } from "@/components/ticket/DigitalTicketCard";
import { 
  LayoutDashboard, 
  Ticket, 
  User, 
  Users2, 
  UploadCloud, 
  BookOpen, 
  HelpCircle, 
  Award, 
  Bell, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";

interface DashboardProps {
  profile: ParticipantProfile;
  registration: Registration;
  ticket: DigitalTicket;
  team?: Team;
  submission?: ProjectSubmission;
  announcements: AnnouncementItem[];
  resources: ResourceItem[];
  supportTickets: SupportTicket[];
  certificate?: CertificateItem;
}

export function ParticipantDashboardClient({
  profile,
  registration,
  ticket,
  team: initialTeam,
  submission: initialSubmission,
  announcements,
  resources,
  supportTickets: initialSupportTickets,
  certificate,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "ticket" | "profile" | "team" | "submission" | "resources" | "support" | "certificate"
  >("overview");

  // Interactive local states
  const [team, setTeam] = useState<Team | undefined>(initialTeam);
  const [teamNameInput, setTeamNameInput] = useState("");
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [isTeamLoading, setIsTeamLoading] = useState(false);
  const [teamMessage, setTeamMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Submission state
  const [submission, setSubmission] = useState<ProjectSubmission | undefined>(initialSubmission);
  const [subForm, setSubForm] = useState({
    projectName: initialSubmission?.projectName || "",
    problemStatement: initialSubmission?.problemStatement || "",
    projectDescription: initialSubmission?.projectDescription || "",
    technologiesUsed: initialSubmission?.technologiesUsed?.join(", ") || "Next.js, Tailwind CSS, Gemini API",
    githubUrl: initialSubmission?.githubUrl || "",
    liveDemoUrl: initialSubmission?.liveDemoUrl || "",
    presentationUrl: initialSubmission?.presentationUrl || "",
  });
  const [isSavingSub, setIsSavingSub] = useState(false);
  const [subMessage, setSubMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Support ticket state
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(initialSupportTickets);
  const [suppCategory, setSuppCategory] = useState<SupportTicket["category"]>("Registration");
  const [suppSubject, setSuppSubject] = useState("");
  const [suppMessageText, setSuppMessageText] = useState("");
  const [isSubmittingSupp, setIsSubmittingSupp] = useState(false);
  const [suppAlert, setSuppAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Handle Team Creation
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamNameInput.trim()) return;
    setIsTeamLoading(true);
    setTeamMessage(null);
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", teamName: teamNameInput.trim(), userId: profile.userId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTeam(data.team);
        setTeamMessage({ type: "success", text: `Team "${data.team.name}" created successfully!` });
        setTeamNameInput("");
      } else {
        setTeamMessage({ type: "error", text: data.error || "Failed to create team." });
      }
    } catch {
      setTeamMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setIsTeamLoading(false);
    }
  };

  // Handle Team Joining
  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) return;
    setIsTeamLoading(true);
    setTeamMessage(null);
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "join", inviteCode: inviteCodeInput.trim(), userId: profile.userId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTeam(data.team);
        setTeamMessage({ type: "success", text: `Joined team "${data.team.name}" successfully!` });
        setInviteCodeInput("");
      } else {
        setTeamMessage({ type: "error", text: data.error || "Failed to join team." });
      }
    } catch {
      setTeamMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setIsTeamLoading(false);
    }
  };

  // Copy invite code
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Handle Project Submission
  const handleSaveSubmission = async (submitStatus: "draft" | "submitted") => {
    setIsSavingSub(true);
    setSubMessage(null);
    try {
      const res = await fetch("/api/submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...subForm,
          status: submitStatus,
          userId: profile.userId,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmission(data.submission);
        setSubMessage({
          type: "success",
          text: submitStatus === "submitted" ? "Project submitted successfully for evaluation!" : "Draft saved successfully.",
        });
      } else {
        setSubMessage({ type: "error", text: data.error || "Could not save submission." });
      }
    } catch {
      setSubMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setIsSavingSub(false);
    }
  };

  // Handle Support Ticket Submission
  const handleCreateSupportTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingSupp(true);
    setSuppAlert(null);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: profile.userId,
          category: suppCategory,
          subject: suppSubject,
          message: suppMessageText,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSupportTickets([data.ticket, ...supportTickets]);
        setSuppAlert({ type: "success", text: "Support query submitted. The organizing desk has been notified." });
        setSuppSubject("");
        setSuppMessageText("");
      } else {
        setSuppAlert({ type: "error", text: data.error || "Failed to submit ticket." });
      }
    } catch {
      setSuppAlert({ type: "error", text: "Network error occurred." });
    } finally {
      setIsSubmittingSupp(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Navigation Sidebar */}
      <div className="lg:col-span-3 space-y-4">
        
        {/* Profile Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#002970] to-[#0056D2] text-white font-bold flex items-center justify-center text-sm shadow-xs">
              {profile.fullName.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-slate-900 text-sm truncate">{profile.fullName}</div>
              <div className="text-[11px] font-mono text-slate-500">{profile.rollNumber}</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">{profile.branch} • {profile.year}</span>
            {profile.isIsteMember ? (
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200">
                ISTE Member
              </span>
            ) : (
              <span className="text-slate-400">Non-ISTE</span>
            )}
          </div>
        </div>

        {/* Mobile Horizontal Navigation Pills (< lg) */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "ticket", label: "QR Pass", icon: Ticket },
            { id: "team", label: "Team", icon: Users2 },
            { id: "submission", label: "Submit", icon: UploadCloud },
            { id: "resources", label: "Guides", icon: BookOpen },
            { id: "profile", label: "Profile", icon: User },
            { id: "certificate", label: "Certificate", icon: Award },
            { id: "support", label: "Support", icon: HelpCircle },
          ].map((tabItem) => {
            const Icon = tabItem.icon;
            const isActive = activeTab === tabItem.id;
            return (
              <button
                key={tabItem.id}
                onClick={() => setActiveTab(tabItem.id as typeof activeTab)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? "bg-[#0056D2] text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tabItem.label}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop Vertical Tab Navigation Buttons (lg:block) */}
        <div className="hidden lg:block p-2 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "overview"
                ? "bg-[#0056D2] text-white shadow-xs"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("ticket")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "ticket"
                ? "bg-[#0056D2] text-white shadow-xs"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>My Digital QR Pass</span>
          </button>

          <button
            onClick={() => setActiveTab("team")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "team"
                ? "bg-[#0056D2] text-white shadow-xs"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Users2 className="w-4 h-4" />
            <span>Team & Collaboration</span>
          </button>

          <button
            onClick={() => setActiveTab("submission")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "submission"
                ? "bg-[#0056D2] text-white shadow-xs"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Project Submission</span>
          </button>

          <button
            onClick={() => setActiveTab("resources")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "resources"
                ? "bg-[#0056D2] text-white shadow-xs"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Playbooks & Resources</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "profile"
                ? "bg-[#0056D2] text-white shadow-xs"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Participant Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("certificate")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "certificate"
                ? "bg-[#0056D2] text-white shadow-xs"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Issued Certificate</span>
          </button>

          <button
            onClick={() => setActiveTab("support")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "support"
                ? "bg-[#0056D2] text-white shadow-xs"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Support Desk</span>
          </button>
        </div>

      </div>

      {/* Right Content Area */}
      <div className="lg:col-span-9 space-y-6">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            
            {/* Status Checklist Banner */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Welcome, {profile.fullName}!
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your workshop readiness and event status tracking dashboard.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("ticket")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0056D2] text-white font-semibold text-xs shadow-xs self-start sm:self-auto"
                >
                  <Ticket className="w-4 h-4" />
                  <span>View Entry Pass</span>
                </button>
              </div>

              {/* 4 Core Milestones from Prompt */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Registration</div>
                  <div className="text-sm font-bold text-emerald-950 mt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Confirmed</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Payment</div>
                  <div className="text-sm font-bold text-emerald-950 mt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Paid (₹{registration.amount})</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Attendance</div>
                  <div className="text-sm font-bold text-blue-950 mt-1 flex items-center gap-1.5">
                    {ticket.attendanceStatus === "checked_in" ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Checked In</span>
                      </>
                    ) : (
                      <>
                        <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                        <span>Pending Check-in</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Certificate</div>
                  <div className="text-sm font-bold text-slate-700 mt-1 flex items-center gap-1.5">
                    {certificate?.isPublished ? (
                      <span className="text-emerald-700">Available</span>
                    ) : (
                      <span className="text-slate-500">Post-Event</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Official Announcements */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#0056D2]" />
                <h3 className="text-sm font-bold text-slate-900">Event Announcements & Advisories</h3>
              </div>

              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                      ann.priority === "urgent"
                        ? "bg-rose-50/70 border-rose-200 text-rose-950"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <div className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                      {ann.priority === "urgent" && (
                        <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white text-[9px] font-bold">
                          URGENT
                        </span>
                      )}
                      <span>{ann.title}</span>
                    </div>
                    <div>{ann.content}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setActiveTab("team")}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Build Challenge Team</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {team ? `Member of "${team.name}" (${team.members.length} members)` : "No team joined yet. Create or join one."}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>

              <div
                onClick={() => setActiveTab("submission")}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Project Prototype Submission</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {submission?.status === "submitted" ? "Submitted for Evaluation" : "Draft ready for submission"}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: DIGITAL TICKET */}
        {activeTab === "ticket" && (
          <div>
            <DigitalTicketCard ticket={ticket} />
          </div>
        )}

        {/* TAB 3: TEAM MANAGEMENT */}
        {activeTab === "team" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Team Collaboration System</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Form a team of 2 to 4 students for the afternoon hands-on build challenge.
              </p>

              {teamMessage && (
                <div
                  className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                    teamMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{teamMessage.text}</span>
                </div>
              )}

              {team ? (
                /* Team Display */
                <div className="mt-6 space-y-5">
                  <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Team Name</span>
                      <div className="text-xl font-black text-slate-900 mt-0.5">{team.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Leader: {team.leaderName}</div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-blue-200 flex items-center gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Invite Code</span>
                        <span className="text-sm font-mono font-bold text-[#0056D2]">{team.inviteCode}</span>
                      </div>
                      <button
                        onClick={() => handleCopyCode(team.inviteCode)}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Copy Invite Code"
                      >
                        {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      Team Members ({team.members.length} / 4)
                    </h3>
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                      {team.members.map((m, idx) => (
                        <div key={idx} className="p-4 flex items-center justify-between text-xs bg-white">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                              {idx + 1}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{m.fullName}</div>
                              <div className="text-[11px] text-slate-500 font-mono">{m.rollNumber} • {m.branch}</div>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              m.role === "leader" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {m.role === "leader" ? "Team Leader" : "Member"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Create or Join Options */
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Create Team Form */}
                  <form onSubmit={handleCreateTeam} className="p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Create a New Team</h3>
                      <p className="text-xs text-slate-500 mt-0.5">You will become the designated team leader.</p>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={teamNameInput}
                        onChange={(e) => setTeamNameInput(e.target.value)}
                        placeholder="Enter Team Name (e.g. PromptWizards)"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isTeamLoading || !teamNameInput.trim()}
                      className="w-full py-2.5 rounded-xl bg-[#0056D2] text-white text-xs font-semibold shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isTeamLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Create Team</span>}
                    </button>
                  </form>

                  {/* Join Team Form */}
                  <form onSubmit={handleJoinTeam} className="p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Join an Existing Team</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Enter the 6-character code given by your team leader.</p>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={inviteCodeInput}
                        onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                        placeholder="e.g. P2P-98A1"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isTeamLoading || !inviteCodeInput.trim()}
                      className="w-full py-2.5 rounded-xl bg-slate-800 text-white text-xs font-semibold shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isTeamLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Join Team</span>}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PROJECT SUBMISSION */}
        {activeTab === "submission" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Build Challenge Project Submission</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Submit your team&apos;s working MVP and prompt architecture for jury evaluation.
                  </p>
                </div>
                {submission && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      submission.status === "submitted"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    Status: {submission.status.toUpperCase()}
                  </span>
                )}
              </div>

              {subMessage && (
                <div
                  className={`mb-5 p-3 rounded-xl text-xs flex items-center gap-2 ${
                    subMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{subMessage.text}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={subForm.projectName}
                    onChange={(e) => setSubForm({ ...subForm, projectName: e.target.value })}
                    placeholder="e.g. DocuSense AI Agent"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Problem Statement *
                  </label>
                  <textarea
                    rows={2}
                    value={subForm.problemStatement}
                    onChange={(e) => setSubForm({ ...subForm, problemStatement: e.target.value })}
                    placeholder="What specific bottleneck or workflow does your build address?"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Project & Prompt Architecture Description *
                  </label>
                  <textarea
                    rows={3}
                    value={subForm.projectDescription}
                    onChange={(e) => setSubForm({ ...subForm, projectDescription: e.target.value })}
                    placeholder="Explain your prompt pipeline, agentic structure, and technical components."
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Technologies Used (comma separated)
                  </label>
                  <input
                    type="text"
                    value={subForm.technologiesUsed}
                    onChange={(e) => setSubForm({ ...subForm, technologiesUsed: e.target.value })}
                    placeholder="Next.js, Python, Gemini API, Tailwind CSS"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                      GitHub Repository URL
                    </label>
                    <input
                      type="url"
                      value={subForm.githubUrl}
                      onChange={(e) => setSubForm({ ...subForm, githubUrl: e.target.value })}
                      placeholder="https://github.com/user/repo"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Live Demo / Deployment URL
                    </label>
                    <input
                      type="url"
                      value={subForm.liveDemoUrl}
                      onChange={(e) => setSubForm({ ...subForm, liveDemoUrl: e.target.value })}
                      placeholder="https://my-app.vercel.app"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleSaveSubmission("submitted")}
                    disabled={isSavingSub}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0056D2] hover:bg-[#0041a3] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2"
                  >
                    {isSavingSub ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Finalize & Submit Project</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveSubmission("draft")}
                    disabled={isSavingSub}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                  >
                    Save as Draft
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: RESOURCES */}
        {activeTab === "resources" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Workshop Resources & Guides</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Curated playbooks, code repositories, and challenge rubrics for participants.
              </p>

              <div className="mt-6 space-y-3.5">
                {resources.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900">{res.title}</div>
                      <p className="text-xs text-slate-500 mt-0.5">{res.description}</p>
                    </div>

                    {res.externalUrl && (
                      <a
                        href={res.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-[#0056D2] text-xs font-semibold shrink-0"
                      >
                        <span>Access</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PARTICIPANT PROFILE */}
        {activeTab === "profile" && (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Participant Profile Record</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verified enrollment record registered with the Department of IT & AI&DS.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Full Name</span>
                <span className="font-bold text-slate-900 text-sm">{profile.fullName}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">College Roll Number</span>
                <span className="font-bold font-mono text-slate-900 text-sm">{profile.rollNumber}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Email ID</span>
                <span className="font-medium text-slate-800">{profile.email}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Mobile Number</span>
                <span className="font-mono text-slate-800">{profile.mobile}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Branch & Year</span>
                <span className="font-semibold text-slate-800">{profile.branch} • {profile.year} (Section {profile.section})</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">ISTE Membership Status</span>
                <span className="font-semibold text-slate-800">
                  {profile.isIsteMember ? `Active (${profile.isteNumber || "Verified"})` : "Non-ISTE"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: CERTIFICATE */}
        {activeTab === "certificate" && (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Certificate of Participation</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Issued upon verified attendance check-in and workshop completion.
            </p>

            {certificate?.isPublished ? (
              <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200 text-center space-y-3">
                <Award className="w-10 h-10 text-amber-600 mx-auto" />
                <div className="text-base font-bold text-slate-900">Certificate Issued!</div>
                <div className="text-xs text-slate-600 font-mono">
                  Certificate No: {certificate.certificateNumber}
                </div>
                <div className="pt-2">
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs shadow-xs"
                  >
                    <span>Download Official PDF Certificate</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                <Award className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-sm font-bold text-slate-700">Certificate Not Yet Published</div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Digital certificates will be generated and signed post-event for students who attend the sessions and build challenge.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: SUPPORT DESK */}
        {activeTab === "support" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Participant Support Desk</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Submit questions regarding your ticket, payment, team, or challenge guidelines.
              </p>

              {suppAlert && (
                <div
                  className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                    suppAlert.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{suppAlert.text}</span>
                </div>
              )}

              <form onSubmit={handleCreateSupportTicket} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Issue Category
                    </label>
                    <select
                      value={suppCategory}
                      onChange={(e) => setSuppCategory(e.target.value as SupportTicket["category"])}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="Registration">Registration</option>
                      <option value="Payment">Payment</option>
                      <option value="Ticket">Ticket & QR</option>
                      <option value="Attendance">Attendance</option>
                      <option value="Team">Team Formation</option>
                      <option value="Submission">Project Submission</option>
                      <option value="Other">Other Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={suppSubject}
                      onChange={(e) => setSuppSubject(e.target.value)}
                      placeholder="Brief summary of inquiry"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Message Description *
                  </label>
                  <textarea
                    rows={3}
                    value={suppMessageText}
                    onChange={(e) => setSuppMessageText(e.target.value)}
                    placeholder="Provide details so the student convenor desk can assist you promptly."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingSupp || !suppSubject.trim() || !suppMessageText.trim()}
                  className="py-2.5 px-5 rounded-xl bg-[#0056D2] hover:bg-[#0041a3] text-white text-xs font-semibold shadow-xs disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmittingSupp ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Submit Inquiry</span>}
                </button>
              </form>

              {/* Ticket History */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Your Support Inquiries ({supportTickets.length})
                </h3>

                {supportTickets.length === 0 ? (
                  <p className="text-xs text-slate-400">No support tickets submitted yet.</p>
                ) : (
                  <div className="space-y-3">
                    {supportTickets.map((st) => (
                      <div key={st.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{st.subject}</span>
                          <span className="font-mono text-[10px] text-slate-400">{st.ticketCode}</span>
                        </div>
                        <p className="text-slate-600">{st.message}</p>
                        {st.response && (
                          <div className="mt-2 p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-900">
                            <strong>Desk Response:</strong> {st.response}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
