import type { CalendarEvent, Lecture } from "./CalendarTypes";
import { formatISODateDE } from "./dateUtils";

type EventDetailsProps = {
  event: CalendarEvent;
  onClose: () => void;
  lectures?: Lecture[];
};

export default function EventDetails({ event, onClose, lectures = [] }: EventDetailsProps) {
   const lecture = event.lectureId? lectures.find((lec ) => lec.id === event.lectureId) ?? null : null ;
  
    return (
    <div className="cv-formOverlay">
      <div className="cv-formBox">
        <h2 className="cv-formTitle">{event.title}</h2>

        <div className="cv-detailsContent">
          <div className="cv-detailRow">
            <span className="cv-detailLabel">Kategorie:</span>
            <span className="cv-detailValue">{event.kind}</span>
          </div>

           {lecture && (
            <div className="cv-detailRow">
              <span className="cv-detailLabel">Vorlesung:</span>
              <span className="cv-detailValueLecture ">
                <span
                  className="cv-lectureSwatch"
                  style={{ backgroundColor: lecture.color }}
                />
                {lecture.name}
              </span>
            </div>
          )}

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