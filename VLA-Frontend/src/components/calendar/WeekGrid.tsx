import type React from "react";
import { useLayoutEffect, useRef, useState } from "react";
import DayColumn from "./DayColumn";
import type { CalendarDay, CalendarEventsByDateISO } from "./CalendarTypes";
import type { Appointment } from "@/lib/databaseTypes";
import TimeColumn from "./TimeColumn";

type Props = {
  days: CalendarDay[];
  eventsByDate: CalendarEventsByDateISO;
  onEventClick?: (event: Appointment) => void;
  startHour?: number;
  endHour?: number;
};

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
  onEventClick,
  startHour = 7,
  endHour = 22,
}: Props) {
  const hourCount = Math.max(0, endHour - startHour);

  const windowStartMin = startHour * 60;
  const windowEndMin = endHour * 60;

  function isUntimedForView(e: Appointment) {
    // Missing time -> untimed
    if (!e.start || !e.end) return true;

    const startMin = e.start.getHours() * 60 + e.start.getMinutes();
    const endMin = e.end.getHours() * 60 + e.end.getMinutes();

    // Invalid range -> untimed
    if (!(endMin > startMin)) return true;

    const intersectsWindow = startMin < windowEndMin && endMin > windowStartMin;

    // Outside hours OR spanning entire visible window -> untimed row
    return (
      !intersectsWindow || (startMin < windowStartMin && endMin > windowEndMin)
    );
  }

  const showAllDayRow = days.some((day) =>
    (eventsByDate[day.iso] || []).some(isUntimedForView)
  );

  /**
   * Make all all-day rows the same height (max across the week)
   * so separators & borders align perfectly between columns.
   */
  const rootRef = useRef<HTMLDivElement>(null);
  const [allDayHeight, setAllDayHeight] = useState(56);

  useLayoutEffect(() => {
    if (!showAllDayRow) {
      // fallback height when row is not used
      setAllDayHeight(56);
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
      setAllDayHeight(max > 0 ? max : 56);
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
            events={eventsByDate[day.iso] || []}
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
