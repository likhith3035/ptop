-- Prompt to Production — Paytm AI Workshop
-- Complete Supabase PostgreSQL Schema & RLS Policies

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'evt_p2p_2026',
    name TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    department TEXT NOT NULL,
    institution TEXT NOT NULL,
    association TEXT NOT NULL,
    event_date DATE NOT NULL,
    display_date TEXT NOT NULL,
    event_time TEXT NOT NULL,
    venue TEXT NOT NULL,
    expected_participants INT DEFAULT 100,
    iste_fee NUMERIC(10, 2) DEFAULT 50.00,
    non_iste_fee NUMERIC(10, 2) DEFAULT 100.00,
    is_registration_open BOOLEAN DEFAULT TRUE,
    max_team_size INT DEFAULT 4,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PARTICIPANT PROFILES
CREATE TABLE IF NOT EXISTS public.participant_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    mobile TEXT NOT NULL,
    roll_number TEXT NOT NULL UNIQUE,
    year TEXT NOT NULL CHECK (year IN ('1st Year', '2nd Year', '3rd Year', '4th Year')),
    branch TEXT NOT NULL,
    section TEXT NOT NULL,
    is_iste_member BOOLEAN DEFAULT FALSE,
    iste_number TEXT,
    has_laptop BOOLEAN DEFAULT TRUE,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. REGISTRATIONS
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_number VARCHAR(30) NOT NULL UNIQUE, -- e.g. P2P-2026-X7K9M2
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES public.participant_profiles(id) ON DELETE CASCADE,
    event_id VARCHAR(50) REFERENCES public.events(id) DEFAULT 'evt_p2p_2026',
    amount NUMERIC(10, 2) NOT NULL,
    is_iste BOOLEAN NOT NULL,
    status VARCHAR(30) DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'confirmed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    razorpay_order_id TEXT NOT NULL UNIQUE,
    razorpay_payment_id TEXT UNIQUE,
    razorpay_signature TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(30) DEFAULT 'created' CHECK (status IN ('created', 'paid', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ
);

-- 6. DIGITAL TICKETS
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(40) NOT NULL UNIQUE,
    registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES public.participant_profiles(id) ON DELETE CASCADE,
    event_id VARCHAR(50) REFERENCES public.events(id) DEFAULT 'evt_p2p_2026',
    qr_token TEXT NOT NULL UNIQUE, -- High-entropy cryptographically secure token
    is_iste_member BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ATTENDANCE
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL UNIQUE REFERENCES public.tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'checked_in' CHECK (status IN ('pending', 'checked_in')),
    checked_in_at TIMESTAMPTZ DEFAULT NOW(),
    checked_in_by UUID REFERENCES auth.users(id),
    verification_notes TEXT
);

-- 8. COORDINATORS & PERMISSIONS
CREATE TABLE IF NOT EXISTS public.coordinators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    department TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coordinator_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coordinator_id UUID REFERENCES public.coordinators(id) ON DELETE CASCADE,
    permission VARCHAR(50) NOT NULL CHECK (permission IN (
        'CHECKIN_VIEW',
        'CHECKIN_MANAGE',
        'PARTICIPANT_VIEW',
        'REGISTRATION_VERIFY',
        'SUPPORT_VIEW',
        'SUPPORT_REPLY'
    )),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(coordinator_id, permission)
);

-- 9. TEAMS & MEMBERS
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    invite_code VARCHAR(20) NOT NULL UNIQUE,
    leader_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('leader', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. PROJECT SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    problem_statement TEXT NOT NULL,
    project_description TEXT NOT NULL,
    technologies_used TEXT[] NOT NULL,
    github_url TEXT,
    live_demo_url TEXT,
    presentation_url TEXT,
    project_file_url TEXT,
    status VARCHAR(30) DEFAULT 'draft' CHECK (status IN ('not_started', 'draft', 'submitted', 'under_review', 'evaluated')),
    evaluation_score NUMERIC(5, 2),
    evaluation_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. RESOURCES
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    type VARCHAR(30) NOT NULL CHECK (type IN ('pdf', 'presentation', 'code', 'link', 'guideline')),
    file_url TEXT,
    external_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_code VARCHAR(30) NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    registration_id UUID REFERENCES public.registrations(id) ON DELETE SET NULL,
    category VARCHAR(40) NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    response TEXT,
    responded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. CERTIFICATES
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_number VARCHAR(50) NOT NULL UNIQUE,
    participant_id UUID REFERENCES public.participant_profiles(id) ON DELETE CASCADE,
    event_id VARCHAR(50) REFERENCES public.events(id) DEFAULT 'evt_p2p_2026',
    verification_code VARCHAR(40) NOT NULL UNIQUE,
    pdf_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent')),
    is_published BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_reg_number ON public.registrations(registration_number);
CREATE INDEX IF NOT EXISTS idx_reg_user ON public.registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_reg_status ON public.registrations(status);
CREATE INDEX IF NOT EXISTS idx_profile_roll ON public.participant_profiles(roll_number);
CREATE INDEX IF NOT EXISTS idx_ticket_qr ON public.tickets(qr_token);
CREATE INDEX IF NOT EXISTS idx_attendance_ticket ON public.attendance(ticket_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_submissions_team ON public.submissions(team_id);

-- 16. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.participant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- POLICIES: Participant access
CREATE POLICY "Users can view their own profile" 
ON public.participant_profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.participant_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own registration" 
ON public.registrations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own payments" 
ON public.payments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own tickets" 
ON public.tickets FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public resources" 
ON public.resources FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Users can view published announcements" 
ON public.announcements FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Users can view their own support tickets" 
ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create support tickets" 
ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
