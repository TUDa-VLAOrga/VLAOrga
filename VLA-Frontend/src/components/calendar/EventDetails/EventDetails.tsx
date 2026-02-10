import { useState } from "react";
import type { CalendarEvent, Lecture } from "../CalendarTypes";
import { formatISODateDE } from "../dateUtils";
import type { Person } from "../CalendarTypes";
import PersonDetails from "./PersonDetails";
import EventEditForm from "./EventEditForm";
import MoveEventDialog from "./MoveEventDialog";
import "../../../styles/Event-details-styles.css";
import MoveConfirmDialog from "./MoveConfirmDialog";


type EventDetailsProps = {
  event: CalendarEvent;
  onClose: () => void;
  lectures?: Lecture[];
  people?: Person[];
  categories?: string[];
  onUpdatePersonNotes?: (personId: string, notes: string) => void;
  onUpdateEvent?: (eventId: string, updates: Partial<CalendarEvent>) => void;
  onMoveEvent?: (eventId: string, newDateTime: string, newEndDateTime: string) => void;
  onMoveSeries?: (eventId: string, newDateTime: string, newEndDateTime: string) => void;
  onAddCategory?: (category: string) => void;
  onAddPerson?: (person: Person) => void;
  onAddLecture?: (lecture: Lecture) => void;
};

/**
 * EventDetails renders a read-only modal with all relevant event information.
 * If the event is assigned to a lecture, it shows the lecture color + name.
 */
export default function EventDetails({ 
  event, 
  onClose,
  lectures = [],
  people = [], 
  categories = [],
  onUpdatePersonNotes, 
  onUpdateEvent,
  onMoveEvent,
  onMoveSeries,
  onAddCategory,
  onAddPerson,
  onAddLecture,
}: EventDetailsProps) {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [showMoveSeriesDialog, setShowMoveSeriesDialog] = useState(false);
  const [showMoveConfirm, setShowMoveConfirm] = useState(false);
  let lecture = null;
  if (event.lectureId) {
    lecture = lectures.find(lec => lec.id === event.lectureId) || null;
  }

  const handleUpdate = (personId: string, notes: string) => {
    //TODO: Backend - PUT request to update person notes
    if (onUpdatePersonNotes) {
      onUpdatePersonNotes(personId, notes);
      if (selectedPerson && selectedPerson.id === personId) {
        setSelectedPerson({...selectedPerson, notes});
      }
    }
  };

  const handleUpdateEvent = (updates: Partial<CalendarEvent>) => {
    if (onUpdateEvent) {
      onUpdateEvent(event.id, updates);
    }
    setIsEditing(false);
  };

  const getEventPeople = (): Person[] => {
    if (lecture && lecture.people) {
      return lecture.people
        .map(personId => people.find(p => p.id === personId))
        .filter((p): p is Person => p !== undefined);
    }
    return [];
  };

  const eventPeople = getEventPeople();
  const getCurrentPerson = (personId: string): Person | undefined => {
    return people.find(p => p.id === personId);
  };
  const currentSelectedPerson = selectedPerson
    ? getCurrentPerson(selectedPerson.id)
    : null;

  if (isEditing) {
    return (
      <EventEditForm
        event={event}
        lectures={lectures}
        people={people}
        categories={categories}
        onAddCategory={onAddCategory}
        onAddPerson={onAddPerson}
        onAddLecture={onAddLecture}
        onSave={handleUpdateEvent}
        onCancel={() => setIsEditing(false)}
      />
    );
  }
  if (showMoveDialog) {
    return (
      <MoveEventDialog
        event={event}
        onMove={onMoveEvent}
        onCancel={() => setShowMoveDialog(false)}
        isSeries={false}
      />
    );
  }
  if (showMoveSeriesDialog) {
    return (
      <MoveEventDialog
        event={event}
        onMove={onMoveSeries}
        onCancel={() => setShowMoveSeriesDialog(false)}
        isSeries={true}
      />
    );
  }
  if (showMoveConfirm) {
    return (
      <MoveConfirmDialog
        onMoveSingle={() => {
          setShowMoveConfirm(false);
          setShowMoveDialog(true);
        }}
        onMoveSeries={() => {
          setShowMoveConfirm(false);
          setShowMoveSeriesDialog(true);
        }}
        onCancel={() => setShowMoveConfirm(false)}
      />
    );
  }
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

            {lecture?.semester && (
              <div className="cv-detailRow">
                <span className="cv-detailLabel">Semester:</span>
                <span className="cv-detailValue">{lecture.semester}</span>
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
                <div className="cv-detailValue cv-detailValuePeople">
                  <span className="cv-peopleList"> 
                    {eventPeople.map((person) => (
                      <span key={person.id} className="cv-personItem">
                        <span className="cv-personName">{person.name}</span>
                        <button
                          type="button"
                          className="cv-personDetailsBtn"
                          onClick={() => setSelectedPerson(person)}
                          aria-label={`Details zu ${person.name}`}
                          title="Details anzeigen"
                        >
                          ⓘ
                        </button>
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            )}

            {/* Status is optional; used for UI highlighting elsewhere */}
            {event.status && (
              <div className="cv-detailRow">
                <span className="cv-detailLabel">Status:</span>
                <span className="cv-detailValue">{event.status}</span>
              </div>
            )}

            {event.notes && (
              <div className="cv-detailRow cv-detailRowNotes">
                <span className="cv-detailLabel">Notizen:</span>
                <span className="cv-detailValue cv-detailValueNotes">{event.notes}</span>
              </div>
            )}
          </div>

          <div className="cv-formActions">
            <button
              type="button"
              className="cv-formBtn cv-formBtnSecondary"
              onClick={() => {
                if (event.recurrenceId) {
                  setShowMoveConfirm(true);
                } else {
                  setShowMoveDialog(true);
                }
              }
              }
            >
              Verschieben
            </button>
            
            <button
              type="button"
              className="cv-formBtn cv-formBtnSecondary"
              onClick={() => setIsEditing(true)}
            >
              Bearbeiten
            </button>
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
          onSaveNotes={handleUpdate}
        />
      )}
    </>
  );
}
