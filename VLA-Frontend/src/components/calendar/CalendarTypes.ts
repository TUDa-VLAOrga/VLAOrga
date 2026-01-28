import type { Person } from "./EventForm/AddPeopleSection";

export type CalendarDay = {
  date: Date;
  iso: string; /** Local date as yyyy-mm-dd (stable key). */
};

/** Calendar identifier, e.g. "vla" or "event-calendar", to distinguish multiple calendars/sources. */
export type CalendarId = string;
/** e.g. "Aufbau", "VL" to distinguish different event types. */
export type EventKind = string;
/** Lecture identifier to link events to lectures. */
export type LectureId = string;
/** Unique event identifier. */
export type EventId = string;

/**
 * Visual/operational status of an event used for UI highlighting.
 *
 * - "neutral": no special state (default)
 * - "ok": everything on track / confirmed
 * - "warn": attention needed soon (e.g., missing info, pending confirmation)
 * - "critical": urgent / blocking issue (e.g., cannot be executed as planned)
 */
export enum EventStatus {
  Neutral = "neutral",
  Ok = "ok",
  Warn = "warn",
  Critical = "critical",
}

export type CalendarEvent = {
  id: EventId;
  title: string;
  dateISO: string;  /** yyyy-mm-dd (must match CalendarDay.iso). */
  displayedStartTime?: string; 
  displayedEndTime?: string;
  calendarId: CalendarId;
  kind: EventKind;
  status?: EventStatus;   /** Optional UI status indicator for highlighting the event in the calendar. */
  shortTitle?: string;
  lectureId?: LectureId;
  people?: string[] | Person[];
};

export type Lecture = {
  id: LectureId;
  name: string;
  color: string; 
};

export type CalendarEventsByDateISO = Record<string, CalendarEvent[]>;


