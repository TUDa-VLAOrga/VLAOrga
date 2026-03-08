import { type ExperimentBooking, ExperimentPreparationStatus, type Appointment } from "@/lib/databaseTypes";
import { useEffect, useState } from "react";

export interface CalendarExperimentIndicator {
  appointment: Appointment;
}

function getStateRepresentativeCounts(experimentBooking: ExperimentBooking[]) {
  return [
    experimentBooking.filter(booking => booking.status === ExperimentPreparationStatus.PENDING).length,
    experimentBooking.filter(booking => booking.status === ExperimentPreparationStatus.IN_PROGRESS).length,
    experimentBooking.filter(booking => booking.status === ExperimentPreparationStatus.FINISHED).length,
  ];
}

export default function CalendarExperimentIndicator({appointment} : CalendarExperimentIndicator){
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
