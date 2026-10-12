/**
 * Post-Event Aadhaar Retention Purge Script
 * 
 * Securely deletes or redacts Aadhaar encryption fields for all attendees
 * once the event (21-22 November 2026) has concluded and room bookings are verified.
 * 
 * Usage:
 *   npx tsx scripts/purge-aadhaar.ts
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function purgeAadhaarData() {
  console.log("=== Post-Event Aadhaar Retention Purge ===");

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY === "placeholder-service-role-key") {
    console.warn("⚠️ Valid Supabase credentials not found. In mock mode, sensitive fields are stored in volatile memory only.");
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // 1. Redact attendees sensitive fields
  const { data, error } = await supabase
    .from("attendees")
    .update({
      encrypted_aadhaar: "REDACTED_PURGED_POST_EVENT",
      aadhaar_iv: "PURGED",
      aadhaar_auth_tag: "PURGED",
      aadhaar_last4: "XXXX",
    })
    .neq("encrypted_aadhaar", "REDACTED_PURGED_POST_EVENT")
    .select("id");

  if (error) {
    console.error("❌ Failed to purge Aadhaar records:", error.message);
    process.exit(1);
  }

  const count = data?.length || 0;
  console.log(`✅ Successfully purged sensitive Aadhaar credentials from ${count} attendee records.`);

  // 2. Append to audit log
  await supabase.from("audit_logs").insert({
    admin_email: "automated_cron_purge@wedding-portal.internal",
    action: "PURGE_AADHAAR_DATA",
    ip_address: "internal-cron",
    timestamp: new Date().toISOString(),
  });

  console.log("🔒 Audit log recorded for retention purge.");
}

purgeAadhaarData().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
