import type {Acceptance, Appointment} from "@/lib/databaseTypes.ts";
import TimeRangeInput from "@/components/calendar/EventForm/TimeRangeInput.tsx";
import {useState} from "react";
import {
  DEFAULT_ACCEPTANCE_DURATION_MIN,
  getEventTitle,
  verifyValidTimeRange
} from "@/components/calendar/eventUtils.ts";
import {formatDateAndTime, formatTime} from "@/components/calendar/dateUtils.ts";

type AcceptanceEditFormProps = {
  acceptance: Acceptance,
  referenceAppointment: Appointment,
  onSubmit: (acceptanceId: number, startTime: Date, endTime: Date) => Promise<void>,
  onClose: () => void
};

/**
 * Form for editing an acceptance.
 *
 * @param referenceEvent needed for dynamic updating via SSE events,
 * the contained acceptance.appointment may get outdated.
 */
export default function AcceptanceEditForm({
  acceptance,
  referenceAppointment,
  onSubmit,
  onClose,
}: AcceptanceEditFormProps)
{
  // states for temporarily saving input
  const [startTime, setStartTime] = useState<Date | undefined>(acceptance.startTime);
  const [endTime, setEndTime] = useState<Date | undefined>(acceptance.endTime);
  // help values for display in form
  const [isValid, errorText] = verifyValidTimeRange(startTime, endTime);
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
            if (!isValid) return;
            // isValid check ensures that startTime and endTime are defined here
            onSubmit(acceptance.id, startTime!, endTime!)
              .then(() => onClose());
          }}>
            <TimeRangeInput
              startDateTime={startTime}
              endDateTime={endTime}
              onStartChange={setStartTime}
              onEndChange={setEndTime}
              durationMilliseconds={DEFAULT_ACCEPTANCE_DURATION_MIN * 60 * 1000}
              hintText={
                "zugehöriger Termin: " + getEventTitle(referenceAppointment)
                + " am " + formatDateAndTime(referenceAppointment.startTime)
                + "<br/> vorige Zeit der Abnahme: " + formatDateAndTime(acceptance.startTime)
                + " bis " + formatTime(acceptance.startTime)
              }
              errorText={errorText}
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
