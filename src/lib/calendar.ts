/**
 * iCalendar (.ics) Generator for Priyal & Justin's Wedding Events
 */

export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  startUtc: string; // YYYYMMDDTHHmmssZ
  endUtc: string;   // YYYYMMDDTHHmmssZ
}

export const WEDDING_EVENTS: Record<string, CalendarEvent> = {
  all: {
    title: "Priyal & Justin's Wedding Celebrations",
    description:
      "Join Priyal and Justin for their wedding celebrations at Corbett Adventure Resort, Bail Parao, Uttarakhand! Events: Haldi (Nov 21, 1 PM), Sangeet (Nov 21, 7 PM), and Wedding (Nov 22).",
    location: "Corbett Adventure Resort, Bail Parao, Ramnagar, Uttarakhand 244715",
    // 21 Nov 2026 13:00 IST = 21 Nov 07:30 UTC
    startUtc: "20261121T073000Z",
    // 23 Nov 2026 11:00 IST = 23 Nov 05:30 UTC
    endUtc: "20261123T053000Z",
  },
  haldi: {
    title: "Priyal & Justin - Haldi Ceremony",
    description: "Yellow vibes, sunshine, and joyful rituals to kick off the wedding festivities.",
    location: "Corbett Adventure Resort, Bail Parao, Uttarakhand",
    startUtc: "20261121T073000Z", // 1:00 PM IST
    endUtc: "20261121T103000Z",   // 4:00 PM IST
  },
  sangeet: {
    title: "Priyal & Justin - Sangeet & Musical Night",
    description: "An evening of music, performances, cocktails, and non-stop dancing under the Corbett stars.",
    location: "Corbett Adventure Resort, Bail Parao, Uttarakhand",
    startUtc: "20261121T133000Z", // 7:00 PM IST
    endUtc: "20261121T180000Z",   // 11:30 PM IST
  },
  wedding: {
    title: "Priyal & Justin - Wedding & Phere",
    description: "The wedding ceremony and auspicious pheras as Priyal and Justin begin their lifetime journey together.",
    location: "Corbett Adventure Resort, Bail Parao, Uttarakhand",
    startUtc: "20261122T113000Z", // 5:00 PM IST
    endUtc: "20261122T173000Z",   // 11:00 PM IST
  },
};

export function generateIcs(eventKey: string = "all"): string {
  const event = WEDDING_EVENTS[eventKey] || WEDDING_EVENTS.all;
  const now = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Priyal and Justin Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:priyal-justin-wedding-${eventKey}-2026@weddingportal`,
    `DTSTAMP:${now}`,
    `DTSTART:${event.startUtc}`,
    `DTEND:${event.endUtc}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${event.location}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
