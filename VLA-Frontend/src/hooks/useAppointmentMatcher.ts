import type { CalendarDay } from "@/components/calendar/CalendarTypes";
import { SseMessageType, type Appointment, type AppointmentMatching, type TimeFrame } from "@/lib/databaseTypes";
import useSseConnection from "./useSseConnection";
import { useEffect } from "react";
import { addDaysPresentFuture } from "@/components/calendar/dateUtils";
import { Logger } from "@/components/logger/Logger";
import { fetchCSRFToken } from "@/lib/utils";
import { API_URL_APPOINTMENTMATCHINGS } from "@/lib/api";

const weeksToCheckBeforeCalendarStartDate = 1;
const weeksToCheckAfterCalendarStartDate = 2;

const daysToCheckBeforeCalendarStartDate = weeksToCheckBeforeCalendarStartDate * 7;
const daysToCheckAfterCalendarStartDate = weeksToCheckAfterCalendarStartDate * 7;

function handleAppointmentMatchingCreated(event: MessageEvent, previousState: AppointmentMatching[]){
  const createdMatchings = JSON.parse(event.data) as AppointmentMatching[];
  // For later: if created matchings are displayed, change the undefined to according value
  const toDoMatchings = createdMatchings.filter(matching => matching.appointment === undefined);

  const nextState = [...previousState, ...toDoMatchings];

  return nextState;
}

function handleAppointmentMatchingUpdated(event: MessageEvent, previousState: AppointmentMatching[]){
  const changedMatching = JSON.parse(event.data) as AppointmentMatching;
    
  const nextState = previousState.filter(matching => matching.id !== changedMatching.id);
    
  return nextState;
}

interface useAppointmentMatcherProps {
  days: CalendarDay[],
  allEvents: Appointment[],
}

const sseHandlers = new Map<
  SseMessageType,
  (event: MessageEvent, value: AppointmentMatching[]) => AppointmentMatching[]
>;

sseHandlers.set(SseMessageType.APPOINTMENTMATCHINGCREATE, handleAppointmentMatchingCreated);
sseHandlers.set(SseMessageType.APPOINTMENTMATCHINGUPDATE, handleAppointmentMatchingUpdated);

/**
 * 
 * @param days Sorted array of days, at least one
 * @returns The current AppointmentMatchings that need to be matched
 */
export function useAppointmentMatcher({days, allEvents} : useAppointmentMatcherProps): AppointmentMatching[]{
  const [
    nullAppointmentMatchings,
    setNullAppointmentMatchings,
  ] = useSseConnection([], sseHandlers);

  useEffect(() => {
    const firstDayInCalendar = days.at(0)!;
    const firstFetchDay = addDaysPresentFuture(firstDayInCalendar.date, -daysToCheckBeforeCalendarStartDate);
    const lastFetchDay = addDaysPresentFuture(firstDayInCalendar.date, daysToCheckAfterCalendarStartDate);

    const timeFrame : TimeFrame = {
      commence: firstFetchDay,
      terminate: lastFetchDay,
    };

    // Update appointments and bookings when navigating
    fetchCSRFToken()
      .then(csrfToken => {
        fetch(API_URL_APPOINTMENTMATCHINGS + "/match/experimentBookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          body: JSON.stringify(timeFrame),
        })
          .catch(e => {
            Logger.warn("Initiating the experimentBooking matching has errored");
            console.log(e);
          })
          .finally(() =>
          // Get currently relevant data
            fetch(
              API_URL_APPOINTMENTMATCHINGS + "/nulledAppointments?" +
                  "commence=" + firstFetchDay.toISOString() + "&" +
                  "terminate=" + lastFetchDay.toISOString() 
            )
              .then(response => {
                if(!response.ok) throw new Error("Response was not ok");  
                return response.json();
              })
              .then(appointmentMatchings => 
                setNullAppointmentMatchings(appointmentMatchings as AppointmentMatching[])
              )
              .catch(e => {
                Logger.error("An error has occured during appointmentMatching fetch");
                console.log(e);
              })
          );
      });
  }, [days, allEvents, setNullAppointmentMatchings]);
    
  return nullAppointmentMatchings;
}
