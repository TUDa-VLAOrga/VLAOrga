import type { Appointment, AppointmentMatching } from "@/lib/databaseTypes";
import "@/styles/AppointmentMatching.css";
import { useEffect, useState } from "react";
import { Logger } from "../logger/Logger";
import { Button } from "../ui/Button";
import { getTimeStringOfDate } from "../calendar/dateUtils";
import { fetchBackend, parseJsonFixDate } from "@/lib/utils";
import { API_URL_APPOINTMENTMATCHINGS } from "@/lib/api";

interface AppointmentMatchEntryProps {
  matching: AppointmentMatching,
  appointments: Appointment[],
}

function postMatching(matchingId: number, matchedAppointmentId: number){
  fetchBackend(API_URL_APPOINTMENTMATCHINGS + "/" + matchingId, "POST", JSON.stringify(matchedAppointmentId))
    .catch(error => {
      Logger.error("AppointmentMatching could not be posted", error);
    });
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
      .then(response => {
        if(!response.ok) throw new Error("Bad response!");
        return response.text();
      })
      .then(responseJSON => {
        return JSON.parse(responseJSON, parseJsonFixDate) as Appointment[];
      })
      .then(appointments => {
        setAvailableAppointments(appointments);
      })
      .catch(error => {
        Logger.warn("Could not fetch appointments for matching.", error);
      });
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
                  {getTimeStringOfDate(new Date(appointment.startTime))}
                  <span> - </span>
                  {getTimeStringOfDate(new Date(appointment.endTime))}<br/><br/>

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
