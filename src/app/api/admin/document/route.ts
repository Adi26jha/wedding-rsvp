import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAccess } from "@/lib/adminAuth";
import { db } from "@/lib/db";
import { decryptAadhaar } from "@/lib/crypto";

export async function GET(req: NextRequest) {
  const { authorized, adminEmail } = verifyAdminAccess(req);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const attendeeId = req.nextUrl.searchParams.get("attendeeId");
  const isDownload = req.nextUrl.searchParams.get("download") === "true";

  if (!attendeeId) {
    return NextResponse.json({ error: "Missing attendee ID" }, { status: 400 });
  }

  try {
    const attendee = await db.getAttendeeById(attendeeId);
    if (!attendee) {
      return NextResponse.json({ error: "Attendee record not found" }, { status: 404 });
    }

    if (!attendee.encrypted_document || !attendee.document_iv || !attendee.document_auth_tag) {
      return NextResponse.json({ error: "No document attached to this attendee" }, { status: 404 });
    }

    // 1. Mandatory Security Audit Log
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    await db.logAudit({
      admin_email: adminEmail,
      action: isDownload ? "DOWNLOAD_AADHAAR_DOCUMENT" : "VIEW_AADHAAR_DOCUMENT",
      target_attendee_id: attendee.id,
      target_rsvp_id: attendee.rsvp_id,
      ip_address: ip,
      user_agent: req.headers.get("user-agent") || "unknown",
    });

    // 2. Decrypt the document payload
    const decryptedBase64 = decryptAadhaar({
      ciphertext: attendee.encrypted_document,
      iv: attendee.document_iv,
      authTag: attendee.document_auth_tag,
    });

    // Strip data URL scheme if present (e.g. "data:image/jpeg;base64,...")
    const cleanBase64 = decryptedBase64.includes(",")
      ? decryptedBase64.split(",")[1]
      : decryptedBase64;

    const fileBuffer = Buffer.from(cleanBase64, "base64");
    const mimeType = attendee.document_type || "application/octet-stream";
    const fileName = attendee.document_name || `aadhaar-${attendee.id.slice(0, 8)}`;

    const disposition = isDownload ? "attachment" : "inline";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `${disposition}; filename="${fileName}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: unknown) {
    console.error("Admin Document Retrieval Error:", err);
    return NextResponse.json(
      { error: "Failed to decrypt or retrieve document" },
      { status: 500 }
    );
  }
}
