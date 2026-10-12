import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { EncryptedPayload } from "./crypto";

export interface RsvpRecord {
  id: string;
  primary_contact_name: string;
  mobile_number: string;
  email?: string | null;
  attendance_status: "attending" | "declined";
  attending_events: string[];
  guest_count: number;
  notes?: string | null;
  ip_hash?: string | null;
  created_at: string;
  updated_at: string;
  attendees?: AttendeeRecord[];
}

export interface AttendeeRecord {
  id: string;
  rsvp_id: string;
  full_name: string;
  age_group: "adult" | "child";
  document_name: string;
  document_type: string;
  document_size: number;
  // AES-256-GCM encrypted document payload
  encrypted_document: string;
  document_iv: string;
  document_auth_tag: string;
  created_at: string;
}

export interface AuditLogRecord {
  id: string;
  admin_email: string;
  action: string;
  target_attendee_id?: string | null;
  target_rsvp_id?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  timestamp: string;
}

// In-memory volatile store for local development / testing without live Supabase credentials
class MemoryDatabase {
  private rsvps: Map<string, RsvpRecord> = new Map();
  private attendees: Map<string, AttendeeRecord> = new Map();
  private auditLogs: AuditLogRecord[] = [];

  constructor() {
    // Seed initial demo data for immediate testing of admin views
    const sampleRsvpId = "sample-rsvp-001";
    this.rsvps.set(sampleRsvpId, {
      id: sampleRsvpId,
      primary_contact_name: "Vikram & Sunita Malhotra",
      mobile_number: "9876543210",
      email: "vikram.malhotra@example.com",
      attendance_status: "attending",
      attending_events: ["haldi", "sangeet", "wedding"],
      guest_count: 2,
      notes: "Looking forward to celebrating with Priyal and Justin!",
      ip_hash: "seed-ip-hash",
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    });

    this.attendees.set("sample-att-001", {
      id: "sample-att-001",
      rsvp_id: sampleRsvpId,
      full_name: "Vikram Malhotra",
      age_group: "adult",
      document_name: "vikram_aadhaar.pdf",
      document_type: "application/pdf",
      document_size: 245000,
      encrypted_document: "",
      document_iv: "",
      document_auth_tag: "",
      created_at: new Date().toISOString(),
    });

    this.attendees.set("sample-att-002", {
      id: "sample-att-002",
      rsvp_id: sampleRsvpId,
      full_name: "Sunita Malhotra",
      age_group: "adult",
      document_name: "sunita_aadhaar.jpg",
      document_type: "image/jpeg",
      document_size: 412000,
      encrypted_document: "",
      document_iv: "",
      document_auth_tag: "",
      created_at: new Date().toISOString(),
    });
  }

  async findRsvpByMobile(mobile: string): Promise<RsvpRecord | null> {
    const cleaned = mobile.replace(/[\s-]/g, "");
    for (const rsvp of this.rsvps.values()) {
      if (rsvp.mobile_number === cleaned || rsvp.mobile_number.endsWith(cleaned.slice(-10))) {
        const attList = Array.from(this.attendees.values()).filter(
          (a) => a.rsvp_id === rsvp.id
        );
        return { ...rsvp, attendees: attList };
      }
    }
    return null;
  }

  async saveRsvp(
    rsvpData: Omit<RsvpRecord, "id" | "created_at" | "updated_at">,
    attendeesData: Array<{
      full_name: string;
      age_group: "adult" | "child";
      document_name: string;
      document_type: string;
      document_size: number;
      encrypted: EncryptedPayload;
    }>
  ): Promise<RsvpRecord> {
    // Check if RSVP exists for mobile
    const existing = await this.findRsvpByMobile(rsvpData.mobile_number);
    const rsvpId = existing ? existing.id : `rsvp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const now = new Date().toISOString();

    const record: RsvpRecord = {
      ...rsvpData,
      id: rsvpId,
      created_at: existing ? existing.created_at : now,
      updated_at: now,
    };
    this.rsvps.set(rsvpId, record);

    // If updating, delete existing attendees first
    if (existing) {
      for (const [attId, att] of this.attendees.entries()) {
        if (att.rsvp_id === rsvpId) {
          this.attendees.delete(attId);
        }
      }
    }

    // Save new attendees
    const savedAttendees: AttendeeRecord[] = [];
    for (const att of attendeesData) {
      const attId = `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const attendeeRecord: AttendeeRecord = {
        id: attId,
        rsvp_id: rsvpId,
        full_name: att.full_name,
        age_group: att.age_group,
        document_name: att.document_name,
        document_type: att.document_type,
        document_size: att.document_size,
        encrypted_document: att.encrypted.ciphertext,
        document_iv: att.encrypted.iv,
        document_auth_tag: att.encrypted.authTag,
        created_at: now,
      };
      this.attendees.set(attId, attendeeRecord);
      savedAttendees.push(attendeeRecord);
    }

    return { ...record, attendees: savedAttendees };
  }

  async getAllRsvps(): Promise<RsvpRecord[]> {
    const list: RsvpRecord[] = [];
    for (const rsvp of this.rsvps.values()) {
      const attList = Array.from(this.attendees.values()).filter(
        (a) => a.rsvp_id === rsvp.id
      );
      list.push({ ...rsvp, attendees: attList });
    }
    return list.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  async getAttendeeById(id: string): Promise<AttendeeRecord | null> {
    return this.attendees.get(id) || null;
  }

  async logAudit(log: Omit<AuditLogRecord, "id" | "timestamp">): Promise<AuditLogRecord> {
    const entry: AuditLogRecord = {
      ...log,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(entry);
    return entry;
  }

  async getAuditLogs(): Promise<AuditLogRecord[]> {
    return [...this.auditLogs];
  }
}

// Global singleton memory store
const memoryDb = new MemoryDatabase();

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(
    url &&
      key &&
      !url.includes("placeholder-project") &&
      key !== "placeholder-service-role-key" &&
      key.length > 20
  );
}

function getSupabaseServerClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export const db = {
  async findRsvpByMobile(mobile: string): Promise<RsvpRecord | null> {
    const supabase = getSupabaseServerClient();
    if (!supabase) return memoryDb.findRsvpByMobile(mobile);

    const cleaned = mobile.replace(/[\s-]/g, "");
    const { data, error } = await supabase
      .from("rsvps")
      .select("*, attendees(*)")
      .eq("mobile_number", cleaned)
      .maybeSingle();

    if (error || !data) return null;
    return data as RsvpRecord;
  },

  async saveRsvp(
    rsvpData: Omit<RsvpRecord, "id" | "created_at" | "updated_at">,
    attendeesData: Array<{
      full_name: string;
      age_group: "adult" | "child";
      document_name: string;
      document_type: string;
      document_size: number;
      encrypted: EncryptedPayload;
    }>
  ): Promise<RsvpRecord> {
    const supabase = getSupabaseServerClient();
    if (!supabase) return memoryDb.saveRsvp(rsvpData, attendeesData);

    // Upsert RSVP
    const { data: savedRsvp, error: rsvpError } = await supabase
      .from("rsvps")
      .upsert(
        {
          primary_contact_name: rsvpData.primary_contact_name,
          mobile_number: rsvpData.mobile_number,
          email: rsvpData.email,
          attendance_status: rsvpData.attendance_status,
          attending_events: rsvpData.attending_events,
          guest_count: rsvpData.guest_count,
          notes: rsvpData.notes,
          ip_hash: rsvpData.ip_hash,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "mobile_number" }
      )
      .select()
      .single();

    if (rsvpError || !savedRsvp) {
      throw new Error(`Failed to save RSVP: ${rsvpError?.message}`);
    }

    // Replace attendees for this RSVP
    await supabase.from("attendees").delete().eq("rsvp_id", savedRsvp.id);

    if (attendeesData.length > 0) {
      // Package document payload to work seamlessly with existing Supabase schema
      const attendeesToInsert = attendeesData.map((att) => {
        // Embed document metadata into ciphertext JSON payload for zero data loss
        const bundledDocData = JSON.stringify({
          document_name: att.document_name,
          document_type: att.document_type,
          document_size: att.document_size,
          ciphertext: att.encrypted.ciphertext,
        });

        return {
          rsvp_id: savedRsvp.id,
          full_name: att.full_name,
          age_group: att.age_group,
          // Populating legacy columns present in current Supabase schema
          aadhaar_last4: "DOC",
          encrypted_aadhaar: bundledDocData,
          aadhaar_iv: att.encrypted.iv,
          aadhaar_auth_tag: att.encrypted.authTag,
        };
      });

      const { data: insertedAttendees, error: attError } = await supabase
        .from("attendees")
        .insert(attendeesToInsert)
        .select();

      if (attError) {
        throw new Error(`Failed to save attendees: ${attError.message}`);
      }

      // Format returned records for unified application usage
      const normalizedAttendees: AttendeeRecord[] = (insertedAttendees || []).map((row: any) => {
        let docName = row.document_name;
        let docType = row.document_type;
        let docSize = row.document_size;
        let ciphertext = row.encrypted_document;

        if (!ciphertext && row.encrypted_aadhaar) {
          try {
            const parsed = JSON.parse(row.encrypted_aadhaar);
            docName = parsed.document_name;
            docType = parsed.document_type;
            docSize = parsed.document_size;
            ciphertext = parsed.ciphertext;
          } catch {
            ciphertext = row.encrypted_aadhaar;
          }
        }

        return {
          id: row.id,
          rsvp_id: row.rsvp_id,
          full_name: row.full_name,
          age_group: row.age_group,
          document_name: docName || "aadhaar_document",
          document_type: docType || "image/jpeg",
          document_size: docSize || 0,
          encrypted_document: ciphertext || "",
          document_iv: row.document_iv || row.aadhaar_iv || "",
          document_auth_tag: row.document_auth_tag || row.aadhaar_auth_tag || "",
          created_at: row.created_at,
        };
      });

      return { ...savedRsvp, attendees: normalizedAttendees } as RsvpRecord;
    }

    return { ...savedRsvp, attendees: [] } as RsvpRecord;
  },

  async getAllRsvps(): Promise<RsvpRecord[]> {
    const supabase = getSupabaseServerClient();
    if (!supabase) return memoryDb.getAllRsvps();

    const { data, error } = await supabase
      .from("rsvps")
      .select("*, attendees(*)")
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    // Normalize attendee fields across all records
    return (data as any[]).map((rsvp) => ({
      ...rsvp,
      attendees: (rsvp.attendees || []).map((row: any) => {
        let docName = row.document_name;
        let docType = row.document_type;
        let docSize = row.document_size;
        let ciphertext = row.encrypted_document;

        if (!ciphertext && row.encrypted_aadhaar) {
          try {
            const parsed = JSON.parse(row.encrypted_aadhaar);
            docName = parsed.document_name;
            docType = parsed.document_type;
            docSize = parsed.document_size;
            ciphertext = parsed.ciphertext;
          } catch {
            ciphertext = row.encrypted_aadhaar;
          }
        }

        return {
          id: row.id,
          rsvp_id: row.rsvp_id,
          full_name: row.full_name,
          age_group: row.age_group,
          document_name: docName || "aadhaar_document",
          document_type: docType || "image/jpeg",
          document_size: docSize || 0,
          encrypted_document: ciphertext || "",
          document_iv: row.document_iv || row.aadhaar_iv || "",
          document_auth_tag: row.document_auth_tag || row.aadhaar_auth_tag || "",
          created_at: row.created_at,
        };
      }),
    })) as RsvpRecord[];
  },

  async getAttendeeById(id: string): Promise<AttendeeRecord | null> {
    const supabase = getSupabaseServerClient();
    if (!supabase) return memoryDb.getAttendeeById(id);

    const { data: row, error } = await supabase
      .from("attendees")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !row) return null;

    let docName = row.document_name;
    let docType = row.document_type;
    let docSize = row.document_size;
    let ciphertext = row.encrypted_document;

    if (!ciphertext && row.encrypted_aadhaar) {
      try {
        const parsed = JSON.parse(row.encrypted_aadhaar);
        docName = parsed.document_name;
        docType = parsed.document_type;
        docSize = parsed.document_size;
        ciphertext = parsed.ciphertext;
      } catch {
        ciphertext = row.encrypted_aadhaar;
      }
    }

    return {
      id: row.id,
      rsvp_id: row.rsvp_id,
      full_name: row.full_name,
      age_group: row.age_group,
      document_name: docName || "aadhaar_document",
      document_type: docType || "image/jpeg",
      document_size: docSize || 0,
      encrypted_document: ciphertext || "",
      document_iv: row.document_iv || row.aadhaar_iv || "",
      document_auth_tag: row.document_auth_tag || row.aadhaar_auth_tag || "",
      created_at: row.created_at,
    };
  },

  async logAudit(log: Omit<AuditLogRecord, "id" | "timestamp">): Promise<AuditLogRecord> {
    const supabase = getSupabaseServerClient();
    if (!supabase) return memoryDb.logAudit(log);

    const { data, error } = await supabase
      .from("audit_logs")
      .insert({
        admin_email: log.admin_email,
        action: log.action,
        target_attendee_id: log.target_attendee_id,
        target_rsvp_id: log.target_rsvp_id,
        ip_address: log.ip_address,
        user_agent: log.user_agent,
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Failed to persist audit log:", error);
      return {
        ...log,
        id: `local-audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
    }

    return data as AuditLogRecord;
  },

  async getAuditLogs(): Promise<AuditLogRecord[]> {
    const supabase = getSupabaseServerClient();
    if (!supabase) return memoryDb.getAuditLogs();

    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(100);

    if (error || !data) return [];
    return data as AuditLogRecord[];
  },
};
