export type CalendarDay = {
  date: Date;
  iso: string; // lokales Datum als yyyy-mm-dd (stabiler Key)
};

export type CalendarId = string; // z.B. "vla", "eventkalender" um verschiedene Kalender zu unterscheiden
export type EventKind = string; // z.B "Aufbau", "VL" um verschiedene Event-Arten zu unterscheiden

/**
 * Visual/operational status of an event used for UI highlighting.
 *
 * - "neutral": no special state (default)
 * - "ok": everything on track / confirmed
 * - "warn": attention needed soon (e.g., missing info, pending confirmation)
 * - "critical": urgent / blocking issue (e.g., cannot be executed as planned)
 */
export type EventStatus = "neutral" | "ok" | "warn" | "critical";

export type CalendarEvent = {
  id: string;
  title: string;
  dateISO: string; // yyyy-mm-dd (muss zu CalendarDay.iso passen)
  calendarId: CalendarId;
  kind: EventKind;
  status?: EventStatus;  // Optional UI status indicator for highlighting the event in the calendar.
  subtitle?: string;
};
export type CalendarEventsByDateISO = Record<string, CalendarEvent[]>;



