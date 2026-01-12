import type { CalendarEvent } from "./CalendarTypes";
import { formatISODateDE } from "./dateUtils";

type EventDetailsProps = {
  event: CalendarEvent;
  onClose: () => void;
};

export default function EventDetails({ event, onClose }: EventDetailsProps) {
  return (
    <div className="cv-formOverlay">
      <div className="cv-formBox">
        <h2 className="cv-formTitle">{event.title}</h2>

        <div className="cv-detailsContent">
          <div className="cv-detailRow">
            <span className="cv-detailLabel">Kategorie:</span>
            <span className="cv-detailValue">{event.kind}</span>
          </div>

          <div className="cv-detailRow">
            <span className="cv-detailLabel">Datum:</span>
            <span className="cv-detailValue">{formatISODateDE(event.dateISO)}</span>
          </div>

            {event.startTime && event.endTime && (
             <div className="cv-detailRow">
                <span className="cv-detailLabel">Uhrzeit:</span>
                <span className="cv-detailValue">
            {event.startTime} – {event.endTime}
            </span>
        </div>
        )}


          {event.subtitle && (
            <div className="cv-detailRow">
              <span className="cv-detailLabel">Personen:</span>
              <span className="cv-detailValue">{event.subtitle}</span>
            </div>
          )}

          {event.status && (
            <div className="cv-detailRow">
              <span className="cv-detailLabel">Status:</span>
              <span className="cv-detailValue">{event.status}</span>
            </div>
          )}
        </div>

        

        <div className="cv-formActions">
          <button
            type="button"
            className="cv-formBtn cv-formBtnCancel"
            onClick={onClose}
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}