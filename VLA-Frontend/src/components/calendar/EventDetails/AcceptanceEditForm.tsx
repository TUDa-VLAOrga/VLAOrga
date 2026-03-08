import type {Acceptance} from "@/lib/databaseTypes.ts";
import TimeRangeInput from "@/components/calendar/EventForm/TimeRangeInput.tsx";
import {useState} from "react";
import {getEventTitle} from "@/components/calendar/eventUtils.ts";
import {formatDateAndTime, formatTime} from "@/components/calendar/dateUtils.ts";

type AcceptanceEditFormProps = {
  acceptance: Acceptance,
  onSubmit: (acceptanceId: number, startTime: Date, endTime: Date) => Promise<void>,
  onClose: () => void
};

export default function AcceptanceEditForm({
  acceptance,
  onSubmit,
  onClose,
}: AcceptanceEditFormProps)
{
  const event = acceptance.appointment;
  // states for temporarily saving input
  const [startTime, setStartTime] = useState<Date | undefined>(acceptance.startTime);
  const [endTime, setEndTime] = useState<Date | undefined>(acceptance.endTime);
  // help values for display in form
  return (
    <>
      <div className="cv-formOverlay">
        <div className="cv-formBox">
          <button
            type="button"
            className="cv-closeBtn cv-floatRight"
            onClick={onClose}
            aria-label="Schließen"
          >&times;</button>
          <h2 className="cv-formTitle">Abnahmetermin verschieben</h2>

          <form className="cv-form" onSubmit={(e) => {
            e.preventDefault();
            const startTime = new Date(e.currentTarget.startTime.value);
            const endTime = new Date(e.currentTarget.endTime.value);
            onSubmit(acceptance.id, startTime, endTime)
              .then(() => onClose());
          }}>
            <TimeRangeInput
              startDateTime={startTime}
              endDateTime={endTime}
              onStartChange={setStartTime}
              onEndChange={setEndTime}
              autoCalculateEnd={false}
              hintText={
                "zugehöriger Termin: " + getEventTitle(event) + " am " + formatDateAndTime(event.startTime)
                + "<br/> vorige Zeit der Abnahme: " + formatDateAndTime(acceptance.startTime)
                + " bis " + formatTime(acceptance.startTime)
              }
            />

            <div className="cv-formActions">
              <button
                type="button"
                className="cv-formBtn cv-formBtnCancel"
                onClick={onClose}
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="cv-formBtn cv-formBtnSubmit"
                disabled={!startTime || !endTime}
              >
                Speichern
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
