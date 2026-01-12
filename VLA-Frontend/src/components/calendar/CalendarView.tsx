import { useEffect, useMemo, useState } from "react";
import WeekHeader from "./WeekHeader";
import WeekGrid from "./WeekGrid";
import type { CalendarDay, CalendarEvent } from "./CalendarTypes";
import "../../styles/CalendarView.css";
import {WORKDAY_COUNT, addDays, addWorkdays, formatRangeShortDE, isWeekend, normalizeToWorkdayStart, toISODateLocal,} from "./dateUtils";
import GoToMenu from "./GoToButton";
import EventForm from "./EventForm";
import { type EventFormData } from "./EventForm";
import EventDetails from "./EventDetails";


 export default function CalendarView() {
  const [weekStart, setWeekStart] = useState<Date>(() => normalizeToWorkdayStart(new Date()));
  const [displayDays,setDisplayDays] = useState<number>(() => WORKDAY_COUNT);
  const [events, setEvents] = useState<CalendarEvent[]>([]); 
  const [showEventForm,setShowEventForm] = useState(false);
  const [selectedEvent,setSelectedEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    window.addEventListener("resize",updateDisplayDays);
    return () => window.removeEventListener("resize",updateDisplayDays);
  });

  //how many days can be displayed in the current window
  function updateDisplayDays() {
    setDisplayDays(Math.min(WORKDAY_COUNT,Math.floor((window.innerWidth-48)/160)));
  }
   
  const days: CalendarDay[] = useMemo(() => {
      const result: CalendarDay[] = [];
      let cursor = new Date(weekStart);
      updateDisplayDays();

      while (result.length < displayDays) {
        if (!isWeekend(cursor)) {
          result.push({ date: new Date(cursor), iso: toISODateLocal(cursor) });
        }
        cursor = addDays(cursor, 1);
      }
      return result;
    }, [weekStart,displayDays]);

  const rangeText = days.length >= 1 ? formatRangeShortDE(days[0].date, days[days.length-1].date) : "";

  /* not in use
  function prevWeek() {
    setWeekStart((d) => addWorkdays(d, -WORKDAY_COUNT));
  }

  function nextWeek() {
    setWeekStart((d) => addWorkdays(d, WORKDAY_COUNT));
  }
  */

  function prevDay() {
    setWeekStart((d) => addWorkdays(d, -1));
  }

  function nextDay() {
    setWeekStart((d) => addWorkdays(d, 1));
  }

  function handleCreateEvent(formData: EventFormData) {
    // TODO: Backend - POST request to /api/events to create new event(s)
    // Expected payload: formData
    // Expected response: created event(s) with server-generated IDs

    const startDate= formData.startDateTime.split("T")[0];
    const newEvents: CalendarEvent[] = [];
    const startTime= formData.startDateTime.split("T")[1];
    const endTime= formData.endDateTime.split("T")[1];
    if (formData.endDateTime <= formData.startDateTime) {
  // invalid range (covers same-day end before start and also end date before start date)
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
      });
    }
    // TODO: Backend - Replace this with API response data
    setEvents((prev) => [...prev, ...newEvents]);
    setShowEventForm(false);
  }
  function handleEventClick(event: CalendarEvent) {
    setSelectedEvent(event);
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


return (
    <div className="cv-root">
      <div className="cv-toolbar" aria-label="Zeitnavigation">
        <button
          className="cv-navBox"
          onClick={prevDay}
          aria-label="Vorherige 5 Arbeitstage"
          type="button"
        >
        </button>

         <div className="cv-range" aria-label="Datumsbereich">
          {rangeText}
        </div>

        <button
          className="cv-navBox"
          onClick={nextDay}
          aria-label="Nächste 5 Arbeitstage"
          type="button"
        >
        </button>

          <GoToMenu currentWeekStart={weekStart} onDateSelect={setWeekStart} />

    <button
          className="cv-createBtn"
          onClick={() => setShowEventForm(true)}
          aria-label="Neuen Termin erstellen"
          type="button"
        >
          + Termin
        </button>
      </div>

      <div className="cv-frame">
        <WeekHeader days={days} />
        <WeekGrid days={days}  eventsByDate={eventsByDate} onEventClick={handleEventClick}/>
      </div>
      {showEventForm && (
        <EventForm
          onSubmit={handleCreateEvent}
          onCancel={() => setShowEventForm(false)}
        />
      )}

      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}