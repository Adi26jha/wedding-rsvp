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
    let cleanBase64 = decryptedBase64;
    let mimeType = attendee.document_type;

    if (decryptedBase64.startsWith("data:")) {
      const commaIndex = decryptedBase64.indexOf(",");
      if (commaIndex !== -1) {
        const prefix = decryptedBase64.slice(0, commaIndex);
        const match = prefix.match(/^data:([^;]+);base64/);
        if (match) {
          mimeType = match[1];
        }
        cleanBase64 = decryptedBase64.slice(commaIndex + 1);
      }
    }

    let fileName = attendee.document_name || `aadhaar-${attendee.id.slice(0, 8)}`;

    // Infer MIME type if missing or generic
    if (!mimeType || mimeType === "application/octet-stream") {
      const lower = fileName.toLowerCase();
      if (lower.endsWith(".pdf")) mimeType = "application/pdf";
      else if (lower.endsWith(".png")) mimeType = "image/png";
      else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) mimeType = "image/jpeg";
      else if (lower.endsWith(".webp")) mimeType = "image/webp";
      else mimeType = "image/jpeg";
    }

    // Ensure fileName has proper extension
    if (!fileName.includes(".")) {
      if (mimeType === "application/pdf") fileName += ".pdf";
      else if (mimeType === "image/png") fileName += ".png";
      else fileName += ".jpg";
    }

    const fileBuffer = Buffer.from(cleanBase64, "base64");
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
