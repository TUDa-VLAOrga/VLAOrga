import { useEffect } from "react";
import {DEFAULT_DURATION} from "@/components/calendar/eventUtils.ts";

type TimeRangeInputProps = {
  startDateTime?: Date;
  endDateTime?: Date;
  onStartChange: (value: Date) => void;
  onEndChange: (value: Date) => void;
  autoCalculateEnd?: boolean; // Ob End-Zeit automatisch berechnet werden soll
  durationMinutes?: number;
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
  durationMinutes = DEFAULT_DURATION,
}: TimeRangeInputProps) {
  
  // Auto-calculate end time when start time changes
  useEffect(() => {
    if (autoCalculateEnd && startDateTime) {
      // TODO: do not re-calculate if end is already set and *not* durationMinutes far from start
      //  (i.e. do not override custom user input)
      const newEndDateTime = new Date(startDateTime);
      newEndDateTime.setMinutes(newEndDateTime.getMinutes() + durationMinutes);
      onEndChange(newEndDateTime);
    }
  }, [startDateTime, autoCalculateEnd, durationMinutes, onEndChange]);

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
          value={startDateTime ? startDateTime.toISOString() : ""}
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
          value={endDateTime ? endDateTime.toISOString() : ""}
          onChange={(e) => onEndChange(new Date(e.target.value))}
          required
        />
      </div>
    </>
  );
}
