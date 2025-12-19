/**
 * dateUtils.ts
 * Sammlung von reinen Datums-/Format-Hilfsfunktionen für den Kalender.
 * Ziel: CalendarView bleibt schlank (State + UI), Logik liegt hier.
 */

export const WORKDAY_COUNT = 5;

export function toISODateLocal(d: Date) {
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Gibt ein neues Date zurück, das `days` Tage von `date` entfernt ist. */
export function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** True, wenn das Datum Samstag oder Sonntag ist. */
export function isWeekend(date: Date) {
  const day = date.getDay(); // 0=So,6=Sa
  return day === 0 || day === 6;
}

/**
 * Normalisiert auf den Start eines Arbeitstags.
 * Falls Sa/So -> nächster Montag. Uhrzeit wird auf 00:00 gesetzt.
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
 * Addiert Arbeitstage (Mo–Fr). Überspringt Wochenende.
 * `n` kann negativ sein.
 */
export function addWorkdays(date: Date, n: number) {
  let d = new Date(date);
  d.setHours(0, 0, 0, 0);

  // Falls jemand aus Versehen auf WE landet, erst normalisieren
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
});

/** Formatiert z.B. "Fr 19.12 – Do 25.12" */
export function formatRangeShortDE(start: Date, end: Date) {
  return `${rangeFmt.format(start)} – ${rangeFmt.format(end)}`;
}
