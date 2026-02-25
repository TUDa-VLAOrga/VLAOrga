import { useState } from "react";
import {formatTimeRangeShortDE} from "../dateUtils";
import PersonDetails from "./PersonDetails";
import EventEditForm from "./EventEditForm";
import "../../../styles/Event-details-styles.css";
import type {Appointment, AppointmentCategory, Lecture, Person} from "@/lib/databaseTypes";
import {checkPartOfSeries, getEventStatus, getEventTitle} from "@/components/calendar/eventUtils.ts";


type EventDetailsProps = {
  event: Appointment;
  allEvents: Appointment[];
  onClose: () => void;
  lectures?: Lecture[];
  people: Person[];
  categories?: AppointmentCategory[];
  onUpdatePersonNotes: (personId: number, notes: string) => void;
  onUpdateEventNotes: (eventId: number, notes: string) => void;
  onUpdateEvent: (eventId: number, updates: Partial<Appointment>, editSeries: boolean) => void;
  onAddCategory: (category: AppointmentCategory) => void;
  onAddPerson: (person: Person) => Promise<Person>;
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
  people,
  categories = [],
  onUpdatePersonNotes,
  onUpdateEventNotes,
  onUpdateEvent,
  onAddCategory,
  onAddPerson,
  onAddLecture,
}: EventDetailsProps) {
  const [selectedPersonId, setSelectedPersonId] = useState<number>();
  const [showEditSingleDialog, setShowEditSingleDialog] = useState(false);
  const [showMoveSeriesDialog, setShowMoveSeriesDialog] = useState(false);
  const [eventNotes, setEventNotes] = useState(event.notes);

  function handlePersonNotesUpdate(personId: number, notes: string) {
    if (onUpdatePersonNotes) {
      onUpdatePersonNotes(personId, notes.trim());
    }
  }

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
            {event.series.lecture && (
              <div className="cv-detailRow">
                <span className="cv-detailLabel">Vorlesung:</span>
                <span className="cv-detailValue">
                  <span className="cv-detailValueLecture ">
                    <span
                      className="cv-lectureSwatch"
                      style={{ backgroundColor: event.series.lecture.color }}
                    />
                    <span className="cv-lectureName">{event.series.lecture.name}</span>
                  </span>
                </span>
              </div>
            )}

            {event.series.lecture?.semester && (
              <div className="cv-detailRow">
                <span className="cv-detailLabel">Semester:</span>
                <span className="cv-detailValue">{event.series.lecture.semester}</span>
              </div>
            )}

            <div className="cv-detailRow">
              <span className="cv-detailLabel">Zeit:</span>
              <span className="cv-detailValue">
                {formatTimeRangeShortDE(event.start, event.end)}
              </span>
            </div>

            {event.series.lecture && event.series.lecture?.persons.length > 0 && (
              <div className="cv-detailRow">
                <span className="cv-detailLabel">Personen:</span>
                <div className="cv-detailValue cv-detailValuePeople">
                  <span className="cv-peopleList"> 
                    {event.series.lecture?.persons.map((person) => (
                      <span key={person.id} className="cv-personItem">
                        {/* Need to use people (state from usePeople) here, since lecture.persons
                         include probably old versions of the person entity. */}
                        <span className="cv-personName">{people.find((p) => p.id == person.id)?.name}</span>
                        <button
                          type="button"
                          className="cv-personDetailsBtn"
                          onClick={() => setSelectedPersonId(person.id)}
                          aria-label={`Details zu ${people.find((p) => p.id == selectedPersonId)?.name} anzeigen`}
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

      {selectedPersonId && people.find((p) => p.id === selectedPersonId) && (
        <PersonDetails
          person={people.find((p) => p.id === selectedPersonId)!}
          onClose={() => setSelectedPersonId(undefined)}
          onSaveNotes={handlePersonNotesUpdate}
        />
      )}
    </>
  );
}
