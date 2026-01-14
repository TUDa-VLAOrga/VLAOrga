import { useState, useMemo } from "react";
import type { CalendarEvent, Lecture } from "../components/calendar/CalendarTypes";
import type { EventFormData } from "../components/calendar/EventForm";
import { addDays, toISODateLocal } from "../components/calendar/dateUtils";

export function useEvents(lectures: Lecture[]) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

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
      let currentDate = new Date(startDate);
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

    setEvents((prev) => [...prev, ...newEvents]);
  }

  function handleEventClick(event: CalendarEvent) {
    setSelectedEvent(event);
  }

  function closeEventDetails() {
    setSelectedEvent(null);
  }

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