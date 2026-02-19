import { useState, useMemo } from "react";
import type { EventFormData, Weekday } from "../components/calendar/EventForm/EventForm";
import { addDays } from "../components/calendar/dateUtils";
import type {Appointment, AppointmentSeries} from "@/lib/databaseTypes";
import {getEventDateISO, moveEventSeries, verifyValidTimeRange} from "@/components/calendar/eventUtils.ts";
import {Logger} from "@/components/logger/Logger.ts";


/**
 * useEvents manages:
 * - the list of calendar events (local state for now)
 * - the currently selected event (for EventDetails modal)
 * - creation logic, including recurrence materialization
 * - a derived "eventsByDate" map for efficient rendering in the grid
 */

export function useEvents() {
  const [allEvents, setEvents] = useState<Appointment[]>([]);
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

  /**
   * Moves a single event in time. Detaches it from its series.
   */
  function handleMoveEvent(
    eventId: number,
    newStartDateTime: Date,
    newEndDateTime: Date
  ) {
    if (!verifyValidTimeRange(newStartDateTime, newEndDateTime)) {
      Logger.error("Invalid time range for event");
      return;
    }

    const oldEvent = allEvents.find(e => e.id === eventId);
    if (!oldEvent) {
      Logger.error("Event not found");
      return;
    }
    // create new appointment series when moving out of existing series
    let newSeries: AppointmentSeries | undefined;
    if (allEvents.filter(e => e.series.id === oldEvent.series.id).length > 1) {
      newSeries = {
        ...oldEvent.series,
        id: -Date.now(),  // negative ID signals a not-yet-created entity
      };
    }
    // TODO: Backend - POST request to /api/events/:eventId/move
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
            ...event,
            series: newSeries || event.series,
            start: newStartDateTime,
            end: newEndDateTime,
          }
          : event
      )
    );

    setSelectedEvent(null);
  }

  /**
   * Move all events in a series by a given offset.
   */
  function handleMoveSeries(
    eventId: number,
    newStartDateTime: Date,
    newEndDateTime: Date
  ) {
    const event= allEvents.find(e => e.id === eventId);
    if(!event?.series){
      Logger.error("Event not part of a series");
      return;
    }
    if (!verifyValidTimeRange(newStartDateTime, newEndDateTime)) {
      Logger.error("Invalid time range for event");
      return;
    }
    // Verschiebe alle Events der Serie
    setEvents((prev) => moveEventSeries(prev, event, newStartDateTime, newEndDateTime));
    setSelectedEvent(null);
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
        id: -Date.now(),
        lecture: formData.lecture,
        name: formData.title.trim(),
        category: formData.category,
      };
      newEvents.push({
        id: -Date.now() - 1,
        series: newAppSeries,
        start: formData.startDateTime,
        end: formData.endDateTime,
        notes: formData.notes || "",
      });
    }

    let dummyId = -Date.now() - 1; // negative ID signals a not-yet-created entity

    // create series of recurring events by looping day by day
    if (formData.recurrence && formData.recurrence.weekdays.length > 0 && formData.recurrence.endDay) {
      // create appointment series, one for each recurrence weekday
      const seriesByWeekday = new Map<Weekday, AppointmentSeries>;
      formData.recurrence.weekdays.forEach(
        (day) => {
          seriesByWeekday.set(day, {
            id: --dummyId,
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
            id: --dummyId,
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
    setSelectedEvent(null);
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
    handleUpdateEvent,
    handleMoveEvent,
    handleMoveSeries,
  };
}
