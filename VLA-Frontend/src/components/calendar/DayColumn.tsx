import type { CalendarDay,} from "./CalendarTypes";
import Timeline from "./Timeline";
import type { Appointment } from "@/lib/databaseTypes";
import { getEventTitle } from "./eventUtils";
import { getEventStatus } from "./eventUtils";

type DayColumnProps = {
  day: CalendarDay;
  events: Appointment[];
  onEventClick?: (event: Appointment) => void;
  startHour?: number;
  endHour?: number;
  showAllDayRow?: boolean;
};


export default function DayColumn({
  day,
  events,
  onEventClick,
  startHour = 7,
  endHour = 22,
  showAllDayRow = true,
}: DayColumnProps) {
  const timed = events.filter(
    (e) => e.start && e.end
  );
  const untimed = events.filter(
    (e) => !(e.start && e.end)
  );


  return (
    <div className="cv-dayColumn" data-date={day.iso}>
      {/* Render all-day row ONLY if enabled AND this week has any untimed events */}
      {showAllDayRow && (
        <div className="cv-allDayRow" aria-label="Ganztägige Termine">
          {untimed.length === 0 ? (
            <div className="cv-allDayEmpty" />
          ) : (
            untimed.map((event) => {
            
              const color = event.series.lecture?.color;
              const name = getEventTitle(event);

              const eventProps = {
                key: event.id,
                className: `cv-event cv-event-${event.series.category} cv-event-${getEventStatus(event)}`,
                style: color
                  ? { backgroundColor: color, borderColor: color }
                  : undefined,
                title: name,
                ...(onEventClick && { onClick: () => onEventClick(event) }),
              };

              return (
                <div
                  {...eventProps}
                  className={`cv-allDayPill ${eventProps.className}`}
                >
                  <div className="cv-eventTitle">{name}</div>
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
          startHour={startHour}
          endHour={endHour}
        />
      </div>
    </div>
  );
}
