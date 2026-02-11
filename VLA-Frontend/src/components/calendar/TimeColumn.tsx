type Props = {
  startHour?: number;
  endHour?: number;
};

export default function TimeColumn({ startHour = 7, endHour = 22 }: Props) {
  const hours: number[] = [];
  for (let h = startHour; h < endHour; h++) hours.push(h);

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
