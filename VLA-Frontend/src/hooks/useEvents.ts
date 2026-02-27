import { useState, useMemo } from "react";
import type { EventFormData, Weekday } from "../components/calendar/EventForm/EventCreationForm.tsx";
import { addDays } from "../components/calendar/dateUtils";
import type {Appointment, AppointmentSeries} from "@/lib/databaseTypes";
import {
  checkPartOfSeries,
  getEventDateISO,
  moveEventSeries,
  verifyValidTimeRange
} from "@/components/calendar/eventUtils.ts";
import {Logger} from "@/components/logger/Logger.ts";
import {getNotSynchronisedId} from "@/lib/utils.ts";


/**
 * useEvents manages:
 * - the list of calendar events (local state for now)
 * - the currently selected event (for EventDetails modal)
 * - creation logic, including recurrence materialization
 * - a derived "eventsByDate" map for efficient rendering in the grid
 */

export function useEvents() {
  const [allEvents, setEvents] = useState<Appointment[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Appointment>();

  function handleUpdateEventNotes(eventId: number, notes: string) {
    // TODO: Backend request
    setEvents((prev) =>
      prev.map(event => event.id === eventId ? {...event, notes} : event)
    );
    setSelectedEvent(prev => prev?.id === eventId ? {...prev, notes} : prev);
  }

  /**
   * Updates an event, maybe also its series. If not, a new series for this single event is created.
   *
   * @param eventId ID of the event to update
   * @param updates updates to apply to the event.
   * @param editSeries Whether to update the whole series or just this event.
   */
  function handleUpdateEvent(eventId: number, updates: Partial<Appointment>, editSeries: boolean) {
    if (updates.start && updates.end && !verifyValidTimeRange(updates.start, updates.end)) {
      Logger.error("Invalid time range for event");
      return;
    }
    const oldEvent = allEvents.find(e => e.id === eventId);
    if (!oldEvent) {
      Logger.error("Event not found");
      return;
    }
    // case 1: only this event should be updated
    if (!editSeries || !checkPartOfSeries(oldEvent, allEvents)) {
      let newSeries: AppointmentSeries | undefined;
      // create new series for event, if not already alone in a series
      if (checkPartOfSeries(oldEvent, allEvents)) {
        newSeries = {
          ...oldEvent.series,
          ...updates.series,
          id: getNotSynchronisedId(),
        };
        // TODO: backend request to create new series
      }
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? {
              ...event,
              ...updates,
              series: newSeries || event.series,
            }
            : event
        )
      );
      // TODO: backend request to update event
    } else if (checkPartOfSeries(oldEvent, allEvents)) {  // case 2: the whole series should be updated as well
      const newSeries = {
        ...oldEvent.series,
        ...updates.series,
      };
      // TODO: backend request to update series
      let movedEvents: Appointment[] = allEvents;
      if (updates.start && updates.end) {
        // calculate new start and end for every event, if changed
        movedEvents = moveEventSeries(allEvents, oldEvent, updates.start, updates.end);
      }
      // set events to moved ones with updated series
      setEvents(movedEvents.map(event =>
        event.series.id === oldEvent.series.id ? {...event, series: newSeries} : event)
      );
      // TODO: backend request to update events
    }
    setSelectedEvent(allEvents.find(e => e.id === eventId));
  }

  //Creates one or many CalendarEvent objects from the EventForm submission
  function handleCreateEvent(formData: EventFormData) {
    // basic validation
    if (!(
      (formData.title || formData.lecture) && formData.category
      && formData.startDateTime && formData.endDateTime
      && verifyValidTimeRange(formData.startDateTime, formData.endDateTime)
    )) {
      // TODO: notify user about invalid input?
      return;
    }

    const newEvents: Appointment[] = [];

    // even w/o recurrence we need one series to conform with our data model.
    // Also, create a single series if initial event date is not on one recurring day.
    if (!formData.recurrence || !formData.recurrence.weekdays.includes(formData.startDateTime.getDay() as Weekday)) {
      const newAppSeries: AppointmentSeries = {
        id: getNotSynchronisedId(),
        lecture: formData.lecture,
        name: formData.title.trim(),
        category: formData.category,
      };
      newEvents.push({
        id: getNotSynchronisedId(),
        series: newAppSeries,
        start: formData.startDateTime,
        end: formData.endDateTime,
        notes: formData.notes || "",
      });
    }

    // create series of recurring events by looping day by day
    if (formData.recurrence && formData.recurrence.weekdays.length > 0 && formData.recurrence.endDay) {
      // create appointment series, one for each recurrence weekday
      const seriesByWeekday = new Map<Weekday, AppointmentSeries>;
      formData.recurrence.weekdays.forEach(
        (day) => {
          seriesByWeekday.set(day, {
            id: getNotSynchronisedId(),
            lecture: formData.lecture,
            name: formData.title.trim(),
            category: formData.category!,
          });
        }
      );

      const duration = formData.endDateTime.getTime() - formData.startDateTime.getTime();
      const endDate = new Date(formData.recurrence.endDay.date);
      endDate.setHours(23, 59, 59, 999);
      let currentDate = new Date(formData.startDateTime);

      while (currentDate <= endDate) {
        const weekday = currentDate.getDay() as Weekday;
        if (formData.recurrence.weekdays.includes(weekday)) {
          newEvents.push({
            id: getNotSynchronisedId(),
            series: seriesByWeekday.get(weekday)!,
            start: currentDate,
            end: new Date(currentDate.getTime() + duration),
            notes: formData.notes || "",
          });
        }
        currentDate = addDays(currentDate, 1);
      }
    }
    // TODO: Backend - POST request to /api/appointmentSeries
    // TODO: Backend - POST request to /api/appointments
    // Append newly created events to state
    setEvents((prev) => [...prev, ...newEvents]);
  }

  function handleEventClick(event: Appointment) {
    setSelectedEvent(event);
  }

  function closeEventDetails() {
    setSelectedEvent(undefined);
  }

  /**
   * Derived map for rendering:
   * dateISO -> list of events on that date.
   */
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, Appointment[]> = {};
    allEvents.forEach((event) => {
      const eventDateISO = getEventDateISO(event);
      if (!grouped[eventDateISO]) {
        grouped[eventDateISO] = [];
      }
      grouped[eventDateISO].push(event);
    });
    return grouped;
  }, [allEvents]);

  return {
    allEvents,
    selectedEvent,
    eventsByDate,
    handleCreateEvent,
    handleEventClick,
    closeEventDetails,
    handleUpdateEventNotes,
    handleUpdateEvent,
  };
}
