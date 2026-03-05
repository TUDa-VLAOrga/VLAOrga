import type React from "react";
import { useState } from "react";
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

export default function CalendarView() {
  
  const [showEventForm, setShowEventForm] = useState(false);
  const { days, weekStart, rangeText, prevDay, nextDay, goToDate } = useCalendarNavigation();
  const { lectures, handleAddLecture } = useLectures();
  const { categories, handleAddCategory } = useCategories();
  const { people, handleAddPerson, handleUpdatePersonNotes } = usePeople();

  const {
    allEvents,
    selectedEventId,
    eventsByDate, 
    handleCreateEvent, 
    handleEventClick,
    closeEventDetails,
    handleUpdateEventNotes,
    handleUpdateEvent,
  } = useEvents();

  /**
   * Called by EventForm when the user submits.
   */
  function onEventSubmit(formData: EventFormData) {
    handleCreateEvent(formData).then(() => setShowEventForm(false));
  }

  const frameStyleVars: React.CSSProperties & Record<string, number> = {
    "--cv-day-count": days.length,
  };

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
          onClick={() => setShowEventForm(true)}
          type="button"
          aria-label="Neuen Termin erstellen"
        >
          + Neuer Termin
        </button>
      </div>

      <div className="cv-frame" style={frameStyleVars}>
        <div className="cv-scrollContent">
          <WeekHeader days={days} />

          <WeekGrid
            days={days}
            eventsByDate={eventsByDate}
            onEventClick={handleEventClick}
          />
        </div>
      </div>

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
      {selectedEventId && (
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
        />
      )}
    </div>
  );
}
