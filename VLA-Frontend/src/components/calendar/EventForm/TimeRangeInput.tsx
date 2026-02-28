import {useEffect, useRef, useState} from "react";
import {DEFAULT_DURATION_MIN} from "@/components/calendar/eventUtils.ts";
import {toDatetimeLocalString} from "@/components/calendar/dateUtils.ts";

type TimeRangeInputProps = {
  startDateTime?: Date;
  endDateTime?: Date;
  onStartChange: (value: Date) => void;
  onEndChange: (value: Date) => void;
  autoCalculateEnd?: boolean; // Ob End-Zeit automatisch berechnet werden soll
  durationMilliseconds?: number;
  hintText?: string;
  errorText?: string;
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
  durationMilliseconds = DEFAULT_DURATION_MIN * 60 * 1000,
  hintText,
  errorText,
}: TimeRangeInputProps) {

  const initialDuration = (startDateTime && endDateTime)
    ? endDateTime.getTime() - startDateTime.getTime()
    : durationMilliseconds;
  const duration = useRef(initialDuration);
  const [isWholeDay, setWholeDay] = useState(false);

  // Auto-calculate end time when start time changes, but keep duration.
  useEffect(() => {
    if (autoCalculateEnd && startDateTime) {
      onEndChange(new Date(startDateTime.getTime() + duration.current));
    }
    if (isWholeDay && startDateTime) {
      const newEndDate = new Date(startDateTime);
      newEndDate.setHours(23, 59, 59, 999);
      onEndChange(newEndDate);
    }
  }, [startDateTime, autoCalculateEnd, onEndChange, isWholeDay]);
  useEffect(() => {
    if (autoCalculateEnd && startDateTime && endDateTime) {
      duration.current = endDateTime.getTime() - startDateTime.getTime();
    }
    // Consciously do not trigger effect for startDateTime. Ignore linter complaint.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDateTime, autoCalculateEnd]);
  // set sensible default values when swapping "ganztägig" checkbox
  useEffect(()=> {
    if (!startDateTime) return;
    if (isWholeDay) {
      const newStartDate = new Date(startDateTime);
      newStartDate.setHours(0, 0, 0, 0);
      onStartChange(newStartDate);
    } else {
      onEndChange(new Date(startDateTime?.getTime() + durationMilliseconds));
    }
    // Consciously do not trigger effect for startDateTime. Ignore linter complaint.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWholeDay]);


  return (
    <>

      <div className="cv-formGroup">
        <label className="cv-formCheckbox">
          <input
            type="checkbox"
            checked={isWholeDay}
            onChange={(e) => setWholeDay(e.target.checked)}
          />
          <span>ganztägig</span>
        </label>
      </div>
      {isWholeDay &&
        <div className="cv-formGroup">
          <label htmlFor="startDay" className="cv-formLabel" />
          <input
            id="startDay"
            type="date"
            className="cv-formInput"
            value={startDateTime ? toDatetimeLocalString(startDateTime).split("T")[0] : ""}
            onChange={(e) => onStartChange(new Date(e.target.value))}/>
          {hintText &&
              <div className="cv-formHint">
                {hintText}
              </div>
          }
          {errorText &&
              <div className="cv-formError">
                {errorText}
              </div>}
        </div>
      }
      {!isWholeDay &&
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
            {hintText &&
              <div className="cv-formHint">
                {hintText}
              </div>
            }
            {errorText &&
              <div className="cv-formError">
                {errorText}
              </div>}
          </div>
        </>
      }
    </>
  );
}
