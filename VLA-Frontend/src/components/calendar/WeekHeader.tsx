import React from "react";
import type { CalendarDay } from "./types";

type Props = {
  days: CalendarDay[]; // Mo–Fr
};

const WEEKDAY_LABELS_DE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];

function formatDDMM(date: Date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.`;
}

export default function WeekHeader({ days }: Props) {
  return (
    <div className="cv-header">
      {days.map((day, idx) => (
        <div key={day.iso} className="cv-headerCell">
          <div className="cv-headerDay">{WEEKDAY_LABELS_DE[idx]}</div>
          <div className="cv-headerDate">{formatDDMM(day.date)}</div>
        </div>
      ))}
    </div>
  );
}
