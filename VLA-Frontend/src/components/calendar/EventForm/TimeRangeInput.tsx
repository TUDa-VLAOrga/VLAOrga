import { useEffect } from "react";
import { addMinutesToDateTime } from "../dateUtils";

type TimeRangeInputProps = {
  startDateTime: string;
  endDateTime: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  autoCalculateEnd?: boolean; // Ob End-Zeit automatisch berechnet werden soll
  durationMinutes?: number;   // Standard: 100 Minuten
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
  durationMinutes = 100,
}: TimeRangeInputProps) {
  
  // Auto-calculate end time when start time changes
  useEffect(() => {
    if (autoCalculateEnd && startDateTime) {
      const newEndDateTime = addMinutesToDateTime(startDateTime, durationMinutes);
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
          value={startDateTime}
          onChange={(e) => onStartChange(e.target.value)}
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
          value={endDateTime}
          onChange={(e) => onEndChange(e.target.value)}
          required
        />
      </div>
    </>
  );
}
