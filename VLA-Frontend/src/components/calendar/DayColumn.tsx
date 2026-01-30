

import type { CalendarDay, CalendarEvent , EventStatus, Lecture } from "./CalendarTypes";
import { compareSameDay } from "./dateUtils";


type DayColumnProps = {
  day: CalendarDay;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  getEventColor?: (event: CalendarEvent) => string | undefined;
  lectures? : Lecture[];
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
export default function DayColumn({ day, events, onEventClick, getEventColor , lectures =[]}: DayColumnProps) {
  const isToday = compareSameDay(day.date, new Date());
       
        return (
          <div
            id={isToday ? "todaysColumn" : undefined}
            className="cv-dayColumn"
            data-date={day.iso}
          >
            {events.map((event) => {
              const customColor = getEventColor?.(event);
              const lecture = event.lectureId ? 
              lectures.find(lec => lec.id === event.lectureId)
              : null;

              const eventProps = {
                key: event.id,
                className: `cv-event cv-event-${event.kind} ${getStatusClass(event.status)}`,
                style: customColor ? { backgroundColor: customColor, borderColor: customColor } : undefined,
                title: event.shortTitle || event.title,
                ...(onEventClick && { onClick: () => onEventClick(event) }),
              };

              return (
                <div {...eventProps}>
                  <div className="cv-eventTitle">{event.title}</div>
                  {lecture && (
                    <div className="cv-eventSubtitle">{lecture.name}</div>
                  )}
                  {!lecture && event.shortTitle && (
                    <div className="cv-eventSubtitle">{event.shortTitle}</div>
                  )}
                </div>
              );
            })} 
          </div>
        );
      }