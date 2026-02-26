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
    ] = useState<boolean>(true);

    const [
      showMatchTaskIcon,
      setShowMatchTaskIcon
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
        {showMatchTaskIcon &&
        <span style={{color: "#8000d7", marginLeft: "3px"}}>⨝</span>
        }
        </button>
        {appointmentMatchingVisible &&
          <LinusAppointmentMatcher appointmentMatching={appointmentMatching} setAppointmentMatcherVisible={setAppointmentMatchingVisible} setAppointmentMatcherIconVisible={setShowMatchTaskIcon}/>
        }
      </>
    )
}