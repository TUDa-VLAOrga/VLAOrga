/**
 * dateUtils.ts
 * Collection of pure date/formatting helper functions for the calendar.
 * Goal: CalendarView stays lean (State + UI), logic is here.
 */

export const WORKDAY_COUNT = 5;

export function toISODateLocal(d: Date) {
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Formats a date as "dd.mm." (e.g., "19.12."). */
export function formatDDMM(date: Date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.`;
}


/** gives a new Date that is `days` days away from `date`. */
export function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** True, if date is Saturday or Sunday. */
export function isWeekend(date: Date) {
  const day = date.getDay(); // 0=So,6=Sa
  return day === 0 || day === 6;
}

/**
 * Normalizes to the start of a workday.
 * If Saturday or Sunday -> next Monday. Time is set to 00:00.
 */
export function normalizeToWorkdayStart(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const day = d.getDay(); // 0=So,6=Sa
  if (day === 6) d.setDate(d.getDate() + 2); // Sa -> Mo
  if (day === 0) d.setDate(d.getDate() + 1); // So -> Mo

  return d;
}

/**
 * adds workdays (Mo–Fr). Skips weekend.
 * `n` can be negative.
 */
export function addWorkdays(date: Date, n: number) {
  let d = new Date(date);
  d.setHours(0, 0, 0, 0);

  // if someone accidentally lands on a weekend, normalize first
  d = normalizeToWorkdayStart(d);

  const step = n >= 0 ? 1 : -1;
  let remaining = Math.abs(n);

  while (remaining > 0) {
    d = addDays(d, step);
    if (!isWeekend(d)) remaining--;
  }

  d.setHours(0, 0, 0, 0);
  return d;
}

const rangeFmt = new Intl.DateTimeFormat("de-DE", {
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/** formats a range like "Fr 19.12 – Do 25.12" */
export function formatRangeShortDE(start: Date, end: Date) {
  return `${rangeFmt.format(start)} – ${rangeFmt.format(end)}`;
}
/** Parse yyyy-mm-dd as a *local* Date (prevents timezone shift). */
export function parseISODateLocal(iso: string): Date {
  const [datePart] = iso.split("T"); // in case you ever store timestamps
  const [y, m, d] = datePart.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

const dateFmtDE = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/** Formats yyyy-mm-dd -> dd.mm.yyyy */
export function formatISODateDE(iso: string): string {
  return dateFmtDE.format(parseISODateLocal(iso));
}
/**
 * Splits a datetime-local string (yyyy-mm-ddTHH:mm) into date and time parts.
 * @param dateTimeString - Format: "2024-01-15T09:00"
 * @returns Object with date (yyyy-mm-dd) and time (HH:mm)
 */
export function splitDateTime(dateTimeString: string): {
  date: string;
  time: string;
} {
  const [date, time] = dateTimeString.split("T");
  return { date, time };
}

/**
 * Compares two days while ignoring the clock time on a given day
 * @param a The first time to compare
 * @param b The second time to compare
 * Returns true iff a and b are on the same day in UTC
 */
export function compareSameDay(a: Date, b: Date){
  // Conversion to remove time zone dependenies

  return a.getDate() == b.getDate() &&
    a.getMonth() == b.getMonth() &&
    a.getFullYear() == b.getFullYear();
}

/**
 * Adds minutes to a datetime-local string (yyyy-mm-ddTHH:mm)
 * and returns the result in the same format.
 * Handles local time correctly without UTC conversion.
 * @param dateTimeString - Format: "2024-01-15T09:00"
 * @param minutes - Number of minutes to add (can be negative)
 * @returns datetime-local string in format "yyyy-mm-ddTHH:mm"
 */
export function addMinutesToDateTime(dateTimeString: string, minutes: number): string {
  if (!dateTimeString) return "";
  
  const date = new Date(dateTimeString);
  date.setMinutes(date.getMinutes() + minutes);
  
  // Format as YYYY-MM-DDTHH:mm for datetime-local input
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const mins = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${mins}`;
}
