import { useState, useMemo } from "react";
import type { CalendarEvent, Lecture } from "../components/calendar/CalendarTypes";
import type { EventFormData, Weekday } from "../components/calendar/EventForm/EventForm";
import { addDays, toISODateLocal, splitDateTime, moveEventSeries } from "../components/calendar/dateUtils";


/**
 * useEvents manages:
 * - the list of calendar events (local state for now)
 * - the currently selected event (for EventDetails modal)
 * - creation logic, including recurrence materialization
 * - a derived "eventsByDate" map for efficient rendering in the grid
 * - color lookup based on lecture assignment
 */

export function useEvents(lectures: Lecture[]  ) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const MAX_RECURRENCE_DAYS = 365; // Limit recurrence expansion to 1 year

  function handleUpdateEvent(eventId: string, updates: Partial<CalendarEvent>) {
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
    eventId: string,
    newStartDateTime: string,
    newEndDateTime: string
  ) {
    // TODO: Backend - POST request to /api/events/:eventId/move
    const [newDateISO, newStartTime] = newStartDateTime.split("T");
    const [_, newEndTime] = newEndDateTime.split("T");

    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
            ...event,
            dateISO: newDateISO,
            displayedStartTime: newStartTime,
            displayedEndTime: newEndTime,
          }
          : event
      )
    );

    setSelectedEvent(null);
  }

  function handleMoveSeries(
    eventId: string,
    newStartDateTime: string,
    _newEndDateTime: string
  ) {
    const event= events.find(e => e.id === eventId);
    if(!event?.recurrenceId){
      console.log("Event is not part of a series");
      return;
    }
    // Verschiebe alle Events der Serie
    setEvents((prev) => moveEventSeries(prev, event, newStartDateTime));
    setSelectedEvent(null);
  }

  //Creates one or many CalendarEvent objects from the EventForm submission
  function handleCreateEvent(formData: EventFormData) {
    // TODO: Backend - POST request to /api/events
    const { date: startDate, time: startTime } = splitDateTime(formData.startDateTime);
    const { time: endTime } = splitDateTime(formData.endDateTime);

    if (formData.endDateTime <= formData.startDateTime) {
      return;
    }

    const newEvents: CalendarEvent[] = [];

    const recurrenceId = formData.recurrence && formData.recurrence.weekdays.length > 0
      ? `recurrence-${Date.now()}`
      : undefined;

    // Always create the base event on the explicitly chosen start date.
    newEvents.push({
      id: `event-${Date.now()}-0`,
      title: formData.title,
      dateISO: startDate,
      calendarId: "user-events",
      kind: formData.category,
      status: formData.status,
      shortTitle: "",
      displayedStartTime: startTime,
      displayedEndTime: endTime,
      lectureId: formData.lectureId,
      notes: formData.notes,
      recurrenceId: recurrenceId,
    });

    if (formData.recurrence && formData.recurrence.weekdays.length > 0) {
      const startDateObj = new Date(startDate);
      const maxEndDate = addDays(startDateObj, MAX_RECURRENCE_DAYS);
      const recurrenceEndDate = new Date(formData.recurrence.endDate);
      const endDate =
        recurrenceEndDate > maxEndDate ? maxEndDate : recurrenceEndDate;

      let currentDate = addDays(new Date(startDate), 1);

      while (currentDate <= endDate) {
        const weekday = currentDate.getDay() as Weekday;
        if (formData.recurrence.weekdays.includes(weekday)) {
          newEvents.push({
            id: `event-${Date.now()}-${newEvents.length}`,
            title: formData.title,
            dateISO: toISODateLocal(currentDate),
            calendarId: "user-events",
            kind: formData.category,
            status: formData.status,
            shortTitle: "",
            displayedStartTime: startTime,
            displayedEndTime: endTime,
            lectureId: formData.lectureId,
            notes: formData.notes,
            recurrenceId: recurrenceId,
          });
        }
        currentDate = addDays(currentDate, 1);
      }
    } 
    // Append newly created events to state
    setEvents((prev) => [...prev, ...newEvents]);
  }

  function handleEventClick(event: CalendarEvent) {
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
    const grouped: Record<string, CalendarEvent[]> = {};
    events.forEach((event) => {
      if (!grouped[event.dateISO]) {
        grouped[event.dateISO] = [];
      }
      grouped[event.dateISO].push(event);
    });
    return grouped;
  }, [events]);

  /**
   * Returns the color for an event based on its lecture assignment (if any).
   */
  const getEventColor = (event: CalendarEvent): string | undefined => {
    if (!event.lectureId) return undefined;
    return lectures.find((lec) => lec.id === event.lectureId)?.color;
  };

  return {
    events,
    selectedEvent,
    eventsByDate,
    handleCreateEvent,
    handleEventClick,
    closeEventDetails,
    getEventColor,
    handleUpdateEvent,
    handleMoveEvent,
    handleMoveSeries,
  };
}
