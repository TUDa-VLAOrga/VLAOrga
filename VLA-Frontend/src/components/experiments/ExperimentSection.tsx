import useSseConnectionWithInitialFetch from "@/hooks/useSseConnectionWithInitialFetch";
import { SseMessageType, type Appointment, type ExperimentBooking } from "@/lib/databaseTypes";
import ExperimentEntry from "./ExperimentEntry";

interface ExperimentSectionProps {
  appointment: Appointment;
}

function handleExperimentBookingUpdate(event: MessageEvent, previousState: ExperimentBooking[]){
  const updatedBooking = JSON.parse(event.data) as unknown as ExperimentBooking
  
  const newState = previousState.map(booking => booking.id == updatedBooking.id ? updatedBooking : booking);
  
  return newState;
}

const handlers = new Map<SseMessageType, (event: MessageEvent, value: ExperimentBooking[]) => ExperimentBooking[]>;
handlers.set(SseMessageType.EXPERIMENTBOOKINGUPDATED, handleExperimentBookingUpdate)

/**
 * Part of Appointments that handles interactions with the experiments
 */
export default function ExperimentSection({appointment}: ExperimentSectionProps){
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
