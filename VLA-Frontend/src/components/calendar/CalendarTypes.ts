import type {Appointment} from "@/lib/databaseTypes";


/**
 * Represents a single day in the calendar.
 * Wrapper data type to easily retrieve ISO representation of the date.
 */
export type CalendarDay = {
  date: Date;
  iso: string; /** Local date as yyyy-mm-dd (stable key). */
};

/**
 * Visual/operational status of an event used for UI highlighting.
 *
 * - "neutral": no special state (default)
 * - "ok": everything on track / confirmed
 * - "warn": attention needed soon (e.g., missing info, pending confirmation)
 * - "critical": urgent / blocking issue (e.g., cannot be executed as planned)
 */
export type EventStatus = string;

/**
 * Data structure to group events by date.
 */
export type CalendarEventsByDateISO = Record<string, Appointment[]>;
