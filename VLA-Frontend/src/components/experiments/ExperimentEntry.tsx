import type { ExperimentBooking } from "@/lib/databaseTypes";

export interface ExperimentProps {
  experiment: ExperimentBooking,
}

/**
 * Represents a single experiment
 */
export default function ExperimentEntry({experiment}: ExperimentProps){
  return (
    <div className="experimentEntry">
      {experiment.id}
    </div>
  );   
}
