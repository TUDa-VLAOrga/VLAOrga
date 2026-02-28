import type { CalendarDay } from "./CalendarTypes";
import Timeline from "./Timeline";
import type { Appointment } from "@/lib/databaseTypes";
import { getEventTitle, getEventStatus } from "./eventUtils";

type DayColumnProps = {
  day: CalendarDay;
  events: Appointment[];
  onEventClick?: (event: Appointment) => void;
  startHour?: number;
  endHour?: number;
  showAllDayRow?: boolean;
};

/**
 * DayColumn renders one day:
 * - Optional "all-day" row at top
 * - Timeline below showing events inside visible working hours
 */
export default function DayColumn({
  day,
  events,
  onEventClick,
  startHour = 7,
  endHour = 22,
  showAllDayRow = true,
}: DayColumnProps) {
  /** 
   * Define visible working-hour window (07:00–22:00).
   * Events are now filtered against this range before
   * being passed to Timeline.
   */
  const windowStartMin = startHour * 60;
  const windowEndMin = endHour * 60;

  /** 
   * Events are split into:
   * - timed   → rendered inside Timeline
   * - untimed → rendered in All-Day row
   *
   * Previously all events went directly into Timeline,
   * which caused overflow and layout issues.
   */
  const timed: Appointment[] = [];
  const untimed: Appointment[] = [];

  /**
   * 
   * Classify events depending on whether they intersect
   * the visible timeline window.
   */
  for (const e of events) {
    // Missing start/end → treat as all-day event
    if (!e.start || !e.end) {
      untimed.push(e);
      continue;
    }

    const startMin = e.start.getHours() * 60 + e.start.getMinutes();
    const endMin = e.end.getHours() * 60 + e.end.getMinutes();

    /** 
     * Prevent invalid time ranges from breaking
     * timeline positioning logic.
     */
    if (!(endMin > startMin)) {
      untimed.push(e);
      continue;
    }

    /**
     * 
     * Check if event overlaps the visible working window.
     * Example:
     *   Window 07–22
     *   Event 06–08 → still visible
     */
    const intersectsWindow = startMin < windowEndMin && endMin > windowStartMin;

    /**
     * 
     * Move events to All-Day row when:
     *  - completely outside working hours OR
     *  - spanning the entire visible window
     *
     * This prevents oversized/clipped timeline events
     */
    if (
      !intersectsWindow ||
      (startMin < windowStartMin && endMin > windowEndMin)
    ) {
      untimed.push(e);
    } else {
      timed.push(e);
    }
  }

  return (
    <div className="cv-dayColumn" data-date={day.iso}>
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
                className: `cv-event cv-event-${event.series.category} cv-event-${getEventStatus(
                  event
                )}`,
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

      {/*
          Timeline now receives ONLY events that intersect
          the visible hour range.
          Timeline handles positioning,
          DayColumn handles filtering.
      */}
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
