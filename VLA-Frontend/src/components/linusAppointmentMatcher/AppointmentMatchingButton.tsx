import { useState } from "react"

export default function AppointmentMatchingButton() {
    const [
        appointmentMatchingVisible,
        setAppointmentMatchingVisible
    ] = useState<boolean>(false);
    
    return (
        <button
          className="cv-createBtn"
          onClick={() => setAppointmentMatchingVisible(!appointmentMatchingVisible)}
          aria-label="Linussynchronisationsbutton"
          title="Synchronisation für Linustermine"
          type="button"
        >
          Linus
        </button>
    )
}