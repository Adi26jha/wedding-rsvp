import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAccess } from "@/lib/adminAuth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { authorized, adminEmail } = verifyAdminAccess(req);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { attendeeId } = await req.json();
    if (!attendeeId) {
      return NextResponse.json({ error: "Attendee ID required" }, { status: 400 });
    }

    const attendee = await db.getAttendeeById(attendeeId);
    if (!attendee) {
      return NextResponse.json({ error: "Attendee record not found" }, { status: 404 });
    }

    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Mandatory Audit Log Entry
    await db.logAudit({
      admin_email: adminEmail,
      action: "VIEW_AADHAAR_RECORD",
      target_attendee_id: attendee.id,
      target_rsvp_id: attendee.rsvp_id,
      ip_address: ip,
      user_agent: userAgent,
    });

    return NextResponse.json({
      success: true,
      attendeeId: attendee.id,
      fullName: attendee.full_name,
      documentName: attendee.document_name,
      documentType: attendee.document_type,
      documentSize: attendee.document_size,
      hasEncryptedDocument: Boolean(attendee.encrypted_document),
      accessedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error("Reveal Record Error:", err);
    return NextResponse.json({ error: "Failed to access record" }, { status: 500 });
  }
}
