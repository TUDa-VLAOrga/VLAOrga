import {useState } from "react";
import WeekHeader from "./WeekHeader";
import WeekGrid from "./WeekGrid";
import "../../styles/CalendarView.css";
import GoToMenu from "./GoToButton";
import EventCreationForm, { type EventFormData } from "./EventForm/EventCreationForm.tsx";
import EventDetails from "./EventDetails/EventDetails";
import { useCalendarNavigation } from "@/hooks/useCalendarNavigation";
import { useEvents } from "@/hooks/useEvents";
import { useLectures } from "@/hooks/useLectures";
import { useCategories } from "@/hooks/useCategories";
import { usePeople } from "@/hooks/usePeople";


/**
 * CalendarView is the main screen for the calendar UI.
 * It wires together navigation (week/day range), event CRUD (currently create + view),
 * and meta data (lectures, categories) that can be used by the form and the event tiles.
 */

export default function CalendarView() {
  const [showEventForm,setShowEventForm] = useState(false);
  const {days,weekStart,rangeText,prevDay,nextDay,goToDate}= useCalendarNavigation();
  const {lectures,handleAddLecture}= useLectures();
  const {categories,handleAddCategory}= useCategories();
  const {people, handleAddPerson, handleUpdatePersonNotes}= usePeople();

  const {
    allEvents,
    selectedEventId,
    eventsByDate, 
    handleCreateEvent, 
    handleEventClick,
    closeEventDetails,
    handleUpdateEventNotes,
    handleUpdateEvent,
    handleRequestDeletion,
    handleCancelDeletionRequest,
    handleConfirmDeletion,
  } = useEvents();
 
  /**
   * Called by EventForm when the user submits.
   * Creates the event(s) (including recurrence materialization) and closes the modal.
   */
  function onEventSubmit(formData: EventFormData) {
    handleCreateEvent(formData).then(() => setShowEventForm(false));
  }

  return (
    <div className="cv-root">
      {/* Top toolbar: range navigation + date jump + "create event" */}
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
        
        {/* Date picker / jump-to control */}
        <GoToMenu currentWeekStart={weekStart} onDateSelect={goToDate} />
 
        {/* Open the create-event overlay */}
        <button
          className="cv-createBtn"
          onClick={() => setShowEventForm(true)}
          aria-label="Neuen Termin erstellen"
          type="button"
        >
          + Neuer Termin
        </button>
      </div>

      {/* Main frame: header row (weekdays) + grid with day columns */}
      <div className="cv-frame">
        <WeekHeader days={days} />
        <WeekGrid
          days={days}
          eventsByDate={eventsByDate}
          onEventClick={handleEventClick}
        />
      </div>
      {/* Modal overlay: create new event */}
      {showEventForm && (
        <EventCreationForm
          onSubmit={onEventSubmit}
          onCancel={() => setShowEventForm(false)}
          lectures={lectures}
          categories={categories}
          onAddLecture={handleAddLecture}
          onAddCategory={handleAddCategory}
          people={people}
          onAddPerson={handleAddPerson}
        />
      )}
      {/* Modal overlay: event details */}
      {selectedEventId && allEvents.find(e => e.id === selectedEventId) && (
        <EventDetails
          event={allEvents.find(e => e.id === selectedEventId)!}
          allEvents={allEvents}
          onClose={closeEventDetails}
          lectures={lectures}
          people={people}
          categories={categories}
          onUpdatePersonNotes={handleUpdatePersonNotes}
          onUpdateEventNotes={handleUpdateEventNotes}
          onUpdateEvent={handleUpdateEvent}
          onAddCategory={handleAddCategory}
          onAddPerson={handleAddPerson}
          onAddLecture={handleAddLecture}
          onRequestDeletion={handleRequestDeletion}
          onCancelDeletionRequest={handleCancelDeletionRequest}
          onConfirmDeletion={handleConfirmDeletion}
          currentUserId={2}// temporär für mock test
        />
      )}
    </div>
  );
}
