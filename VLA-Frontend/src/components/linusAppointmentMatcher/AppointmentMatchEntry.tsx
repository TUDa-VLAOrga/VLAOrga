import type { Appointment, AppointmentMatching } from "@/lib/databaseTypes";
import "@/styles/AppointmentMatching.css"
import { useEffect, useState } from "react";
import { Logger } from "../logger/Logger";
import { Button } from "../ui/Button";
import { getTimeStringOfDate } from "../calendar/dateUtils";

interface AppointmentMatchEntryProps {
    matching: AppointmentMatching,
    appointments: Appointment[],
}

function postMatching(matchingId: number, matchedAppointmentId: number){
    fetch("/api/appointmentMatchings/" + matchingId, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(matchedAppointmentId),
    })
}

export default function AppointmentMatchEntry({matching, appointments} : AppointmentMatchEntryProps) {   
    const [availableAppointments, setAvailableAppointments] = 
            useState<Appointment[] | undefined>(undefined);

    useEffect(() => {
        const linusAppointmentTime = new Date(matching.linusAppointmentTime);

        fetch(
            "/api/appointments/includeTime?" + 
            "eventTime=" + linusAppointmentTime.toISOString()
        )
        .then(response => response.json())
        .then(appointments => setAvailableAppointments(appointments))
        .catch(e => {
            Logger.warn("Could not fetch appointments for matching.")
            console.log(e);
        })
    }, [matching, appointments]);
    
    return (
        <>
        {!availableAppointments &&
            <>
            <div>Lädt</div>            
            </>
        }

        {availableAppointments &&
            <>
            {availableAppointments.length === 0 &&
            <>
            <br/>
            <b>Keine Termine in dem Zeitraum!</b>
            <br/><br/>
            <b>Legen Sie vor einer Zuweisung einen Termin an,<br/>
            der zu dieser Zeit stattfindet!</b>
            </>
            }

            {availableAppointments.length !== 0 &&
            <>
            {availableAppointments.map(appointment => 
                <span key={appointment.id}>
                    <br/>
                    <b>Terminkategorie</b><br/>
                    {appointment.series.category.title}<br/><br/>

                    <b>Terminzeit</b><br/>
                    {getTimeStringOfDate(new Date(appointment.start))} - {getTimeStringOfDate(new Date(appointment.end))}<br/><br/>

                    <Button text={"Termin zuweisen"} onClick={() => postMatching(matching.id, appointment.id)}/>
                    <br/>
                </span>
            )}
            </>
            }         
            </>
        }
        </>
    );
}