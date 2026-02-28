

import type { CalendarDay } from "./CalendarTypes";
import { compareSameDay } from "./dateUtils";
import type {Appointment} from "@/lib/databaseTypes";
import {getEventStatus, getEventTitle} from "@/components/calendar/eventUtils.ts";


type DayColumnProps = {
  day: CalendarDay;
  events: Appointment[];
  onEventClick?: (event: Appointment) => void;
};

/**
 * DayColumn renders all events for a single day.
 * It is used inside the WeekGrid to build the calendar layout.
 */
export default function DayColumn({ day, events, onEventClick }: DayColumnProps) {
  const isToday = compareSameDay(day.date, new Date());
       
  return (
    <div
      id={isToday ? "todaysColumn" : undefined}
      className="cv-dayColumn"
      data-date={day.iso}
    >
      {events.map((event) => {
        // TODO: default color for events without associated lecture?
        const color = event.series.lecture?.color;
        const name = getEventTitle(event);

        const eventProps = {
          key: event.id,
          className: `cv-event cv-event-${event.series.category} cv-event-${getEventStatus(event)}`,
          style: color ? { backgroundColor: color, borderColor: color } : undefined,
          title: name,
          ...(onEventClick && { onClick: () => onEventClick(event) }),
        };

        return (
          <div {...eventProps}>
            <div className="cv-eventTitle">{name}</div>
          </div>
        );
      })} 
    </div>
  );
}
