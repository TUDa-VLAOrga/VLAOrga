import { ExperimentPreparationStatus, type ExperimentBooking, type LinusExperiment } from "@/lib/databaseTypes";
import { useState } from "react";
import { Logger } from "../logger/Logger";

interface ExperimentOverviewProps {
  linusExperiment: LinusExperiment,
  experimentBooking: ExperimentBooking,
  statusBackgroundColor: string,
  statusTextColor: string,
}

function updateAppointmentStatus(experimentBooking: ExperimentBooking, status: ExperimentPreparationStatus){
  const updatedExperimentBooking: ExperimentBooking = {
    ...experimentBooking,
    status: status,
  };

  fetch("/api/experimentBookings/" + experimentBooking.id, {
    method: "PUT",
    body: JSON.stringify(updatedExperimentBooking),
  })
    .then(response => {
      if(!response.ok) throw new Error("Experimentbooking could not be updated");
    })
    .catch(e => {
      Logger.info(e.message);
      console.log(e);
    });
}

export default function ExperimentOverview({
  linusExperiment,
  experimentBooking,
  statusBackgroundColor,
  statusTextColor,
} : ExperimentOverviewProps){
  const [isEditingStatus, setIsEditingStatus] = useState<boolean>(false);
    
  return (
    <div className="experimentOverview">
      <div className="experimentPropertyGrid">
        <div className="experimentOverviewTitle" style={{gridColumnStart: "span 2"}}>
          {linusExperiment.name}
        </div>  

        <div>
          Aufbaustatus
        </div>
        <div>
          {isEditingStatus &&
            <>
              <select onPointerDown={e => e.stopPropagation()}>
                {Object.values(ExperimentPreparationStatus).map(status => {
                  return (
                    <>
                      <option  
                        value={status}
                        onClick={() => {
                          updateAppointmentStatus(experimentBooking, status);
                          setIsEditingStatus(false);
                        }}
                      >
                        {status}
                      </option>
                    </>
                  );
                })}
              </select>
            </>
          }

          {!isEditingStatus &&
            <>
              <span 
                className="experimentOverviewStatus" 
                style={{
                  backgroundColor: statusBackgroundColor,
                  color: statusTextColor,
                }}
                onClick={() => setIsEditingStatus(true)}
              >
                {experimentBooking.status}
              </span>
            </>
          }
                    
        </div>
                
        <div>
          Link zu linus
        </div>
        <div>
          <a 
            className="linusLink"
            target="_blank"
            href={"https://linus.iap.physik.tu-darmstadt.de/experiment/" + linusExperiment.id + "/description"}
          >
            Experiment in Linus
          </a>
        </div>
      </div>
    </div>
  );
}
