import { useState } from "react";
import {formatDateAndTime, formatTimeRangeLongerDE} from "../dateUtils";
import PersonDetails from "./PersonDetails";
import EventEditForm from "./EventEditForm";
import "../../../styles/EventDetailsStyles.css";
import LectureEditForm from "./LectureEditForm";
import "../../../styles/EventDetailsStyles.css";
import type {Acceptance, Appointment, AppointmentCategory, Lecture, Person} from "@/lib/databaseTypes";
import {
  checkPartOfSeries,
  getEventStatus,
  getEventTitle,
  isCalendarEventAcceptance, retrieveAppointment
} from "@/components/calendar/eventUtils.ts";
import AddAcceptanceForm from "@/components/calendar/EventForm/AddAcceptanceForm.tsx";
import type {CalendarEvent} from "@/components/calendar/CalendarTypes.ts";
import AcceptanceEditForm from "@/components/calendar/EventDetails/AcceptanceEditForm.tsx";
import ExperimentSection from "@/components/experiments/ExperimentSection";


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
  onAddAcceptance: (appointmentId: number, startTime: Date, endTime: Date) => Promise<Acceptance | void>;
  onUpdateAcceptance: (acceptanceId: number, startTime: Date, endTime: Date) => Promise<Acceptance | void>;
  onDeleteAcceptance: (acceptanceId: number) => Promise<void>;
  onAddCategory: (category: AppointmentCategory) => Promise<AppointmentCategory | void>;
  onAddPerson: (person: Person) => Promise<Person | void>;
  onAddLecture: (lecture: Lecture) => Promise<Lecture | void>;
  onUpdateLecture: (lecture: Lecture) => Promise<Lecture | void>;
  onDeletion: (eventId: number) => Promise<Appointment | string>;
  onCancelDeletionRequest: (eventId: number) => Promise<void>;
  currentUserId?: number;
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
  onAddAcceptance,
  onUpdateAcceptance,
  onDeleteAcceptance,
  onAddCategory,
  onAddPerson,
  onAddLecture,
  onUpdateLecture,
  onDeletion,
  onCancelDeletionRequest,
  currentUserId,
}: EventDetailsProps) {
  // toggles for other popups
  const [selectedPersonId, setSelectedPersonId] = useState<number>();
  const [showEditSingleDialog, setShowEditSingleDialog] = useState(false);
  const [showMoveSeriesDialog, setShowMoveSeriesDialog] = useState(false);
  const [showCreateAcceptanceDialog, setShowCreateAcceptanceDialog] = useState(false);
  const [showEditLectureDialog, setShowEditLectureDialog] = useState(false);


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
  const appointment: Appointment = retrieveAppointment(event, allEvents);
  // local state for note editing
  const [eventNotes, setEventNotes] = useState(appointment.notes);


  const [deletionBlocked, setDeletionBlocked] = useState((
    !isAcceptance
    && allEvents
      .filter(isCalendarEventAcceptance)
      .filter(acc => acc.appointment.id == appointment.id)
      .length > 0
  ) ? "Dieser Termin kann noch nicht gelöscht werden, da Abnahmetermine verknüpft sind." : "");
  // double-deletion logic for appointments
  const isDeletionPending = isAcceptance ? false : Boolean(event.deletingIntentionUser);
  const deletingUser = isAcceptance ? null : event.deletingIntentionUser;
  const isOwnDeletionRequest = deletingUser != null && deletingUser.id === currentUserId;
  const canConfirmDeletion = deletingUser != null && !isOwnDeletionRequest;

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
    return (
      <AcceptanceEditForm
        acceptance={event}
        referenceAppointment={appointment}
        onSubmit={(acceptanceId, startTime, endTime) => {
          return onUpdateAcceptance(acceptanceId, startTime, endTime).then(() => setShowEditSingleDialog(false));
        }}
        onClose={() => setShowEditSingleDialog(false)}
      />
    );
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
        onSubmit={(appointmentId, startTime, endTime) => {
          return onAddAcceptance(appointmentId, startTime, endTime).then(() => setShowCreateAcceptanceDialog(false));
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
            <h2 className="cv-formTitle">{getEventTitle(event, allEvents)}</h2>
          </div>
          }
          {isAcceptance &&
              <div>
                <h2 className="cv-formTitle">Abnahmetermin</h2>
                <h3 className="cv-formSubtitle">
                  für {getEventTitle(appointment)} am {formatDateAndTime(appointment.startTime)}
                </h3>
              </div>
          }

          <div className="cv-detailsContent">
            <div className="cv-detailRow">
              <span className="cv-detailLabel">Kategorie:</span>
              <span className="cv-detailValue">{appointment.series.category.title}</span>
            </div>

            {/* Lecture details (only if lecture is assigned) */}
            {appointment.series.lecture && (
              <div className="cv-detailRow">
                <span className="cv-detailLabel">Vorlesung:</span>
                <span className="cv-detailValue">
                  <span className="cv-detailValueLecture ">
                    <span
                      className="cv-lectureSwatch"
                      style={{ backgroundColor: appointment.series.lecture.color }}
                    />
                    <span className="cv-lectureName">{appointment.series.lecture.name}</span>
                    <button
                      type="button"
                      className="cv-personDetailsBtn"
                      onClick={() => setShowEditLectureDialog(true)}
                      title="Vorlesung bearbeiten"
                    >
                    </button>
                  </span>
                </span>
              </div>
            )}

            {appointment.series.lecture?.semester && (
              <div className="cv-detailRow">
                <span className="cv-detailLabel">Semester:</span>
                <span className="cv-detailValue">{appointment.series.lecture.semester}</span>
              </div>
            )}

            <div className="cv-detailRow">
              <span className="cv-detailLabel">Zeit:</span>
              <span className="cv-detailValue">
                {formatTimeRangeLongerDE(event.startTime, event.endTime)}
              </span>
            </div>

            <ExperimentSection appointment={appointment} />

            {appointment.series.lecture && appointment.series.lecture?.persons.length > 0 && (
              <div className="cv-detailRow">
                <span className="cv-detailLabelPeople"> 
                  <span className="cv-detailLabel">Personen:</span>
                  <button
                    type="button"
                    className="cv-formBtn cv-formBtnSecondary"
                    onClick={() => mailToPersons(appointment.series.lecture!.persons)}
                  >
                    {"Email an Alle"}
                  </button>
                </span>
                <div className="cv-detailValue cv-detailValuePeople">
                  <span className="cv-peopleList"> 
                    {appointment.series.lecture?.persons.map((person) => (
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
                        </button>
                        { people.find((p) => p.id == person.id)?.notes !== "" && (
                          <span className="cv-notesIcon">
                            {""}
                          </span>
                        )}
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
              disabled={typeof eventNotes === "string" && eventNotes.trim() === appointment.notes}
              onClick={() => {
                onUpdateEventNotes(appointment.id, eventNotes);
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
          <div className="cv-formActions">
            {deletionBlocked &&
              <div className="cv-hintBanner cv-deletionHintBanner">
                {deletionBlocked}
              </div>
            }
            {!deletionBlocked && deletingUser &&
                <div className="cv-hintBanner cv-deletionRequestBanner">
                  <span className="cv-deletionRequestIcon">⚠️</span>
                  <span>
                    {isOwnDeletionRequest
                      ? "Sie haben die Löschung dieses Termins beantragt. Ein zweiter Nutzer muss sie bestätigen."
                      : `${deletingUser.name} hat die Löschung dieses Termins beantragt. Sie können sie ausführen.`}
                  </span>
                </div>
            }
            {!deletionBlocked && !isDeletionPending && (
              <button
                type="button"
                className="cv-formBtn cv-formBtnDanger"
                disabled={isDeletionPending}
                onClick={() => {
                  if (isAcceptance)
                    onDeleteAcceptance(event.id).then(() => onClose());
                  else
                    onDeletion(event.id).then((errorStr: Appointment | string) => {
                      // string returned => error message, otherwise success
                      if (typeof errorStr === "string") {
                        setDeletionBlocked(errorStr);
                      }
                    });
                }}
              >
                Löschen
              </button>
            )}
            {!deletionBlocked && canConfirmDeletion && (
              <button
                type="button"
                className="cv-formBtn cv-formBtnDanger"
                onClick={() => onDeletion(event.id).then(
                  (errorStr: Appointment | string) => {
                    // string returned => error message, otherwise success
                    if (typeof errorStr === "string") {
                      setDeletionBlocked(errorStr);
                    }
                  })}
              >
                Löschung bestätigen
              </button>
            )}
            {!deletionBlocked && isDeletionPending &&
              <button
                type="button"
                className="cv-formBtn cv-formBtnDanger cv-formBtnOutline"
                onClick={() => onCancelDeletionRequest(event.id)}
              >
                Löschanfrage zurückziehen
              </button>
            }
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
      {showEditLectureDialog && (
        <LectureEditForm
          lecture={appointment.series.lecture!}
          people={people}
          onCancel={() => setShowEditLectureDialog(false)}
          onSubmit={(lecture) => {
            onUpdateLecture(lecture)
              .then(() => setShowEditLectureDialog(false));
          }}
          onAddPerson={onAddPerson}
        />
      )}
    </>
  );
}
