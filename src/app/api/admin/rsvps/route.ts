import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAccess } from "@/lib/adminAuth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { authorized, adminEmail } = verifyAdminAccess(req);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const rsvps = await db.getAllRsvps();
    const auditLogs = await db.getAuditLogs();

    // Calculate summary statistics
    let totalConfirmedGuests = 0;
    let totalDeclined = 0;
    let totalAttendingResponses = 0;
    let haldiCount = 0;
    let cocktailCount = 0;
    let choodaCount = 0;
    let weddingCount = 0;

    rsvps.forEach((r) => {
      if (r.attendance_status === "attending") {
        totalAttendingResponses += 1;
        totalConfirmedGuests += r.guest_count;
        if (r.attending_events?.includes("haldi") || !r.attending_events?.length) haldiCount += r.guest_count;
        if (r.attending_events?.includes("cocktail") || r.attending_events?.includes("sangeet") || !r.attending_events?.length) cocktailCount += r.guest_count;
        if (r.attending_events?.includes("chooda") || !r.attending_events?.length) choodaCount += r.guest_count;
        if (r.attending_events?.includes("wedding") || !r.attending_events?.length) weddingCount += r.guest_count;
      } else {
        totalDeclined += 1;
      }
    });

    const sanitizedRsvps = rsvps.map((r) => ({
      id: r.id,
      primaryContactName: r.primary_contact_name,
      mobileNumber: r.mobile_number,
      email: r.email,
      attendanceStatus: r.attendance_status,
      attendingEvents: r.attending_events,
      guestCount: r.guest_count,
      notes: r.notes,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      attendees: (r.attendees || []).map((a) => ({
        id: a.id,
        fullName: a.full_name,
        ageGroup: a.age_group,
        documentName: a.document_name,
        documentType: a.document_type,
        documentSize: a.document_size,
        hasDocument: Boolean(a.encrypted_document || a.document_name),
      })),
    }));

    return NextResponse.json({
      metrics: {
        totalResponses: rsvps.length,
        totalAttendingResponses,
        totalConfirmedGuests,
        totalDeclined,
        haldiCount,
        cocktailCount,
        choodaCount,
        weddingCount,
        sangeetCount: cocktailCount,
      },
      rsvps: sanitizedRsvps,
      recentAuditLogs: auditLogs.slice(0, 20),
    });
  } catch (err: unknown) {
    console.error("Admin RSVPs Fetch Error:", err);
    return NextResponse.json({ error: "Failed to fetch RSVPs" }, { status: 500 });
  }
}
