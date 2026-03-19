import type { AppointmentMatching } from "@/lib/databaseTypes";
import LinusAppointmentMatchEntry from "./LinusAppointmentMatchEntry";
import AppointmentMatchEntry from "./AppointmentMatchEntry";
import "@/styles/AppointmentMatching.css";
import type {CalendarEvent} from "@/components/calendar/CalendarTypes.ts";

interface LinusAppointmentMatchProps {
  matching: AppointmentMatching,
  events: CalendarEvent[],
  calendarStartMinSinceMidnight: number,
  calendarEndMinSinceMidnight: number,
}

export default function LinusAppointmentMatch({
  matching,
  events,
  calendarStartMinSinceMidnight,
  calendarEndMinSinceMidnight,
} : LinusAppointmentMatchProps)
{
  return (
    <>
      <div className="concreteMatchContainer">
        <div className="matchGrid">
          <div>
            <LinusAppointmentMatchEntry linusAppointmentId={matching.linusAppointmentId}/>
          </div>
          <div>
            <AppointmentMatchEntry
              matching={matching}
              events={events}
              calendarStartMinSinceMidnight={calendarStartMinSinceMidnight}
              calendarEndMinSinceMidnight={calendarEndMinSinceMidnight}
            />
          </div>
        </div>
      </div>
    </>
  );
}
