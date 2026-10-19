import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://tqwhcxakdycrzzxfxyct.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxd2hjeGFrZHljcnp6eGZ4eWN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTczNjYwMywiZXhwIjoyMTA3MzEyNjAzfQ.qxeV9T__f436HU52Pfodfha1738UfA6j9yA9YVmHJXM";

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
