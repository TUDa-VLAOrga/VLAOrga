
import DayColumn from "./DayColumn";
import type { CalendarDay, CalendarEventsByDateISO } from "./CalendarTypes";

type Props = {
  days: CalendarDay[];
  eventsByDate: CalendarEventsByDateISO;
  onEventClick?: (eventId: number) => void;
};

/**
 * WeekGrid rendert die Spalten für die Woche.
 * Jede Spalte ist über day.iso eindeutig an einen Wochentag gekoppelt.
 */
export default function WeekGrid({ days, eventsByDate = {}, onEventClick }: Props) {
  return (
    <div className="cv-grid">
      {days.map((day) => (
        <DayColumn
          key={day.iso}
          day={day}
          events={eventsByDate[day.iso] || []}
          onEventClick={onEventClick}
        />
      ))}
    </div>
  );
}
