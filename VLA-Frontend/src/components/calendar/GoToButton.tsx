import { useState } from "react";
import { normalizeToWorkdayStart, toISODateLocal } from "./dateUtils";

type GoToMenuProps = {
  currentWeekStart: Date;
  onDateSelect: (date: Date) => void;
};

/**
 * GoToMenu provides quick navigation options:
 * - "Jetzt" button to jump to current week
 * - "Datum" button to open date picker for specific date selection
 */
export default function GoToMenu({ currentWeekStart, onDateSelect }: GoToMenuProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  function handleGoToToday() {
    onDateSelect(normalizeToWorkdayStart(new Date()));
  }

  function handleDateChange(dateString: string) {
    const selectedDate = new Date(dateString);
    onDateSelect(normalizeToWorkdayStart(selectedDate));
    setShowDatePicker(false);
  }

  function handleOverlayClick() {
    setShowDatePicker(false);
  }

  function handleBoxClick(e: React.MouseEvent) {
    e.stopPropagation();
  }

  return (
    <>
      <div className="cv-quickNav">
        <button
          className="cv-quickNavBtn"
          onClick={handleGoToToday}
          aria-label="Gehe zu heute"
          type="button"
        >
          Heute
        </button>
        
        <button
          className="cv-quickNavBtn"
          onClick={() => setShowDatePicker(!showDatePicker)}
          aria-label="Gehe zu Datum"
          type="button"
        >
          Datum
        </button>
      </div>

      {showDatePicker && (
        <div className="cv-datePickerOverlay" onClick={handleOverlayClick}>
          <div className="cv-datePickerBox" onClick={handleBoxClick}>
            <h3 className="cv-datePickerTitle">Datum auswählen</h3>
            <input
              type="date"
              className="cv-datePickerInput"
              defaultValue={toISODateLocal(currentWeekStart)}
              onChange={(e) => handleDateChange(e.target.value)}
              autoFocus
            />
            <button
              className="cv-datePickerClose"
              onClick={() => setShowDatePicker(false)}
              type="button"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}
    </>
  );
}