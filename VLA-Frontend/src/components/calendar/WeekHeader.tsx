
import type { CalendarDay } from "./CalendarTypes";

type Props = {
  days: CalendarDay[]; // Mo–Fr
};

function formatDDMM(date: Date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.`;
}

const weekdayFmt = new Intl.DateTimeFormat("de-DE", { weekday: "long" });

export default function WeekHeader({ days }: Props) {
  return (
    <div className="cv-header">
      {days.map((day) => (
        <div key={day.iso} className="cv-headerCell">
          <div className="cv-headerDay">{weekdayFmt.format(day.date)}</div>
          <div className="cv-headerDate">{formatDDMM(day.date)}</div>
        </div>
      ))}
    </div>
  );
}
