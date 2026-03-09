import { type ExperimentBooking, ExperimentPreparationStatus } from "@/lib/databaseTypes";
import { useEffect, useState } from "react";
import type {CalendarEvent} from "@/components/calendar/CalendarTypes.ts";
import {isCalendarEventAcceptance} from "@/components/calendar/eventUtils.ts";

export interface CalendarExperimentIndicator {
  event: CalendarEvent;
}

function getStateRepresentativeCounts(experimentBooking: ExperimentBooking[]) {
  return [
    experimentBooking.filter(booking => booking.status === ExperimentPreparationStatus.PENDING).length,
    experimentBooking.filter(booking => booking.status === ExperimentPreparationStatus.IN_PROGRESS).length,
    experimentBooking.filter(booking => booking.status === ExperimentPreparationStatus.FINISHED).length,
  ];
}

export default function CalendarExperimentIndicator({event} : CalendarExperimentIndicator){
  const appointment = isCalendarEventAcceptance(event) ? event.appointment : event;
  const [appointmentBookings, setAppointmentBookings] = useState<ExperimentBooking[]>(appointment.bookings);

  useEffect(() => {
    setAppointmentBookings(appointment.bookings);
  }, [appointment, setAppointmentBookings]);

  return (
    <div className="calendarExperimentIndicatorContainer">
      <div className="calendarExperimentIndicator"
        style={{
          gridTemplateColumns:
                getStateRepresentativeCounts(appointmentBookings)
                  .map(count => String(count) + "fr").join(" "),
        }}
      >
        <div className="cei-experimentsPending">{getStateRepresentativeCounts(appointmentBookings)[0]}</div>
        <div className="cei-experimentsInProgress">{getStateRepresentativeCounts(appointmentBookings)[1]}</div>
        <div className="cei-experimentsFinished">{getStateRepresentativeCounts(appointmentBookings)[2]}</div>
      </div>
    </div>
  );
}
