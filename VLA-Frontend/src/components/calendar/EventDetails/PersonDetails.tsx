import type { Person } from "../EventForm/AddPeopleSection";
import {useState} from "react";

type PersonDetailsProps = {
  person: Person;
  onClose: () => void;
  onSaveNotes?: (personId: string, notes: string) => void;
};

/**
 * PersonDetails shows detailed information about a person in a modal.
 */
export default function PersonDetails({ person, onClose, onSaveNotes }: PersonDetailsProps) {
  const [notes, setNotes] = useState(person.notes || "");
  const handleSave = () => {
    if (onSaveNotes) {
    //TODO: Backend - PUT request to save notes
      onSaveNotes(person.id, notes);
    }
    onClose();
  };

  return (
    <div className="cv-formOverlay cv-personDetailsOverlay" onClick={onClose}>
      <div className="cv-formBox cv-personDetailsBox" onClick={(e) => e.stopPropagation()}>
        <h2 className="cv-formTitle cv-personDetailsTitle">{person.name}</h2>
        <div className="cv-detailsContent cv-personDetailsContent">
          <div className="cv-detailRow">
            <span className="cv-detailLabel">Name:</span>
            <span className="cv-detailValue">{person.name}</span>
          </div>

          {person.email && (
            <div className="cv-detailRow">
              <span className="cv-detailLabel">E-Mail:</span>
              <span className="cv-detailValue">
                <a href={`mailto:${person.email}`} className="cv-personEmail">
                  {person.email}
                </a>
              </span>
            </div>
          )}

          {person.role && (
            <div className="cv-detailRow">
              <span className="cv-detailLabel">Rolle:</span>
              <span className="cv-detailValue">{person.role}</span>
            </div>
          )}
        </div>

        <div className="cv-formGroup cv-personNotesGroup">
          <label htmlFor="personNotes" className="cv-formLabel">
            Notizen:
          </label>
          <textarea
            id="personNotes"
            className="cv-formInput cv-personNotesTextarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notizen zu dieser Person..."
            rows={4}
          />
        </div>
      </div>

      <div className="cv-formActions">
        <button
          type="button"
          className="cv-formBtn cv-formBtnCancel"
          onClick={onClose}
        >
          Abbrechen
        </button>
        {onSaveNotes && (
          <button
            type="button"
            className="cv-formBtn cv-formBtnSubmit"
            onClick={handleSave}
          >
            Speichern
          </button>
        )}
      </div>
    </div>
  );
}
