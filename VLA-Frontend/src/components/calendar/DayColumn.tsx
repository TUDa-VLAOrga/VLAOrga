
import type { CalendarDay, CalendarEvent , EventStatus } from "./CalendarTypes";

type DayColumnProps = {
  day: CalendarDay;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
};

function getStatusClass(status?: EventStatus): string {
  if (!status) return "";
  return `cv-event-${status}`;
}

export default function DayColumn({ day, events, onEventClick }: DayColumnProps) {
  return (
    <div className="cv-dayColumn" data-date={day.iso}>
      {events.map((event) => (
        <div
          key={event.id}
          className={`cv-event cv-event-${event.kind} ${getStatusClass(
            event.status
          )}`}
          title={event.subtitle || event.title}
          onClick={() => onEventClick && onEventClick(event)}
        >
          <div className="cv-eventTitle">{event.title}</div>
          {event.subtitle && (
            <div className="cv-eventSubtitle">{event.subtitle}</div>
          )}
        </div>
      ))}
    </div>
  );
}
