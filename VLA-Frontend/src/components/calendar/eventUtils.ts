import type {Appointment} from "@/lib/databaseTypes";
import {compareSameDay, toISODateLocal} from "@/components/calendar/dateUtils.ts";
import type {EventStatus} from "@/components/calendar/CalendarTypes.ts";

/** Default event duration in minutes. */
export const DEFAULT_DURATION = 100;

/**
 * Returns a readable title for an event.
 *
 * This is factored out here since the title may be set at the event series already, otherwise the lecture name.
 * In case both are present, the lecture name is appended in parentheses.
 */
export function getEventTitle(event: Appointment) {
  if (!event.series.lecture)
    return event.series.name;
  if (!event.series.name)
    return event.series.lecture.name;
  return `${event.series.name} (${event.series.lecture.name})`;
}

/**
 * Returns the ISO date of an event.
 * This assumes the end date is the same day as the start date.
 */
export function getEventDateISO(event: Appointment) {
  return toISODateLocal(event.start);
}

/**
 * Verifies that given start and end are valid for an event, i.e., on the same day and nothing is undefined.
 */
export function verifyValidTimeRange(start?: Date, end?: Date) {
  return start && end && start < end && compareSameDay(start, end);
}


/**
 * Moves a series of events by calculating time difference.
 *
 * @param events - Array of events to move
 * @param referenceEvent - The event that was dragged. Only events with the same series ID will be moved.
 * @param newStartDateTime - New start datetime string
 * @returns Updated events with new times
 */
export function moveEventSeries(
  events: Appointment[],
  referenceEvent: Appointment,
  newStartDateTime: Date,
  newEndDateTime: Date
): Appointment[] {
  const timeDiffStart = newStartDateTime.getTime() - referenceEvent.start.getTime();
  const timeDiffEnd = newEndDateTime.getTime() - referenceEvent.end.getTime();

  return events.map((e) => {
    if (e.series.id !== referenceEvent.series.id) return e;

    const newEventStart = new Date(e.start.getTime() + timeDiffStart);
    const newEventEnd = new Date(e.end.getTime() + timeDiffEnd);

    return {
      ...e,
      start: newEventStart,
      end: newEventEnd,
    };
  });
}


/**
 * Get event status.
 */
export function getEventStatus(_event: Appointment) {
  // TODO: implement, extract experiments? What was this EventStatus type thought for?
  return "" as EventStatus;
}
