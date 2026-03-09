import type { Appointment, AppointmentMatching } from "@/lib/databaseTypes";
import "@/styles/AppointmentMatching.css";
import { useEffect, useState } from "react";
import { Logger } from "../logger/Logger";
import { Button } from "../ui/Button";
import { getTimeStringOfDate, toJSONLocalTime } from "../calendar/dateUtils";
import { fetchBackend } from "@/lib/utils";
import { API_URL_APPOINTMENTMATCHINGS, API_URL_APPOINTMENTS } from "@/lib/api";
import { getEventTitle } from "../calendar/eventUtils";
import type {CalendarEvent} from "@/components/calendar/CalendarTypes.ts";

interface AppointmentMatchEntryProps {
  matching: AppointmentMatching,
  events: CalendarEvent[],
}

function postMatching(matchingId: number, matchedAppointmentId: number){
  fetchBackend(API_URL_APPOINTMENTMATCHINGS + "/" + matchingId, "POST", JSON.stringify(matchedAppointmentId))
    .catch(error => {
      Logger.error("AppointmentMatching could not be posted", error);
    });
}

export default function AppointmentMatchEntry({matching, events} : AppointmentMatchEntryProps) {
  const [availableAppointments, setAvailableAppointments] = 
    useState<Appointment[] | undefined>(undefined);

  useEffect(() => {
    const linusAppointmentTime = new Date(matching.linusAppointmentTime);

    fetchBackend<Appointment[]>(
      `${API_URL_APPOINTMENTS}/includeTime?eventTime=${toJSONLocalTime(linusAppointmentTime)}`,
      "GET"
    )
      .then(appointments => {
        setAvailableAppointments(appointments);
      });
  }, [matching, events]);
    
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
                <span key={appointment.id} className="appointmentMatchEntryHighlight">
                  <br/>
                  <b>Termintitel</b><br/>
                  {getEventTitle(appointment)}<br/><br/>

                  <b>Terminkategorie</b><br/>
                  {appointment.series.category.title}<br/><br/>

                  <b>Terminzeit</b><br/>
                  {getTimeStringOfDate(new Date(appointment.startTime))}
                  <span> - </span>
                  {getTimeStringOfDate(new Date(appointment.endTime))}<br/><br/>

                  <Button text={"Termin zuweisen"} onClick={() => postMatching(matching.id, appointment.id)}/>
                  <br/>
                  {availableAppointments.lastIndexOf(appointment) != availableAppointments.length - 1 &&
                  <>
                    <hr className="appointmentMatchingSeperator"/>
                  </>
                  }
                </span>
              )}
            </>
              }         
            </>
      }
    </>
  );
}
