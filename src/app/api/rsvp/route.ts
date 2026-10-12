import { NextRequest, NextResponse } from "next/server";
import { rsvpFormSchema } from "@/lib/validations/rsvpSchema";
import { encryptAadhaar } from "@/lib/crypto";
import { checkRateLimit } from "@/lib/rateLimiter";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting by IP
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateLimit = checkRateLimit(ip, 8, 60000); // 8 requests per minute
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many submission attempts. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 2. Anti-spam Honeypot check
    if (body.honeypot && body.honeypot.trim() !== "") {
      return NextResponse.json({ success: true, message: "Thank you for your response." });
    }

    // 3. Strict Zod validation
    const validationResult = rsvpFormSchema.safeParse(body);
    if (!validationResult.success) {
      const formattedErrors = validationResult.error.format();
      return NextResponse.json(
        {
          error: "Validation failed. Please check your entries.",
          details: formattedErrors,
        },
        { status: 400 }
      );
    }

    const validated = validationResult.data;

    // 4. Check for existing submission by mobile number
    const existingRsvp = await db.findRsvpByMobile(validated.mobileNumber);
    if (existingRsvp && !validated.confirmUpdate) {
      return NextResponse.json({
        exists: true,
        existingName: existingRsvp.primary_contact_name,
        existingCount: existingRsvp.guest_count,
        message: `An RSVP for this mobile number already exists under "${existingRsvp.primary_contact_name}". Would you like to update your response?`,
      });
    }

    // 5. Encrypt attendee Aadhaar card documents server-side
    // Plaintext document base64 is strictly kept in memory and never stored or logged unencrypted
    const encryptedAttendees =
      validated.attendanceStatus === "attending"
        ? validated.attendees.map((att) => {
            const encrypted = encryptAadhaar(att.documentBase64);
            return {
              full_name: att.fullName,
              age_group: att.ageGroup,
              document_name: att.documentName,
              document_type: att.documentType,
              document_size: att.documentSize,
              encrypted,
            };
          })
        : [];

    // 6. Save RSVP record to database
    const saved = await db.saveRsvp(
      {
        primary_contact_name: validated.contactName,
        mobile_number: validated.mobileNumber,
        email: validated.email || null,
        attendance_status: validated.attendanceStatus,
        attending_events: validated.attendingEvents,
        guest_count: validated.attendanceStatus === "attending" ? validated.guestCount : 0,
        notes: validated.notes || null,
        ip_hash: ip,
      },
      encryptedAttendees
    );

    // 7. Return confirmation payload
    return NextResponse.json({
      success: true,
      rsvpId: saved.id,
      isUpdate: Boolean(existingRsvp),
      primaryContactName: saved.primary_contact_name,
      mobileNumber: saved.mobile_number,
      attendanceStatus: saved.attendance_status,
      attendingEvents: saved.attending_events,
      guestCount: saved.guest_count,
      attendees: saved.attendees?.map((a) => ({
        id: a.id,
        fullName: a.full_name,
        ageGroup: a.age_group,
        documentName: a.document_name,
        documentSize: a.document_size,
        hasEncryptedDocument: true,
      })),
      timestamp: saved.updated_at,
    });
  } catch (err: unknown) {
    console.error("RSVP Submission Error:", err);
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your RSVP. Please try again.", details: message },
      { status: 500 }
    );
  }
}
