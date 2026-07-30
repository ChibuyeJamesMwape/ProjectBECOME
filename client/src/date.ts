// Mirrors the server's UTC-based calendar-day scheme (server/src/lib/gates.ts)
// so client-side displays (streak dots, chart bars) line up with what the
// backend actually stored.
export function todayISO(offsetDays = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - offsetDays);
  return d.toISOString().slice(0, 10);
}

export function fmt(dateStr: string): string {
  return new Date(dateStr + "T12:00:00Z").toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export function fmtShort(dateStr: string): string {
  return new Date(dateStr + "T12:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export function weekdayLetter(dateStr: string): string {
  const day = new Date(dateStr + "T12:00:00Z").getUTCDay();
  return ["S", "M", "T", "W", "T", "F", "S"][day];
}
