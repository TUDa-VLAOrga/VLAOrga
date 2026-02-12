import { ExperimentBooking } from "../../lib/databaseTypes";

export interface ExperimentProps {
  experiment: ExperimentBooking,
}

/**
 * Represents a single experiment
 */
export default function Experiment({experiment}: ExperimentProps){
  return (
    <div className="experimentContainer">
      {experiment.id}
    </div>
  );   
}
