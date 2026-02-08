type MoveConfirmDialogProps = {
  onMoveSingle: () => void;
  onMoveSeries: () => void;
  onCancel: () => void;
};

/**
 * MoveConfirmDialog asks user whether to move single event or entire series
 */
export default function MoveConfirmDialog({
  onMoveSingle,
  onMoveSeries,
  onCancel,
}: MoveConfirmDialogProps) {
  return (
    <div className="cv-formOverlay">
      <div className="cv-formBox cv-confirmDialog">
        <h2 className="cv-formTitle">Termin verschieben</h2>

        <div className="cv-detailsContent">
          <p className="cv-confirmMessage">
            Dieser Termin ist Teil einer Wiederholungsserie.
          </p>
          <p className="cv-confirmQuestion">
            Möchten Sie nur diesen Termin oder die gesamte Serie verschieben?
          </p>
        </div>

        <div className="cv-formActions cv-confirmActions">
          <button
            type="button"
            className="cv-formBtn cv-formBtnCancel"
            onClick={onCancel}
          >
            Abbrechen
          </button>
          <button
            type="button"
            className="cv-formBtn cv-formBtnSecondary"
            onClick={onMoveSingle}
          >
            Nur diesen Termin
          </button>
          <button
            type="button"
            className="cv-formBtn cv-formBtnSubmit"
            onClick={onMoveSeries}
          >
            Gesamte Serie
          </button>
        </div>
      </div>
    </div>
  );
}