import { useState, useMemo } from "react";
import type { CalendarEvent, Lecture } from "../components/calendar/CalendarTypes";
import type { EventFormData } from "../components/calendar/EventForm/EventForm";
import { addDays, toISODateLocal } from "../components/calendar/dateUtils";

/**
 * useEvents manages:
 * - the list of calendar events (local state for now)
 * - the currently selected event (for EventDetails modal)
 * - creation logic, including recurrence materialization
 * - a derived "eventsByDate" map for efficient rendering in the grid
 * - color lookup based on lecture assignment
 */

export function useEvents(lectures: Lecture[]) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    //Creates one or many CalendarEvent objects from the EventForm submission
  function handleCreateEvent(formData: EventFormData) {
    // TODO: Backend - POST request to /api/events
    const startDate = formData.startDateTime.split("T")[0];
    const newEvents: CalendarEvent[] = [];
    const startTime = formData.startDateTime.split("T")[1];
    const endTime = formData.endDateTime.split("T")[1];

    if (formData.endDateTime <= formData.startDateTime) {
      return;
    }

    if (formData.recurrence) {
        // Always create the base event on the explicitly chosen start date.
        newEvents.push({
        id: `event-${Date.now()}-0`,
        title: formData.title,
        dateISO: startDate,
        calendarId: "user-events",
        kind: formData.category,
        status: formData.status,
        subtitle: formData.people.join(", "),
        startTime: startTime,
        endTime: endTime,
        lectureId: formData.lectureId,
      });

      let currentDate = addDays(new Date(startDate), 1);
      const endDate = new Date(formData.recurrence.endDate);

      while (currentDate <= endDate) {
        const weekday = currentDate.getDay();
        if (formData.recurrence.weekdays.includes(weekday)) {
          newEvents.push({
            id: `event-${Date.now()}-${newEvents.length}`,
            title: formData.title,
            dateISO: toISODateLocal(currentDate),
            calendarId: "user-events",
            kind: formData.category,
            status: formData.status,
            subtitle: formData.people.join(", "),
            startTime: startTime,
            endTime: endTime,
            lectureId: formData.lectureId,
          });
        }
        currentDate = addDays(currentDate, 1);
      }
    } else {
      newEvents.push({
        id: `event-${Date.now()}`,
        title: formData.title,
        dateISO: startDate,
        calendarId: "user-events",
        kind: formData.category,
        status: formData.status,
        subtitle: formData.people.join(", "),
        startTime: startTime,
        endTime: endTime,
        lectureId: formData.lectureId,
      });
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
  };
}