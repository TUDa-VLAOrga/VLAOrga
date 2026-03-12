import { ExperimentPreparationStatus, type ExperimentBooking, type LinusExperiment } from "@/lib/databaseTypes";
import { fetchBackend, getExperimentPreperationsStatusGermanMap } from "@/lib/utils";
import { API_URL_EXPERIMENTBOOKINGS } from "@/lib/api";

interface ExperimentOverviewProps {
  linusExperiment: LinusExperiment,
  experimentBooking: ExperimentBooking,
}

function updateBookingStatus(experimentBooking: ExperimentBooking, status: ExperimentPreparationStatus){
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
} : ExperimentOverviewProps){
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
          <select
            defaultValue={experimentBooking.status}
            onPointerDown={e => e.stopPropagation()}
          >
            {Object.values(ExperimentPreparationStatus).map(status => {
              return (
                <option
                  key={status}
                  value={status}
                  onClick={e => {
                    e.stopPropagation();
                    updateBookingStatus(experimentBooking, status);
                  }}
                >
                  {translationMap.get(status)}
                </option>
              );
            })}
          </select>
        </div>
                
        <div>
          Link zu Linus
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
