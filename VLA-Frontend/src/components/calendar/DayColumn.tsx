import type { CalendarDay, CalendarEvent, EventStatus } from "./CalendarTypes";
import type { HTMLAttributes } from "react";
import Timeline from "./Timeline";

type DayColumnProps = {
  day: CalendarDay;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  getEventColor?: (event: CalendarEvent) => string | undefined;
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

  if (timed.length > 0) {
    return (
      <div className="cv-dayColumn" data-date={day.iso}>
        <div className="cv-dayColumn-inner">
          <div className="cv-dayTimeline">
            <Timeline
              events={timed}
              onEventClick={onEventClick}
              getEventColor={getEventColor}
            />
          </div>

          <div className="cv-dayMain">
            {untimed.map((event) => {
              const customColor = getEventColor?.(event);
              const eventProps = buildEventProps(event, customColor);

              return (
                <div key={event.id} {...eventProps}>
                  <div className="cv-eventTitle">{event.title}</div>
                  {event.shortTitle && (
                    <div className="cv-eventSubtitle">{event.shortTitle}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cv-dayColumn" data-date={day.iso}>
      {untimed.map((event) => {
        const customColor = getEventColor?.(event);
        const eventProps = buildEventProps(event, customColor);

        return (
          <div key={event.id} {...eventProps}>
            <div className="cv-eventTitle">{event.title}</div>
            {event.shortTitle && (
              <div className="cv-eventSubtitle">{event.shortTitle}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
