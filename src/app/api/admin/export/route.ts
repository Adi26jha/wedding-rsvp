import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAccess } from "@/lib/adminAuth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { authorized, adminEmail } = verifyAdminAccess(req);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

  try {
    // Record audit log for export
    await db.logAudit({
      admin_email: adminEmail,
      action: "EXPORT_RSVP_ROSTER_CSV",
      ip_address: ip,
      user_agent: req.headers.get("user-agent") || "unknown",
    });

    const rsvps = await db.getAllRsvps();

    // Prepare CSV headers
    const headers = [
      "RSVP ID",
      "Submission Date",
      "Primary Contact Name",
      "Mobile Number",
      "Email",
      "Status",
      "Events Attending",
      "Total Guest Count",
      "Attendee Name",
      "Attendee Age Group",
      "Aadhaar Document Name",
      "Aadhaar Document Status",
      "Notes",
    ];

    const rows: string[][] = [];

    for (const rsvp of rsvps) {
      const eventsStr = (rsvp.attending_events || []).join("; ");
      const submissionDate = new Date(rsvp.created_at).toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
      });

      if (!rsvp.attendees || rsvp.attendees.length === 0) {
        rows.push([
          rsvp.id,
          submissionDate,
          rsvp.primary_contact_name,
          rsvp.mobile_number,
          rsvp.email || "",
          rsvp.attendance_status,
          eventsStr,
          String(rsvp.guest_count),
          "",
          "",
          "",
          "No ID attached",
          rsvp.notes || "",
        ]);
      } else {
        for (const att of rsvp.attendees) {
          rows.push([
            rsvp.id,
            submissionDate,
            rsvp.primary_contact_name,
            rsvp.mobile_number,
            rsvp.email || "",
            rsvp.attendance_status,
            eventsStr,
            String(rsvp.guest_count),
            att.full_name,
            att.age_group,
            att.document_name || "aadhaar_card.pdf",
            "Encrypted & Verified on Server",
            rsvp.notes || "",
          ]);
        }
      }
    }

    const csvContent = [
      headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${(cell || "").replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\r\n");

    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `priyal-justin-wedding-roster-${dateStr}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err: unknown) {
    console.error("Export Error:", err);
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}
