import type React from "react";
import { useState } from "react";
import WeekHeader from "./WeekHeader";
import WeekGrid from "./WeekGrid";
import "../../styles/CalendarView.css";
import GoToMenu from "./GoToButton";
import AddEventForm, { type EventFormData } from "./EventForm/AddEventForm.tsx";
import EventDetails from "./EventDetails/EventDetails";
import { useCalendarNavigation } from "@/hooks/useCalendarNavigation";
import { useEvents } from "@/hooks/useEvents";
import { useLectures } from "@/hooks/useLectures";
import { useCategories } from "@/hooks/useCategories";
import { usePeople } from "@/hooks/usePeople";
import AppointmentMatchingButton from "../linusAppointmentMatcher/AppointmentMatchingButton.tsx";
import { useAppointmentMatcher } from "@/hooks/useAppointmentMatcher.ts";
import LogoutButton from "./LogoutButton.tsx";
import {useUsers} from "@/hooks/useUsers.ts";
import type {CalendarEvent} from "@/components/calendar/CalendarTypes.ts";
import {isCalendarEventAcceptance} from "@/components/calendar/eventUtils.ts";

/*
 * CalendarView is the main screen for the calendar UI.
 * It wires together navigation (week/day range), event CRUD (currently create + view),
 * and meta data (lectures, categories) that can be used by the form and the event tiles.
 */
export default function CalendarView() {

  // === bits for display logic ===
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  // since we have two entity types mixe in allEvents, we need two flags
  const [selectedAcceptanceId, setselectedAcceptanceId] = useState<number | undefined>(undefined);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | undefined>(undefined);
  function handleEventClick(event: CalendarEvent) {
    if (isCalendarEventAcceptance(event)) {
      setselectedAcceptanceId(event.id);
      setSelectedAppointmentId(undefined);
    } else {
      setSelectedAppointmentId(event.id);
      setselectedAcceptanceId(undefined);
    }
  }
  function closeEventDetails() {
    setSelectedAppointmentId(undefined);
    setselectedAcceptanceId(undefined);
  }

  // === stateful stuff  ===
  const { days, weekStart, rangeText, prevDay, nextDay, goToDate } = useCalendarNavigation();
  const { lectures, handleAddLecture, handleUpdateLecture } = useLectures();
  const { categories, handleAddCategory } = useCategories();
  const { people, handleAddPerson, handleUpdatePersonNotes } = usePeople();
  const { currentUserId } = useUsers();

  const {
    allEvents,
    eventsByDate,
    handleCreateEvent, 
    handleUpdateEventNotes,
    handleUpdateEvent,
    handleDeletion,
    handleCancelDeletionRequest,
    handleAcceptanceSeriesCreate,
    handleAcceptanceUpdate,
    handleAcceptanceDeletion,
  } = useEvents();

  const missingAppointmentMatchings = useAppointmentMatcher({days, allEvents});
 
  /**
   * Called by EventForm when the user submits.
   */
  function onEventSubmit(formData: EventFormData) {
    handleCreateEvent(formData).then(() => setShowAddEventForm(false));
  }

 

  return (
    <div className="cv-root">
      <div className="cv-toolbar" aria-label="Zeitnavigation">
        <button
          className="cv-navBox"
          onClick={prevDay}
          aria-label="Vorherige 5 Arbeitstage"
          type="button"
        />

        <div className="cv-range" aria-label="Datumsbereich">
          {rangeText}
        </div>

        <button
          className="cv-navBox"
          onClick={nextDay}
          aria-label="Nächste 5 Arbeitstage"
          type="button"
        />

        <GoToMenu currentWeekStart={weekStart} onDateSelect={goToDate} />

        <button
          className="cv-createBtn"
          onClick={() => setShowAddEventForm(true)}
          type="button"
          aria-label="Neuen Termin erstellen"
        >
          + Neuer Termin
        </button>

        <AppointmentMatchingButton appointmentMatchings={missingAppointmentMatchings} events={allEvents}/>

        <LogoutButton/>
      </div>

      <div
        className="cv-frame"
        style={{ "--cv-day-count": String(days.length) } as React.CSSProperties}
      >
        <div className="cv-scrollContent">
          <WeekHeader days={days} />

          <WeekGrid
            days={days}
            eventsByDate={eventsByDate}
            allEvents={allEvents}
            onEventClick={handleEventClick}
          />
        </div>
      </div>

      {showAddEventForm && (
        <AddEventForm
          onSubmit={onEventSubmit}
          onCancel={() => setShowAddEventForm(false)}
          lectures={lectures}
          categories={categories}
          onAddLecture={handleAddLecture}
          onAddCategory={handleAddCategory}
          people={people}
          onAddPerson={handleAddPerson}
        />
      )}
      {/* Modal overlay: event details */}
      {(selectedAppointmentId || selectedAcceptanceId) &&
        <EventDetails
          event={selectedAcceptanceId
            ? allEvents.find(ev => isCalendarEventAcceptance(ev) && ev.id === selectedAcceptanceId)!
            : allEvents.find(ev => !isCalendarEventAcceptance(ev) && ev.id === selectedAppointmentId)!
          }
          allEvents={allEvents}
          onClose={closeEventDetails}
          lectures={lectures}
          people={people}
          categories={categories}
          onUpdatePersonNotes={handleUpdatePersonNotes}
          onUpdateEventNotes={handleUpdateEventNotes}
          onUpdateEvent={handleUpdateEvent}
          onAddAcceptance={handleAcceptanceSeriesCreate}
          onUpdateAcceptance={handleAcceptanceUpdate}
          onDeleteAcceptance={handleAcceptanceDeletion}
          onAddCategory={handleAddCategory}
          onAddPerson={handleAddPerson}
          onAddLecture={handleAddLecture}
          onUpdateLecture={handleUpdateLecture}
          onDeletion={handleDeletion}
          onCancelDeletionRequest={handleCancelDeletionRequest}
          currentUserId={currentUserId}
        />
      }
    </div>
  );
}
