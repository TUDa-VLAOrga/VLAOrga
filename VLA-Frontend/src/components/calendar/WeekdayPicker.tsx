type WeekdayPickerProps = {
  selectedDays: number[];
  onDaysChange: (days: number[]) => void;
};

const WEEKDAYS = [
  { value: 1, label: "Mo" },
  { value: 2, label: "Di" },
  { value: 3, label: "Mi" },
  { value: 4, label: "Do" },
  { value: 5, label: "Fr" },
];

export default function WeekdayPicker({
  selectedDays,
  onDaysChange,
}: WeekdayPickerProps) {
  const toggleWeekday = (day: number) => {
    if (selectedDays.includes(day)) {
      onDaysChange(selectedDays.filter((d) => d !== day));
    } else {
      onDaysChange([...selectedDays, day]);
    }
  };

  return (
    <div className="cv-weekdayPicker">
      {WEEKDAYS.map((wd) => (
        <button
          key={wd.value}
          type="button"
          className={`cv-weekdayBtn ${
            selectedDays.includes(wd.value) ? "active" : ""
          }`}
          onClick={() => toggleWeekday(wd.value)}
        >
          {wd.label}
        </button>
      ))}
    </div>
  );
}