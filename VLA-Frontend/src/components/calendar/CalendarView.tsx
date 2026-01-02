import { useMemo, useState } from "react";
import WeekHeader from "./WeekHeader";
import WeekGrid from "./WeekGrid";
import type { CalendarDay } from "./CalendarTypes";
import "../../styles/CalendarView.css";
import {WORKDAY_COUNT, addDays, addWorkdays, formatRangeShortDE, isWeekend, normalizeToWorkdayStart, toISODateLocal,} from "./dateUtils";
import GoToMenu from "./GoToButton";


 export default function CalendarView() {
  const [weekStart, setWeekStart] = useState<Date>(() => normalizeToWorkdayStart(new Date()));
   
  const days: CalendarDay[] = useMemo(() => {
      const result: CalendarDay[] = [];
      let cursor = new Date(weekStart);

      while (result.length < WORKDAY_COUNT) {
        if (!isWeekend(cursor)) {
          result.push({ date: new Date(cursor), iso: toISODateLocal(cursor) });
        }
        cursor = addDays(cursor, 1);
      }
      return result;
    }, [weekStart]);

  const rangeText = days.length === WORKDAY_COUNT ? formatRangeShortDE(days[0].date, days[WORKDAY_COUNT-1].date) : "";

  function prevWeek() {
    setWeekStart((d) => addWorkdays(d, -WORKDAY_COUNT));
  }

  function nextWeek() {
    setWeekStart((d) => addWorkdays(d, WORKDAY_COUNT));
  }

return (
    <div className="cv-root">
      <div className="cv-toolbar" aria-label="Zeitnavigation">
        <button
          className="cv-navBox"
          onClick={prevWeek}
          aria-label="Vorherige 5 Arbeitstage"
          type="button"
        >
          <span className="cv-navIcon">◀</span>
        </button>

         <div className="cv-range" aria-label="Datumsbereich">
          {rangeText}
        </div>

        <button
          className="cv-navBox"
          onClick={nextWeek}
          aria-label="Nächste 5 Arbeitstage"
          type="button"
        >
          <span className="cv-navIcon">▶</span>
        </button>

          <GoToMenu currentWeekStart={weekStart} onDateSelect={setWeekStart} />
      </div>

      <div className="cv-frame">
        <WeekHeader days={days} />
        <WeekGrid days={days} />
      </div>
    </div>
  );
}

