import type { CalendarEvent } from "./CalendarTypes";

type Props = {
  events: CalendarEvent[];
  startHour?: number;
  endHour?: number;
  onEventClick?: (event: CalendarEvent) => void;
  getEventColor?: (event: CalendarEvent) => string | undefined;
};

/**
 * Timeline renders time-based events inside a single day column.
 * Events are positioned vertically based on their start/end time
 * and horizontally split when they overlap in time.
 */
export default function Timeline({
  events,
  startHour = 7,
  endHour = 22,
  onEventClick,
  getEventColor,
}: Props) {
  const minutesPerDay = (endHour - startHour) * 60;

  /**
   * Converts "HH:mm" into minutes since startHour
   */
  function timeToMinutes(time?: string): number {
    if (!time) return 0;
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m - startHour * 60;
  }

  /**
   * Prepare events with numeric start/end
   */
  const timed = events
    .filter((e) => e.displayedStartTime && e.displayedEndTime)
    .map((e) => ({
      event: e,
      start: timeToMinutes(e.displayedStartTime),
      end: timeToMinutes(e.displayedEndTime),
    }))
    .filter((e) => e.end > e.start);

  /**
   * Group overlapping events (simple O(n²), OK for calendar scale)
   */
  const groups: (typeof timed)[] = [];
  timed.forEach((item) => {
    let placed = false;

    for (const group of groups) {
      if (group.some((g) => item.start < g.end && g.start < item.end)) {
        group.push(item);
        placed = true;
        break;
      }
    }

    if (!placed) {
      groups.push([item]);
    }
  });

  return (
    <div className="cv-timeline">
      <div className="cv-timeline-grid">
        {Array.from({ length: endHour - startHour }).map((_, i) => (
          <div key={i} className="cv-timeline-hour" />
        ))}
      </div>

      <div className="cv-timeline-events">
        {groups.map((group) =>
          group.map((item, index) => {
            const { event, start, end } = item;
            const top = (start / minutesPerDay) * 100;
            const height = ((end - start) / minutesPerDay) * 100;
            const width = 100 / group.length;
            const left = index * width;
            const color = getEventColor?.(event);

            return (
              <div
                key={event.id}
                className="cv-timeline-event"
                style={{
                  top: `${top}%`,
                  height: `${height}%`,
                  left: `calc(${left}% + 4px)`,
                  width: `calc(${width}% - 6px)`,
                  backgroundColor: color ?? undefined,
                  borderColor: color ?? undefined,
                }}
                onClick={onEventClick ? () => onEventClick(event) : undefined}
              >
                <div className="cv-timeline-event-title">{event.title}</div>

                <div className="cv-timeline-event-time">
                  {event.displayedStartTime} – {event.displayedEndTime}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
