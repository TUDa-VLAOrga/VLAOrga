import type {Acceptance, Appointment} from "@/lib/databaseTypes";
import {compareSameDay, NON_WORKDAYS, toISODateLocal} from "@/components/calendar/dateUtils.ts";
import type {CalendarEvent, EventStatus} from "@/components/calendar/CalendarTypes.ts";

/** Default event duration in minutes. */
export const DEFAULT_DURATION_MIN = 100;
/** Default duration of an acceptance event in minutes. */
export const DEFAULT_ACCEPTANCE_DURATION_MIN = 30;

/**
 * Returns a readable title for an event.
 *
 * This is factored out here since the title may be set at the event series already, otherwise the lecture name.
 * In case both are present, the lecture name is appended in parentheses.
 */
export function getEventTitle(event: CalendarEvent, allEvents?: CalendarEvent[]) {
  let title = "";
  if (isCalendarEventAcceptance(event)) {
    title += "Abnahme: ";
  }
  const appointment = allEvents
    ? retrieveAppointment(event, allEvents)
    : isCalendarEventAcceptance(event)
      ? event.appointment
      : event;
  if (!appointment.series.lecture)
    title += appointment.series.name;
  else if (!appointment.series.name)
    title += appointment.series.lecture.name;
  else
    title += `${appointment.series.name} (${appointment.series.lecture.name})`;
  return title;
}

/**
 * Returns the ISO date of an event.
 * This assumes the end date is the same day as the start date.
 */
export function getEventDateISO(event: CalendarEvent) {
  return toISODateLocal(event.startTime);
}

/**
 * Verifies that given start and end are valid for an event, i.e., on the same day and nothing is undefined.
 */
export function verifyValidTimeRange(start?: Date, end?: Date): [boolean, string] {
  let validRange;
  let helpString;
  if (! (start && end)) {
    validRange = false;
    helpString = "Start und Ende sind erforderlich.";
  } else if (start >= end) {
    validRange = false;
    helpString = "Start muss vor Ende liegen.";
  } else if (!compareSameDay(start, end)) {
    validRange = false;
    helpString = "Start und Ende muss am selben Tag liegen.";
  } else if (NON_WORKDAYS.includes(start.getDay())) {
    validRange = false;
    helpString = "Termin muss an einem Werktag liegen.";
  } else {
    validRange = true;
    helpString = "";
  }
  return [validRange, helpString];
}


/**
 * Moves a series of events by calculating time difference.
 *
 * @param events - Array of events to move
 * @param referenceEvent - The event that was dragged. Only events with the same series ID will be moved.
 * @param newStartDateTime - New start datetime
 * @param newEndDateTime - New end datetime
 * @returns Updated events with new times, events without changes are not returned!
 */
export function moveEventSeries(
  events: Appointment[],
  referenceEvent: Appointment,
  newStartDateTime: Date,
  newEndDateTime: Date
): Appointment[] {
  const timeDiffStart = newStartDateTime.getTime() - referenceEvent.startTime.getTime();
  const timeDiffEnd = newEndDateTime.getTime() - referenceEvent.endTime.getTime();

  return events
    .filter((e) => e.series.id === referenceEvent.series.id)
    .map((e): Appointment => {
      const newEventStart = new Date(e.startTime.getTime() + timeDiffStart);
      const newEventEnd = new Date(e.endTime.getTime() + timeDiffEnd);

      return {
        ...e,
        startTime: newEventStart,
        endTime: newEventEnd,
      };
    });
}

/**
 * Determine whether the event is part of a series with more than one event.
 */
export function checkPartOfSeries(event: CalendarEvent, allEvents: CalendarEvent[]) {
  const seriesId = isCalendarEventAcceptance(event) ? event.appointment.series.id: event.series.id;
  return allEvents.filter(e => "series" in e && e.series.id === seriesId).length > 1;
}


/**
 * Get event status.
 */
export function getEventStatus(_event: Appointment) {
  // TODO: implement, extract experiments? probably with a @OneToMany attribute
  //  appointment.bookedExperiments in the backend
  return "" as EventStatus;
}

/**
 * Get color to display the event with in frontend.
 */
export function getEventColor(event: CalendarEvent, allEvents: CalendarEvent[]): string {
  const appointment = retrieveAppointment(event, allEvents);
  if (appointment.series.lecture) {
    return appointment.series.lecture.color;
  } else {
    return "";
  }
}

// Utility functions needed for dealing with the union of Acceptance and Appointment (=CalendarEvent)
// They agree in that they both have a startTime and endTime, but the Acceptance has an assocuated appointment,
// the Appointments have notes, series and bookings.
// In most cases, we just want to transfer the properties of the associated Appointment to the Acceptance.

/**
 * Determine whether a calendar event is an acceptance.
 */
export function isCalendarEventAcceptance(event: CalendarEvent): event is Acceptance {
  return "appointment" in event;
}

/**
 * Get the associated appointment for an acceptance.
 * If input is already an appointment, return itself.
 */
export function retrieveAppointment(event: CalendarEvent, allEvents: CalendarEvent[]): Appointment {
  if (isCalendarEventAcceptance(event))
    return allEvents.find((
      ev) => !isCalendarEventAcceptance(ev) && ev.id == event.appointment.id
    ) as Appointment ?? event.appointment;
  else
    return event;
}

