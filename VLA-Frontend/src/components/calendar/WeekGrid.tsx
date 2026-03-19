import type React from "react";
import { useLayoutEffect, useRef, useState } from "react";
import DayColumn from "./DayColumn";
import type {CalendarDay, CalendarEvent, CalendarEventsByDateISO} from "./CalendarTypes";
import TimeColumn from "./TimeColumn";
import { isUntimedForView } from "./eventUtils";

type WeekGridProps = {
  days: CalendarDay[];
  eventsByDate: CalendarEventsByDateISO;
  allEvents: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  startHour: number;
  endHour: number;
};

// default height for the all-day row in pixels
const DEFAULT_ALL_DAY_HEIGHT = 56;

/**
 * WeekGrid renders the week layout:
 * - left rail: TimeColumn
 * - right: DayColumn for each day
 * If there are untimed/all-day events, we render an all-day row
 * above the timeline. If not, timeline starts directly at startHour.
 * "Untimed" here includes:
 *  - missing start/end
 *  - invalid time range
 *  - events outside the visible hour window
 *  - events spanning the whole visible window
 */
export default function WeekGrid({
  days,
  eventsByDate = {},
  allEvents,
  onEventClick,
  startHour,
  endHour,
}: WeekGridProps) {
  const hourCount = Math.max(0, endHour - startHour);

  const windowStartMin = startHour * 60;
  const windowEndMin = endHour * 60;

  const showAllDayRow = days.some((day) =>
    (eventsByDate[day.iso] || []).some((event) => isUntimedForView(event, windowStartMin, windowEndMin))
  );

  /**
   * Make all all-day rows the same height (max across the week)
   * so separators & borders align perfectly between columns.
   */
  const rootRef = useRef<HTMLDivElement>(null);
  const [allDayHeight, setAllDayHeight] = useState(DEFAULT_ALL_DAY_HEIGHT);

  useLayoutEffect(() => {
    if (!showAllDayRow) {
      // fallback height when row is not used
      setAllDayHeight(DEFAULT_ALL_DAY_HEIGHT);
      return;
    }
    if (!rootRef.current) return;

    const el = rootRef.current;

    const compute = () => {
      const rows = Array.from(
        el.querySelectorAll<HTMLElement>(".cv-allDayRow")
      );

      const max = rows.reduce((acc, r) => Math.max(acc, r.scrollHeight), 0);

      // if nothing found, keep fallback
      setAllDayHeight(max > 0 ? max : DEFAULT_ALL_DAY_HEIGHT);
    };

    compute();

    const ro = new ResizeObserver(() => compute());

    // Observe the whole grid container
    ro.observe(el);

    // Observe each all-day row (content changes / wrapping)
    const rows = Array.from(el.querySelectorAll<HTMLElement>(".cv-allDayRow"));
    rows.forEach((r) => ro.observe(r));

    return () => ro.disconnect();
  }, [days, eventsByDate, showAllDayRow, startHour, endHour]);

  const styleVars: React.CSSProperties & {
    "--cv-hour-count": number;
    "--cv-start-hour": number;
    "--cv-end-hour": number;
    "--cv-all-day-height": string;
  } = {
    "--cv-hour-count": hourCount,
    "--cv-start-hour": startHour,
    "--cv-end-hour": endHour,
    "--cv-all-day-height": `${allDayHeight}px`,
  };

  return (
    <div ref={rootRef} className="cv-gridWithTime" style={styleVars}>
      <div className="cv-leftRail" aria-hidden="true">
        {showAllDayRow && <div className="cv-allDaySpacer" />}
        <TimeColumn startHour={startHour} endHour={endHour} />
      </div>

      <div className="cv-grid">
        {days.map((day) => (
          <DayColumn
            key={day.iso}
            day={day}

            eventsAllDay={(eventsByDate[day.iso] || []).filter((e) =>
              isUntimedForView(e, windowStartMin, windowEndMin)
            )}

            eventsTimed={(eventsByDate[day.iso] || []).filter((e) =>
              !isUntimedForView(e, windowStartMin, windowEndMin)
            )}
            
            allEvents={allEvents}
            onEventClick={onEventClick}
            startHour={startHour}
            endHour={endHour}
            showAllDayRow={showAllDayRow}
          />
        ))}
      </div>
    </div>
  );
}
