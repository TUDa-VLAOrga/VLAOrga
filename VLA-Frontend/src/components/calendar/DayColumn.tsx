import type {CalendarDay, CalendarEvent} from "./CalendarTypes";
import Timeline from "./Timeline";
import {getEventColor, getEventTitle} from "./eventUtils";

type DayColumnProps = {
  day: CalendarDay;
  eventsAllDay: CalendarEvent[];
  eventsTimed: CalendarEvent[];
  /** all events from all days, needed for referencing experiments of future days */
  allEvents: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  startHour: number;
  endHour: number;
  showAllDayRow?: boolean;
};

/**
 * DayColumn renders one day:
 * - Optional "all-day" row at top
 * - Timeline below showing events inside visible working hours
 */
export default function DayColumn({
  day,
  eventsAllDay,
  eventsTimed,
  allEvents,
  onEventClick,
  startHour,
  endHour,
  showAllDayRow = true,
}: DayColumnProps) {

  return (
    <div className="cv-dayColumn" data-date={day.iso}>
      {showAllDayRow && (
        <div className="cv-allDayRow" aria-label="Ganztägige Termine">
          {eventsAllDay.length === 0 ? (
            <div className="cv-allDayEmpty" />
          ) : (
            eventsAllDay.map((event) => {
              const color = getEventColor(event, allEvents);
              const name = getEventTitle(event, allEvents);

              const eventProps = {
                className: `cv-event`,
                style: color
                  ? { backgroundColor: color, borderColor: color }
                  : undefined,
                title: name,
                ...(onEventClick && { onClick: () => onEventClick(event) }),
              };

              return (
                <div
                  key={event.id} {...eventProps}
                  className={`cv-allDayPill ${eventProps.className}`}
                >
                  <div className="cv-eventTitle">{name}</div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/*
          Timeline now receives ONLY events that intersect
          the visible hour range.
          Timeline handles positioning,
          DayColumn handles filtering.
      */}
      <div className="cv-dayTimeline">
        <Timeline
          events={eventsTimed}
          allEvents={allEvents}
          onEventClick={onEventClick}
          startHour={startHour}
          endHour={endHour}
        />
      </div>
    </div>
  );
}
