import type { AppointmentMatching } from "@/lib/databaseTypes";
import LinusAppointmentMatchEntry from "./LinusAppointmentMatchEntry";
import AppointmentMatchEntry from "./AppointmentMatchEntry";
import "@/styles/AppointmentMatching.css";
import type {CalendarEvent} from "@/components/calendar/CalendarTypes.ts";

interface LinusAppointmentMatchProps {
  matching: AppointmentMatching,
  events: CalendarEvent[],
}

export default function LinusAppointmentMatch({matching, events} : LinusAppointmentMatchProps){
  return (
    <>
      <div className="concreteMatchContainer">
        <div className="matchGrid">
          <div>
            <LinusAppointmentMatchEntry linusAppointmentId={matching.linusAppointmentId}/>
          </div>
          <div>
            <AppointmentMatchEntry matching={matching} events={events}/>
          </div>
        </div>
      </div>
    </>
  );
}
