import React, { useMemo, useState } from "react";
import WeekHeader from "./WeekHeader";
import WeekGrid from "./WeekGrid";
import "../../styles/calendarView.css";

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

  const weekDays = useMemo(() => {
    // Mo–Fr
    return Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  function prevWeek() {
    setWeekStart((d) => addDays(d, -7));
  }

  function nextWeek() {
    setWeekStart((d) => addDays(d, 7));
  }

  return (
    <div className="cv-root">
      <h1 className="cv-title">Kalender der VLA</h1>

      <WeekHeader weekDays={weekDays} onPrevWeek={prevWeek} onNextWeek={nextWeek} />
      <WeekGrid weekDays={weekDays} />
    </div>
  );
}
