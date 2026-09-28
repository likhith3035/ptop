import { 
  DEFAULT_EVENT_CONFIG, 
} from "@/lib/constants";
import { 
  DigitalTicket, 
  EventConfig, 
  ParticipantProfile, 
  PaymentRecord, 
  ProjectSubmission, 
  Registration, 
  SupportTicket, 
  Team, 
  TeamMember,
  CoordinatorPermission,
  AnnouncementItem,
  ResourceItem,
  CertificateItem
} from "@/types";
import { generateRegistrationNumber, generateTicketToken } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key && !url.includes("placeholder")) {
    return createClient(url, key);
  }
  return null;
}

// Server-side State Store with relational integrity
interface DatabaseState {
  eventConfig: EventConfig;
  profiles: ParticipantProfile[];
  registrations: Registration[];
  payments: PaymentRecord[];
  tickets: DigitalTicket[];
  teams: Team[];
  submissions: ProjectSubmission[];
  supportTickets: SupportTicket[];
  coordinators: {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    department: string;
    permissions: CoordinatorPermission[];
  }[];
  announcements: AnnouncementItem[];
  resources: ResourceItem[];
  certificates: CertificateItem[];
}

// Global persistent in-process store for local/demo runs
const globalStore = global as unknown as { __ptop_db?: DatabaseState };

if (!globalStore.__ptop_db) {
  globalStore.__ptop_db = {
    eventConfig: { ...DEFAULT_EVENT_CONFIG },
    profiles: [],
    registrations: [],
    payments: [],
    tickets: [],
    teams: [],
    submissions: [],
    supportTickets: [],
    coordinators: [
      {
        id: "coord_1",
        userId: "usr_coord_1",
        fullName: "Faculty Coordinator",
        email: "coordinator@nbkrist.org",
        department: "IT & AI&DS",
        permissions: [
          "CHECKIN_VIEW",
          "CHECKIN_MANAGE",
          "PARTICIPANT_VIEW",
          "REGISTRATION_VERIFY",
          "SUPPORT_VIEW",
          "SUPPORT_REPLY"
        ]
      }
    ],
    announcements: [
      {
        id: "ann_1",
        title: "Workshop Lab & Wi-Fi Access Credentials",
        content: "High-speed workshop Wi-Fi credentials will be broadcasted on the Seminar Hall screen at 9:00 AM. Please ensure your laptops have Google Chrome / VS Code installed.",
        priority: "normal",
        isPublished: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "ann_2",
        title: "Session 1 Starts Promptly at 9:35 AM",
        content: "Mr. Suman Mandal from Paytm will be joining live for the first expert session. Please take your seats by 9:15 AM.",
        priority: "urgent",
        isPublished: true,
        createdAt: new Date().toISOString(),
      }
    ],
    resources: [
      {
        id: "res_1",
        title: "Prompt Engineering Playbook (PDF)",
        description: "Official workshop guide covering zero-shot, few-shot, and reasoning frameworks.",
        type: "pdf",
        externalUrl: "https://nbkrist.org/resources/prompt-engineering-playbook.pdf",
        isPublished: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "res_2",
        title: "Starter Repository & API Boilerplate",
        description: "Template repository with Next.js App Router and AI API integrations.",
        type: "code",
        externalUrl: "https://github.com/nbkrist-events/p2p-starter-kit",
        isPublished: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "res_3",
        title: "Build Challenge Rubric & Rules",
        description: "Scoring criteria: Innovation (30%), Prompt Quality (30%), Execution (20%), Demonstration (20%).",
        type: "guideline",
        externalUrl: "#",
        isPublished: true,
        createdAt: new Date().toISOString(),
      }
    ],
    certificates: []
  };
}

const db = globalStore.__ptop_db;

// Asynchronously hydrate real records from Supabase on server start
const sbAdmin = getSupabaseAdmin();
async function hydrateFromSupabase() {
  if (!sbAdmin) return;
  try {
    // 1. Hydrate participant_profiles
    const { data: profiles, error: pError } = await sbAdmin.from("participant_profiles").select("*");
    if (!pError && profiles && profiles.length > 0) {
      for (const p of profiles) {
        if (!db.profiles.some((existing) => existing.rollNumber.toUpperCase() === p.roll_number.toUpperCase())) {
          db.profiles.push({
            id: p.id,
            userId: `usr_${p.id}`,
            fullName: p.full_name,
            email: p.email,
            mobile: p.mobile,
            rollNumber: p.roll_number,
            year: p.year,
            branch: p.branch,
            section: p.section,
            isIsteMember: p.is_iste_member,
            isteNumber: p.iste_number,
            hasLaptop: p.has_laptop,
            linkedinUrl: p.linkedin_url,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
          });
        }
      }
    }

    // 2. Hydrate registrations
    const { data: regs, error: rError } = await sbAdmin.from("registrations").select("*");
    if (!rError && regs && regs.length > 0) {
      for (const r of regs) {
        if (!db.registrations.some((existing) => existing.registrationNumber === r.registration_number)) {
          const profile = db.profiles.find((p) => p.id === r.participant_id) || db.profiles[0];
          db.registrations.push({
            id: r.id,
            registrationNumber: r.registration_number,
            userId: profile ? profile.userId : `usr_${r.id}`,
            participantId: r.participant_id || (profile ? profile.id : r.id),
            eventId: r.event_id || "evt_p2p_2026",
            amount: Number(r.amount) || (r.is_iste ? 50 : 100),
            isIste: Boolean(r.is_iste),
            paymentMethod: "upi",
            upiReference: "VERIFIED_UPI",
            status: r.status || "confirmed",
            createdAt: r.created_at,
            updatedAt: r.updated_at,
          });
        }
      }
    }

    // 3. Hydrate tickets
    const { data: tkts, error: tError } = await sbAdmin.from("tickets").select("*");
    const { data: attRecords } = await sbAdmin.from("attendance").select("*");
    const checkedInTicketIds = new Set(
      attRecords
        ?.filter((a: { status: string; ticket_id: string }) => a.status === "checked_in")
        .map((a: { ticket_id: string }) => a.ticket_id) || []
    );

    if (!tError && tkts && tkts.length > 0) {
      for (const t of tkts) {
        if (!db.tickets.some((existing) => existing.ticketNumber === t.ticket_number || existing.qrToken === t.qr_token)) {
          const reg = db.registrations.find((r) => r.id === t.registration_id) || db.registrations[0];
          const prof = db.profiles.find((p) => p.id === t.participant_id || p.id === reg?.participantId) || db.profiles[0];

          if (prof) {
            db.tickets.push({
              id: t.id,
              ticketNumber: t.ticket_number,
              registrationNumber: reg ? reg.registrationNumber : `P2P-2026-${prof.rollNumber.slice(-4)}`,
              participantName: prof.fullName,
              rollNumber: prof.rollNumber,
              branch: prof.branch,
              year: prof.year,
              eventName: `${db.eventConfig.name} – ${db.eventConfig.subtitle}`,
              date: db.eventConfig.displayDate,
              time: db.eventConfig.time,
              venue: db.eventConfig.venue,
              qrToken: t.qr_token,
              isIsteMember: t.is_iste_member,
              attendanceStatus: checkedInTicketIds.has(t.id) ? "checked_in" : "pending",
              createdAt: t.created_at,
            });
          }
        }
      }
    }
  } catch (err) {
    console.error("Supabase hydration error:", err);
  }
}
hydrateFromSupabase();

export const dbService = {
  // Event Config
  getEventConfig(): EventConfig {
    return db.eventConfig;
  },
  updateEventConfig(updates: Partial<EventConfig>): EventConfig {
    db.eventConfig = { ...db.eventConfig, ...updates };
    return db.eventConfig;
  },

  // Registrations & Capacity
  getRegistrations(): Registration[] {
    return db.registrations;
  },
  getConfirmedRegistrationsCount(): number {
    return db.registrations.filter((r) => r.status === "confirmed").length;
  },
  getRegistrationByNumber(regNum: string): Registration | undefined {
    return db.registrations.find((r) => r.registrationNumber === regNum);
  },
  getRegistrationByUserId(userId: string): Registration | undefined {
    return db.registrations.find((r) => r.userId === userId);
  },

  // Participant Profiles
  getProfiles(): ParticipantProfile[] {
    return db.profiles;
  },
  getProfileById(id: string): ParticipantProfile | undefined {
    return db.profiles.find((p) => p.id === id);
  },
  getProfileByUserId(userId: string): ParticipantProfile | undefined {
    return db.profiles.find((p) => p.userId === userId);
  },
  getProfileByEmail(email: string): ParticipantProfile | undefined {
    return db.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
  },
  getProfileByRollNumber(rollNumber: string): ParticipantProfile | undefined {
    return db.profiles.find((p) => p.rollNumber.toUpperCase() === rollNumber.toUpperCase());
  },

  // Server-side registration creation & validation (Zero Gateway Fees / Direct UPI / Cash at Desk)
  async createRegistration(data: {
    fullName: string;
    email: string;
    mobile: string;
    rollNumber: string;
    year: "1st Year" | "2nd Year" | "3rd Year" | "4th Year";
    branch: "IT" | "AI&DS" | "CSE" | "ECE" | "EEE" | "MECH" | "CIVIL" | "OTHER";
    section: string;
    isIsteMember: boolean;
    isteNumber?: string;
    hasLaptop: boolean;
    linkedinUrl?: string;
    paymentMethod: "upi" | "cash_at_desk";
    upiReference?: string;
  }): Promise<{
    success: boolean;
    error?: string;
    registration?: Registration;
    profile?: ParticipantProfile;
    ticket?: DigitalTicket;
    amount?: number;
  }> {
    // 1. Capacity check
    if (!db.eventConfig.isRegistrationOpen) {
      return { success: false, error: "Registration is currently closed by the organizers." };
    }
    const confirmedCount = this.getConfirmedRegistrationsCount();
    if (confirmedCount >= db.eventConfig.expectedParticipants) {
      return { success: false, error: "Registration capacity (100 students) has been reached." };
    }

    // 2. Duplicate roll number or email check
    const normalizedEmail = data.email.trim().toLowerCase();
    const normalizedRoll = data.rollNumber.trim().toUpperCase();

    const existingRoll = db.profiles.find((p) => p.rollNumber.toUpperCase() === normalizedRoll);
    if (existingRoll) {
      return { success: false, error: `Roll Number ${normalizedRoll} is already registered.` };
    }

    const existingEmail = db.profiles.find((p) => p.email.toLowerCase() === normalizedEmail);
    if (existingEmail) {
      return { success: false, error: `Email ${normalizedEmail} is already registered.` };
    }

    // 3. ISTE validation
    if (data.isIsteMember && (!data.isteNumber || data.isteNumber.trim().length < 3)) {
      return { success: false, error: "Valid ISTE Membership number is required for ISTE discount." };
    }

    // 4. UPI reference validation if paymentMethod === 'upi'
    if (data.paymentMethod === "upi") {
      if (!data.upiReference || data.upiReference.trim().length < 6) {
        return { success: false, error: "Please enter a valid 12-digit UPI Transaction / UTR Number." };
      }
    }

    // 5. Calculate fee strictly on server
    const amount = data.isIsteMember ? db.eventConfig.isteFee : db.eventConfig.nonIsteFee;

    // Create user ID & profile using standard UUIDs
    const profileId = crypto.randomUUID();
    const regId = crypto.randomUUID();
    const ticketId = crypto.randomUUID();
    const userId = `usr_${profileId}`;
    const regNumber = generateRegistrationNumber();

    const profile: ParticipantProfile = {
      id: profileId,
      userId,
      fullName: data.fullName.trim(),
      email: normalizedEmail,
      mobile: data.mobile.trim(),
      rollNumber: normalizedRoll,
      year: data.year,
      branch: data.branch,
      section: data.section.trim().toUpperCase(),
      isIsteMember: data.isIsteMember,
      isteNumber: data.isIsteMember ? data.isteNumber?.trim() : undefined,
      hasLaptop: data.hasLaptop,
      linkedinUrl: data.linkedinUrl?.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const registration: Registration = {
      id: regId,
      registrationNumber: regNumber,
      userId,
      participantId: profileId,
      eventId: db.eventConfig.id,
      amount,
      isIste: data.isIsteMember,
      paymentMethod: data.paymentMethod || "upi",
      upiReference: data.upiReference?.trim(),
      status: "confirmed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Generate secure Digital Ticket immediately
    const uniqueSuffix = `${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`;
    const ticketNumber = `TKT-P2P-${uniqueSuffix}`;
    const qrToken = generateTicketToken();

    const ticket: DigitalTicket = {
      id: ticketId,
      ticketNumber,
      registrationNumber: regNumber,
      participantName: profile.fullName,
      rollNumber: profile.rollNumber,
      branch: profile.branch,
      year: profile.year,
      eventName: `${db.eventConfig.name} – ${db.eventConfig.subtitle}`,
      date: db.eventConfig.displayDate,
      time: db.eventConfig.time,
      venue: db.eventConfig.venue,
      qrToken,
      isIsteMember: profile.isIsteMember,
      attendanceStatus: "pending",
      createdAt: new Date().toISOString(),
    };

    const payment: PaymentRecord = {
      id: `pay_${Date.now()}`,
      registrationId: registration.id,
      userId,
      paymentMethod: data.paymentMethod || "upi",
      upiReference: data.upiReference?.trim() || (data.paymentMethod === "cash_at_desk" ? "CASH_AT_DESK" : undefined),
      amount,
      currency: "INR",
      status: data.paymentMethod === "upi" ? "paid" : "pending",
      createdAt: new Date().toISOString(),
      paidAt: data.paymentMethod === "upi" ? new Date().toISOString() : undefined,
    };

    db.profiles.push(profile);
    db.registrations.push(registration);
    db.tickets.push(ticket);
    db.payments.push(payment);

    // Sequential await for relational integrity in Supabase
    const sb = getSupabaseAdmin();
    if (sb) {
      try {
        const { error: pErr } = await sb.from("participant_profiles").insert({
          id: profileId,
          full_name: profile.fullName,
          email: profile.email,
          mobile: profile.mobile,
          roll_number: profile.rollNumber,
          year: profile.year,
          branch: profile.branch,
          section: profile.section,
          is_iste_member: profile.isIsteMember,
          iste_number: profile.isteNumber,
          has_laptop: profile.hasLaptop,
          linkedin_url: profile.linkedinUrl
        });
        if (pErr) console.error("Supabase profile sync error:", pErr);

        const { error: rErr } = await sb.from("registrations").insert({
          id: regId,
          participant_id: profileId,
          registration_number: registration.registrationNumber,
          amount: registration.amount,
          is_iste: registration.isIste,
          status: registration.status,
        });
        if (rErr) console.error("Supabase reg sync error:", rErr);

        const { error: tErr } = await sb.from("tickets").insert({
          id: ticketId,
          participant_id: profileId,
          registration_id: regId,
          ticket_number: ticket.ticketNumber,
          qr_token: ticket.qrToken,
          is_iste_member: ticket.isIsteMember
        });
        if (tErr) console.error("Supabase ticket sync error:", tErr);
      } catch (sbErr) {
        console.error("Supabase sequential sync error:", sbErr);
      }
    }

    return {
      success: true,
      registration,
      profile,
      ticket,
      amount,
    };
  },

  // Synchronize client-recovered ticket to in-memory store & Supabase
  syncTicket(ticket: DigitalTicket) {
    if (!ticket || !ticket.registrationNumber) return;
    const exists = db.tickets.some((t) => t.registrationNumber === ticket.registrationNumber);
    if (!exists) {
      db.tickets.push(ticket);
    }
  },

  // Tickets
  getTickets(): DigitalTicket[] {
    return db.tickets;
  },
  getTicketByRegistrationNumber(regNum: string): DigitalTicket | undefined {
    return db.tickets.find((t) => t.registrationNumber.toUpperCase() === regNum.trim().toUpperCase());
  },
  async getTicketAsync(idOrRegNum: string): Promise<DigitalTicket | undefined> {
    if (!idOrRegNum) return undefined;
    const query = idOrRegNum.trim().toUpperCase();

    // 1. Check in-memory store
    const local = db.tickets.find(
      (t) =>
        t.registrationNumber.toUpperCase() === query ||
        t.id === idOrRegNum ||
        t.qrToken === idOrRegNum ||
        t.rollNumber.toUpperCase() === query ||
        t.ticketNumber.toUpperCase() === query
    );
    if (local) return local;

    // 2. Query Supabase directly
    const sb = getSupabaseAdmin();
    if (sb) {
      try {
        // Query registrations table by registration_number
        const { data: reg } = await sb
          .from("registrations")
          .select("*, participant_profiles(*), tickets(*)")
          .ilike("registration_number", query)
          .maybeSingle();

        if (reg && reg.participant_profiles) {
          const prof = reg.participant_profiles;
          const tkt = Array.isArray(reg.tickets) && reg.tickets.length > 0 ? reg.tickets[0] : null;

          const newTicket: DigitalTicket = {
            id: tkt?.id || crypto.randomUUID(),
            ticketNumber: tkt?.ticket_number || `TKT-P2P-${reg.registration_number.slice(-6)}`,
            registrationNumber: reg.registration_number,
            participantName: prof.full_name,
            rollNumber: prof.roll_number,
            branch: prof.branch,
            year: prof.year,
            eventName: `${db.eventConfig.name} – ${db.eventConfig.subtitle}`,
            date: db.eventConfig.displayDate,
            time: db.eventConfig.time,
            venue: db.eventConfig.venue,
            qrToken: tkt?.qr_token || generateTicketToken(),
            isIsteMember: Boolean(reg.is_iste),
            attendanceStatus: "pending",
            createdAt: reg.created_at || new Date().toISOString(),
          };

          if (!db.tickets.some((existing) => existing.registrationNumber === newTicket.registrationNumber)) {
            db.tickets.push(newTicket);
          }
          return newTicket;
        }

        // Query tickets table directly by ticket_number, qr_token, or id
        const { data: tkt } = await sb
          .from("tickets")
          .select("*, participant_profiles(*), registrations(*)")
          .or(`id.eq.${idOrRegNum},ticket_number.ilike.${idOrRegNum},qr_token.eq.${idOrRegNum}`)
          .maybeSingle();

        if (tkt && tkt.participant_profiles) {
          const prof = tkt.participant_profiles;
          const regInfo = tkt.registrations;
          const newTicket: DigitalTicket = {
            id: tkt.id,
            ticketNumber: tkt.ticket_number,
            registrationNumber: regInfo?.registration_number || `P2P-2026-${prof.roll_number.slice(-4)}`,
            participantName: prof.full_name,
            rollNumber: prof.roll_number,
            branch: prof.branch,
            year: prof.year,
            eventName: `${db.eventConfig.name} – ${db.eventConfig.subtitle}`,
            date: db.eventConfig.displayDate,
            time: db.eventConfig.time,
            venue: db.eventConfig.venue,
            qrToken: tkt.qr_token,
            isIsteMember: Boolean(tkt.is_iste_member),
            attendanceStatus: "pending",
            createdAt: tkt.created_at || new Date().toISOString(),
          };
          if (!db.tickets.some((existing) => existing.registrationNumber === newTicket.registrationNumber)) {
            db.tickets.push(newTicket);
          }
          return newTicket;
        }

        // Query participant_profiles table directly by roll_number
        const { data: profileByRoll } = await sb
          .from("participant_profiles")
          .select("*, registrations(*, tickets(*))")
          .ilike("roll_number", query)
          .maybeSingle();

        if (profileByRoll && profileByRoll.registrations && profileByRoll.registrations.length > 0) {
          const regInfo = profileByRoll.registrations[0];
          const tktInfo = Array.isArray(regInfo.tickets) && regInfo.tickets.length > 0 ? regInfo.tickets[0] : null;
          const newTicket: DigitalTicket = {
            id: tktInfo?.id || crypto.randomUUID(),
            ticketNumber: tktInfo?.ticket_number || `TKT-P2P-${regInfo.registration_number.slice(-6)}`,
            registrationNumber: regInfo.registration_number,
            participantName: profileByRoll.full_name,
            rollNumber: profileByRoll.roll_number,
            branch: profileByRoll.branch,
            year: profileByRoll.year,
            eventName: `${db.eventConfig.name} – ${db.eventConfig.subtitle}`,
            date: db.eventConfig.displayDate,
            time: db.eventConfig.time,
            venue: db.eventConfig.venue,
            qrToken: tktInfo?.qr_token || generateTicketToken(),
            isIsteMember: Boolean(profileByRoll.is_iste_member),
            attendanceStatus: "pending",
            createdAt: profileByRoll.created_at || new Date().toISOString(),
          };
          if (!db.tickets.some((existing) => existing.registrationNumber === newTicket.registrationNumber)) {
            db.tickets.push(newTicket);
          }
          return newTicket;
        }
      } catch (err) {
        console.error("Supabase getTicketAsync query error:", err);
      }
    }

    return undefined;
  },

  getTicketByUserId(userId: string): DigitalTicket | undefined {
    const reg = db.registrations.find((r) => r.userId === userId);
    if (!reg) return undefined;
    return db.tickets.find((t) => t.registrationNumber === reg.registrationNumber);
  },
  getTicketByQrToken(qrToken: string): DigitalTicket | undefined {
    return db.tickets.find((t) => t.qrToken === qrToken);
  },

  // Attendance & Check-in
  checkInParticipant(
    qrTokenOrRegNum: string,
    coordinatorName = "Coordinator Desk",
    confirmCash = false
  ): {
    success: boolean;
    alreadyCheckedIn: boolean;
    message: string;
    ticket?: DigitalTicket;
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
  } {
    const query = qrTokenOrRegNum.trim().toUpperCase();
    const ticket = db.tickets.find(
      (t) =>
        t.qrToken === qrTokenOrRegNum ||
        t.registrationNumber.toUpperCase() === query ||
        t.rollNumber.toUpperCase() === query
    );

    const getStats = () => {
      const total = db.tickets.length;
      const checkedIn = db.tickets.filter((t) => t.attendanceStatus === "checked_in").length;
      return { total, checkedIn, remaining: Math.max(0, total - checkedIn) };
    };

    if (!ticket) {
      return {
        success: false,
        alreadyCheckedIn: false,
        message: `No participant matching "${qrTokenOrRegNum}" found in event registry.`,
        stats: getStats(),
      };
    }

    const registration = db.registrations.find((r) => r.registrationNumber === ticket.registrationNumber);
    const payment = db.payments.find((p) => p.registrationId === registration?.id);

    const paymentInfo = {
      method: registration?.paymentMethod || "upi",
      amount: registration?.amount || (ticket.isIsteMember ? 50 : 100),
      upiReference: registration?.upiReference,
      status: payment?.status || (registration?.paymentMethod === "upi" ? "paid" : "pending"),
    };

    if (ticket.attendanceStatus === "checked_in") {
      const checkInTime = ticket.checkedInAt ? new Date(ticket.checkedInAt).toLocaleTimeString("en-IN") : "earlier";
      return {
        success: false,
        alreadyCheckedIn: true,
        message: `⚠️ ALREADY CHECKED IN at ${checkInTime} by ${ticket.checkedInBy || "Coordinator"}. DO NOT ADMIT.`,
        ticket,
        payment: paymentInfo,
        stats: getStats(),
      };
    }

    // Perform check-in
    ticket.attendanceStatus = "checked_in";
    ticket.checkedInAt = new Date().toISOString();
    ticket.checkedInBy = coordinatorName;

    // If cash was confirmed at gate desk, update payment status
    if (confirmCash && payment) {
      payment.status = "paid";
      payment.paidAt = new Date().toISOString();
      payment.upiReference = `CASH_COLLECTED_BY_${coordinatorName.replace(/\s+/g, "_").toUpperCase()}`;
    }

    const sb = getSupabaseAdmin();
    if (sb) {
      sb.from("attendance").insert({
        status: "checked_in",
        verification_notes: `Checked in by ${coordinatorName}${confirmCash ? " (Cash Collected at Desk)" : ""}`
      }).then(() => {});

      if (confirmCash && registration) {
        sb.from("payments").update({
          status: "paid",
          paid_at: new Date().toISOString()
        }).eq("registration_id", registration.id).then(() => {});
      }
    }

    return {
      success: true,
      alreadyCheckedIn: false,
      message: `Check-in verified! Welcome, ${ticket.participantName} (${ticket.rollNumber}).`,
      ticket,
      payment: paymentInfo,
      stats: getStats(),
    };
  },

  // Teams
  getTeams(): Team[] {
    return db.teams;
  },
  getTeamByUserId(userId: string): Team | undefined {
    return db.teams.find((t) => t.members.some((m) => m.userId === userId));
  },
  createTeam(name: string, userId: string): { success: boolean; team?: Team; error?: string } {
    // Check if user already in team
    if (this.getTeamByUserId(userId)) {
      return { success: false, error: "You are already a member of a team." };
    }
    // Check duplicate team name
    if (db.teams.some((t) => t.name.toLowerCase() === name.trim().toLowerCase())) {
      return { success: false, error: "Team name already taken. Please choose another name." };
    }

    const profile = db.profiles.find((p) => p.userId === userId);
    const memberName = profile ? profile.fullName : "Team Leader";
    const memberRoll = profile ? profile.rollNumber : "N/A";
    const memberBranch = profile ? profile.branch : "N/A";

    const teamId = `team_${Date.now()}`;
    const inviteCode = `P2P-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newTeam: Team = {
      id: teamId,
      name: name.trim(),
      leaderId: userId,
      leaderName: memberName,
      inviteCode,
      members: [
        {
          id: `tm_${Date.now()}`,
          teamId,
          userId,
          fullName: memberName,
          rollNumber: memberRoll,
          branch: memberBranch,
          role: "leader",
          joinedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    };

    db.teams.push(newTeam);
    return { success: true, team: newTeam };
  },
  joinTeam(inviteCode: string, userId: string): { success: boolean; team?: Team; error?: string } {
    if (this.getTeamByUserId(userId)) {
      return { success: false, error: "You are already a member of a team." };
    }
    const team = db.teams.find((t) => t.inviteCode.toUpperCase() === inviteCode.trim().toUpperCase());
    if (!team) {
      return { success: false, error: "Team not found. Please verify the invite code." };
    }
    if (team.members.length >= db.eventConfig.maxTeamSize) {
      return { success: false, error: `Team has reached the maximum size of ${db.eventConfig.maxTeamSize} members.` };
    }

    const profile = db.profiles.find((p) => p.userId === userId);
    const newMember: TeamMember = {
      id: `tm_${Date.now()}`,
      teamId: team.id,
      userId,
      fullName: profile ? profile.fullName : "Team Member",
      rollNumber: profile ? profile.rollNumber : "N/A",
      branch: profile ? profile.branch : "N/A",
      role: "member",
      joinedAt: new Date().toISOString(),
    };

    team.members.push(newMember);
    return { success: true, team };
  },

  // Submissions
  getSubmissions(): ProjectSubmission[] {
    return db.submissions;
  },
  getSubmissionByUserId(userId: string): ProjectSubmission | undefined {
    const team = this.getTeamByUserId(userId);
    if (team) {
      return db.submissions.find((s) => s.teamId === team.id || s.userId === userId);
    }
    return db.submissions.find((s) => s.userId === userId);
  },
  saveSubmission(userId: string, data: Partial<ProjectSubmission>): { success: boolean; submission?: ProjectSubmission; error?: string } {
    const team = this.getTeamByUserId(userId);
    let sub = this.getSubmissionByUserId(userId);

    if (sub) {
      Object.assign(sub, data, { updatedAt: new Date().toISOString() });
    } else {
      sub = {
        id: `sub_${Date.now()}`,
        teamId: team?.id,
        userId,
        projectName: data.projectName || "Untitled Build",
        problemStatement: data.problemStatement || "",
        projectDescription: data.projectDescription || "",
        technologiesUsed: data.technologiesUsed || [],
        githubUrl: data.githubUrl,
        liveDemoUrl: data.liveDemoUrl,
        presentationUrl: data.presentationUrl,
        status: data.status || "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.submissions.push(sub);
    }
    return { success: true, submission: sub };
  },

  // Support
  getSupportTickets(): SupportTicket[] {
    return db.supportTickets;
  },
  getSupportTicketsByUserId(userId: string): SupportTicket[] {
    return db.supportTickets.filter((st) => st.userId === userId);
  },
  createSupportTicket(userId: string, category: SupportTicket["category"], subject: string, message: string): SupportTicket {
    const newTicket: SupportTicket = {
      id: `supp_${Date.now()}`,
      ticketCode: `SUP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      userId,
      category,
      subject: subject.trim(),
      message: message.trim(),
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.supportTickets.push(newTicket);
    return newTicket;
  },

  // Announcements
  getAnnouncements(): AnnouncementItem[] {
    return db.announcements.filter((a) => a.isPublished);
  },
  getAllAnnouncements(): AnnouncementItem[] {
    return db.announcements;
  },
  createAnnouncement(title: string, content: string, priority: "normal" | "urgent" = "normal"): AnnouncementItem {
    const item: AnnouncementItem = {
      id: `ann_${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      priority,
      isPublished: true,
      createdAt: new Date().toISOString(),
    };
    db.announcements.unshift(item);
    return item;
  },

  // Resources
  getResources(): ResourceItem[] {
    return db.resources.filter((r) => r.isPublished);
  },
  getAllResources(): ResourceItem[] {
    return db.resources;
  },

  // Certificates
  getCertificates(): CertificateItem[] {
    return db.certificates;
  },
  async getCertificatesAsync(): Promise<CertificateItem[]> {
    const sb = getSupabaseAdmin();
    if (sb) {
      try {
        const { data, error } = await sb.from("certificates").select("*, participant_profiles(*)");
        if (!error && data && data.length > 0) {
          for (const item of data) {
            if (!db.certificates.some((c) => c.certificateNumber === item.certificate_number)) {
              const prof = item.participant_profiles;
              db.certificates.push({
                id: item.id,
                certificateNumber: item.certificate_number,
                participantId: item.participant_id,
                participantName: prof ? prof.full_name : "Participant",
                rollNumber: prof?.roll_number,
                branch: prof?.branch,
                email: prof?.email,
                eventName: db.eventConfig.name,
                issueDate: "11 April 2026",
                verificationCode: item.verification_code || `VER-${item.id.slice(0, 8).toUpperCase()}`,
                pdfUrl: item.pdf_url,
                isPublished: Boolean(item.is_published),
                createdAt: item.created_at,
              });
            }
          }
        }
      } catch (err) {
        console.error("Supabase getCertificatesAsync error:", err);
      }
    }
    return db.certificates;
  },
  getCertificateByRollNumber(rollNumber: string): CertificateItem | undefined {
    const profile = this.getProfileByRollNumber(rollNumber);
    if (!profile) return undefined;
    return db.certificates.find((c) => c.participantId === profile.id || c.rollNumber?.toUpperCase() === rollNumber.toUpperCase());
  },
  async getCertificateAsync(idOrNum: string): Promise<CertificateItem | undefined> {
    const query = idOrNum.trim().toUpperCase();

    // 1. Check in-memory store
    const local = db.certificates.find(
      (c) =>
        c.certificateNumber.toUpperCase() === query ||
        c.id === idOrNum ||
        c.verificationCode.toUpperCase() === query ||
        c.rollNumber?.toUpperCase() === query
    );
    if (local) return local;

    // 2. Query Supabase
    const sb = getSupabaseAdmin();
    if (sb) {
      try {
        const { data } = await sb
          .from("certificates")
          .select("*, participant_profiles(*)")
          .or(`certificate_number.ilike.${idOrNum},verification_code.ilike.${idOrNum},id.eq.${idOrNum}`)
          .maybeSingle();

        if (data) {
          const prof = data.participant_profiles;
          const cert: CertificateItem = {
            id: data.id,
            certificateNumber: data.certificate_number,
            participantId: data.participant_id,
            participantName: prof ? prof.full_name : "Participant",
            rollNumber: prof?.roll_number,
            branch: prof?.branch,
            email: prof?.email,
            eventName: "Prompt to Production – Paytm AI Workshop",
            issueDate: "11 April 2026",
            verificationCode: data.verification_code,
            isPublished: Boolean(data.is_published),
            createdAt: data.created_at,
          };
          if (!db.certificates.some((c) => c.certificateNumber === cert.certificateNumber)) {
            db.certificates.push(cert);
          }
          return cert;
        }
      } catch (err) {
        console.error("Supabase getCertificateAsync error:", err);
      }
    }
    return undefined;
  },
  issueCertificate(participantId: string, overrides?: { fullName?: string; rollNumber?: string; branch?: string; year?: string }, forceRegenerate?: boolean): CertificateItem {
    const profile = db.profiles.find((p) => p.id === participantId);
    const existingIdx = db.certificates.findIndex((c) => c.participantId === participantId);

    // If already exists and not forcing regeneration, return existing
    if (existingIdx >= 0 && !forceRegenerate) return db.certificates[existingIdx];

    // Use override values if provided, otherwise fall back to profile data
    const name = overrides?.fullName || profile?.fullName || "Participant";
    const roll = overrides?.rollNumber || profile?.rollNumber;
    const branch = overrides?.branch || profile?.branch;
    const email = profile?.email;

    // If regenerating, reuse the existing cert ID & number, update data
    if (existingIdx >= 0 && forceRegenerate) {
      const existing = db.certificates[existingIdx];
      existing.participantName = name;
      existing.rollNumber = roll;
      existing.branch = branch;
      existing.email = email;

      // Sync to Supabase (no need to re-insert, just update)
      const sb = getSupabaseAdmin();
      if (sb) {
        sb.from("certificates").update({
          is_published: true,
        }).eq("id", existing.id).then(({ error }: { error: unknown }) => {
          if (error) console.error("Supabase cert update error:", error);
        });
      }
      return existing;
    }

    const certId = crypto.randomUUID();
    const certSuffix = Math.floor(1000 + Math.random() * 9000);
    const certNumber = `NBKRIST-P2P-2026-${certSuffix}`;
    const verificationCode = `VER-${crypto.randomUUID().substring(0, 8).toUpperCase()}`;

    const cert: CertificateItem = {
      id: certId,
      certificateNumber: certNumber,
      participantId,
      participantName: name,
      rollNumber: roll,
      branch,
      email,
      eventName: db.eventConfig.name,
      issueDate: "11 April 2026",
      verificationCode,
      isPublished: true,
      createdAt: new Date().toISOString(),
    };
    db.certificates.push(cert);

    const sb = getSupabaseAdmin();
    if (sb) {
      (async () => {
        try {
          const { data: existingProf } = await sb
            .from("participant_profiles")
            .select("id")
            .eq("id", participantId)
            .maybeSingle();

          if (!existingProf && profile) {
            await sb.from("participant_profiles").insert({
              id: participantId,
              user_id: null,
              full_name: profile.fullName,
              email: profile.email || `participant_${participantId.slice(0, 8)}@nbkrist.ac.in`,
              mobile: profile.mobile || "9999999999",
              roll_number: profile.rollNumber,
              year: profile.year || "3rd Year",
              branch: profile.branch || "CSE",
              section: profile.section || "A",
              is_iste_member: Boolean(profile.isIsteMember),
              has_laptop: true,
            });
          }

          const { error: certErr } = await sb.from("certificates").insert({
            id: certId,
            certificate_number: certNumber,
            participant_id: participantId,
            verification_code: verificationCode,
            is_published: true,
          });
          if (certErr) console.error("Supabase cert sync error:", certErr);
        } catch (err) {
          console.error("Supabase cert sync exception:", err);
        }
      })();
    }

    return cert;
  },

  // Update an existing profile's details and optionally issue/regenerate certificate
  async updateProfileAndIssueCert(
    participantId: string,
    updates: { fullName?: string; rollNumber?: string; branch?: string; year?: string },
    issueCert: boolean = true
  ): Promise<{ profile: ParticipantProfile; certificate?: CertificateItem }> {
    const idx = db.profiles.findIndex((p) => p.id === participantId);
    if (idx < 0) throw new Error("Profile not found");

    const profile = db.profiles[idx];
    if (updates.fullName) profile.fullName = updates.fullName;
    if (updates.rollNumber) profile.rollNumber = updates.rollNumber;
    if (updates.branch) profile.branch = updates.branch as ParticipantProfile["branch"];
    if (updates.year) profile.year = updates.year as ParticipantProfile["year"];
    profile.updatedAt = new Date().toISOString();

    // Sync to Supabase
    const sb = getSupabaseAdmin();
    if (sb) {
      const supaUpdates: Record<string, unknown> = { updated_at: profile.updatedAt };
      if (updates.fullName) supaUpdates.full_name = updates.fullName;
      if (updates.rollNumber) supaUpdates.roll_number = updates.rollNumber;
      if (updates.branch) supaUpdates.branch = updates.branch;
      if (updates.year) supaUpdates.year = updates.year;

      await sb.from("participant_profiles").update(supaUpdates).eq("id", participantId);
    }

    // Also update matching ticket display data
    const ticket = db.tickets.find(
      (t) => t.rollNumber.toUpperCase() === (updates.rollNumber || profile.rollNumber).toUpperCase()
    );
    if (ticket) {
      if (updates.fullName) ticket.participantName = updates.fullName;
      if (updates.rollNumber) ticket.rollNumber = updates.rollNumber;
      if (updates.branch) ticket.branch = updates.branch;
      if (updates.year) ticket.year = updates.year;
    }

    let certificate: CertificateItem | undefined;
    if (issueCert) {
      certificate = this.issueCertificate(participantId, updates, true);
    }

    return { profile, certificate };
  },

  // Add a manual/walk-in participant and issue certificate immediately
  async addManualProfileAndIssueCert(data: {
    fullName: string;
    rollNumber: string;
    branch: string;
    year: string;
    email?: string;
    mobile?: string;
    section?: string;
  }): Promise<{ profile: ParticipantProfile; certificate: CertificateItem }> {
    const profileId = crypto.randomUUID();
    const profile: ParticipantProfile = {
      id: profileId,
      userId: crypto.randomUUID(),
      fullName: data.fullName,
      email: data.email || "",
      mobile: data.mobile || "",
      rollNumber: data.rollNumber,
      year: data.year as ParticipantProfile["year"],
      branch: data.branch as ParticipantProfile["branch"],
      section: data.section || "A",
      isIsteMember: false,
      hasLaptop: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.profiles.push(profile);

    // Sync to Supabase
    const sb = getSupabaseAdmin();
    if (sb) {
      const { error: insErr } = await sb.from("participant_profiles").insert({
        id: profileId,
        user_id: null,
        full_name: data.fullName,
        email: data.email || `manual_${profileId.slice(0, 8)}@nbkrist.ac.in`,
        mobile: data.mobile || "0000000000",
        roll_number: data.rollNumber,
        year: data.year,
        branch: data.branch,
        section: data.section || "A",
        is_iste_member: false,
        has_laptop: true,
      });
      if (insErr) console.error("Manual profile Supabase insert error:", insErr);
    }

    const certificate = this.issueCertificate(profileId);
    return { profile, certificate };
  },

  async generateAllCertificates(): Promise<{ generated: number; certificates: CertificateItem[] }> {
    let count = 0;
    for (const p of db.profiles) {
      const already = db.certificates.some((c) => c.participantId === p.id);
      if (!already) {
        this.issueCertificate(p.id);
        count++;
      }
    }
    return { generated: count, certificates: db.certificates };
  },
  markCertificateEmailed(certificateId: string): boolean {
    const cert = db.certificates.find((c) => c.id === certificateId || c.certificateNumber === certificateId);
    if (cert) {
      cert.emailedAt = new Date().toISOString();
      return true;
    }
    return false;
  },

  // Admin stats
  getAdminStats() {
    const totalRegs = db.registrations.length;
    const confirmedRegs = db.registrations.filter((r) => r.status === "confirmed").length;
    const isteCount = db.profiles.filter((p) => p.isIsteMember).length;
    const nonIsteCount = totalRegs - isteCount;
    const checkedInCount = db.tickets.filter((t) => t.attendanceStatus === "checked_in").length;
    const totalTeams = db.teams.length;
    const totalSubmissions = db.submissions.length;
    const openSupport = db.supportTickets.filter((s) => s.status === "open").length;
    const totalRevenue = db.payments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      totalRegistrations: totalRegs,
      confirmedRegistrations: confirmedRegs,
      isteParticipants: isteCount,
      nonIsteParticipants: nonIsteCount,
      checkedInParticipants: checkedInCount,
      totalTeams,
      totalSubmissions,
      openSupportTickets: openSupport,
      totalRevenue,
      capacity: db.eventConfig.expectedParticipants,
    };
  },

  // Delete an individual participant across in-memory state and Supabase
  async deleteParticipant(identifier: string): Promise<boolean> {
    const clean = identifier.trim().toUpperCase();
    const profile = db.profiles.find(
      (p) => p.id === identifier || p.rollNumber.toUpperCase() === clean
    );

    let targetRoll = clean;
    let targetProfileId = identifier;
    let targetUserId = "";

    if (profile) {
      targetRoll = profile.rollNumber.toUpperCase();
      targetProfileId = profile.id;
      targetUserId = profile.userId;
    } else {
      const ticket = db.tickets.find(
        (t) =>
          t.id === identifier ||
          t.rollNumber.toUpperCase() === clean ||
          t.registrationNumber.toUpperCase() === clean
      );
      if (ticket) {
        targetRoll = ticket.rollNumber.toUpperCase();
        targetProfileId = ticket.id;
      }
    }

    // 1. Remove from in-memory arrays
    db.profiles = db.profiles.filter(
      (p) => p.id !== targetProfileId && p.rollNumber.toUpperCase() !== targetRoll
    );

    const removedRegNumbers: string[] = [];
    const removedRegIds: string[] = [];
    db.registrations = db.registrations.filter((r) => {
      const match =
        r.participantId === targetProfileId ||
        (targetUserId && r.userId === targetUserId);
      if (match) {
        removedRegNumbers.push(r.registrationNumber);
        removedRegIds.push(r.id);
        return false;
      }
      return true;
    });

    db.tickets = db.tickets.filter(
      (t) =>
        t.rollNumber.toUpperCase() !== targetRoll &&
        !removedRegNumbers.includes(t.registrationNumber) &&
        t.id !== targetProfileId
    );

    db.certificates = db.certificates.filter(
      (c) =>
        c.participantId !== targetProfileId &&
        c.rollNumber?.toUpperCase() !== targetRoll
    );

    db.payments = db.payments.filter(
      (p) =>
        !removedRegIds.includes(p.registrationId) &&
        (!targetUserId || p.userId !== targetUserId)
    );

    if (targetUserId) {
      db.submissions = db.submissions.filter((s) => s.userId !== targetUserId);
      db.teams = db.teams.filter((tm) => tm.leaderId !== targetUserId);
    }

    // 2. Remove from Supabase
    const sb = getSupabaseAdmin();
    if (sb) {
      try {
        await sb.from("certificates").delete().eq("participant_id", targetProfileId);
        await sb.from("tickets").delete().eq("participant_id", targetProfileId);
        if (targetUserId) {
          await sb.from("payments").delete().eq("user_id", targetUserId);
        }
        await sb.from("registrations").delete().eq("participant_id", targetProfileId);
        await sb.from("participant_profiles").delete().eq("id", targetProfileId);
        await sb.from("participant_profiles").delete().eq("roll_number", targetRoll);
      } catch (err) {
        console.error("Supabase single deletion error:", err);
      }
    }

    return true;
  },

  // Permanently delete all participant registrations, tickets, payments, and certificates
  async deleteAllData(): Promise<void> {
    // 1. Wipe in-memory store
    db.profiles = [];
    db.registrations = [];
    db.payments = [];
    db.tickets = [];
    db.certificates = [];
    db.submissions = [];
    db.teams = [];
    db.supportTickets = [];

    // 2. Wipe Supabase tables
    const sb = getSupabaseAdmin();
    if (sb) {
      const nil = "00000000-0000-0000-0000-000000000000";
      try {
        await sb.from("certificates").delete().neq("id", nil);
        await sb.from("attendance").delete().neq("id", nil);
        await sb.from("tickets").delete().neq("id", nil);
        await sb.from("payments").delete().neq("id", nil);
        await sb.from("registrations").delete().neq("id", nil);
        await sb.from("submissions").delete().neq("id", nil);
        await sb.from("team_members").delete().neq("id", nil);
        await sb.from("teams").delete().neq("id", nil);
        await sb.from("support_tickets").delete().neq("id", nil);
        await sb.from("participant_profiles").delete().neq("id", nil);
      } catch (err) {
        console.error("Supabase bulk wipe error:", err);
      }
    }
  },
};
