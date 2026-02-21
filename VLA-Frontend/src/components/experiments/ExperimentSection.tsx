import useSseConnectionWithInitialFetch from "@/hooks/useSseConnectionWithInitialFetch";
import { ExperimentPreparationStatus, type Appointment, type ExperimentBooking, type SseMessageType } from "@/lib/databaseTypes";
import ExperimentEntry from "./ExperimentEntry";

interface ExperimentSectionProps {
  appointment: Appointment;
}

// TODO: Handle SSE
const handlers = new Map<SseMessageType, (event: MessageEvent, value: ExperimentBooking[]) => ExperimentBooking[]>;

/**
 * Part of Appointments that handles interactions with the experiments
 */
export default function ExperimentSection({appointment}: ExperimentSectionProps){
  const [experimentBookings, _setExperimentBooking] = useSseConnectionWithInitialFetch<ExperimentBooking[]>(
    [{
      id: 0,
      linusExperimentId: 2,
      linusExperimentBookingId: 0,
      notes: "",
      status: ExperimentPreparationStatus.FINISHED,
    }],
    `/api/appointments/${appointment.id}/experimentBookings`, // Fix this URL once testing is done
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
        </div>
      </span>
    </div>
  );
}
