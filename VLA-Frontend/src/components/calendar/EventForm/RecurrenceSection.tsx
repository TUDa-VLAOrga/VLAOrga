import WeekdayPicker from "../WeekdayPicker";
import type { Weekday } from "./EventCreationForm.tsx";
import type {CalendarDay} from "@/components/calendar/CalendarTypes.ts";



type RecurrenceSectionProps = {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  weekdays: Weekday[];
  onWeekdaysChange: (weekdays: Weekday[]) => void;
  endDay?: CalendarDay;
  onEndDayChange: (day: CalendarDay) => void;
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
  endDay,
  onEndDayChange,
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
            <div className="cv-formHint">
              Für jeden Wochentag wird eine eigene Terminserie erstellt.
            </div>
          </div>

          <div className="cv-formGroup">
            <label htmlFor="recEnd" className="cv-formLabel">
              Wiederholung bis einschließlich
            </label>
            <input
              id="recEnd"
              type="date"
              className="cv-formInput"
              value={endDay?.iso}
              onChange={(e) => {
                const newDay: CalendarDay = {
                  date: new Date(e.target.value),
                  iso: e.target.value,
                };
                onEndDayChange(newDay);
              }}
            />
          </div>
        </>
      )}
    </>
  );
}
