import useSseConnectionWithInitialFetch from "@/hooks/useSseConnectionWithInitialFetch";
import { ExperimentPreparationStatus, type Appointment, type ExperimentBooking, type SseMessageType } from "@/lib/databaseTypes";
import ExperimentEntry from "./ExperimentEntry";

interface ExperimentSectionProps {
    appointment: Appointment;
}

// TODO: Handle SSE
const handlers = new Map<SseMessageType, (event: MessageEvent, value: ExperimentBooking[]) => ExperimentBooking[]>

/**
 * Part of Appointments that handles interactions with the experiments
 */
export default function ExperimentSection({appointment}: ExperimentSectionProps){
    const [experimentBookings, _setExperimentBooking] = useSseConnectionWithInitialFetch<ExperimentBooking[]>(
        [],
        `api/appointments/${appointment.id}/experimentBookings`,
        handlers
    );
    
    return (
        <div className="experimentSection">
            {
                experimentBookings.map(experimentBooking => {
                    return <ExperimentEntry experiment={experimentBooking}/>;
                })
            }
        </div>
    );
}
