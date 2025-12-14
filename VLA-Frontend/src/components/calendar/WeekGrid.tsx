import React from "react";

type Props = {
  weekDays: Date[]; // Mo–Fr
};

export default function WeekGrid({ weekDays }: Props) {
  return (
    <div className="cv-grid">
      {weekDays.map((d) => (
         
        //Jede Spalte respräsentiert einen Tag

        <div key={d.toISOString()} className="cv-dayColumn">
          {/* Platzhalter – hier kommen später Events rein */}
        </div>
      ))}
    </div>
  );
}
