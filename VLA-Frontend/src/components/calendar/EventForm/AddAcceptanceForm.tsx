import type {Appointment} from "@/lib/databaseTypes.ts";
import TimeRangeInput from "@/components/calendar/EventForm/TimeRangeInput.tsx";
import {useState} from "react";
import {
  DEFAULT_ACCEPTANCE_DURATION_MIN,
  getEventTitle,
  isCalendarEventAcceptance,
  verifyValidTimeRange
} from "@/components/calendar/eventUtils.ts";
import {daysBefore, formatDateAndTime, formatTime} from "@/components/calendar/dateUtils.ts";
import type {CalendarEvent} from "@/components/calendar/CalendarTypes.ts";

type AddAcceptanceFormProps = {
  event: Appointment,
  allEvents: CalendarEvent[],
  onSubmit: (eventId: number, startTime: Date, endTime: Date) => Promise<void>,
  onClose: () => void
};

export default function AddAcceptanceForm({
  event,
  allEvents,
  onSubmit,
  onClose,
}: AddAcceptanceFormProps)
{
  // states for temporarily saving input
  const [startTime, setStartTime] = useState<Date | undefined>();
  const [endTime, setEndTime] = useState<Date | undefined>();
  // help values for display in form
  const seriesEventCount = allEvents.filter(
    e => !isCalendarEventAcceptance(e) && e.series.id === event.series.id
  ).length;
  const diff = startTime
    ? `${daysBefore(startTime, event.startTime)} vor dem Termin um ${formatTime(startTime)} Uhr`
    : "entsprechend";

  const [isValid, errorText] = verifyValidTimeRange(startTime, endTime);
  /**
   * Handle creation form and send request to server.
   */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isValid)
      return;
    onSubmit(
      event.id,
      // isValid check ensures that startTime and endTime are defined here
      startTime!,
      endTime!
    ).then(() => onClose());
  }

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
          <h2 className="cv-formTitle">Abnahmetermin hinzufügen</h2>

          <form className="cv-form" onSubmit={(e) => handleSubmit(e)}>
            <TimeRangeInput
              startDateTime={startTime}
              endDateTime={endTime}
              onStartChange={setStartTime}
              onEndChange={setEndTime}
              durationMilliseconds={DEFAULT_ACCEPTANCE_DURATION_MIN * 60 * 1000}
              hintText={"Referenz: " + getEventTitle(event) + " am " + formatDateAndTime(event.startTime)}
              errorText={errorText}
            />

            <div className="cv-formGroup">
              <p className="cv-formHint">
                Füge Abnahmetermin für jeden Termin der Serie ({seriesEventCount} Termine) hinzu.
                Für jeden Termin wird ein Abnahmetermin {diff} erstellt.
              </p>
            </div>

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
                disabled={!isValid}
                title={errorText}
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
