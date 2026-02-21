import { type LinusExperiment, type ExperimentBooking, ExperimentPreparationStatus } from "@/lib/databaseTypes";
import { useEffect, useState } from "react";
import { Logger } from "../logger/Logger";
import "@/styles/Experiments.css"
import Draggable from "../draggableElement/Draggable";

export interface ExperimentProps {
  experiment: ExperimentBooking,
}

const statusBackgroundColorMap = new Map<ExperimentPreparationStatus, string>();
statusBackgroundColorMap.set(ExperimentPreparationStatus.PENDING, "#b71d13");
statusBackgroundColorMap.set(ExperimentPreparationStatus.IN_PROGRESS, "#bb8f00");
statusBackgroundColorMap.set(ExperimentPreparationStatus.FINISHED, "#008550");

const statusTextColorMap = new Map<ExperimentPreparationStatus, string>();
statusTextColorMap.set(ExperimentPreparationStatus.PENDING, "#FFFFFF");
statusTextColorMap.set(ExperimentPreparationStatus.IN_PROGRESS, "#FFFFFF");
statusTextColorMap.set(ExperimentPreparationStatus.FINISHED, "#FFFFFF");

/**
 * Represents a single experiment
 */
export default function ExperimentEntry({experiment}: ExperimentProps){
  const [linusExperiment, setLinusExperiment] = useState<LinusExperiment>({
    id: 0,
    categoryId: 0,
    name: "Lädt..",
    status: "",
    experimentNumber: 0,
  });
  const [experimentModalOpen, setExperimentModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/linusExperiments/" + experiment.linusExperimentId)
    .then(response => {
      if(!response.ok) throw new Error("Non-ok response code received");
      return response.json()
    })
    .then((linusExperiment) => setLinusExperiment(linusExperiment as unknown as LinusExperiment))
    .catch(e => {
      // TODO: Display error in experiment window
      Logger.error("Fetch of linusExperiment id=" + experiment.linusExperimentId + " has failed");
      console.log(e);
    });
  }, [experiment])

  return (
    <>
      <div 
      className="experimentEntry" 
      style={{
        backgroundColor: statusBackgroundColorMap.get(experiment.status),
        color: statusTextColorMap.get(experiment.status)
        }}
      onClick={() => setExperimentModalOpen(!experimentModalOpen)}
      >
        {linusExperiment.name}
      </div>

      {experimentModalOpen &&
      <>
        <Draggable onClose={() => setExperimentModalOpen(false)}>
          <div style={{width: "100px", height: "100px", backgroundColor: "white"}}>
            Test
          </div>
        </Draggable>
      </>
      }
      <br/>
    </>
  );   
}
