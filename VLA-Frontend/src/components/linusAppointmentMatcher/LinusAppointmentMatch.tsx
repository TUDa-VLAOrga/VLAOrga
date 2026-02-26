import type { AppointmentMatching } from "@/lib/databaseTypes";
import LinusAppointmentMatchEntry from "./LinusAppointmentMatchEntry";
import AppointmentMatchEntry from "./AppointmentMatchEntry";
import "@/styles/AppointmentMatching.css"

interface LinusAppointmentMatchProps {
    matching: AppointmentMatching
}

export default function LinusAppointmentMatch({matching} : LinusAppointmentMatchProps){
    return (
        <>
            <div className="matchGrid">
                <div><LinusAppointmentMatchEntry linusAppointmentId={matching.linusAppointmentId}/></div>
                <div><AppointmentMatchEntry linusAppointmentId={matching.linusAppointmentId}/></div>
            </div>
            <>Zuweisen button</>
        </>
    );
}