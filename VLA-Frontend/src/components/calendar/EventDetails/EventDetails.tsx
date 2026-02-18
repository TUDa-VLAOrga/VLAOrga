import { useState } from "react";
import {formatTimeRangeShortDE} from "../dateUtils";
import PersonDetails from "./PersonDetails";
import EventEditForm from "./EventEditForm";
import MoveEventDialog from "./MoveEventDialog";
import "../../../styles/Event-details-styles.css";
import MoveConfirmDialog from "./MoveConfirmDialog";
import type {Appointment, AppointmentCategory, Lecture, Person} from "@/lib/databaseTypes";
import {getEventStatus, getEventTitle} from "@/components/calendar/eventUtils.ts";


type EventDetailsProps = {
  event: Appointment;
  allEvents: Appointment[];
  onClose: () => void;
  lectures?: Lecture[];
  people?: Person[];
  categories?: AppointmentCategory[];
  onUpdatePersonNotes?: (personId: number, notes: string) => void;
  onUpdateEvent?: (eventId: number, updates: Partial<Appointment>) => void;
  onMoveEvent?: (eventId: number, newDateTime: Date, newEndDateTime: Date) => void;
  onMoveSeries?: (eventId: number, newDateTime: Date, newEndDateTime: Date) => void;
  onAddCategory?: (category: AppointmentCategory) => void;
  onAddPerson?: (person: Person) => void;
  onAddLecture?: (lecture: Lecture) => void;
};

/**
 * EventDetails renders a read-only modal with all relevant event information.
 * If the event is assigned to a lecture, it shows the lecture color + name.
 */
export default function EventDetails({ 
  event,
  allEvents,
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
  const lecture = event.series.lecture;

  function handleUpdate(personId: number, notes: string) {
    //TODO: Backend - PUT request to update person notes
    if (onUpdatePersonNotes) {
      onUpdatePersonNotes(personId, notes);
      if (selectedPerson && selectedPerson.id === personId) {
        setSelectedPerson({...selectedPerson, notes});
      }
    }
  };

  function handleUpdateEvent(updates: Partial<Appointment>) {
    if (onUpdateEvent) {
      onUpdateEvent(event.id, updates);
    }
    setIsEditing(false);
  };

  function getEventPeople(): Person[] {
    if (lecture && lecture.persons) {
      return lecture.persons
        .map(person => people.find(p => p.id === person.id))
        .filter((p): p is Person => p !== undefined);
    }
    return [];
  };

  const eventPeople = getEventPeople();
  function getCurrentPerson(personId: number): Person | undefined {
    return people.find(p => p.id === personId);
  };

  const currentSelectedPerson = selectedPerson ? getCurrentPerson(selectedPerson.id) : null;

  if (isEditing) {
    return (
      <EventEditForm
        event={event}
        lectures={lectures}
        categories={categories}
        people={people}
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
          <h2 className="cv-formTitle">{getEventTitle(event)}</h2>

          <div className="cv-detailsContent">
            <div className="cv-detailRow">
              <span className="cv-detailLabel">Kategorie:</span>
              <span className="cv-detailValue">{event.series.category.title}</span>
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
              <span className="cv-detailLabel">Zeit:</span>
              <span className="cv-detailValue">
                {formatTimeRangeShortDE(event.start, event.end)}
              </span>
            </div>

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
            {getEventStatus(event) && (
              <div className="cv-detailRow">
                <span className="cv-detailLabel">Status:</span>
                <span className="cv-detailValue">{getEventStatus(event)}</span>
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
                if (allEvents.filter(e => e.series.id === event.series.id).length > 1) {
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
