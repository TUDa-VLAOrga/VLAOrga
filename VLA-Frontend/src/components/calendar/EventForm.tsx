import { useState } from "react";
import type { EventKind, EventStatus } from "./CalendarTypes";

export type RecurrencePattern = {
  weekdays: number[]; // 0=So, 1=Mo, ..., 6=Sa
  endDate: string; // ISO date
};

export type EventFormData = {
  title: string;
  lectureId?: string; // Optional reference to lecture
  category: EventKind;
  startDateTime: string; // ISO datetime-local format
  endDateTime: string;
  recurrence?: RecurrencePattern;
  people: string[]; // IDs or names of people involved
  status?: EventStatus;
};

type EventFormProps = {
  initialDate?: string; // ISO date to pre-fill
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
};

// Mock data - später aus API/State laden
const CATEGORIES: EventKind[] = [
  "Vorlesung",
  "Übung",
  "Abnahmetermin",
  "Ferien",
  "Aufbau",
  "Abbau",
];

// Generate time options in 15-minute intervals
const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 15) {
    const hour = String(h).padStart(2, '0');
    const minute = String(m).padStart(2, '0');
    TIME_OPTIONS.push(`${hour}:${minute}`);
  }
}

const WEEKDAYS = [
  { value: 1, label: "Mo" },
  { value: 2, label: "Di" },
  { value: 3, label: "Mi" },
  { value: 4, label: "Do" },
  { value: 5, label: "Fr" },
];

export default function EventForm({
  initialDate,
  onSubmit,
  onCancel,
}: EventFormProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventKind>("Vorlesung");
  const [startDate, setStartDate] = useState(initialDate || "");
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState(initialDate || "");
  const [endTime, setEndTime] = useState("10:00");
  const [hasRecurrence, setHasRecurrence] = useState(false);
  const [recurrenceWeekdays, setRecurrenceWeekdays] = useState<number[]>([]);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState("");
  const [peopleInput, setPeopleInput] = useState("");

  function toggleWeekday(day: number) {
    setRecurrenceWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData: EventFormData = {
      title,
      category,
      startDateTime: `${startDate}T${startTime}`,
      endDateTime: `${endDate}T${endTime}`,
      people: peopleInput
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
    };

    if (hasRecurrence && recurrenceWeekdays.length > 0 && recurrenceEndDate) {
      formData.recurrence = {
        weekdays: recurrenceWeekdays,
        endDate: recurrenceEndDate,
      };
    }

    onSubmit(formData);
  }

  const isValid = title.trim() && startDate && startTime && endDate && endTime;

  return (
    <div className="cv-formOverlay">
      <div className="cv-formBox" >
        <h2 className="cv-formTitle">Neuer Termin</h2>

        <form onSubmit={handleSubmit} className="cv-form">
          <div className="cv-formGroup">
            <label htmlFor="title" className="cv-formLabel">
              Titel *
            </label>
            <input
              id="title"
              type="text"
              className="cv-formInput"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. Vorlesung Analysis I"
              required
            />
          </div>

          <div className="cv-formGroup">
            <label htmlFor="category" className="cv-formLabel">
              Kategorie *
            </label>
            <select
              id="category"
              className="cv-formSelect"
              value={category}
              onChange={(e) => setCategory(e.target.value as EventKind)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

         <div className="cv-formGroup">
            <label htmlFor="startDate" className="cv-formLabel">
              Startdatum *
            </label>
            <input
              id="startDate"
              type="date"
              className="cv-formInput"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

         <div className="cv-formGroup">
            <label htmlFor="startTime" className="cv-formLabel">
              Startzeit *
            </label>
            <select
              id="startTime"
              className="cv-formSelect"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            >
              {TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div className="cv-formGroup">
            <label htmlFor="endDate" className="cv-formLabel">
              Enddatum *
            </label>
            <input
              id="endDate"
              type="date"
              className="cv-formInput"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div className="cv-formGroup">
            <label htmlFor="endTime" className="cv-formLabel">
              Endzeit *
            </label>
            <select
              id="endTime"
              className="cv-formSelect"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            >
              {TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div className="cv-formGroup">
            <label className="cv-formCheckbox">
              <input
                type="checkbox"
                checked={hasRecurrence}
                onChange={(e) => setHasRecurrence(e.target.checked)}
              />
              <span>Wiederholung</span>
            </label>
          </div>

          {hasRecurrence && (
            <>
              <div className="cv-formGroup">
                <label className="cv-formLabel">Wochentage</label>
                <div className="cv-weekdayPicker">
                  {WEEKDAYS.map((wd) => (
                    <button
                      key={wd.value}
                      type="button"
                      className={`cv-weekdayBtn ${
                        recurrenceWeekdays.includes(wd.value) ? "active" : ""
                      }`}
                      onClick={() => toggleWeekday(wd.value)}
                    >
                      {wd.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cv-formGroup">
                <label htmlFor="recEnd" className="cv-formLabel">
                  Wiederholung bis
                </label>
                <input
                  id="recEnd"
                  type="date"
                  className="cv-formInput"
                  value={recurrenceEndDate}
                  onChange={(e) => setRecurrenceEndDate(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="cv-formGroup">
            <label htmlFor="people" className="cv-formLabel">
              Personen (kommagetrennt)
            </label>
            <input
              id="people"
              type="text"
              className="cv-formInput"
              value={peopleInput}
              onChange={(e) => setPeopleInput(e.target.value)}
              placeholder="z.B. Prof. Müller, Dr. Schmidt"
            />
            <small className="cv-formHint">
              Mehrere Personen mit Komma trennen
            </small>
          </div>

          <div className="cv-formActions">
            <button
              type="button"
              className="cv-formBtn cv-formBtnCancel"
              onClick={onCancel}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="cv-formBtn cv-formBtnSubmit"
              disabled={!isValid}
            >
              Erstellen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}