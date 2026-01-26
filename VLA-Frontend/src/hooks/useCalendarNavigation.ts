import { useState, useMemo, useEffect } from "react";
import type { CalendarDay } from "../components/calendar/CalendarTypes";
import {
  WORKDAY_COUNT,
  addDays,
  addWorkdays,
  formatRangeShortDE,
  isWeekend,
  normalizeToWorkdayStart,
  toISODateLocal
} from "../components/calendar/dateUtils";

/**
 * useCalendarNavigation manages the currently displayed workday range.
 * It supports:
 * - previous/next workday navigation
 * - jumping to a specific date
 */

export function useCalendarNavigation() {
  // First displayed day of the current week view
  const [weekStart, setWeekStart] = useState<Date>(() =>
    normalizeToWorkdayStart(new Date())
  );
  // How many workdays we show in the grid 
  const [displayDays, setDisplayDays] = useState<number>(() => WORKDAY_COUNT);

  /**
   * Calculates how many day columns can fit on the screen.
   * This is responsive behavior based on window width.
   */
  function updateDisplayDays() {
    setDisplayDays(
      Math.min(WORKDAY_COUNT, Math.floor((window.innerWidth - 48) / 160))
    );
  }

  /**
   * Update displayDays on window resize.
   */
  useEffect(() => {
    window.addEventListener("resize", updateDisplayDays);
    return () => window.removeEventListener("resize", updateDisplayDays);
  }, []);
  /**
   * Compute the list of CalendarDay objects from weekStart.
   * Only workdays are included (weekends are skipped).
   */
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
  // Human-readable range label for the toolbar (e.g. "12.–16. Jan")
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
