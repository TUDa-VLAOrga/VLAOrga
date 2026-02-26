import type { Appointment, AppointmentMatching } from "@/lib/databaseTypes";
import LinusAppointmentMatchEntry from "./LinusAppointmentMatchEntry";
import AppointmentMatchEntry from "./AppointmentMatchEntry";
import "@/styles/AppointmentMatching.css"

interface LinusAppointmentMatchProps {
    matching: AppointmentMatching,
    appointments: Appointment[],
}

export default function LinusAppointmentMatch({matching, appointments} : LinusAppointmentMatchProps){
    return (
        <>
        <div className="concreteMatchContainer">
            <div className="matchGrid">
                <div>
                    <LinusAppointmentMatchEntry linusAppointmentId={matching.linusAppointmentId}/>
                </div>
                <div>
                    <AppointmentMatchEntry matching={matching} appointments={appointments}/>
                </div>
            </div>
        </div>
        </>
    );
}