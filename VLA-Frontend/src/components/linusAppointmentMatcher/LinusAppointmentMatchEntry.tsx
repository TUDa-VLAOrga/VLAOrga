import type { LinusAppointment } from "@/lib/databaseTypes";
import "@/styles/AppointmentMatching.css";
import { useEffect, useState } from "react";
import { getDateStringOfDate, getTimeStringOfDate } from "../calendar/dateUtils";
import { fetchBackend } from "@/lib/utils";
import { API_URL_LINUSAPPOINTMENTS } from "@/lib/api";

interface LinusAppointmentMatchEntryProps {
  linusAppointmentId: number
}

export default function LinusAppointmentMatchEntry({linusAppointmentId} : LinusAppointmentMatchEntryProps) {
  const [linusAppointment, setLinusAppointment] = 
    useState<LinusAppointment | undefined>(undefined);
    
  useEffect(() => {
    fetchBackend<LinusAppointment>(
      `${API_URL_LINUSAPPOINTMENTS}/${linusAppointmentId}`,
      "GET" 
    )
      .then(linusAppointment => setLinusAppointment(linusAppointment));
  }, [linusAppointmentId]);
    
  return (
    <>
      <div className="linusMatchEntry">
        <br/>
        <b>Terminname in Linus</b><br/>
        {linusAppointment ? linusAppointment.name : "Lädt.."}<br/><br/>


        <b>Kommentar in Linus</b><br/>
        {linusAppointment ?
          <>
            {linusAppointment.comment ? linusAppointment.comment : "Kein Kommentar"}
          </>
          :
          <>
            Lädt..
          </>
        }
        <br/><br/>

        <b>Gelisteter Termin</b><br/>
        {linusAppointment ? 
          getDateStringOfDate(new Date(linusAppointment.appointmentTime!)) + ", " +
            getTimeStringOfDate(new Date(linusAppointment.appointmentTime!))
            
          : "Lädt.."}
        <br/>
        <br/>
      </div>
    </>
  );
}
