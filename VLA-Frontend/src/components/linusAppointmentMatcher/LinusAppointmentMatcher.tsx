import type { AppointmentMatching } from "@/lib/databaseTypes";
import LinusAppointmentMatch from "./LinusAppointmentMatch";
import "@/styles/AppointmentMatching.css"

interface LinusAppointmentMatcherProps {
    appointmentMatching: AppointmentMatching[]
}

export default function LinusAppointmentMatcher({appointmentMatching} : LinusAppointmentMatcherProps){

    return (
        <div className="linusAppointmentMatcherContainer">
            <div className="matchingColumn">
                <div className="linusProposedAppointmentsRow">
                    {appointmentMatching.map(matching => <LinusAppointmentMatch matching={matching}/>)}
                </div>
            </div>
        </div>
    );
}