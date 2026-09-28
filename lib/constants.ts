import { EventConfig } from "@/types";

export const DEFAULT_EVENT_CONFIG: EventConfig = {
  id: "evt_p2p_2026",
  name: "Prompt to Production",
  subtitle: "Paytm AI Workshop",
  department: "Department of IT & AI&DS",
  institution: "N.B.K.R. Institute of Science & Technology",
  association: "ISTE Student Chapter",
  date: "2026-09-30",
  displayDate: "30 September 2026 (Wednesday)",
  time: "9:00 AM – 4:00 PM",
  venue: "Seminar Hall, New CSE Block",
  expectedParticipants: 100,
  isteFee: 50,
  nonIsteFee: 100,
  isRegistrationOpen: true,
  maxTeamSize: 4,
};

export const SPEAKERS = [
  {
    id: "suman-mandal",
    name: "Mr. Suman Mandal",
    role: "Program Lead",
    company: "Paytm",
    mode: "Virtual Session",
    duration: "1 Hour 15 Minutes",
    topic: "Prompt Engineering & Production-Grade AI Systems",
    bio: "Program Lead at Paytm spearheading scalable technological solutions, AI product workflows, and real-world system architecture.",
    initials: "SM",
  },
  {
    id: "shivam-behl",
    name: "Mr. Shivam Behl",
    role: "SDE-II",
    company: "Microsoft",
    mode: "Virtual Session",
    duration: "1 Hour 15 Minutes",
    topic: "AI-Assisted Development & Enterprise Cloud Integration",
    bio: "Software Development Engineer at Microsoft specializing in cloud platforms, generative models, and engineering productivity tools.",
    initials: "SB",
  },
];

export const SCHEDULE_TIMELINE = [
  { time: "9:00 – 9:15 AM", title: "Registration and Seating", category: "General", desc: "Arrival of registered students, physical kit handout & seating." },
  { time: "9:15 – 9:25 AM", title: "Welcome Address", category: "Ceremony", desc: "Opening remarks by Head of Department & Faculty Coordinators." },
  { time: "9:25 – 9:35 AM", title: "Prompt to Production Introduction", category: "Keynote", desc: "Setting the stage for the day's goals, themes, and build challenge." },
  { time: "9:35 – 10:50 AM", title: "Expert Session – Mr. Suman Mandal", category: "Speaker", speaker: "Mr. Suman Mandal (Paytm)", desc: "Deep dive into Prompt Engineering paradigms, LLM patterns, and real-world engineering constraints." },
  { time: "10:50 – 11:00 AM", title: "Interaction / Q&A", category: "Interactive", desc: "Live audience Q&A with Mr. Suman Mandal." },
  { time: "11:00 – 11:15 AM", title: "Tea Break", category: "Break", desc: "Networking and refreshments." },
  { time: "11:15 AM – 12:30 PM", title: "Expert Session – Mr. Shivam Behl", category: "Speaker", speaker: "Mr. Shivam Behl (Microsoft)", desc: "AI-assisted engineering, tooling workflows, and transitioning prototypes to resilient codebases." },
  { time: "12:30 – 12:40 PM", title: "Q&A Session", category: "Interactive", desc: "Direct technical questions with Mr. Shivam Behl." },
  { time: "12:40 – 1:30 PM", title: "Lunch Break", category: "Break", desc: "Lunch provided for all registered participants." },
  { time: "1:30 – 1:45 PM", title: "Build Challenge Introduction", category: "Challenge", desc: "Problem statement unveiling, rubric announcement & team formation." },
  { time: "1:45 – 3:15 PM", title: "Hands-on AI Build", category: "Challenge", desc: "Intensive 90-minute building sprint with on-site faculty mentoring." },
  { time: "3:15 – 3:35 PM", title: "Project Demonstrations", category: "Challenge", desc: "Top team presentations and live working prototypes." },
  { time: "3:35 – 3:50 PM", title: "Evaluation", category: "Review", desc: "Jury scoring based on prompt creativity, implementation, and feasibility." },
  { time: "3:50 – 4:00 PM", title: "Prize Distribution & Vote of Thanks", category: "Ceremony", desc: "Recognizing outstanding builds and closing remarks." },
];

export const HIGHLIGHTS = [
  {
    icon: "Sparkles",
    title: "Generative AI",
    desc: "From core mathematical concepts to production applications.",
  },
  {
    icon: "Code2",
    title: "Prompt Engineering",
    desc: "Master system prompts, few-shot prompting, and chain-of-thought.",
  },
  {
    icon: "Boxes",
    title: "AI-Assisted Development",
    desc: "Supercharge your coding speed and build systems 10x faster.",
  },
  {
    icon: "Users2",
    title: "Team Collaboration",
    desc: "Pair with talented developers and build cohesive software together.",
  },
  {
    icon: "MonitorPlay",
    title: "Project Demonstration",
    desc: "Pitch and demonstrate working MVPs directly to evaluators.",
  },
  {
    icon: "Building2",
    title: "Industry Interaction",
    desc: "Learn directly from senior engineers at Paytm and Microsoft.",
  },
  {
    icon: "Gift",
    title: "Surprise Prizes",
    desc: "Awards, cash prizes, and merchandise for top-performing teams.",
  },
];

export const FAQ_ITEMS = [
  {
    q: "Who is eligible to attend the workshop?",
    a: "The workshop is open to all engineering students of N.B.K.R. Institute of Science & Technology across all branches (IT, AI&DS, CSE, ECE, EEE, MECH, CIVIL) and all years. Prior familiarity with programming basics is recommended.",
  },
  {
    q: "What is the registration fee?",
    a: "For registered ISTE Student Chapter members, the fee is ₹50 (requires valid ISTE number). For Non-ISTE students, the fee is ₹100.",
  },
  {
    q: "Do I need to bring my own laptop?",
    a: "Yes, bringing a laptop with working Wi-Fi capability and browser/IDE installed is strongly advised for the hands-on afternoon Build Challenge.",
  },
  {
    q: "Will participants receive an authorized certificate?",
    a: "Yes! Every participant who is checked-in via their digital QR ticket and completes the workshop schedule will receive an official verifiable certificate issued by the Department of IT & AI&DS in association with ISTE.",
  },
  {
    q: "How does the team challenge work?",
    a: "Teams can have 2 to 4 members. You can either register your team together through the dashboard after enrollment or team up during the workshop kick-off.",
  },
  {
    q: "How do I access my entry ticket?",
    a: "Once your registration and payment verification are complete, your high-security Digital QR Ticket is automatically generated inside your personal dashboard. You can download it or save it to your phone for coordinator scanning at the venue.",
  },
];

export const CONTACT_PERSONS = [
  {
    role: "Faculty Coordinator",
    name: "Department of IT & AI&DS",
    dept: "N.B.K.R.I.S.T, Vidyanagar",
    email: "it_aids@nbkrist.org",
  },
  {
    role: "ISTE Student Chapter",
    name: "Student Convenor Desk",
    dept: "ISTE Chapter NBKRIST",
    email: "iste@nbkrist.org",
  },
];

export const UPI_CONFIG = {
  payeeName: process.env.NEXT_PUBLIC_UPI_NAME || "NBKRIST ISTE Student Chapter",
  upiId: process.env.NEXT_PUBLIC_UPI_ID || "9491803089@ptaxis",
  instructions: "Scan the official UPI QR code with GPay, PhonePe, or Paytm for zero transaction fees. Enter the 12-digit UTR/Reference number to confirm.",
};
