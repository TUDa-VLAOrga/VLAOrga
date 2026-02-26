import type { CalendarDay } from "@/components/calendar/CalendarTypes";
import { SseMessageType, type AppointmentMatching, type TimeFrame } from "@/lib/databaseTypes";
import useSseConnection from "./useSseConnection";
import { useEffect } from "react";
import { addDaysPresentFuture } from "@/components/calendar/dateUtils";
import { Logger } from "@/components/logger/Logger";

const weeksToCheckBeforeCalendarStartDate = 1;
const weeksToCheckAfterCalendarStartDate = 2;

const daysToCheckBeforeCalendarStartDate = weeksToCheckBeforeCalendarStartDate * 7;
const daysToCheckAfterCalendarStartDate = weeksToCheckAfterCalendarStartDate * 7;

const API_BASE_URL = "/api/appointmentMatchings"

function handleAppointmentMatchingCreated(event: MessageEvent, previousState: AppointmentMatching[]){
    const createdMatchings = JSON.parse(event.data) as AppointmentMatching[];
    // For later: if created matchings are displayed, change the undefined to according value
    const toDoMatchings = createdMatchings.filter(matching => matching.appointment === undefined)

    const nextState = [...previousState, ...toDoMatchings];

    return nextState;
}

function handleAppointmentMatchingUpdated(event: MessageEvent, previousState: AppointmentMatching[]){
    const changedMatching = JSON.parse(event.data) as AppointmentMatching;
    
    const nextState = previousState.filter(matching => matching.id !== changedMatching.id);
    
    return nextState;
}


const sseHandlers = new Map<
    SseMessageType,
    (event: MessageEvent, value: AppointmentMatching[]) => AppointmentMatching[]
>

sseHandlers.set(SseMessageType.APPOINTMENTMATCHINGCREATE, handleAppointmentMatchingCreated);
sseHandlers.set(SseMessageType.APPOINTMENTMATCHINGUPDATE, handleAppointmentMatchingUpdated);


/**
 * 
 * @param days Sorted array of days, at least one
 * @returns The current AppointmentMatchings that need to be matched
 */
export function useAppointmentMatcher(days : CalendarDay[]): AppointmentMatching[]{
    const [
        nullAppointmentMatchings,
        setNullAppointmentMatchings
    ] = useSseConnection([], sseHandlers);

    useEffect(() => {
        const firstDayInCalendar = days.at(0)!;
        const firstFetchDay = addDaysPresentFuture(firstDayInCalendar.date, -daysToCheckBeforeCalendarStartDate);
        const lastFetchDay = addDaysPresentFuture(firstDayInCalendar.date, daysToCheckAfterCalendarStartDate);

        const timeFrame : TimeFrame = {
            commence: firstFetchDay,
            terminate: lastFetchDay
        }

        // Update appointments and bookings when navigating
        fetch(API_BASE_URL + "/match/experimentBookings", {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify(timeFrame)
        })
        .catch(e => {
            Logger.warn("Initiating the experimentBooking matching has errored");
            console.log(e);
        })
        .finally(() =>
            // Get currently relevant data
            fetch(
                API_BASE_URL + "/nulledAppointments?" +
                "commence=" + firstFetchDay.toISOString() + "&" +
                "terminate=" + lastFetchDay.toISOString() 
            )
            .then(response => response.json())
            .then(appointmentMatchings => 
                setNullAppointmentMatchings(appointmentMatchings as AppointmentMatching[])
            )
            .catch(e => {
                Logger.error("An error has occured during appointmentMatching fetch");
                console.log(e);
            })
        )
    }, [days, events])
    
    return nullAppointmentMatchings;
}