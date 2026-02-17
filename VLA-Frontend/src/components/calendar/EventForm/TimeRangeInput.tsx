import {useEffect, useRef} from "react";
import {DEFAULT_DURATION} from "@/components/calendar/eventUtils.ts";
import {toDatetimeLocalString} from "@/components/calendar/dateUtils.ts";

type TimeRangeInputProps = {
  startDateTime?: Date;
  endDateTime?: Date;
  onStartChange: (value: Date) => void;
  onEndChange: (value: Date) => void;
  autoCalculateEnd?: boolean; // Ob End-Zeit automatisch berechnet werden soll
  durationMilliseconds?: number;
};

/**
 * TimeRangeInput - Wiederverwendbare Komponente für Start/End Zeitauswahl
 * Berechnet automatisch die End-Zeit basierend auf der Start-Zeit
 */
export default function TimeRangeInput({
  startDateTime,
  endDateTime,
  onStartChange,
  onEndChange,
  autoCalculateEnd = true,
  durationMilliseconds = DEFAULT_DURATION * 60 * 1000,
}: TimeRangeInputProps) {

  const initialDuration = (startDateTime && endDateTime)
    ? endDateTime.getTime() - startDateTime.getTime()
    : durationMilliseconds;
  const duration = useRef(initialDuration);

  // Auto-calculate end time when start time changes, but keep duration.
  useEffect(() => {
    if (autoCalculateEnd && startDateTime) {
      onEndChange(new Date(startDateTime.getTime() + duration.current));
    }
    // Consciously do not trigger effect for endDateTime. Ignore linter complaint.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDateTime, autoCalculateEnd, onEndChange]);
  useEffect(() => {
    if (autoCalculateEnd && startDateTime && endDateTime) {
      duration.current = endDateTime.getTime() - startDateTime.getTime();
    }
    // Consciously do not trigger effect for startDateTime. Ignore linter complaint.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDateTime, autoCalculateEnd]);

  return (
    <>
      <div className="cv-formGroup">
        <label htmlFor="startDateTime" className="cv-formLabel">
          Start (Datum & Uhrzeit) *
        </label>
        <input
          id="startDateTime"
          type="datetime-local"
          className="cv-formInput"
          value={startDateTime ? toDatetimeLocalString(startDateTime) : ""}
          onChange={(e) => onStartChange(new Date(e.target.value))}
          required
        />
      </div>

      <div className="cv-formGroup">
        <label htmlFor="endDateTime" className="cv-formLabel">
          Ende (Datum & Uhrzeit) *
        </label>
        <input
          id="endDateTime"
          type="datetime-local"
          className="cv-formInput"
          value={endDateTime ? toDatetimeLocalString(endDateTime) : ""}
          onChange={(e) => onEndChange(new Date(e.target.value))}
          required
        />
      </div>
    </>
  );
}
