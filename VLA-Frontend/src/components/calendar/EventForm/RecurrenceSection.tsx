import WeekdayPicker from "../WeekdayPicker";

type RecurrenceSectionProps = {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  weekdays: number[];
  onWeekdaysChange: (weekdays: number[]) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
};

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