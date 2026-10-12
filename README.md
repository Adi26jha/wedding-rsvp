# Priyal & Justin — Wedding Invitation & RSVP Portal

A production-ready, luxury editorial Indian wedding invitation and multi-step RSVP web application built for the wedding of **Priyal & Justin** at **Corbett Adventure Resort, Bail Parao, Uttarakhand** (21st–22nd November 2026).

---

## 🏛️ Design System & Aesthetic Decisions

The portal was designed from scratch to feel like a bespoke high-fashion editorial invitation rather than a generic wedding template:

- **Color Palette**:
  - **Warm Ivory / Parchment** (`#FAF7F2`, `#F5EFEB`): Soft, warm paper feel reminiscent of hand-pressed Italian wedding stationary.
  - **Royal Maroon / Deep Crimson** (`#6A1B29`, `#4E121D`): Regal Indian wedding accent conveying tradition and gravitas.
  - **Corbett Forest Emerald** (`#1C3F34`, `#132B23`): Subtle nod to Jim Corbett National Park's lush Sal tree wilderness.
  - **Muted Antique Champagne Gold** (`#C5A059`, `#D8B677`): Metallic filigree accents and borders without ostentatious glitz.
  - **Charcoal Ink** (`#23211E`): High-contrast typography exceeding WCAG AA standards.
- **Typography**:
  - **Display / Headings**: `Cormorant Garamond` (Google Font via `next/font`) with elegant italic ligatures.
  - **Body / Numbers**: `Plus Jakarta Sans` for crisp mobile legibility and tabular figures for phone and Aadhaar inputs.
- **Visual Ornaments**: Lightweight, hand-coded SVG Mughal/Jharokha arches and "P & J" mandala monogram crests. Zero heavy image payloads.
- **Ambient Sound**: Gentle Web Audio acoustic drone toggle (off by default) playing meditative Raag Yaman harmonic chords.

---

## 🔒 Security & Privacy Architecture

Because Indian regulations and guest privacy strictly require safeguarding Aadhaar information:

1. **Aadhaar Verhoeff Checksum Validation**:
   - Both client-side (real-time feedback) and server-side (Zod schema) validate the 12-digit number using the **Verhoeff algorithm** (dihedral group $D_5$), completely preventing typos and single-digit errors.
2. **AES-256-GCM Server-side Encryption**:
   - All Aadhaar numbers are encrypted on the server before being saved to the database.
   - Utilizes unique 96-bit (12-byte) initialization vectors (IVs) and 128-bit authentication tags per record.
   - Plaintext Aadhaar numbers are **never stored**, **never logged**, and **never sent back in HTTP responses**.
   - Client views always see masked strings (`XXXX XXXX 1234`).
3. **Immutable Audit Trail (`audit_logs`)**:
   - Any administrator revealing an Aadhaar number or exporting unmasked IDs generates a permanent log entry recording the admin email, IP address, timestamp, and target attendee.
4. **Row Level Security (RLS)**:
   - Supabase tables (`rsvps`, `attendees`, `audit_logs`) have strict RLS policies blocking public anonymous access. Writes and reads occur via Next.js server endpoints using the Supabase Service Role key.
5. **Spam & Abuse Defense**:
   - In-memory sliding-window rate limiter on the `/api/rsvp` route.
   - Hidden anti-bot honeypot field (`_hp_company`).
   - `noindex, nofollow` headers and meta tags to prevent search engines from indexing guest names.
6. **Post-Event Data Deletion**:
   - Standalone retention script (`scripts/purge-aadhaar.ts`) and Postgres function (`purge_expired_aadhaar_data()`) to permanently redact and purge Aadhaar ciphertexts 7 days after the wedding.

---

## 🚀 Quick Start & Development

### 1. Prerequisites
- **Node.js**: v18+ (tested on v22.18.0)
- **npm** or **pnpm**

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Generate a secure 32-byte (256-bit) encryption key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Paste this into `AADHAAR_ENCRYPTION_KEY` in `.env.local`.

> **Note on Zero-Config Development**: If Supabase credentials are left as placeholders, the app automatically runs in secure memory-database mode, allowing you to test RSVP submissions, Aadhaar encryption, and the admin dashboard immediately with zero external setup.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Wedding Invitation & RSVP**: [http://localhost:3000](http://localhost:3000)
- **Personalized URL Demo**: [http://localhost:3000?family=sharma](http://localhost:3000?family=sharma)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin) (Default passcode: `corbett2026admin`)

---

## 🗄️ Supabase Postgres Setup (Production)

1. Create a new project on [Supabase](https://supabase.com).
2. Go to **SQL Editor** in the Supabase Dashboard.
3. Open `supabase/schema.sql` from this repository and run the entire script. This creates:
   - `rsvps` table with indexes
   - `attendees` table with foreign keys
   - `audit_logs` table
   - Strict RLS policies
   - Auto-updating `updated_at` trigger
   - Post-event purge function
4. Copy your **Project URL**, **Anon Key**, and **Service Role Key** from Supabase Settings -> API into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

---

## 🧹 Post-Event Data Purge (Retention Policy)

To purge all Aadhaar ciphertexts after 30th November 2026:

### Method A: Standalone Node/TSX Script
```bash
npx tsx scripts/purge-aadhaar.ts
```

### Method B: Supabase SQL Function
Execute the pre-installed stored procedure:
```sql
SELECT purge_expired_aadhaar_data();
```

---

## 🧪 Automated Testing

To run the cryptographic and Verhoeff algorithm test suite:
```bash
npx tsx scripts/test-security.ts
```

Output:
```
=== 1. Testing Verhoeff Algorithm ===
Generated valid test Aadhaar: 999912345678 (Checksum: 8)
Validation of valid Aadhaar: { isValid: true }
Validation of tampered Aadhaar: { isValid: false, error: 'Invalid Aadhaar number (checksum failed)' }

=== 2. Testing AES-256-GCM Encryption / Decryption ===
Decrypted result: 999912345678
✅ Encryption & Decryption passed!
✅ Successfully caught tampered payload
```

---

## 📦 Production Deployment (Vercel)

1. Push this repository to GitHub or GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Environment Variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `AADHAAR_ENCRYPTION_KEY`
   - `ADMIN_ACCESS_PASSWORD`
4. Deploy!
