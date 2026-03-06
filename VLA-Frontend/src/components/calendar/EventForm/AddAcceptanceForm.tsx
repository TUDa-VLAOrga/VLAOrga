import type {Appointment} from "@/lib/databaseTypes.ts";
import TimeRangeInput from "@/components/calendar/EventForm/TimeRangeInput.tsx";
import {useState} from "react";
import {getEventTitle} from "@/components/calendar/eventUtils.ts";
import {daysBefore, formatDDMMHHMM, formatTime} from "@/components/calendar/dateUtils.ts";

type AddAcceptanceFormProps = {
  event: Appointment,
  allEvents: Appointment[],
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
  const seriesEventCount = allEvents.filter(e => e.series.id === event.series.id).length;
  const diff = startTime
    ? `${daysBefore(startTime, event.startTime)} vor dem Termin um ${formatTime(startTime)} Uhr`
    : "entsprechend";
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

          <form className="cv-form" onSubmit={(e) => {
            e.preventDefault();
            const startTime = new Date(e.currentTarget.startTime.value);
            const endTime = new Date(e.currentTarget.endTime.value);
            onSubmit(event.id, startTime, endTime)
              .then(() => onClose());
          }}>
            <TimeRangeInput
              startDateTime={startTime}
              endDateTime={endTime}
              onStartChange={setStartTime}
              onEndChange={setEndTime}
              autoCalculateEnd={false}
              hintText={"Referenz: " + getEventTitle(event) + " am " + formatDDMMHHMM(event.startTime)}
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
