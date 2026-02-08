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
    <div className="cv-formOverlay " onClick={onClose}>
      <div className="cv-formBox cv-personDetailsBox" onClick={(e) => e.stopPropagation()}>
       
        {/* Header mit Close-Button */}
        <div className="cv-personDetailsHeader">
           <h2 className="cv-formTitle">{person.name}</h2>
            <button 
              type="button"
              className="cv-closeBtn"
              onClick={onClose}
              aria-label="Schließen"
            >
              x
            </button>
        </div>

        {/* Kontakt-Informationen */}
        <div className="cv-personDetailsContent">
          {person.email && (
            <div className="cv-personInfoCard">
              <span className="cv-personInfoLabel">E-Mail</span>
              <a 
                href={`mailto:${person.email}`} 
                className="cv-personInfoValue cv-personEmail"
              >
                {person.email}
              </a>
            </div>
          )}

          {person.role && (
            <div className="cv-personInfoCard">
              <span className="cv-personInfoLabel">Rolle</span>
              <span className="cv-personInfoValue">{person.role}</span>
            </div>
          )}
        </div>

        {/* Notizen Section */}
        <div className="cv-personNotesSection">
          <label htmlFor="personNotes" className="cv-personNotesLabel">
            Notizen
          </label>
          <textarea
            id="personNotes"
            className="cv-personNotesTextarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notizen zu dieser Person..."
            rows={5}
          />
        </div>

        {/* Actions */}
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
    </div>
  );
}