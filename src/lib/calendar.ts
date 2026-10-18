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
      "Join Priyal and Justin for their wedding celebrations at Corbett Adventure Resort, Bail Parao, Uttarakhand!\n\nSaturday November 21, 2026:\n• 1:00 PM to 4:30 PM: HALDI (Poolside Arena)\n• 7:00 PM to 11:00 PM: COCKTAIL & RING CEREMONY (Swagatam Lawn)\n\nSunday November 22, 2026:\n• 10:00 AM to 11:30 AM: CHOODA CEREMONY (Banquet Hall)\n• 4:30 PM to 10:00 PM: THE WEDDING (Adanya Lawn)",
    location: "Corbett Adventure Resort, Bail Parao, Ramnagar, Uttarakhand 244715",
    // 21 Nov 2026 13:00 IST = 21 Nov 07:30 UTC
    startUtc: "20261121T073000Z",
    // 22 Nov 2026 22:00 IST = 22 Nov 16:30 UTC
    endUtc: "20261122T163000Z",
  },
  haldi: {
    title: "Priyal & Justin - Haldi",
    description: "The festivities begin in a garden filled with joy 💕\nDress Code: Shades of Pink\nLocation: Poolside Arena, Corbett Adventure Resort",
    location: "Poolside Arena, Corbett Adventure Resort, Bail Parao, Uttarakhand",
    startUtc: "20261121T073000Z", // 1:00 PM IST
    endUtc: "20261121T110000Z",   // 4:30 PM IST
  },
  cocktail: {
    title: "Priyal & Justin - Cocktail & Ring Ceremony",
    description: "As day turns to night, let music and the magic of stars brighten up the celebrations💃\nDress Code: All-Bling\nLocation: Swagatam Lawn, Corbett Adventure Resort",
    location: "Swagatam Lawn, Corbett Adventure Resort, Bail Parao, Uttarakhand",
    startUtc: "20261121T133000Z", // 7:00 PM IST
    endUtc: "20261121T173000Z",   // 11:00 PM IST
  },
  sangeet: {
    title: "Priyal & Justin - Cocktail & Ring Ceremony",
    description: "As day turns to night, let music and the magic of stars brighten up the celebrations💃\nDress Code: All-Bling\nLocation: Swagatam Lawn, Corbett Adventure Resort",
    location: "Swagatam Lawn, Corbett Adventure Resort, Bail Parao, Uttarakhand",
    startUtc: "20261121T133000Z", // 7:00 PM IST
    endUtc: "20261121T173000Z",   // 11:00 PM IST
  },
  chooda: {
    title: "Priyal & Justin - Chooda Ceremony",
    description: "A sacred blessing, a shower of love, and a lifetime of happiness ❤️\nDress Code: Ethnic Wear\nLocation: Banquet Hall, Corbett Adventure Resort",
    location: "Banquet Hall, Corbett Adventure Resort, Bail Parao, Uttarakhand",
    startUtc: "20261122T043000Z", // 10:00 AM IST
    endUtc: "20261122T060000Z",   // 11:30 AM IST
  },
  wedding: {
    title: "Priyal & Justin - The Wedding",
    description: "Two stories intertwine to become one timeless tale 👩❤️👨\nDress Code: Royal Indian Attire\nLocation: Adanya Lawn, Corbett Adventure Resort",
    location: "Adanya Lawn, Corbett Adventure Resort, Bail Parao, Uttarakhand",
    startUtc: "20261122T110000Z", // 4:30 PM IST
    endUtc: "20261122T163000Z",   // 10:00 PM IST
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
