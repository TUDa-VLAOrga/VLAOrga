import { ExperimentPreparationStatus, type ExperimentBooking, type LinusExperiment } from "@/lib/databaseTypes";
import { useState } from "react";
import { fetchBackend, getExperimentPreperationsStatusGermanMap } from "@/lib/utils";
import { API_URL_EXPERIMENTBOOKINGS } from "@/lib/api";

interface ExperimentOverviewProps {
  linusExperiment: LinusExperiment,
  experimentBooking: ExperimentBooking,
  statusBackgroundColor: string,
  statusTextColor: string,
}

function updateAppointmentStatus(experimentBooking: ExperimentBooking, status: ExperimentPreparationStatus){
  fetchBackend(
    `${API_URL_EXPERIMENTBOOKINGS}/${experimentBooking.id}/status`,
    "PUT",
    Object.keys(ExperimentPreparationStatus).indexOf(status).toString()
  );
}

const translationMap = getExperimentPreperationsStatusGermanMap();

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
        <div className="experimentOverviewTitle">
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
                        key={status}
                        value={status}
                        onClick={e => {
                          e.stopPropagation();
                          updateAppointmentStatus(experimentBooking, status);
                          setIsEditingStatus(false);
                        }}
                      >
                        {translationMap.get(status)}
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
                {translationMap.get(experimentBooking.status)}
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
