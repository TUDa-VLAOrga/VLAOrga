import type { CalendarDay, CalendarEvent, EventStatus } from "./CalendarTypes";
import type { HTMLAttributes } from "react";
import Timeline from "./Timeline";

type DayColumnProps = {
  day: CalendarDay;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  getEventColor?: (event: CalendarEvent) => string | undefined;
  startHour?: number;
  endHour?: number;
  showAllDayRow?: boolean;
};

function getStatusClass(status?: EventStatus): string {
  if (!status) return "";
  return `cv-event-${status}`;
}

export default function DayColumn({
  day,
  events,
  onEventClick,
  getEventColor,
  startHour = 7,
  endHour = 22,
  showAllDayRow = true,
}: DayColumnProps) {
  const timed = events.filter(
    (e) => e.displayedStartTime && e.displayedEndTime
  );
  const untimed = events.filter(
    (e) => !(e.displayedStartTime && e.displayedEndTime)
  );

  const buildEventProps = (
    event: CalendarEvent,
    customColor?: string
  ): HTMLAttributes<HTMLDivElement> & { title?: string } => ({
    className: `cv-event cv-event-${event.kind} ${getStatusClass(event.status)}`,
    style: customColor
      ? { backgroundColor: customColor, borderColor: customColor }
      : undefined,
    title: event.shortTitle || event.title,
    ...(onEventClick ? { onClick: () => onEventClick(event) } : {}),
  });

  return (
    <div className="cv-dayColumn" data-date={day.iso}>
      {/* Render all-day row ONLY if enabled AND this week has any untimed events */}
      {showAllDayRow && (
        <div className="cv-allDayRow" aria-label="Ganztägige Termine">
          {untimed.length === 0 ? (
            <div className="cv-allDayEmpty" />
          ) : (
            untimed.map((event) => {
              const customColor = getEventColor?.(event);
              const eventProps = buildEventProps(event, customColor);

              return (
                <div
                  key={event.id}
                  {...eventProps}
                  className={`cv-allDayPill ${eventProps.className}`}
                >
                  <div className="cv-eventTitle">{event.title}</div>
                </div>
              );
            })
          )}
        </div>
      )}

      <div className="cv-dayTimeline">
        <Timeline
          events={timed}
          onEventClick={onEventClick}
          getEventColor={getEventColor}
          startHour={startHour}
          endHour={endHour}
        />
      </div>
    </div>
  );
}
