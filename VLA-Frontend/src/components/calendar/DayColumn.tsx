
import type { CalendarDay } from "./CalendarTypes";

type DayColumnProps = {
  day: CalendarDay;
};

/**
 * DayColumn repräsentiert genau EINEN Tag.
 * Später werden hier die Events gerendert, deren event.dateISO === day.iso.
 */
export default function DayColumn({ day }: DayColumnProps) {
  return (

    //TODO: Events rendern

    // data-date hilft beim Debuggen (DevTools) und später auch bei Tests
    <div className="cv-dayColumn" data-date={day.iso}>
      {/* Platzhalter – hier kommen später Events rein */}
    </div>
  );
}
