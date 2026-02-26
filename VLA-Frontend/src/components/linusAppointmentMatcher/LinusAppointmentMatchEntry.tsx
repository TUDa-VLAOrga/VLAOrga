import type { LinusAppointment } from "@/lib/databaseTypes";
import "@/styles/AppointmentMatching.css"
import { useEffect, useState } from "react"
import { Logger } from "../logger/Logger";
import { getDateStringOfDate, getTimeStringOfDate } from "../calendar/dateUtils";

interface LinusAppointmentMatchEntryProps {
    linusAppointmentId: number
}

export default function LinusAppointmentMatchEntry({linusAppointmentId} : LinusAppointmentMatchEntryProps) {
    const [linusAppointment, setLinusAppointment] = 
        useState<LinusAppointment | undefined>(undefined);
    
    useEffect(() => {
        fetch("/api/linusAppointments/" + linusAppointmentId)
        .then(response => response.json())
        .then(linusAppointment => setLinusAppointment(linusAppointment))
        .catch(e => {
            Logger.warn("Could not fetch linusAppointment for matching.")
            console.log(e);
        })
    }, [linusAppointmentId])
    
    return (
        <>
        <div className="linusMatchEntry">
            <br/>
            <b>Terminname in Linus</b><br/>
            {linusAppointment ? linusAppointment.name : "Lädt.."}<br/><br/>

            <b>Kommentar in Linus</b><br/>
            {linusAppointment ? linusAppointment.comment : "Lädt.."}<br/><br/>

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