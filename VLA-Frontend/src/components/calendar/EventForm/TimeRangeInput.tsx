import {type Dispatch, type SetStateAction, useState} from "react";
import {DEFAULT_DURATION_MIN} from "@/components/calendar/eventUtils.ts";
import {toDatetimeLocalString} from "@/components/calendar/dateUtils.ts";

type TimeRangeInputProps = {
  startDateTime?: Date;
  endDateTime?: Date;
  onStartChange: Dispatch<SetStateAction<Date>> | Dispatch<SetStateAction<Date | undefined>>;
  onEndChange: Dispatch<SetStateAction<Date>> | Dispatch<SetStateAction<Date | undefined>>;
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
  const [isWholeDay, setWholeDay] = useState(
    startDateTime && startDateTime.getHours() === 0 && endDateTime && endDateTime.getHours() === 23
  );

  return (
    <>

      <div className="cv-formGroup">
        <label className="cv-formCheckbox">
          <input
            type="checkbox"
            checked={isWholeDay}
            onChange={(e) => {
              const newState = e.target.checked;
              setWholeDay(prevState => {
                if (prevState === newState) {
                  return prevState;
                }
                if (newState && startDateTime) {
                  // event should span over whole day
                  const newDate = new Date(startDateTime.getTime());
                  newDate.setHours(0, 0, 0, 0);
                  onStartChange(newDate);
                  newDate.setHours(23, 59, 59, 999);
                  onEndChange(newDate);
                } else if (!newState && startDateTime) {
                  // whole day deactivated, set default duration
                  const newDate = new Date(startDateTime.getTime() + durationMilliseconds);
                  onEndChange(newDate);
                }
              });
            }}
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
            // addition of T00:00 is necessary as otherwise we get 00:00 UTC, which is 01:00 in Darmstadt :(
            onChange={(e) => {
              onStartChange(new Date(e.target.value + "T00:00:00"));
              onEndChange(new Date(e.target.value + "T23:59:59"));
            }}
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
              onChange={(e) => {
                const newStart = new Date(e.target.value);
                onStartChange((oldStart: Date | undefined) => {
                  if (autoCalculateEnd && startDateTime && endDateTime) {
                    if (oldStart) {
                      onEndChange(new Date(endDateTime.getTime() + (newStart.getTime() - oldStart.getTime())));
                    } else {
                      onEndChange(new Date(endDateTime.getTime() + durationMilliseconds));
                    }
                  }
                  return newStart;
                });
              }}
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
              onChange={(e) => {
                onEndChange(new Date(e.target.value));
              }}
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
