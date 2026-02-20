import { useState } from "react";
import {formatTimeRangeShortDE} from "../dateUtils";
import PersonDetails from "./PersonDetails";
import EventEditForm from "./EventEditForm";
import "../../../styles/Event-details-styles.css";
import type {Appointment, AppointmentCategory, Lecture, Person} from "@/lib/databaseTypes";
import ExperimentSection from "@/components/experiments/ExperimentSection";
import {getEventStatus, checkPartOfSeries, getEventTitle} from "@/components/calendar/eventUtils.ts";


type EventDetailsProps = {
  event: Appointment;
  allEvents: Appointment[];
  onClose: () => void;
  lectures?: Lecture[];
  people?: Person[];
  categories?: AppointmentCategory[];
  onUpdatePersonNotes: (personId: number, notes: string) => void;
  onUpdateEventNotes: (eventId: number, notes: string) => void;
  onUpdateEvent: (eventId: number, updates: Partial<Appointment>, editSeries: boolean) => void;
  onAddCategory: (category: AppointmentCategory) => void;
  onAddPerson: (person: Person) => void;
  onAddLecture: (lecture: Lecture) => void;
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
  onUpdateEventNotes,
  onUpdateEvent,
  onAddCategory,
  onAddPerson,
  onAddLecture,
}: EventDetailsProps) {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showEditSingleDialog, setShowEditSingleDialog] = useState(false);
  const [showMoveSeriesDialog, setShowMoveSeriesDialog] = useState(false);
  const [eventNotes, setEventNotes] = useState(event.notes);

  function handlePersonNotesUpdate(personId: number, notes: string) {
    //TODO: Backend - PUT request to update person notes
    if (onUpdatePersonNotes) {
      onUpdatePersonNotes(personId, notes);
      if (selectedPerson && selectedPerson.id === personId) {
        setSelectedPerson({...selectedPerson, notes});
      }
    }
  }

  const lecture = event.series.lecture;
  const eventPeople = lecture?.persons || [];
  const currentSelectedPerson = selectedPerson || null;
  const isPartOfSeries = checkPartOfSeries(event, allEvents);

  if (showEditSingleDialog) {
    return (
      <EventEditForm
        event={event}
        isSeries={false}
        lectures={lectures}
        categories={categories}
        people={people}
        onAddCategory={onAddCategory}
        onAddPerson={onAddPerson}
        onAddLecture={onAddLecture}
        onSave={(updates) => {
          onUpdateEvent(event.id, updates, false);
          onClose();
        }}
        onCancel={() => setShowEditSingleDialog(false)}
      />
    );
  }
  if (showMoveSeriesDialog) {
    return (
      <EventEditForm
        event={event}
        isSeries={true}
        lectures={lectures}
        categories={categories}
        people={people}
        onAddCategory={onAddCategory}
        onAddPerson={onAddPerson}
        onAddLecture={onAddLecture}
        onSave={(updates) => {
          onUpdateEvent(event.id, updates, true);
          onClose();
        }}
        onCancel={() => setShowMoveSeriesDialog(false)}
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

            <ExperimentSection appointment={event}/>

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

            <textarea
              id="eventNotes"
              className="cv-notesTextarea"
              value={eventNotes}
              onChange={(e) => setEventNotes(e.target.value)}
              placeholder="Notizen zu diesem Termin..."
              rows={4}
            />
          </div>

          <div className="cv-formActions">
            {isPartOfSeries &&
              <small className="cv-formHint">
                Dieser Termin ist Teil einer Wiederholungsserie.
              </small>
            }
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
              disabled={eventNotes.trim() === event.notes}
              onClick={() => {
                onUpdateEventNotes(event.id, eventNotes);
                onClose();
              }}
            >
              Notizen speichern
            </button>
            {isPartOfSeries &&
              <button
                type="button"
                className="cv-formBtn cv-formBtnSecondary"
                onClick={() => setShowMoveSeriesDialog(true)}
              >
                Serie bearbeiten
              </button>
            }

            <button
              type="button"
              className="cv-formBtn cv-formBtnSecondary"
              onClick={() => setShowEditSingleDialog(true)}
            >
              {isPartOfSeries ? "Einzeln bearbeiten" : "Bearbeiten"}
            </button>
          </div>
        </div>
      </div>

      {currentSelectedPerson && (
        <PersonDetails
          person={currentSelectedPerson}
          onClose={() => setSelectedPerson(null)}
          onSaveNotes={handlePersonNotesUpdate}
        />
      )}
    </>
  );
}
