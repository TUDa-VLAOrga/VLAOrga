import { useState, useMemo } from "react";
import type { CalendarEvent, Lecture } from "../components/calendar/CalendarTypes";
import type { EventFormData, Weekday } from "../components/calendar/EventForm/EventForm";
import { addDays, toISODateLocal, splitDateTime } from "../components/calendar/dateUtils";
import type { Person } from "../components/calendar/CalendarTypes";

/**
 * useEvents manages:
 * - the list of calendar events (local state for now)
 * - the currently selected event (for EventDetails modal)
 * - creation logic, including recurrence materialization
 * - a derived "eventsByDate" map for efficient rendering in the grid
 * - color lookup based on lecture assignment
 */

export function useEvents(lectures: Lecture[] , people: Person[] ) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const MAX_RECURRENCE_DAYS = 365; // Limit recurrence expansion to 1 year

  

  //Creates one or many CalendarEvent objects from the EventForm submission
  function handleCreateEvent(formData: EventFormData) {
    // TODO: Backend - POST request to /api/events
    const { date: startDate, time: startTime } = splitDateTime(formData.startDateTime);
    const { time: endTime } = splitDateTime(formData.endDateTime);

    if (formData.endDateTime <= formData.startDateTime) {
      return;
    }
    const eventPeople: Person[] = Array.isArray(formData.people)
      ? formData.people
        .map(id=> people.find(p => p.id === id))
        .filter((p): p is Person => p !== undefined) 
      :[];
      
    const newEvents: CalendarEvent[] = [];

    
    // Always create the base event on the explicitly chosen start date.
    newEvents.push({
      id: `event-${Date.now()}-0`,
      title: formData.title,
      dateISO: startDate,
      calendarId: "user-events",
      kind: formData.category,
      status: formData.status,
      shortTitle: "",
      people: eventPeople,
      displayedStartTime: startTime,
      displayedEndTime: endTime,
      lectureId: formData.lectureId,
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
            people: eventPeople,
            displayedStartTime: startTime,
            displayedEndTime: endTime,
            lectureId: formData.lectureId,
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
  };
}
