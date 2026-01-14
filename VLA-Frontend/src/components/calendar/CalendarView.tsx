import {useState } from "react";
import WeekHeader from "./WeekHeader";
import WeekGrid from "./WeekGrid";
import "../../styles/CalendarView.css";
import GoToMenu from "./GoToButton"; 
import EventForm, { type EventFormData } from "./EventForm/EventForm";
import EventDetails from "./EventDetails/EventDetails";
import { useCalendarNavigation } from "@/hooks/useCalendarNavigation";
import { useEvents } from "@/hooks/useEvents";
import { useLectures } from "@/hooks/useLectures";
import { useCategories } from "@/hooks/useCategories";



 export default function CalendarView() {
  const [showEventForm,setShowEventForm] = useState(false);
  const {days,weekStart,rangeText,prevDay,nextDay,goToDate}= useCalendarNavigation();
  const {lectures,handleAddLecture}= useLectures();
  const {categories,handleAddCategory}= useCategories();

  const {selectedEvent, eventsByDate, handleCreateEvent, handleEventClick,closeEventDetails, getEventColor  }= useEvents(lectures);

  function onEventSubmit(formData: EventFormData) {
    handleCreateEvent(formData);
    setShowEventForm(false);
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
          onClick={() => setShowEventForm(true)}
          aria-label="Neuen Termin erstellen"
          type="button"
        >
          + Termin
        </button>
      </div>

      <div className="cv-frame">
        <WeekHeader days={days} />
        <WeekGrid days={days}  eventsByDate={eventsByDate} onEventClick={handleEventClick} getEventColor={getEventColor}/>
      </div>

      {showEventForm && (
        <EventForm
          onSubmit={onEventSubmit}
          onCancel={() => setShowEventForm(false)}
          lectures={lectures}
          categories={categories}
          onAddLecture={handleAddLecture}
          onAddCategory={handleAddCategory}
        />
      )}

      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          onClose={closeEventDetails}
          lectures={lectures}
        />
      )}
    </div>
  );
}