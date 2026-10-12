import { createClient } from "@supabase/supabase-js";

const url = "https://tqwhcxakdycrzzxfxyct.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxd2hjeGFrZHljcnp6eGZ4eWN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTczNjYwMywiZXhwIjoyMTA3MzEyNjAzfQ.qxeV9T__f436HU52Pfodfha1738UfA6j9yA9YVmHJXM";

async function testConnection() {
  console.log("Connecting to Supabase at:", url);
  const client = createClient(url, key);

  const { data: rsvps, error: rsvpsError } = await client.from("rsvps").select("*").limit(1);
  if (rsvpsError) {
    console.error("❌ rsvps table check failed:", rsvpsError.message);
  } else {
    console.log("✅ rsvps table connected successfully! Current count:", rsvps.length);
  }

  const { data: attendees, error: attError } = await client.from("attendees").select("*").limit(1);
  if (attError) {
    console.error("❌ attendees table check failed:", attError.message);
  } else {
    console.log("✅ attendees table connected successfully!");
  }

  const { data: audit, error: auditError } = await client.from("audit_logs").select("*").limit(1);
  if (auditError) {
    console.error("❌ audit_logs table check failed:", auditError.message);
  } else {
    console.log("✅ audit_logs table connected successfully!");
  }
}

testConnection();
