import {useState, useEffect, useRef} from "react";
import type {Appointment} from "@/lib/databaseTypes";
import {verifyValidTimeRange} from "@/components/calendar/eventUtils.ts";

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
  const durationChanged = useRef(false);
  const initialDuration = event.end.getTime() - event.start.getTime();

  const [newStartDateTime, setNewStartDateTime] = useState(event.start);
  const [newEndDateTime, setNewEndDateTime] = useState(event.end);

  // Auto-calculate end time when start time changes
  useEffect(() => {
    if (newStartDateTime && !durationChanged.current) {
      // move end by the same span as start was moved
      setNewEndDateTime(new Date(newStartDateTime.getTime() + initialDuration));
    }
  }, [newStartDateTime, durationChanged, initialDuration]);
  // update internal duration when end time changes
  useEffect(() => {
    if (newEndDateTime) {
      durationChanged.current = true;
    }
  }, [newEndDateTime, durationChanged]);

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

          <div className="cv-formGroup">
            <label htmlFor="newStartDateTime" className="cv-formLabel">
              Neuer Start (Datum & Uhrzeit) *
            </label>
            <input
              id="newStartDateTime"
              type="datetime-local"
              className="cv-formInput"
              value={newStartDateTime.toISOString()}
              onChange={(e) => setNewStartDateTime(new Date(e.target.value))}
              required
            />
          </div>

          <div className="cv-formGroup">
            <label htmlFor="newEndDateTime" className="cv-formLabel">
              Neues Ende (Datum & Uhrzeit) *
            </label>
            <input
              id="newEndDateTime"
              type="datetime-local"
              className="cv-formInput"
              value={newEndDateTime.toISOString()}
              onChange={(e) => setNewEndDateTime(new Date(e.target.value))}
              required
            />
          </div>
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
