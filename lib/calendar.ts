export function generateWorkshopICS(): string {
  // 30 September 2026, 9:00 AM to 4:00 PM IST (UTC+05:30)
  // 09:00 IST = 03:30 UTC
  // 16:00 IST = 10:30 UTC
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NBKRIST//Prompt to Production Workshop//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:p2p-workshop-20260930@nbkrist.org",
    "DTSTAMP:20260928T120000Z",
    "DTSTART:20260930T033000Z",
    "DTEND:20260930T103000Z",
    "SUMMARY:Prompt to Production – Paytm AI Workshop",
    "DESCRIPTION:Prompt to Production — One-day hands-on AI workshop organized by the Department of IT & AI&DS, N.B.K.R. Institute of Science & Technology, in association with ISTE. Expert sessions with Mr. Suman Mandal (Paytm) and Mr. Shivam Behl (Microsoft), followed by Hands-on AI Build Challenge.",
    "LOCATION:Seminar Hall, New CSE Block, NBKRIST, Vidyanagar, AP",
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder: Prompt to Production – Paytm AI Workshop starts in 30 minutes at Seminar Hall, New CSE Block",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  return icsContent;
}

export function downloadCalendarEvent() {
  const content = generateWorkshopICS();
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "Prompt_to_Production_Paytm_AI_Workshop.ics");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
