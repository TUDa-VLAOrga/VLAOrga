import { useState } from "react"
import LinusAppointmentMatcher from "./LinusAppointmentMatcher";
import type { AppointmentMatching } from "@/lib/databaseTypes";

interface AppointmentMatchingButtonsProps {
  appointmentMatching: AppointmentMatching[]
}

export default function AppointmentMatchingButton({appointmentMatching} : AppointmentMatchingButtonsProps) {
    const [
        appointmentMatchingVisible,
        setAppointmentMatchingVisible
    ] = useState<boolean>(false);
    
    return (
      <>
        <button
          className="cv-createBtn"
          onClick={() => setAppointmentMatchingVisible(!appointmentMatchingVisible)}
          aria-label="Linussynchronisationsbutton"
          title="Synchronisation für Linustermine"
          type="button"
        >
          Linus
        </button>
        {appointmentMatchingVisible &&
          <LinusAppointmentMatcher appointmentMatching={appointmentMatching} setAppointmentMatcherVisible={setAppointmentMatchingVisible}/>
        }
      </>
    )
}