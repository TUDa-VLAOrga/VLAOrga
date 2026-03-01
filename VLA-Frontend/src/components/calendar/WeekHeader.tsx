
import type { CalendarDay } from "./CalendarTypes";
import { compareSameDay, formatDDMM } from "./dateUtils";

type Props = {
  days: CalendarDay[]; // Mo–Fr
};

const weekdayFmt = new Intl.DateTimeFormat("de-DE", { weekday: "long" });

export default function WeekHeader({ days }: Props) {
  return (
    <div className="cv-header">
      {/* empty cell for the time column */}
      <div className="cv-headerCell cv-headerTimeCell" />
      {days.map((day) => (
        <div
          id={compareSameDay(day.date, new Date()) ? "todaysColumnHeader" : ""}
          key={day.iso}
          className="cv-headerCell"
        >
          <div className="cv-headerDay">{weekdayFmt.format(day.date)}</div>
          <div className="cv-headerDate">{formatDDMM(day.date)}</div>
        </div>
      ))}
    </div>
  );
}
