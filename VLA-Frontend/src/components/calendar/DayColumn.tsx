
import type { CalendarDay, CalendarEvent , EventStatus } from "./CalendarTypes";

type DayColumnProps = {
  day: CalendarDay;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  getEventColor?: (event: CalendarEvent) => string | undefined;
};

/**
 * DayColumn represents exactly one day in the calendar.
 * It receives the events for that day and renders them as clickable tiles.
 */

function getStatusClass(status?: EventStatus): string {
  if (!status) return "";
  return `cv-event-${status}`;
}
/**
 * DayColumn renders all events for a single day.
 * It is used inside the WeekGrid to build the calendar layout.
 */
export default function DayColumn({ day, events, onEventClick, getEventColor }: DayColumnProps) {
  return (
    <div className="cv-dayColumn" data-date={day.iso}>
      {events.map((event) => {
        const customColor = getEventColor?.(event);
        return (
        <div
          key={event.id}
          className={`cv-event cv-event-${event.kind} ${getStatusClass(
            event.status
          )}`}
          style={customColor ? { 
              backgroundColor: customColor,
              borderColor: customColor 
            } : undefined}
            title={event.subtitle || event.title}
            onClick={() => onEventClick && onEventClick(event)}
          >
          <div className="cv-eventTitle">{event.title}</div>
          {event.subtitle && (
            <div className="cv-eventSubtitle">{event.subtitle}</div>
          )}
        </div>
        );})}
    </div>
  );
}
