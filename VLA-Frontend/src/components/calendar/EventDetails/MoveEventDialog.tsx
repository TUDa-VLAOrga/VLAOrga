import { useState, useEffect } from "react";
import type { CalendarEvent } from "../CalendarTypes";
import { addMinutesToDateTime } from "../dateUtils";

type MoveEventDialogProps = {
  event: CalendarEvent;
  onMove?: (eventId: string, newDateTime: string, newEndDateTime: string) => void;
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
  
  // Extract current date and time from event
  const getCurrentStartDateTime = () => {
    if (event.displayedStartTime) {
      // displayedStartTime ist bereits im Format "HH:MM"
      return `${event.dateISO}T${event.displayedStartTime}`;
    }
    return `${event.dateISO}T09:00`;
  };

  const getCurrentEndDateTime = () => {
    if (event.displayedEndTime) {
      // displayedEndTime ist bereits im Format "HH:MM"
      return `${event.dateISO}T${event.displayedEndTime}`;
    }
    return `${event.dateISO}T10:00`;
  };
  
  const [newStartDateTime, setNewStartDateTime] = useState(getCurrentStartDateTime());
  const [newEndDateTime, setNewEndDateTime] = useState(getCurrentEndDateTime());

  // Auto-calculate end time when start time changes
  useEffect(() => {
    if (newStartDateTime) {
      // Automatisch 100 Minuten hinzufügen
      setNewEndDateTime(addMinutesToDateTime(newStartDateTime, 100));
    }
  }, [newStartDateTime]);

  const handleMove = () => {
    if (onMove && newStartDateTime && newEndDateTime) {
      onMove(event.id, newStartDateTime, newEndDateTime);
      onCancel();
    }
  };

  const isValid = newStartDateTime && newEndDateTime && newEndDateTime > newStartDateTime;

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
              value={newStartDateTime}
              onChange={(e) => setNewStartDateTime(e.target.value)}
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
              value={newEndDateTime}
              onChange={(e) => setNewEndDateTime(e.target.value)}
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
