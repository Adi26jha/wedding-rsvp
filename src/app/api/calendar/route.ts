import { NextRequest, NextResponse } from "next/server";
import { generateIcs } from "@/lib/calendar";

export async function GET(req: NextRequest) {
  const event = req.nextUrl.searchParams.get("event") || "all";
  const icsContent = generateIcs(event);

  return new NextResponse(icsContent, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="priyal-justin-wedding-${event}.ics"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
