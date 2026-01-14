import { useState, useMemo, useEffect } from "react";
import type { CalendarDay } from "../components/calendar/CalendarTypes";
import {
  WORKDAY_COUNT,
  addDays,
  addWorkdays,
  formatRangeShortDE,
  isWeekend,
  normalizeToWorkdayStart,
  toISODateLocal,
} from "../components/calendar/dateUtils";

export function useCalendarNavigation() {
  const [weekStart, setWeekStart] = useState<Date>(() =>
    normalizeToWorkdayStart(new Date())
  );
  const [displayDays, setDisplayDays] = useState<number>(() => WORKDAY_COUNT);

  function updateDisplayDays() {
    setDisplayDays(
      Math.min(WORKDAY_COUNT, Math.floor((window.innerWidth - 48) / 160))
    );
  }

  useEffect(() => {
    window.addEventListener("resize", updateDisplayDays);
    return () => window.removeEventListener("resize", updateDisplayDays);
  });

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
  }, [weekStart, displayDays]);

  const rangeText =
    days.length >= 1
      ? formatRangeShortDE(days[0].date, days[days.length - 1].date)
      : "";

  function prevDay() {
    setWeekStart((d) => addWorkdays(d, -1));
  }

  function nextDay() {
    setWeekStart((d) => addWorkdays(d, 1));
  }

  function goToDate(date: Date) {
    setWeekStart(normalizeToWorkdayStart(date));
  }

  return {
    days,
    rangeText,
    weekStart,
    prevDay,
    nextDay,
    goToDate,
  };
}