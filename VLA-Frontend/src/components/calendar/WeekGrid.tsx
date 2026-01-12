
import DayColumn from "./DayColumn";
import type { CalendarDay } from "./CalendarTypes";

type Props = {
  days: CalendarDay[]; // Mo–Fr
};

/**
 * WeekGrid rendert die Spalten für die Woche.
 * Jede Spalte ist über day.iso eindeutig an einen Wochentag gekoppelt.
 */
export default function WeekGrid({ days }: Props) {
  return (
    <div className="cv-grid">
      {days.map((day) => (
        <DayColumn key={day.iso} day={day} />
      ))}
    </div>
  );
}
