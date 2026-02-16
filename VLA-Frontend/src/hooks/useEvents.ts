import { useState, useMemo } from "react";
import type { EventFormData, Weekday } from "../components/calendar/EventForm/EventForm";
import { addDays } from "../components/calendar/dateUtils";
import type {Appointment, AppointmentSeries} from "@/lib/databaseTypes";
import {getEventDateISO, moveEventSeries, verifyValidTimeRange} from "@/components/calendar/eventUtils.ts";


/**
 * useEvents manages:
 * - the list of calendar events (local state for now)
 * - the currently selected event (for EventDetails modal)
 * - creation logic, including recurrence materialization
 * - a derived "eventsByDate" map for efficient rendering in the grid
 */

export function useEvents() {
  const [events, setEvents] = useState<Appointment[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null);

  function handleUpdateEvent(eventId: number, updates: Partial<Appointment>) {
    // TODO: Backend - PATCH request to /api/events/:eventId
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, ...updates } : event
      )
    );

    setSelectedEvent((prev) => {
      if (prev?.id === eventId) {
        return { ...prev, ...updates };
      }
      return prev;
    });
  }

  function handleMoveEvent(
    eventId: number,
    newStartDateTime: Date,
    newEndDateTime: Date
  ) {
    // TODO: Backend - POST request to /api/events/:eventId/move

    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
            ...event,
            start: newStartDateTime,
            end: newEndDateTime,
          }
          : event
      )
    );

    setSelectedEvent(null);
  }

  function handleMoveSeries(
    eventId: number,
    newStartDateTime: Date,
    _newEndDateTime: Date
  ) {
    const event= events.find(e => e.id === eventId);
    if(!event?.series){
      console.log("Event is not part of a series");
      return;
    }
    // Verschiebe alle Events der Serie
    setEvents((prev) => moveEventSeries(prev, event, newStartDateTime));
    setSelectedEvent(null);
  }

  //Creates one or many CalendarEvent objects from the EventForm submission
  function handleCreateEvent(formData: EventFormData) {
    // basic validation
    if (!(
      formData.title && formData.category
      && formData.startDateTime && formData.endDateTime
      && verifyValidTimeRange(formData.startDateTime, formData.endDateTime)
    )) {
      // TODO: notify user about invalid input?
      return;
    }

    const newEvents: Appointment[] = [];

    // create appointment series, even w/o recurrence we need it to conform with our data model
    const newAppSeries: AppointmentSeries = {
      id: -Date.now(),
      lecture: formData.lecture,
      name: formData.lecture ? "" : formData.title,
      category: formData.category,
    };
    // TODO: Backend - POST request to /api/appointmentSeries (maybe later below together with POST to /api/appointments

    // Always create the base event on the explicitly chosen start date.
    let dummyId = -Date.now(); // negative ID signals a not-yet-created entity
    newEvents.push({
      id: dummyId,
      series: newAppSeries,
      start: formData.startDateTime,
      end: formData.endDateTime,
      notes: formData.notes || "",
    });

    // create series by looping day by day
    if (formData.recurrence && formData.recurrence.weekdays.length > 0 && formData.recurrence.endDay) {

      const duration = formData.endDateTime.getTime() - formData.startDateTime.getTime();
      const endDate = new Date(formData.recurrence.endDay.date);
      endDate.setHours(23, 59, 59, 999);
      let currentDate = addDays(new Date(formData.startDateTime), 1);

      while (currentDate <= endDate) {
        const weekday = currentDate.getDay() as Weekday;
        if (formData.recurrence.weekdays.includes(weekday)) {
          newEvents.push({
            id: --dummyId,
            series: newAppSeries,
            start: currentDate,
            end: new Date(currentDate.getTime() + duration),
            notes: formData.notes || "",
          });
        }
        currentDate = addDays(currentDate, 1);
      }
    }
    // TODO: Backend - POST request to /api/appointments
    // Append newly created events to state
    setEvents((prev) => [...prev, ...newEvents]);
  }

  function handleEventClick(event: Appointment) {
    setSelectedEvent(event);
  }

  function closeEventDetails() {
    setSelectedEvent(null);
  }

  /**
   * Derived map for rendering:
   * dateISO -> list of events on that date.
   */
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, Appointment[]> = {};
    events.forEach((event) => {
      const eventDateISO = getEventDateISO(event);
      if (!grouped[eventDateISO]) {
        grouped[eventDateISO] = [];
      }
      grouped[eventDateISO].push(event);
    });
    return grouped;
  }, [events]);

  return {
    events,
    selectedEvent,
    eventsByDate,
    handleCreateEvent,
    handleEventClick,
    closeEventDetails,
    handleUpdateEvent,
    handleMoveEvent,
    handleMoveSeries,
  };
}
