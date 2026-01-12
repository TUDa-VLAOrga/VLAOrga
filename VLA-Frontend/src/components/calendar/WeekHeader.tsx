
import type { CalendarDay, } from "./CalendarTypes";
import { formatDDMM, } from "./dateUtils";

type Props = {
  days: CalendarDay[]; // Mo–Fr
};

const weekdayFmt = new Intl.DateTimeFormat("de-DE", { weekday: "long", },);

export default function WeekHeader({ days, }: Props,) {
  return (
    <div className="cv-header">
      {days.map((day,) => (
        <div key={day.iso} className="cv-headerCell">
          <div className="cv-headerDay">{weekdayFmt.format(day.date,)}</div>
          <div className="cv-headerDate">{formatDDMM(day.date,)}</div>
        </div>
      ),)}
    </div>
  );
}
