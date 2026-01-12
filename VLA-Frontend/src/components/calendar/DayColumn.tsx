
import type { CalendarDay, } from "./CalendarTypes";

type DayColumnProps = {
  day: CalendarDay;
};

/**
 * DayColumn represents exactly one day.
 * Later, we will render all events where event.dateISO === day.iso.
 */
export default function DayColumn({ day, }: DayColumnProps,) {
  return (

  //TODO: Events rendern

  // data-date helps with debugging (DevTools) and later for tests
    <div className="cv-dayColumn" data-date={day.iso}>
      {/* Placeholder – events will be rendered here later */}
    </div>
  );
}
