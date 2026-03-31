import { ExperimentPreparationStatus, type ExperimentBooking, type LinusExperiment } from "@/lib/databaseTypes";
import { fetchBackend, getExperimentPreperationsStatusGermanMap } from "@/lib/utils";
import { API_URL_EXPERIMENTBOOKINGS } from "@/lib/api";
import { useState } from "react";
import { Logger } from "../logger/Logger";

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
  const [deletionRequested, setDeletionRequested] = useState<boolean>(false);
  const [moveForwardPossible, setMoveForwardPossible] = useState<boolean>(true);
  const [moveBackwardPossible, setMoveBackwardPossible] = useState<boolean>(true);

  function moveBookingToNextAppointment(experimentBooking: ExperimentBooking) {
    fetchBackend(
      `${API_URL_EXPERIMENTBOOKINGS}/${experimentBooking.id}/moveNext`,
      "PUT"
    )
      .catch(error => {
        Logger.warn("ExperimentBooking could not be moved forward", error);
        setMoveForwardPossible(false);
      });
  }

  function moveBookingToPreviousAppointment(experimentBooking: ExperimentBooking) {
    fetchBackend(
      `${API_URL_EXPERIMENTBOOKINGS}/${experimentBooking.id}/movePrevious`,
      "PUT"
    )
      .catch(error => {
        Logger.warn("ExperimentBooking could not be moved forward", error);
        setMoveBackwardPossible(false);
      });
  }

  function deleteExperimentBooking(){
    if(!deletionRequested) {
      setDeletionRequested(true);
      return;
    } 
    fetchBackend(`${API_URL_EXPERIMENTBOOKINGS}/${experimentBooking.id}`, "DELETE");
  }

  return (
    <div className="experimentOverview">
      <div className="cv-detailsContent">
        <div className="experimentOverviewTitle">
          {linusExperiment.name}
        </div>  

        <div className="cv-detailRow">

          <div className="cv-detailLabel">
            Aufbaustatus
          </div>
          <div className="cv-detailValue">
            <select
              defaultValue={experimentBooking.status}
              onPointerDown={e => e.stopPropagation()}
              onChange={(e) => updateBookingStatus(experimentBooking, e.target.value as ExperimentPreparationStatus)}
            >
              {Object.values(ExperimentPreparationStatus).map(status => {
                return (
                  <option
                    key={status}
                    value={status}
                  >
                    {translationMap.get(status)}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="cv-detailRow">

          <div className="cv-detailLabel">
            Link zu Linus
          </div>
          <div className="cv-detailValue">
            <a 
              className="linusLink"
              target="_blank"
              href={"https://linus.iap.physik.tu-darmstadt.de/experiment/" + linusExperiment.id + "/description"}
            >
              Experiment in Linus
            </a>
          </div>
        </div>

        <div className="cv-detailRow">
          <div className="cv-detailLabel">
            Notizen:
          </div>
          <div className="cv-detailValue cv-respectNewlines">
            {experimentBooking.notes}
          </div>
        </div>

        <button 
          type="button"
          className="cv-formBtn cv-formBtnSubmit"
          onClick={() => moveBookingToNextAppointment(experimentBooking)}
          aria-label="Experiment auf nächsten Termin vertagen" 
          disabled={!moveForwardPossible}
        >
          {moveForwardPossible ? 
            "Experiment auf nächsten Termin vertagen" : 
            "Kein nächster Termin gefunden!"
          }
        </button>

        <button 
          type="button"
          className="cv-formBtn cv-formBtnSubmit"
          onClick={() => moveBookingToPreviousAppointment(experimentBooking)}
          aria-label="Experiment vorziehen" 
          disabled={!moveBackwardPossible}
        >
          {moveBackwardPossible ? 
            "Experiment auf vorherigen Termin verschieben" : 
            "Kein vorheriger Termin gefunden!"
          }
        </button>

        <button
          type="button"
          className="cv-formBtn cv-formBtnDanger"
          onClick={() => deleteExperimentBooking()}
          aria-label= {deletionRequested ? "Löschung bestätigen" : "Experimentbuchung löschen"}
        >
          {deletionRequested ? "Sicher?" : "Experimentbuchung löschen"}
        </button>
      </div>
    </div>
  );
}
