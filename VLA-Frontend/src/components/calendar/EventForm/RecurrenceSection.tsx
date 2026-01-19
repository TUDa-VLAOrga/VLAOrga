import WeekdayPicker from "../WeekdayPicker";
import type { Weekday } from "./EventForm";



type RecurrenceSectionProps = {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  weekdays: Weekday[];
  onWeekdaysChange: (weekdays: Weekday[]) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
};

/**
 * RecurrenceSection provides UI for optional weekly recurrence:
 * - checkbox to enable/disable
 * - weekday selection
 * - "repeat until" end date
 * It does not generate events itself; it only collects recurrence inputs.
 */
export default function RecurrenceSection({
  isEnabled,
  onToggle,
  weekdays,
  onWeekdaysChange,
  endDate,
  onEndDateChange,
}: RecurrenceSectionProps) {
  return (
    <>
      {/* Enable/disable recurrence */}
      <div className="cv-formGroup">
        <label className="cv-formCheckbox">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => onToggle(e.target.checked)}
          />
          <span>Wiederholung</span>
        </label>
      </div>
      {/* Only show the configuration fields if recurrence is enabled */}
      {isEnabled && (
        <>
          <div className="cv-formGroup">
            <label className="cv-formLabel">Wochentage</label>
            <WeekdayPicker
              selectedDays={weekdays}
              onDaysChange={onWeekdaysChange}
            />
          </div>

          <div className="cv-formGroup">
            <label htmlFor="recEnd" className="cv-formLabel">
              Wiederholung bis
            </label>
            <input
              id="recEnd"
              type="date"
              className="cv-formInput"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
            />
          </div>
        </>
      )}
    </>
  );
}
