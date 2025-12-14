import { useMemo, useState } from "react";
import WeekHeader from "./WeekHeader";
import WeekGrid from "./WeekGrid";
import type { CalendarDay } from "./types";
import "../../styles/calendarView.css";

function toISODateLocal(d: Date) {
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Liefert das Datum des Montags der Woche, in der `date` liegt.
function startOfWeekMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=So,1=Mo,...6=Sa
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diffToMonday);
  d.setHours(0, 0, 0, 0);
  return d;
}

//Gibt ein neues Date zurück, das `days` Tage von `date` entfernt ist.
function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/*
 * CalendarView ist der Container:
 * - hält den Wochen-State (weekStart)
 * - berechnet die 5 Arbeitstage (Mo–Fr)
 * - verkabelt Header (Navigation) und Grid (Layout)
 */

 export default function CalendarView() {
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeekMonday(new Date()));

    const days: CalendarDay[] = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const date = addDays(weekStart, i);
      return { date, iso: toISODateLocal(date) };
    });
  }, [weekStart]);

  function prevWeek() {
    setWeekStart((d) => addDays(d, -7));
  }

  function nextWeek() {
    setWeekStart((d) => addDays(d, 7));
  }

 // CalendarView.tsx
return (
  <div className="cv-root">
    <h1 className="cv-title">Kalender der VLA</h1>

    <div className="cv-weekRow">
      <button
        className="cv-navBox"
        onClick={prevWeek}
        aria-label="Vorherige Woche"
        type="button"
      >
        <span className="cv-navIcon">◀</span>
      </button>

      <div className="cv-frame">
        <WeekHeader days={days} />
        <WeekGrid days={days} />
      </div>

      <button
        className="cv-navBox"
        onClick={nextWeek}
        aria-label="Nächste Woche"
        type="button"
      >
        <span className="cv-navIcon">▶</span>
      </button>
    </div>
  </div>
);



}
