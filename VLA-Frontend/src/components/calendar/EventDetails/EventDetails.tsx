import { useState } from "react";
import {formatDateAndTime, formatTimeRangeShortDE} from "../dateUtils";
import PersonDetails from "./PersonDetails";
import EventEditForm from "./EventEditForm";
import "../../../styles/Event-details-styles.css";
import type {Appointment, AppointmentCategory, Lecture, Person} from "@/lib/databaseTypes";
import {
  checkPartOfSeries,
  getEventNotes,
  getEventStatus,
  getEventTitle,
  isCalendarEventAcceptance
} from "@/components/calendar/eventUtils.ts";
import AddAcceptanceForm from "@/components/calendar/EventForm/AddAcceptanceForm.tsx";
import type {CalendarEvent} from "@/components/calendar/CalendarTypes.ts";


type EventDetailsProps = {
  event: CalendarEvent;
  allEvents: CalendarEvent[];
  onClose: () => void;
  lectures: Lecture[];
  people: Person[];
  categories: AppointmentCategory[];
  onUpdatePersonNotes: (personId: number, notes: string) => void;
  onUpdateEventNotes: (eventId: number, notes: string) => void;
  onUpdateEvent: (eventId: number, updates: Partial<Appointment>, editSeries: boolean) => void;
  onAddCategory: (category: AppointmentCategory) => Promise<AppointmentCategory | void>;
  onAddPerson: (person: Person) => Promise<Person | void>;
  onAddLecture: (lecture: Lecture) => Promise<Lecture | void>;
};

/**
 * EventDetails renders a read-only modal with all relevant event information.
 * If the event is assigned to a lecture, it shows the lecture color + name.
 */
export default function EventDetails({ 
  event,
  allEvents,
  onClose,
  lectures,
  people,
  categories,
  onUpdatePersonNotes,
  onUpdateEventNotes,
  onUpdateEvent,
  onAddCategory,
  onAddPerson,
  onAddLecture,
}: EventDetailsProps) {
  // toggles for other popups
  const [selectedPersonId, setSelectedPersonId] = useState<number>();
  const [showEditSingleDialog, setShowEditSingleDialog] = useState(false);
  const [showMoveSeriesDialog, setShowMoveSeriesDialog] = useState(false);
  const [showCreateAcceptanceDialog, setShowCreateAcceptanceDialog] = useState(false);

  // local state for note editing
  const [eventNotes, setEventNotes] = useState(getEventNotes(event));

  function handlePersonNotesUpdate(personId: number, notes: string) {
    if (onUpdatePersonNotes) {
      onUpdatePersonNotes(personId, notes.trim());
    }
  }

  function mailToPersons(persons:Person[]) {
    const mails: string[] = persons.filter(person => person.email != "").map(person => person.email);
    if(mails.length > 0){
      window.location.href = "mailto:" + mails.join(",");
    }
  }

  const isPartOfSeries = checkPartOfSeries(event, allEvents);
  const isAcceptance = isCalendarEventAcceptance(event);
  const referenceEvent: Appointment = isAcceptance ? event.appointment : event;

  if (showEditSingleDialog && !isAcceptance) {
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
  } else if (showEditSingleDialog && isAcceptance) {
    // ToDo: show EditAcceptanceForm w/o series
  }
  if (showMoveSeriesDialog && !isAcceptance) {
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
  if (showCreateAcceptanceDialog && !isAcceptance) {
    return (
      <AddAcceptanceForm
        event={event}
        allEvents={allEvents}
        onSubmit={(_eventId, _startTime, _endTime) => {
          // TODO: implement
          return new Promise((_resolve, _reject) => {return;});
        }}
        onClose={() => setShowCreateAcceptanceDialog(false)}
      />
    );
  }
  return (
    <>
      <div className="cv-formOverlay">
        <div className="cv-formBox">
          {!isAcceptance &&
          <div>
            <button
              className="cv-floatRight cv-formBtn cv-formBtnSecondary"
              onClick={() => setShowCreateAcceptanceDialog(true)}
            >
              +&nbsp;Abnahmetermin
            </button>
            <h2 className="cv-formTitle">{getEventTitle(event)}</h2>
          </div>
          }
          {isAcceptance &&
              <div>
                <h2 className="cv-formTitle">Abnahmetermin</h2>
                <h5 className="cv-formTitle">
                  für {getEventTitle(event.appointment)} am {formatDateAndTime(event.appointment.startTime)}
                </h5>
              </div>
          }

          <div className="cv-detailsContent">
            <div className="cv-detailRow">
              <span className="cv-detailLabel">Kategorie:</span>
              <span className="cv-detailValue">{referenceEvent.series.category.title}</span>
            </div>

            {/* Lecture details (only if lecture is assigned) */}
            {referenceEvent.series.lecture && (
              <div className="cv-detailRow">
                <span className="cv-detailLabel">Vorlesung:</span>
                <span className="cv-detailValue">
                  <span className="cv-detailValueLecture ">
                    <span
                      className="cv-lectureSwatch"
                      style={{ backgroundColor: referenceEvent.series.lecture.color }}
                    />
                    <span className="cv-lectureName">{referenceEvent.series.lecture.name}</span>
                  </span>
                </span>
              </div>
            )}

            {referenceEvent.series.lecture?.semester && (
              <div className="cv-detailRow">
                <span className="cv-detailLabel">Semester:</span>
                <span className="cv-detailValue">{referenceEvent.series.lecture.semester}</span>
              </div>
            )}

            <div className="cv-detailRow">
              <span className="cv-detailLabel">Zeit:</span>
              <span className="cv-detailValue">
                {formatTimeRangeShortDE(event.startTime, event.endTime)}
              </span>
            </div>

            {referenceEvent.series.lecture && referenceEvent.series.lecture?.persons.length > 0 && (
              <div className="cv-detailRow">
                <span className="cv-detailLabelPeople"> 
                  <span className="cv-detailLabel">Personen:</span>
                  <button
                    type="button"
                    className="cv-formBtn cv-formBtnSecondary"
                    onClick={() => mailToPersons(referenceEvent.series.lecture!.persons)}
                  >
                    {"Email an Alle"}
                  </button>
                </span>
                <div className="cv-detailValue cv-detailValuePeople">
                  <span className="cv-peopleList"> 
                    {referenceEvent.series.lecture?.persons.map((person) => (
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
            {!isAcceptance && getEventStatus(event) && (
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
              disabled={typeof eventNotes === "string" && eventNotes.trim() === getEventNotes(event)}
              onClick={() => {
                onUpdateEventNotes(event.id, eventNotes);
                onClose();
              }}
            >
              Notizen speichern
            </button>
            {isPartOfSeries && !isAcceptance &&
              // We do not allow editing acceptances in series for simplicity of code logic
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
