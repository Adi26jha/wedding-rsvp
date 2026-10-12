-- ============================================================================
-- WEDDING RSVP & ATTENDEE MANAGEMENT SCHEMA
-- Couple: Priyal & Justin
-- Venue: Corbett Adventure Resort - Bail Parao, Uttarakhand
-- Date: 21st - 22nd November 2026
-- ============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Table: rsvps (Main family/group submission)
CREATE TABLE IF NOT EXISTS rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    primary_contact_name TEXT NOT NULL,
    mobile_number VARCHAR(15) NOT NULL UNIQUE,
    email TEXT,
    attendance_status VARCHAR(20) NOT NULL CHECK (attendance_status IN ('attending', 'declined')),
    attending_events TEXT[] DEFAULT ARRAY[]::TEXT[], -- e.g. ARRAY['haldi', 'sangeet', 'wedding']
    guest_count INTEGER NOT NULL DEFAULT 1 CHECK (guest_count >= 1 AND guest_count <= 10),
    notes TEXT,
    ip_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for instant lookup on duplicate RSVP checks
CREATE INDEX IF NOT EXISTS idx_rsvps_mobile_number ON rsvps(mobile_number);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rsvps_attendance_status ON rsvps(attendance_status);

-- 3. Table: attendees (Individual family member records with encrypted Aadhaar documents)
CREATE TABLE IF NOT EXISTS attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rsvp_id UUID NOT NULL REFERENCES rsvps(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    age_group VARCHAR(10) NOT NULL DEFAULT 'adult' CHECK (age_group IN ('adult', 'child')),
    -- Document upload metadata
    document_name TEXT,
    document_type TEXT,
    document_size INTEGER,
    -- AES-256-GCM encrypted document payload & authentication tags
    encrypted_document TEXT,
    document_iv TEXT,
    document_auth_tag TEXT,
    -- Legacy text fields for backwards compatibility
    aadhaar_last4 CHAR(4),
    encrypted_aadhaar TEXT,
    aadhaar_iv TEXT,
    aadhaar_auth_tag TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_attendees_rsvp_id ON attendees(rsvp_id);

-- 4. Table: audit_logs (Immutable audit trail for security compliance)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_email TEXT NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'VIEW_AADHAAR_DOCUMENT', 'DOWNLOAD_AADHAAR_DOCUMENT', 'EXPORT_RSVP_ROSTER_CSV'
    target_attendee_id UUID REFERENCES attendees(id) ON DELETE SET NULL,
    target_rsvp_id UUID REFERENCES rsvps(id) ON DELETE SET NULL,
    ip_address TEXT,
    user_agent TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_email ON audit_logs(admin_email);

-- 5. Trigger for updated_at on rsvps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_rsvps_updated_at ON rsvps;
CREATE TRIGGER trigger_rsvps_updated_at
    BEFORE UPDATE ON rsvps
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict zero-trust model: Public has NO read/write access via direct PostgREST.
-- All operations are performed server-side via Supabase Service Role Key.
-- ============================================================================

ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Deny all direct public anon access
DROP POLICY IF EXISTS "Deny anon select on rsvps" ON rsvps;
CREATE POLICY "Deny anon select on rsvps" ON rsvps
    FOR SELECT TO anon USING (false);

DROP POLICY IF EXISTS "Deny anon insert on rsvps" ON rsvps;
CREATE POLICY "Deny anon insert on rsvps" ON rsvps
    FOR INSERT TO anon WITH CHECK (false);

DROP POLICY IF EXISTS "Deny anon update on rsvps" ON rsvps;
CREATE POLICY "Deny anon update on rsvps" ON rsvps
    FOR UPDATE TO anon USING (false);

DROP POLICY IF EXISTS "Deny anon select on attendees" ON attendees;
CREATE POLICY "Deny anon select on attendees" ON attendees
    FOR SELECT TO anon USING (false);

DROP POLICY IF EXISTS "Deny anon select on audit_logs" ON audit_logs;
CREATE POLICY "Deny anon select on audit_logs" ON audit_logs
    FOR SELECT TO anon USING (false);

-- Authenticated Admin Policies
DROP POLICY IF EXISTS "Admins can view rsvps" ON rsvps;
CREATE POLICY "Admins can view rsvps" ON rsvps
    FOR SELECT TO authenticated
    USING (auth.jwt() ->> 'email' IS NOT NULL);

DROP POLICY IF EXISTS "Admins can view attendees" ON attendees;
CREATE POLICY "Admins can view attendees" ON attendees
    FOR SELECT TO authenticated
    USING (auth.jwt() ->> 'email' IS NOT NULL);

DROP POLICY IF EXISTS "Admins can read audit_logs" ON audit_logs;
CREATE POLICY "Admins can read audit_logs" ON audit_logs
    FOR SELECT TO authenticated
    USING (auth.jwt() ->> 'email' IS NOT NULL);

DROP POLICY IF EXISTS "Admins can insert audit_logs" ON audit_logs;
CREATE POLICY "Admins can insert audit_logs" ON audit_logs
    FOR INSERT TO authenticated
    WITH CHECK (auth.jwt() ->> 'email' IS NOT NULL);

-- ============================================================================
-- POST-EVENT RETENTION PURGE FUNCTION
-- Automatically redacts Aadhaar documents after the event (post 30th Nov 2026)
-- ============================================================================

CREATE OR REPLACE FUNCTION purge_expired_aadhaar_data()
RETURNS INTEGER AS $$
DECLARE
    purged_count INTEGER;
BEGIN
    UPDATE attendees
    SET 
        encrypted_document = 'REDACTED_PURGED_POST_EVENT',
        document_iv = 'PURGED',
        document_auth_tag = 'PURGED',
        document_name = 'purged_document.pdf'
    WHERE created_at < '2026-11-30 00:00:00+00'
      AND encrypted_document <> 'REDACTED_PURGED_POST_EVENT';

    GET DIAGNOSTICS purged_count = ROW_COUNT;

    INSERT INTO audit_logs (admin_email, action, ip_address)
    VALUES ('system_retention_job', 'PURGE_AADHAAR_DATA', 'cron');

    RETURN purged_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
