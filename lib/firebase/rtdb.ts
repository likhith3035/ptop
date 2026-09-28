/**
 * Firebase Realtime Database (RTDB) Sync Service
 * 
 * Provides server-side, non-blocking real-time synchronization to Firebase Realtime Database
 * via its high-performance REST API. Client subscribers receive WebSocket push events instantly.
 */

function getRtdbUrl(): string | null {
  if (process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL) {
    return process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL.replace(/\/$/, "");
  }
  if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    return `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`;
  }
  return null;
}

export async function syncToRtdb(
  path: string, 
  data: unknown, 
  method: "PUT" | "PATCH" | "POST" | "DELETE" = "PUT"
): Promise<boolean> {
  const baseUrl = getRtdbUrl();
  if (!baseUrl) return false;

  const cleanPath = path.replace(/^\//, "").replace(/\.json$/, "");
  const targetUrl = `${baseUrl}/${cleanPath}.json`;

  try {
    const res = await fetch(targetUrl, {
      method,
      headers: { "Content-Type": "application/json" },
      body: method === "DELETE" ? undefined : JSON.stringify(data),
      cache: "no-store",
    });
    return res.ok;
  } catch (err) {
    // Non-blocking catch to ensure local/Supabase operations never fail if Firebase RTDB is unreachable
    console.warn(`[Firebase RTDB] Sync warning for ${path}:`, err);
    return false;
  }
}

/**
 * Sync check-in admission and stats in real time
 */
export async function syncCheckInToRtdb(ticket: {
  ticketNumber: string;
  participantName: string;
  rollNumber: string;
  checkedInAt?: string;
  checkedInBy?: string;
}, stats?: { total: number; checkedIn: number; remaining: number }): Promise<void> {
  // Fire and forget so check-in response is immediate
  Promise.all([
    syncToRtdb(`attendance/${ticket.ticketNumber}`, {
      ticketNumber: ticket.ticketNumber,
      participantName: ticket.participantName,
      rollNumber: ticket.rollNumber,
      checkedInAt: ticket.checkedInAt || new Date().toISOString(),
      checkedInBy: ticket.checkedInBy || "Coordinator",
      status: "checked_in"
    }),
    stats ? syncToRtdb("stats", stats) : Promise.resolve(false)
  ]).catch(() => {});
}

/**
 * Sync submission in real time
 */
export async function syncSubmissionToRtdb(submission: {
  id: string;
  projectName: string;
  teamName?: string;
  submitterName?: string;
  rollNumber?: string;
  status: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  presentationUrl?: string;
  evaluationScore?: number;
  updatedAt: string;
}): Promise<void> {
  syncToRtdb(`submissions/${submission.id}`, submission).catch(() => {});
}

/**
 * Sync event configuration in real time (master lock, registration open, etc.)
 */
export async function syncEventConfigToRtdb(config: {
  isRegistrationOpen?: boolean;
  isSubmissionOpen?: boolean;
  expectedParticipants?: number;
}): Promise<void> {
  syncToRtdb("eventConfig", config, "PATCH").catch(() => {});
}

/**
 * Sync announcement broadcast
 */
export async function syncAnnouncementToRtdb(announcement: {
  id: string;
  title: string;
  message: string;
  priority: string;
  createdAt: string;
}): Promise<void> {
  syncToRtdb(`announcements/${announcement.id}`, announcement).catch(() => {});
}
