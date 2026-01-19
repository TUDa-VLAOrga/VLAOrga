import { useState, useRef, useEffect } from "react";
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
  const [selectedDate, setSelectedDate] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showDatePicker) {
      setSelectedDate(toISODateLocal(currentWeekStart));
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [showDatePicker , currentWeekStart]);

  function handleGoToToday() {
    onDateSelect(normalizeToWorkdayStart(new Date()));
  }

  function handleDateInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Just update the local state, don't navigate yet
    setSelectedDate(e.target.value);
  }

  function handleConfirm() {
    if (selectedDate) {
      const date = new Date(selectedDate);
      onDateSelect(normalizeToWorkdayStart(date));
      setShowDatePicker(false);
    }
  }

  function handleCancel() {
    setShowDatePicker(false);
  }

  function handleOverlayClick() {
    setShowDatePicker(false);
  }
  function handleBoxClick(e: React.MouseEvent) {
    e.stopPropagation();
  }
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleConfirm();
    } else if (e.key === "Escape") {
      handleCancel();
    }
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
          Jetzt
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
              ref={inputRef}
              type="date"
              className="cv-datePickerInput"
              value={selectedDate}
              onChange={handleDateInputChange}
              onKeyDown={handleKeyDown}
            />
            <div className="cv-datePickerActions">
              <button
                className="cv-datePickerBtn cv-datePickerCancel"
                onClick={handleCancel}
                type="button"
              >
                Abbrechen
              </button>
              <button
                className="cv-datePickerBtn cv-datePickerConfirm"
                onClick={handleConfirm}
                type="button"
                disabled={!selectedDate}
              >
                Bestätigen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
