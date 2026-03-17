import useSseConnectionWithInitialFetch from "@/hooks/useSseConnectionWithInitialFetch";
import {SseMessageType, type ExperimentBooking, type Appointment} from "@/lib/databaseTypes";
import ExperimentEntry from "./ExperimentEntry";

interface ExperimentSectionProps {
  appointment: Appointment;
}

function handleExperimentBookingDeletion(event: MessageEvent, previousState: ExperimentBooking[]){
  const deletedBooking = JSON.parse(event.data) as unknown as ExperimentBooking;
  
  const newState = previousState.filter(booking => booking.id != deletedBooking.id);

  return newState;
}

const handlers = new Map<SseMessageType, (event: MessageEvent, value: ExperimentBooking[]) => ExperimentBooking[]>;
handlers.set(SseMessageType.EXPERIMENTBOOKINGDELETED, handleExperimentBookingDeletion);

/**
 * Part of Appointments that handles interactions with the experiments
 */
export default function ExperimentSection({appointment}: ExperimentSectionProps){
  
  // Cannot be declared in top level as we need information about the underlying appointment
  function handleExperimentBookingUpdate(event: MessageEvent, previousState: ExperimentBooking[]){
    const updatedBooking = JSON.parse(event.data) as unknown as ExperimentBooking;
    
    const newState = previousState
      .map(booking => booking.id == updatedBooking.id ? updatedBooking : booking)
      .filter(booking => appointment.bookings.includes(booking));

    return newState;
  }
  handlers.set(SseMessageType.EXPERIMENTBOOKINGUPDATED, handleExperimentBookingUpdate);

  const [experimentBookings, _setExperimentBooking] = useSseConnectionWithInitialFetch<ExperimentBooking[]>(
    [],
    `/api/appointments/${appointment.id}/experimentBookings`,
    handlers
  );
    
  return (
    <div className="cv-detailRow">
      <span className="cv-detailLabel" style={{alignSelf: "start"}}>Experimente:</span>
      <span className="cv-detailValue">
        <div className="experimentSection">
          {
            experimentBookings.map(experimentBooking => {
              return <ExperimentEntry experiment={experimentBooking} key={experimentBooking.id}/>;
            })
          }
          {experimentBookings.length === 0 &&
          <>
            Keine hinterlegt
          </>
          }
        </div>
      </span>
    </div>
  );
}
