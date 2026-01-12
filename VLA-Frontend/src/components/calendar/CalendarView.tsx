import { useEffect, useMemo, useState } from "react";
import WeekHeader from "./WeekHeader";
import WeekGrid from "./WeekGrid";
import type { CalendarDay } from "./CalendarTypes";
import "../../styles/CalendarView.css";
import {WORKDAY_COUNT, addDays, addWorkdays, formatRangeShortDE, isWeekend, normalizeToWorkdayStart, toISODateLocal} from "./dateUtils";
import GoToMenu from "./GoToButton";


export default function CalendarView() {
  const [weekStart, setWeekStart] = useState<Date>(() => normalizeToWorkdayStart(new Date()));
  const [displayDays,setDisplayDays] = useState<number>(() => WORKDAY_COUNT);

  useEffect(() => {
    window.addEventListener("resize",updateDisplayDays);
    return () => window.removeEventListener("resize",updateDisplayDays);
  });

  //how many days can be displayed in the current window
  function updateDisplayDays() {
    setDisplayDays(Math.min(WORKDAY_COUNT,Math.floor((window.innerWidth-48)/160)));
  }
   
  const days: CalendarDay[] = useMemo(() => {
    const result: CalendarDay[] = [];
    let cursor = new Date(weekStart);
    updateDisplayDays();

    while (result.length < displayDays) {
      if (!isWeekend(cursor)) {
        result.push({ date: new Date(cursor), iso: toISODateLocal(cursor) });
      }
      cursor = addDays(cursor, 1);
    }
    return result;
  }, [weekStart,displayDays]);

  const rangeText = days.length >= 1 ? formatRangeShortDE(days[0].date, days[days.length-1].date) : "";

  /* not in use
  function prevWeek() {
    setWeekStart((d) => addWorkdays(d, -WORKDAY_COUNT));
  }

  function nextWeek() {
    setWeekStart((d) => addWorkdays(d, WORKDAY_COUNT));
  }
  */

  function prevDay() {
    setWeekStart((d) => addWorkdays(d, -1));
  }

  function nextDay() {
    setWeekStart((d) => addWorkdays(d, 1));
  }

  return (
    <div className="cv-root">
      <div className="cv-toolbar" aria-label="Zeitnavigation">
        <button
          className="cv-navBox"
          onClick={prevDay}
          aria-label="Vorherige 5 Arbeitstage"
          type="button"
        >
        </button>

        <div className="cv-range" aria-label="Datumsbereich">
          {rangeText}
        </div>

        <button
          className="cv-navBox"
          onClick={nextDay}
          aria-label="Nächste 5 Arbeitstage"
          type="button"
        >
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
