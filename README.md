# ⚡ Prompt to Production — Paytm AI Workshop
### N.B.K.R. Institute of Science & Technology (Autonomous, Vidyanagar)
**Department of Information Technology & Artificial Intelligence & Data Science**  
*In Association with ISTE Student Chapter*

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20RLS-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Modern%20UI-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Direct UPI](https://img.shields.io/badge/Direct_UPI-Zero%20Fees%20(Free)-002970?style=for-the-badge&logo=paytm)](https://paytm.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

## 🧭 Executive Summary

**Prompt to Production** is a full-stack, enterprise-grade event management platform and gate admission terminal custom-engineered for the **Paytm AI Workshop** hosted at the **N.B.K.R. Institute of Science & Technology (NBKRIST)** campus on **30 September 2026**.

Built specifically for high-density campus environments where **90%+ of attendees and coordinators operate entirely from mobile smartphones**, this application eliminates costly payment gateway fees (100% free via direct UPI transfer & cash-at-desk), enforces strict access security with confidential staff portals, and delivers an ultra-fast, audio-haptic QR admission terminal that works natively on every mobile device.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                PROMPT TO PRODUCTION PLATFORM                                │
├───────────────────────────────┬───────────────────────────────┬─────────────────────────────┤
│      🎓 Student Portal        │     🛡️ Gate Terminal           │    📊 Admin Master Console  │
│  • Instant Direct UPI (₹0 fee)│  • 4-Digit Shift Unlock (1234)│  • Live Real-Time Analytics │
│  • Cryptographic QR Ticket    │  • Native Phone Camera Snap   │  • 1-Click CSV Roster Export│
│  • WhatsApp Pass Share        │  • WhatsApp Screenshot Decode │  • Live Event Capacity Rules│
│  • Team Formation (P2P-XXXX)  │  • Audio / Haptic Feedback    │  • Advisory Broadcaster     │
│  • Build Challenge Submission │  • Duplicate Pass Deny Alarm  │  • Verified Certificates    │
│  • Verifiable Certificate View│  • Cash Collection Workflow   │  • Password Protected Delete│
└───────────────────────────────┴───────────────────────────────┴─────────────────────────────┘
```

---

## 📌 Event Specification

| Attribute | Details |
| :--- | :--- |
| **Event Name** | Prompt to Production – Paytm AI Workshop |
| **Institution** | N.B.K.R. Institute of Science & Technology (Autonomous), Vidyanagar, AP |
| **Organizers** | Department of IT & AI&DS in association with ISTE Student Chapter |
| **Date & Time** | **30 September 2026 (Wednesday)** • 9:00 AM – 4:00 PM *(Gate opens 8:45 AM)* |
| **Venue** | Seminar Hall, New CSE Block, NBKRIST Campus |
| **Audience Cap** | **Strict 100 Student Capacity** (Automated waitlist/lock) |
| **Registration Fees**| **₹50** (Enrolled ISTE Members) • **₹100** (General Engineering Students) |
| **Payment Flow** | **Direct Department UPI (`9491803089@ptaxis`)** or **Pay at Desk (Cash)** |
| **Keynote Speakers** | **Mr. Suman Mandal** (Program Lead, Paytm) • **Mr. Shivam Behl** (SDE-II, Microsoft) |

---

## 🔐 Confidential Access Credentials

> [!IMPORTANT]
> Administrative and Staff routes feature **Strict Server-Side Session Guards**. Direct URL navigation without authorized authentication is prohibited and automatically redirects to the security gateway.

| Portal | URL Route | Access Credential | Role & Permissions |
| :--- | :--- | :--- | :--- |
| **Admin Master Console** | [`/admin`](file:///c:/Users/kamil/OneDrive/Desktop/ptop-event/app/admin/page.tsx) | Password: `ptopadmin` | Complete financial reconciliation, participant roster, live capacity switch, CSV export, advisories, certificate issuance, and password-protected deletion. |
| **Data Deletion Confirmation** | [`/api/admin/data`](file:///c:/Users/kamil/OneDrive/Desktop/ptop-event/app/api/admin/data/route.ts) | Password: `delete` | Required password to delete individual attendees or wipe all data. |
| **Coordinator Desk** | [`/coordinator`](file:///c:/Users/kamil/OneDrive/Desktop/ptop-event/app/coordinator/page.tsx) | Password: `ptopcoordinator` | Seminar hall reception desk, check-in roster monitoring, support ticket handling. |
| **Gate Entry Scanner** | [`/scan`](file:///c:/Users/kamil/OneDrive/Desktop/ptop-event/app/scan/page.tsx) | PIN: `1234` | Shift-unlocked terminal for Volunteers & Admins. Live QR scanning, cash collection confirmation. |
| **Participant Dashboard**| [`/dashboard`](file:///c:/Users/kamil/OneDrive/Desktop/ptop-event/app/dashboard/page.tsx) | College Roll Number / Email | Personal pass, QR code, team builder, project prototype submission, workshop guides, and issued certificates. |
| **Public Certificate Portal** | [`/certificate/[id]`](file:///c:/Users/kamil/OneDrive/Desktop/ptop-event/app/certificate/[id]/page.tsx) | Certificate Number | Publicly verifiable credential with student name, roll number, academic year, branch, and institutional seal. |

---

## 🚀 Architectural Modules & Key Features

### 1. Zero-Fee Direct UPI & Cash-at-Desk Payment Pipeline
Commercial payment gateways charge 2–3% transaction fees plus GST, requiring merchant verification delays and corporate bank setups. Prompt to Production is **100% free with zero intermediary deduction**:
- **Dynamic UPI Intent & QR Generation**: Generates standard `upi://pay` strings and high-contrast dynamic QR codes embedding the exact calculated amount (₹50 or ₹100).
- **1-Tap Mobile UPI Intent**: Students on smartphones tap one button to launch Google Pay, PhonePe, or Paytm with payee and amount pre-filled.
- **Cryptographic Server-Side Validation**: Fee calculations are performed exclusively on the server based on validated ISTE membership numbers.
- **Pay at Entrance Desk Alternative**: Students without online banking can register online to reserve their seat and pay cash to the coordinator at 8:45 AM before entry.

### 2. High-Entropy Digital QR Pass
- **Cryptographically Unique Token**: QR codes contain an isolated token (`af34763fad...`), never raw student PII or database IDs.
- **1-Tap WhatsApp Share**: Students can instantly forward their verified pass and pass link to their own WhatsApp chat or friends with one tap.
- **Print & PDF Engine**: Dedicated CSS print styles generate a clean, official single-sheet badge ready for physical clipping.
- **RFC 5545 Calendar Integration**: One-click download of `.ics` calendar invitation with a 30-minute reminder alarm.

### 3. Mobile Gate Terminal & Terminal Shift Unlock
- **PIN Pad Shift Unlock (Option 3)**: Requires entering the 4-digit staff PIN (`1234`) on a high-visibility touch numpad before scanning begins.
- **Failsafe Native Camera Integration**: Mobile browsers frequently block `getUserMedia` video streaming on non-HTTPS local networks. The scanner includes a native camera capture button (`<input capture="environment">`) that works 100% reliably on all iOS and Android devices.
- **WhatsApp Screenshot Gallery Upload**: Students who took a screenshot of their pass on WhatsApp can present it; the coordinator can upload or snap the image to decode the QR instantly.
- **Live Idempotent Gate Verification**: Scans are atomic. Re-scanning an already admitted badge triggers a high-contrast **RED ALERT** with the original admission timestamp and admitting staff member.
- **Desk Cash Collection Workflow**: For "Cash at Desk" registrations, scanning presents a high-visibility **AMBER SCREEN** instructing the volunteer to collect ₹50 or ₹100 in cash before admitting.

### 4. Web Audio & Haptic Feedback Engine
Operating a noisy gate requires instantaneous multi-sensory confirmation without staring at the screen:
- **Success Chime (Verified)**: Dual-harmonic major chord synthesized in real-time via the Web Audio API + double haptic pulse (`[60, 40, 60]ms`).
- **Duplicate Alert (Deny Entry)**: Low-frequency harsh buzzer + heavy continuous vibration (`[300, 100, 300]ms`).
- **Cash Action Chime**: Mid-frequency alert notifying the volunteer to collect physical currency.

### 5. Participant Workshop Dashboard
- **Mobile-First Horizontal Touch Bar**: Replaces heavy vertical menu sidebars with a fluid horizontal scroll pill bar for easy thumb navigation on mobile phones.
- **Team Collaboration System**: Students can create a team, generate a 6-character invite code (e.g. `P2P-98A1`), and join teammates (up to 4 members).
- **Build Challenge Submission Console**: Submit project name, problem statement, prompt architecture, GitHub repo, and live deployment link.
- **Playbook & Resource Center**: Instant access to prompt engineering cheat sheets, starter repositories, and evaluation rubrics.

### 6. Administrative Master Control Panel
- **Real-Time Financial & Attendance Metrics**: Live counters for total registered, ISTE concession count, check-ins, teams, and total revenue collected.
- **Searchable Roster & Filter Matrix**: Search attendees by name, roll number, or registration ID; filter by branch (`AI&DS`, `IT`, `CSE`, etc.) or check-in status.
- **One-Click CSV Export**: Downloads a clean, formatted CSV roster of all attendees with payment methods and UTR references for college records.
- **Live Emergency Advisory Broadcaster**: Post urgent advisories (e.g. Wi-Fi credentials, seating updates) that display immediately on all student dashboards.

### 7. Verified Certificate Issuance & Customization
- **1-Click Modal Customization**: Administrators can preview and customize attendee certificate details (Student Full Name, College Roll Number, Academic Year, Branch/Department, Certificate Type, Verification Code) before issuing.
- **Manual Walk-in / Offline Issuance**: Seamless entry modal allowing staff to add walk-in attendees on the fly (Name, Email, Phone, College Roll Number, Branch, Year, Payment Method) and generate instant digital tickets & certificates.
- **Dedicated Public Certificate Portal ([`/certificate/[id]`](file:///c:/Users/kamil/OneDrive/Desktop/ptop-event/app/certificate/[id]/page.tsx))**:
  - Official institutional layout with gold seal, signature authenticators, and high-contrast typography.
  - Verifiable cryptographic verification code (e.g., `PTOP-2026-XXXX`).
  - Print/Save as PDF with print-optimized CSS, plus 1-tap WhatsApp credential sharing.

### 8. Password-Protected Single & Bulk Data Deletion System
- **Granular Single-Attendee Deletion**: Each row in the attendee roster includes a dedicated "Delete" action to safely remove cancelled or test registrations.
- **Bulk Clean ("Delete All Data")**: Dedicated top-level action allowing administrators to wipe test datasets, registrations, tickets, check-in attendance, and certificates before or after the live workshop.
- **Strict Security Password Challenge**: To eliminate accidental data loss, both single deletion and bulk wipe require typing the administrative deletion password: `delete`.
- **Server-Side Guarded Endpoint ([`/api/admin/data`](file:///c:/Users/kamil/OneDrive/Desktop/ptop-event/app/api/admin/data/route.ts))**: Validates the deletion password server-side and cascades record deletions across Supabase PostgreSQL tables and fallback in-memory stores.

---

## 📱 Mobile-First Quality of Life Improvements

Campus events are executed on phones, not laptops. The application contains specific engineering to guarantee flawless mobile performance:

1. **iOS Safari Auto-Zoom Prevention**:
   Every input across the login, registration, dashboard, and scanner utilizes `text-base sm:text-sm` (minimum 16px font-size on mobile viewports). This prevents iOS Safari from violently zooming in and distorting the page layout when fields are focused.
2. **Horizontal Overflow Immunity**:
   All cards, banners, and poster graphics use responsive offsets (`left-2 sm:-left-5`) to eliminate horizontal page wobble on screens as narrow as 360px.
3. **Responsive Data Tables**:
   Admin and coordinator tables are wrapped in momentum-scrolling containers with `min-w-[680px]`, ensuring columns never crush on small displays.
4. **Body Scroll Lock**:
   Opening the mobile navigation drawer automatically locks the underlying background scroll (`overflow: hidden`) to avoid disorientation.

---

## 🛠️ Technology Stack

```text
Frontend Framework  │ Next.js 16.3 (Turbopack, App Router, React 19)
Programming Lang    │ TypeScript 5 (Strict Mode)
Styling & Tokens    │ Tailwind CSS (Custom HSL Palette & Responsive Typography)
Database & Storage  │ Supabase (Managed PostgreSQL, Row Level Security, Realtime)
Audio Synthesis     │ Web Audio API (Zero external MP3 dependencies)
Hardware Haptics    │ Navigator Vibration API
QR & Barcode Engine │ qrcode (Generation) • jsqr (Real-time frame & photo decoding)
Visual Effects      │ canvas-confetti • Lucide React Icons
Calendar Protocol   │ RFC 5545 iCalendar (.ics) Engine
```

---

## 📂 Project Directory Structure

```text
ptop-event/
├── app/
│   ├── admin/page.tsx               # Master admin dashboard (Server Guarded)
│   ├── coordinator/page.tsx         # Coordinator check-in dashboard (Server Guarded)
│   ├── certificate/[id]/page.tsx    # Publicly verifiable digital certificate portal
│   ├── dashboard/page.tsx           # Student workshop dashboard & passes
│   ├── login/page.tsx               # Universal 3-Mode authentication portal
│   ├── register/page.tsx            # Zero-fee student registration console
│   ├── scan/page.tsx                # Dedicated mobile gate scanner (PIN 1234)
│   ├── ticket/[id]/page.tsx         # Verified digital QR ticket & WhatsApp share
│   ├── api/
│   │   ├── admin/
│   │   │   ├── announcement/route.ts# Advisory broadcast endpoint
│   │   │   ├── certificate/route.ts # Certificate issuance endpoint
│   │   │   ├── data/route.ts        # Password-protected single & bulk deletion endpoint
│   │   │   └── event/route.ts       # Capacity & fee configuration endpoint
│   │   ├── auth/
│   │   │   ├── login/route.ts       # HMAC session token generator
│   │   │   └── logout/route.ts      # Session cookie destruction
│   │   ├── checkin/route.ts         # Gate verification & PIN authorization
│   │   ├── register/route.ts        # Server-side validation & profile creation
│   │   ├── submission/route.ts      # Project prototype submission
│   │   ├── support/route.ts         # Student inquiry ticketing
│   │   └── team/route.ts            # Team creation & invite code management
│   ├── globals.css                  # Custom styling, fonts, and print directives
│   ├── layout.tsx                   # Root HTML with smooth-scroll & font tokens
│   └── page.tsx                     # Landing page translating official poster
├── components/
│   ├── admin/
│   │   └── AdminDashboardClient.tsx # Metrics, attendee table, CSV export, certificate & delete modals
│   ├── certificate/
│   │   └── CertificateView.tsx      # High-fidelity verifiable certificate & PDF print view
│   ├── coordinator/
│   │   └── QrScanner.tsx            # Shift PIN lock, native camera, video scanner
│   ├── dashboard/
│   │   └── ParticipantDashboardClient.tsx # Horizontal pill navigation, teams
│   ├── landing/
│   │   ├── HeroSection.tsx          # Official poster composition, live countdown
│   │   ├── AboutSection.tsx         # Department & ISTE introduction
│   │   ├── HighlightsSection.tsx    # 7 workshop pillars
│   │   ├── SpeakersSection.tsx      # Paytm & Microsoft speaker profiles
│   │   ├── WhatYouWillLearnSection.tsx # 4-stage technical syllabus
│   │   ├── ScheduleSection.tsx      # 14-milestone timeline with .ics download
│   │   ├── FaqSection.tsx           # Logistics & hardware requirements
│   │   └── CtaBanner.tsx            # Sticky enrollment reminder
│   ├── layout/
│   │   ├── Navbar.tsx               # Autonomous crest, mobile drawer, scroll-lock
│   │   └── Footer.tsx               # Academic credits, location, emergency contacts
│   ├── registration/
│   │   └── RegistrationForm.tsx     # Dynamic UPI QR, UTR input, live pass preview
│   ├── ticket/
│   │   └── DigitalTicketCard.tsx    # Digital pass, WhatsApp share, PDF print
│   └── ui/
│       └── Logos.tsx                # Scalable vector graphics for NBKRIST, ISTE, Paytm
├── lib/
│   ├── audio.ts                     # Web Audio API sound synthesis & haptic pulses
│   ├── auth.ts                      # HMAC session signatures & server guards
│   ├── calendar.ts                  # .ics calendar invitation generator
│   ├── constants.ts                 # Timelines, UPI configuration, pricing rules
│   ├── db/
│   │   └── index.ts                 # State store with Supabase PostgreSQL hydration
│   └── utils.ts                     # Token generation, currency & date formatters
├── public/
│   └── images/                      # Campus architecture & workshop hall photography
├── scripts/
│   ├── audit-all-pages.js           # Automated headless browser audit for all routes
│   └── test-deletion-flow.js        # Automated API test suite for data deletion system
├── supabase/
│   └── schema.sql                   # Complete PostgreSQL schema, tables & RLS policies
├── types/
│   └── index.ts                     # TypeScript data contracts & interfaces
├── .env.local                       # Local environment secrets
├── package.json
└── README.md
```

---

## ⚡ Quick Start & Deployment Guide

### 1. Prerequisites
- **Node.js**: v18.18.0 or newer (Node.js 20+ or 22 LTS recommended)
- **Package Manager**: `npm`, `yarn`, or `pnpm`

### 2. Installation
Clone the repository and install project dependencies:
```bash
git clone https://github.com/likhith3035/ptop.git
cd ptop
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Direct UPI Payment Settings (100% Free / Zero Gateway Fees)
NEXT_PUBLIC_UPI_ID=9491803089@ptaxis
NEXT_PUBLIC_UPI_NAME=NBKRIST ISTE Student Chapter

# Public Domain URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Confidential Security Passwords
ADMIN_PASSWORD=ptopadmin
COORDINATOR_PASSWORD=ptopcoordinator

# Firebase Spark (100% Free Plan) - Google Auth & Realtime Database (Optional)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 4. Firebase Spark (100% Free Plan) Setup (Optional)
To enable **1-Click Google Sign-In** and **Real-Time WebSocket Sync across Gate Scanners & Admin Consoles**:
1. Go to **[Firebase Console](https://console.firebase.google.com/)** and create a project on the default **Spark (Free / ₹0)** plan.
2. In the left sidebar:
   - **Build > Authentication > Sign-in method**: Click **Get Started** and enable **Google**.
   - **Build > Realtime Database**: Click **Create Database** (choose US or Singapore). Under the **Rules** tab, allow read and write:
     ```json
     {
       "rules": {
         ".read": true,
         ".write": true
       }
     }
     ```
3. Copy your project web credentials and `databaseURL` into `.env.local` or your Vercel Environment Variables. *(If omitted, the platform runs seamlessly on its local/Supabase and roll-number authentication modes).*

### 5. Supabase Database Provisioning
Run the SQL queries in [`supabase/schema.sql`](file:///c:/Users/kamil/OneDrive/Desktop/ptop-event/supabase/schema.sql) inside your Supabase project's **SQL Editor**. This creates:
- `participant_profiles` (College roll numbers, branches, ISTE IDs)
- `registrations` (Order tracking & status)
- `tickets` (Cryptographic QR tokens & pass numbers)
- `attendance` (Gate check-in timestamps & admitting coordinators)
- Row Level Security (RLS) policies for user data isolation.

### 5. Running Locally
Start the development server with Turbopack:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser or test on your phone connected to the same Wi-Fi using your local IP.

### 6. Production Verification & Build
To build and validate all 21 routes for deployment:
```bash
npm run build
npm run start
```

---

## 📋 Security Architecture & Access Control

```
                              [ Incoming Web Request ]
                                         │
                         ┌───────────────┴───────────────┐
                         ▼                               ▼
                 [ Public Route ]               [ Protected Route ]
              (/, /register, /login)        (/admin, /coordinator, /scan)
                         │                               │
                         ▼                               ▼
                   Render Page                 [ Verify Cookie Session ]
                                                         │
                                            ┌────────────┴────────────┐
                                            ▼                         ▼
                                      [ Valid HMAC ]           [ Invalid / None ]
                                            │                         │
                                            ▼                         ▼
                                    Check Role Privilege      Redirect to /login
                                            │                 with auth_required
                                    ┌───────┴───────┐
                                    ▼               ▼
                                 Matches         Mismatch
                                    │               │
                                    ▼               ▼
                               Access Granted    Redirect /login
                                                 unauthorized
```

---

## 🤝 Organizing Committee & Acknowledgments

* **Institution:** N.B.K.R. Institute of Science & Technology, Vidyanagar, SPSR Nellore Dist., Andhra Pradesh.
* **Academic Department:** Department of Information Technology & Department of Artificial Intelligence & Data Science.
* **Professional Partner:** Indian Society for Technical Education (ISTE) Student Chapter.
* **Corporate Knowledge Partners:**
  * **Paytm** — Leading digital payments and financial technology innovator.
  * **Microsoft** — Enterprise cloud and generative AI engineering.

---

<div align="center">
  <sub>Built with ❤️ by the Department of IT & AI&DS, NBKRIST Vidyanagar • Prompt to Production 2026</sub>
</div>
