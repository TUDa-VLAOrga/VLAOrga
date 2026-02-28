import type React from "react";
import DayColumn from "./DayColumn";
import type { CalendarDay, CalendarEventsByDateISO } from "./CalendarTypes";
import type {Appointment} from "@/lib/databaseTypes";
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
 *
 * If there are untimed/all-day events, we render an all-day row
 * above the timeline. If not, timeline starts directly at startHour.
 */
export default function WeekGrid({
  days,
  eventsByDate = {},
  onEventClick,
  startHour = 7,
  endHour = 22,
}: Props) {
  const hourCount = Math.max(0, endHour - startHour);

  const showAllDayRow = days.some((day) =>
    (eventsByDate[day.iso] || []).some(
      (e) => !(e.start && e.end)
    )
  );

  const styleVars: React.CSSProperties & Record<string, number> = {
    "--cv-hour-count": hourCount,
    "--cv-start-hour": startHour,
    "--cv-end-hour": endHour,
  };

  return (
    <div className="cv-gridWithTime" style={styleVars}>
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
