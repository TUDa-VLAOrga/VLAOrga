import React from "react";

type Props = {
  weekDays: Date[]; // erwartet Mo–Fr
  onPrevWeek: () => void;
  onNextWeek: () => void;
};

const WEEKDAY_LABELS_DE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];

function formatDDMM(date: Date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.`;
}

export default function WeekHeader({ weekDays, onPrevWeek, onNextWeek }: Props) {
  return (
    <div className="cv-headerRow">

       {/* Linker Pfeil: Woche zurück */}

      <button className="cv-arrow" onClick={onPrevWeek} aria-label="Vorherige Woche" type="button">
        ◀
      </button>

      {/* Tagesköpfe */}

      <div className="cv-header">
        {weekDays.map((d, idx) => (
          <div key={d.toISOString()} className="cv-headerCell">
            <div className="cv-headerDay">{WEEKDAY_LABELS_DE[idx]}</div>
            <div className="cv-headerDate">{formatDDMM(d)}</div>
          </div>
        ))}
      </div>

      {/* Rechter Pfeil: Woche vor */}

      <button className="cv-arrow" onClick={onNextWeek} aria-label="Nächste Woche" type="button">
        ▶
      </button>
    </div>
  );
}
