import { useEffect, useState } from "react";
import LinusAppointmentMatcher from "./LinusAppointmentMatcher";
import type { AppointmentMatching } from "@/lib/databaseTypes";
import type {CalendarEvent} from "@/components/calendar/CalendarTypes.ts";

interface AppointmentMatchingButtonsProps {
  appointmentMatchings: AppointmentMatching[],
  events: CalendarEvent[],
  calendarStartMinSinceMidnight: number,
  calendarEndMinSinceMidnight: number,
}

export default function AppointmentMatchingButton({
  appointmentMatchings,
  events,
  calendarStartMinSinceMidnight,
  calendarEndMinSinceMidnight,
} 
: AppointmentMatchingButtonsProps)
{
  const [
    appointmentMatchingVisible,
    setAppointmentMatchingVisible,
  ] = useState<boolean>(false);

  const [
    showMatchTaskIcon,
    setShowMatchTaskIcon,
  ] = useState<boolean>(false);

  useEffect(() => {
    setShowMatchTaskIcon(appointmentMatchings.length !== 0);
  }, [appointmentMatchings]);
    
  return (
    <>
      <button
        className={"cv-createBtn " + (showMatchTaskIcon ? "cv-linusMatchReadyButton" : "")}
        onClick={() => setAppointmentMatchingVisible(!appointmentMatchingVisible)}
        aria-label="Linussynchronisationsbutton"
        title="Synchronisation für Linustermine"
        type="button"
      >
        Linus
        {showMatchTaskIcon &&
        <span className="cv-linusJoinIcon">⨝</span>
        }
      </button>

      <LinusAppointmentMatcher
        appointmentMatchings={appointmentMatchings}
        setAppointmentMatcherVisible={setAppointmentMatchingVisible}
        visible={appointmentMatchingVisible}
        events={events}
        calendarStartMinSinceMidnight={calendarStartMinSinceMidnight}
        calendarEndMinSinceMidnight={calendarEndMinSinceMidnight}
      />
    </>
  );
}
