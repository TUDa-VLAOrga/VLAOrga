export type CalendarDay = {
  date: Date;
  iso: string; /** Local date as yyyy-mm-dd (stable key). */
};

export type CalendarId = string; /** Calendar identifier, e.g. "vla" or "event-calendar", to distinguish multiple calendars/sources. */
export type EventKind = string; /** e.g. "Aufbau", "VL" to distinguish different event types. */

/**
 * Visual/operational status of an event used for UI highlighting.
 *
 * - "neutral": no special state (default)
 * - "ok": everything on track / confirmed
 * - "warn": attention needed soon (e.g., missing info, pending confirmation)
 * - "critical": urgent / blocking issue (e.g., cannot be executed as planned)
 */
export const EVENT_STATUSES = ["neutral", "ok", "warn", "critical"] as const;
export type EventStatus = typeof EVENT_STATUSES[number];

export type CalendarEvent = {
  id: string;
  title: string;
  dateISO: string;  /** yyyy-mm-dd (must match CalendarDay.iso). */
  calendarId: CalendarId;
  kind: EventKind;
  status?: EventStatus;   /** Optional UI status indicator for highlighting the event in the calendar. */
  subtitle?: string;
};
export type CalendarEventsByDateISO = Record<string, CalendarEvent[]>;



