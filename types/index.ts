export type UserRole = "user" | "coordinator" | "admin";

export type CoordinatorPermission =
  | "CHECKIN_VIEW"
  | "CHECKIN_MANAGE"
  | "PARTICIPANT_VIEW"
  | "REGISTRATION_VERIFY"
  | "SUPPORT_VIEW"
  | "SUPPORT_REPLY";

export interface EventConfig {
  id: string;
  name: string;
  subtitle: string;
  department: string;
  institution: string;
  association: string;
  date: string;
  displayDate: string;
  time: string;
  venue: string;
  expectedParticipants: number;
  isteFee: number;
  nonIsteFee: number;
  isRegistrationOpen: boolean;
  maxTeamSize: number;
}

export interface ParticipantProfile {
  id: string;
  userId: string;
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
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = "upi" | "cash_at_desk";

export interface Registration {
  id: string;
  registrationNumber: string; // e.g. P2P-2026-X7K9M2
  userId: string;
  participantId: string;
  eventId: string;
  amount: number;
  isIste: boolean;
  paymentMethod: PaymentMethod;
  upiReference?: string;
  status: "pending_payment" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  registrationId: string;
  userId: string;
  paymentMethod: PaymentMethod;
  upiReference?: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "created" | "failed";
  createdAt: string;
  paidAt?: string;
}

export interface DigitalTicket {
  id: string;
  ticketNumber: string;
  registrationNumber: string;
  participantName: string;
  rollNumber: string;
  branch: string;
  year: string;
  eventName: string;
  date: string;
  time: string;
  venue: string;
  qrToken: string; // Secure random token
  isIsteMember: boolean;
  attendanceStatus: "pending" | "checked_in";
  checkedInAt?: string;
  checkedInBy?: string;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  leaderId: string;
  leaderName: string;
  inviteCode: string;
  members: TeamMember[];
  createdAt: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  fullName: string;
  rollNumber: string;
  branch: string;
  role: "leader" | "member";
  joinedAt: string;
}

export interface ProjectSubmission {
  id: string;
  teamId?: string;
  userId: string;
  projectName: string;
  problemStatement: string;
  projectDescription: string;
  technologiesUsed: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  presentationUrl?: string;
  status: "draft" | "submitted" | "under_review" | "evaluated";
  evaluationScore?: number;
  evaluationFeedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicket {
  id: string;
  ticketCode: string;
  userId: string;
  registrationId?: string;
  category: "Registration" | "Payment" | "Ticket" | "Attendance" | "Team" | "Submission" | "Certificate" | "Other";
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  response?: string;
  respondedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "presentation" | "code" | "link" | "guideline";
  fileUrl?: string;
  externalUrl?: string;
  isPublished: boolean;
  createdAt: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  priority: "normal" | "urgent";
  isPublished: boolean;
  createdAt: string;
}

export interface CertificateItem {
  id: string;
  certificateNumber: string;
  participantId: string;
  participantName: string;
  rollNumber?: string;
  branch?: string;
  email?: string;
  eventName: string;
  issueDate: string;
  verificationCode: string;
  pdfUrl?: string;
  isPublished: boolean;
  emailedAt?: string;
  createdAt?: string;
}
