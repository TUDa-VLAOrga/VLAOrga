import type { Appointment, AppointmentMatching } from "@/lib/databaseTypes";
import LinusAppointmentMatch from "./LinusAppointmentMatch";
import "@/styles/AppointmentMatching.css"
import { type Dispatch, type SetStateAction } from "react";
import { Button } from "../ui/Button";

interface LinusAppointmentMatcherProps {
    appointmentMatching: AppointmentMatching[],
    setAppointmentMatcherVisible: Dispatch<SetStateAction<boolean>>,
    visible: boolean,
    appointments: Appointment[],
}

export default function LinusAppointmentMatcher({
    appointmentMatching,
    setAppointmentMatcherVisible,
    visible,
    appointments
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
                {appointmentMatching.map(matching => <LinusAppointmentMatch matching={matching} key={matching.id} appointments={appointments}/>)}
            </div>
        </div>
    );
}