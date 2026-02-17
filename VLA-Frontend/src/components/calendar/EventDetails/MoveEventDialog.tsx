import {useState} from "react";
import type {Appointment} from "@/lib/databaseTypes";
import {verifyValidTimeRange} from "@/components/calendar/eventUtils.ts";
import TimeRangeInput from "@/components/calendar/EventForm/TimeRangeInput.tsx";

type MoveEventDialogProps = {
  event: Appointment;
  onMove?: (eventID: number, newStart: Date, newEnd: Date) => void;
  onCancel: () => void;
  isSeries: boolean;
};

/**
 * MoveEventDialog allows the user to move an event to a new date/time
 */
export default function MoveEventDialog({ 
  event, 
  onMove, 
  onCancel, 
  isSeries, 
}: MoveEventDialogProps) {

  const [newStartDateTime, setNewStartDateTime] = useState(event.start);
  const [newEndDateTime, setNewEndDateTime] = useState(event.end);

  const handleMove = () => {
    if (onMove && newStartDateTime && newEndDateTime) {
      onMove(event.id, newStartDateTime, newEndDateTime);
      onCancel();
    }
  };

  const isValid = verifyValidTimeRange(newStartDateTime, newEndDateTime);

  return (
    <div className="cv-formOverlay">
      <div className="cv-formBox">
        <h2 className="cv-formTitle">
          {isSeries ? 'Serie verschieben' : 'Termin verschieben'}
        </h2>

        <div className="cv-detailsContent">
          <p className="cv-moveDialogInfo">
            {isSeries 
              ? 'Alle Termine dieser Serie werden verschoben.' 
              : 'Nur dieser einzelne Termin wird verschoben.'}
          </p>

          <TimeRangeInput
            startDateTime={newStartDateTime}
            endDateTime={newEndDateTime}
            onStartChange={setNewStartDateTime}
            onEndChange={setNewEndDateTime}
            durationMilliseconds={event.end.getTime() - event.start.getTime()}
          />
        </div>

        <div className="cv-formActions">
          <button
            type="button"
            className="cv-formBtn cv-formBtnCancel"
            onClick={onCancel}
          >
            Abbrechen
          </button>
          <button
            type="button"
            className="cv-formBtn cv-formBtnSubmit"
            onClick={handleMove}
            disabled={!isValid}
          >
            Verschieben
          </button>
        </div>
      </div>
    </div>
  );
}
