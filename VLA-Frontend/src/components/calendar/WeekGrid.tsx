
import DayColumn from "./DayColumn";
import TimeColumn from "./TimeColumn";
import type { CalendarDay, CalendarEvent, CalendarEventsByDateISO } from "./CalendarTypes";

type Props = {
  days: CalendarDay[];
  eventsByDate: CalendarEventsByDateISO;
  onEventClick?: (event: CalendarEvent) => void;
  getEventColor?: (event: CalendarEvent) => string | undefined;
};

/**
 * WeekGrid rendert die Spalten für die Woche.
 * Jede Spalte ist über day.iso eindeutig an einen Wochentag gekoppelt.
 */
export default function WeekGrid({ days, eventsByDate = {}, onEventClick, getEventColor }: Props) {
  return (
    <div className="cv-gridWithTime">
      <TimeColumn />
      <div className="cv-grid">
        {days.map((day) => (
          <DayColumn key={day.iso} day={day} events={eventsByDate[day.iso] || []} onEventClick={onEventClick} 
            getEventColor={getEventColor} />
        ))}
      </div>
    </div>
  );
}
