import { useEffect, useState } from "react"
import LinusAppointmentMatcher from "./LinusAppointmentMatcher";
import type { Appointment, AppointmentMatching } from "@/lib/databaseTypes";

interface AppointmentMatchingButtonsProps {
  appointmentMatching: AppointmentMatching[],
  appointments: Appointment[],
}

export default function AppointmentMatchingButton({appointmentMatching, appointments} : AppointmentMatchingButtonsProps) {
    const [
      appointmentMatchingVisible,
      setAppointmentMatchingVisible
    ] = useState<boolean>(true);

    const [
      showMatchTaskIcon,
      setShowMatchTaskIcon
    ] = useState<boolean>(false);

    useEffect(() => {
        setShowMatchTaskIcon(appointmentMatching.length !== 0)
    }, [appointmentMatching]);
    
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

        <LinusAppointmentMatcher
          appointmentMatching={appointmentMatching}
          setAppointmentMatcherVisible={setAppointmentMatchingVisible}
          visible={appointmentMatchingVisible}
          appointments={appointments}
        />
      </>
    )
}