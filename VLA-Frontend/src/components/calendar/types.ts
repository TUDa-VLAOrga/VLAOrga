export type CalendarDay = {
  date: Date;
  iso: string; // lokales Datum als yyyy-mm-dd (stabiler Key)
};

export type CalendarId = "calendar-1" | "calendar-2";
export type EventKind = "lecture" | "pickup" | "other";
export type EventStatus = "neutral" | "ok" | "warn" | "critical";

export type CalendarEvent = {
  id: string;
  title: string;
  dateISO: string; // yyyy-mm-dd (muss zu CalendarDay.iso passen)
  calendarId: CalendarId;
  kind: EventKind;
  status?: EventStatus;
  subtitle?: string;
};
export type CalendarEventsByDateISO = Record<string, CalendarEvent[]>;



