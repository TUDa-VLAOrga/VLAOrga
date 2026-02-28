type Props = {
  /** First visible hour (inclusive). */
  startHour?: number;
  endHour?: number;
};

export default function TimeColumn({ startHour = 7, endHour = 22 }: Props) {
  const hours = Array.from(
    { length: Math.max(0, endHour - startHour) },
    (_, i) => startHour + i
  );

  return (
    <div className="cv-timeColumn" aria-label="Zeitskala">
      {hours.map((h) => (
        <div key={h} className="cv-timeCell">
          <div className="cv-timeLabel">{`${String(h).padStart(2, "0")}:00`}</div>
        </div>
      ))}
    </div>
  );
}
