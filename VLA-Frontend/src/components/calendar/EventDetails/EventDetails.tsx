import { useState } from "react";
import type { CalendarEvent, Lecture } from "../CalendarTypes";
import { formatISODateDE } from "../dateUtils";
import type { Person } from "../EventForm/AddPeopleSection";
import PersonDetails from "./PersonDetails";

type EventDetailsProps = {
  event: CalendarEvent;
  onClose: () => void;
  lectures?: Lecture[];
  people?: Person[];
  onUpdatePersonNotes?: (personId: string, notes: string) => void;
};

/**
 * EventDetails renders a read-only modal with all relevant event information.
 * If the event is assigned to a lecture, it shows the lecture color + name.
 */
export default function EventDetails({ event, onClose, lectures = [], people = [], onUpdatePersonNotes }: EventDetailsProps) {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  let lecture = null;
  if (event.lectureId) {
    lecture = lectures.find(lec => lec.id === event.lectureId) || null;
  }

  const handleUpdatePersonNotes = (personId: string, notes: string) => {
    if (onUpdatePersonNotes) {
      onUpdatePersonNotes(personId, notes);
      // Update the selected person with the new notes
      if (selectedPerson && selectedPerson.id === personId) {
        setSelectedPerson({ ...selectedPerson, notes });
      }
    }
  };

  const getEventPeople = (): Person[] => {
    if (!event.people || event.people.length === 0) {
      return [];
    }
    return event.people
      .map(item => {
        if (typeof item === "string") {
          return people.find(p => p.id === item);
        }else {
        return item;
        }
      })
      .filter((p): p is Person => p !== undefined);
  };

  const eventPeople = getEventPeople();
  const getCurrentPerson = (personId: string): Person | undefined => {
    return people.find(p => p.id === personId);
  };
  const currentSelectedPerson = selectedPerson
    ? getCurrentPerson(selectedPerson.id)
    : null;
  
  return (
    <>
    <div className="cv-formOverlay">
      <div className="cv-formBox">
        <h2 className="cv-formTitle">{event.title}</h2>

        <div className="cv-detailsContent">
          <div className="cv-detailRow">
            <span className="cv-detailLabel">Kategorie:</span>
            <span className="cv-detailValue">{event.kind}</span>
          </div>

          {/* Lecture details (only if lecture is assigned) */}
          {lecture && (
            <div className="cv-detailRow">
              <span className="cv-detailLabel">Vorlesung:</span>
              <span className="cv-detailValue">
                <span className="cv-detailValueLecture ">
                  <span
                    className="cv-lectureSwatch"
                    style={{ backgroundColor: lecture.color }}
                  />
                  <span className="cv-lectureName">{lecture.name}</span>
                </span>
              </span>
            </div>
          )}

          <div className="cv-detailRow">
            <span className="cv-detailLabel">Datum:</span>
            <span className="cv-detailValue">{formatISODateDE(event.dateISO)}</span>
          </div>

          {(event.displayedStartTime && event.displayedEndTime) && (
            <div className="cv-detailRow">
              <span className="cv-detailLabel">Uhrzeit:</span>
              <span className="cv-detailValue">
                {event.displayedStartTime} – {event.displayedEndTime}
              </span>
            </div>
          )}

          {eventPeople.length > 0 && (
            <div className="cv-detailRow">
              <span className="cv-detailLabel">Personen:</span>
              <span className="cv-detailValue ">
                {eventPeople.map((person, index) => (
                  <span
                    key={person.id}>
                    <button
                    type="button"
                    className="cv-personLink"
                    onClick={() => setSelectedPerson(person)}
                  >
                    {person.name}
                    </button>
                    {index < eventPeople.length - 1 ? ", " : ""}
                  </span>
                ))}
              </span>
            </div>
          )}

          {/* Status is optional; used for UI highlighting elsewhere */}
          {event.status && (
            <div className="cv-detailRow">
              <span className="cv-detailLabel">Status:</span>
              <span className="cv-detailValue">{event.status}</span>
            </div>
          )}
        </div>

        <div className="cv-formActions">
          <button
            type="button"
            className="cv-formBtn cv-formBtnCancel"
            onClick={onClose}
          >
            Schließen
          </button>
        </div>
      </div>
    </div>

    {currentSelectedPerson && (
      <PersonDetails
        person={currentSelectedPerson}
        onClose={() => setSelectedPerson(null)}
        onSaveNotes={handleUpdatePersonNotes}
      />
    )}
    </>
  );
}
