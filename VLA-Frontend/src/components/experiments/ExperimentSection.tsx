import { useEffect, useState } from "react";
import { Appointment, ExperimentBooking, ExperimentPreparationStatus } from "../../lib/databaseTypes";
import Experiment from "./Experiment";

interface ExperimentSectionProps {
    appointment: Appointment;
}

/**
 * Part of Appointments that handles interactions with the experiments
 */
export default function ExperimentSection({appointment}: ExperimentSectionProps){
    const [experiments, setExperiments] = useState<ExperimentBooking[]>([]);

    useEffect(() => {
        // TODO: Fetch the actual experiments
        const ex: ExperimentBooking = {
            id: 0,
            linusExperimentId: 0,
            linusExperimentBookingId: 0,
            person: {
                id: 0,
                name: "",
                notes: "",
                linusUserId: 0
            },
            appointment: {
                id: appointment.id,
                series: {
                    id: 0,
                    lecture: {
                        id: 0,
                        name: "",
                        semester: "",
                        color: ""
                    },
                    category: {
                        id: 0,
                        title: ""
                    }
                },
                start: new Date(),
                end: new Date(),
                notes: ""
            },
            notes: "",
            status: ExperimentPreparationStatus.PENDING
        }

        setExperiments([ex]);
    }, []);
    
    return (
        <div className="experimentSection">
            {
                experiments.map(experiment => {
                    return <Experiment experiment={experiment}></Experiment>;
                })
            }
        </div>
    );
}
