import type { AppointmentMatching } from "@/lib/databaseTypes";
import LinusAppointmentMatch from "./LinusAppointmentMatch";
import "@/styles/AppointmentMatching.css";
import { type Dispatch, type SetStateAction } from "react";
import { Button } from "../ui/Button";
import type {CalendarEvent} from "@/components/calendar/CalendarTypes.ts";

interface LinusAppointmentMatcherProps {
  appointmentMatchings: AppointmentMatching[],
  setAppointmentMatcherVisible: Dispatch<SetStateAction<boolean>>,
  visible: boolean,
  events: CalendarEvent[],
  calendarStartMinSinceMidnight: number,
  calendarEndMinSinceMidnight: number,
}

export default function LinusAppointmentMatcher({
  appointmentMatchings,
  setAppointmentMatcherVisible,
  visible,
  events,
  calendarStartMinSinceMidnight,
  calendarEndMinSinceMidnight,
}
: LinusAppointmentMatcherProps)
{
  return (
    <div className="linusAppointmentMatcherContainer" style={{display: !visible ? "none" : undefined}}>
      <div className="linusAppointmentMatcherTop">
        <span></span>
        <span className="linusAppointmentMatcherTitle">Linus Terminzuordnung</span>
        <span className="linusAppointmentMatcherClose">
          <Button text={"Schließen"} marginBottom="0" onClick={() => setAppointmentMatcherVisible(false)}/>
        </span>
      </div>

      <div className="matchingColumn">
        {appointmentMatchings.map(matching =>
          <LinusAppointmentMatch
            matching={matching}
            key={matching.id}
            events={events}
            calendarStartMinSinceMidnight={calendarStartMinSinceMidnight}
            calendarEndMinSinceMidnight={calendarEndMinSinceMidnight}
          />
        )}
      </div>
    </div>
  );
}
