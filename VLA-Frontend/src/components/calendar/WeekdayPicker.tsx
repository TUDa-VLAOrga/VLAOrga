import type { Weekday } from "./EventForm/AddEventForm.tsx";
import {NON_WORKDAYS} from "@/components/calendar/dateUtils.ts";

type WeekdayPickerProps = {
  selectedDays: Weekday[];
  onDaysChange: (days: Weekday[]) => void;
};

// every day which is not a non-workday ;)
const WORKDAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6].filter(dayNr => !NON_WORKDAYS.includes(dayNr));

const WEEKDAY_LABELS: Record<Weekday, string> = {
  0: "So",
  1: "Mo",
  2: "Di",
  3: "Mi",
  4: "Do",
  5: "Fr",
  6: "Sa",
};
export default function WeekdayPicker({
  selectedDays,
  onDaysChange,
}: WeekdayPickerProps) {

  function toggleWeekday(day: Weekday) {
    if (selectedDays.includes(day)) {
      onDaysChange(selectedDays.filter((d) => d !== day));
    } else {
      onDaysChange([...selectedDays, day]);
    }
  };

  return (
    <div className="cv-weekdayPicker">
      {WORKDAYS.map((day) => (
        <button
          key={day}
          type="button"
          className={`cv-weekdayBtn ${
            selectedDays.includes(day) ? "active" : ""
          }`}
          onClick={() => toggleWeekday(day)}
        >
          {WEEKDAY_LABELS[day]}
        </button>
      ))}
    </div>
  );
}
