import { useState } from "react";
import type { EventKind, EventStatus, Lecture } from "./CalendarTypes";

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
  lectures? : Lecture[];
  categories?: EventKind[];
  onAddLecture?: (lecture: Lecture) => void;
  onAddCategory?: (category: EventKind) => void;
};

const COLOR_PALETTE = [
  "#3b82f6", // Blau
  "#10b981", // Grün
  "#f59e0b", // Orange
  "#8b5cf6", // Lila
  "#ef4444", // Rot
  "#06b6d4", // Cyan
  "#f97316", // Orange-Rot
  "#84cc16", // Lime
  "#ec4899", // Pink
  "#6366f1", // Indigo
];
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
  lectures= [],
  categories=[],
  onAddLecture,
  onAddCategory,
}: EventFormProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventKind>("Vorlesung");
  const [lectureId, setLectureId] = useState("");
  const [startDateTime, setStartDateTime] = useState(initialDate ? `${initialDate}T09:00` : "");
  const [endDateTime, setEndDateTime] = useState(  initialDate ? `${initialDate}T10:00` : "");
  const [hasRecurrence, setHasRecurrence] = useState(false);
  const [recurrenceWeekdays, setRecurrenceWeekdays] = useState<number[]>([]);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState("");
  const [peopleInput, setPeopleInput] = useState("");
  const [showAddLecture, setShowAddLecture] = useState(false);
  const [newLectureName, setNewLectureName] = useState("");
  const [newLectureColor, setNewLectureColor] = useState(COLOR_PALETTE[0]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  function toggleWeekday(day: number) {
    setRecurrenceWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  function handleAddLecture() {
    if (!newLectureName.trim() || !onAddLecture) return;

    const newLecture: Lecture = {
      id: `lecture-${Date.now()}`,
      name: newLectureName.trim(),
      color: newLectureColor,
    };

    onAddLecture(newLecture);
    setLectureId(newLecture.id); // Automatisch auswählen
    setNewLectureName("");
    setNewLectureColor(COLOR_PALETTE[0]);
    setShowAddLecture(false);
  }

  
  function handleAddCategory() {
    if (!newCategoryName.trim() || !onAddCategory) return;

    onAddCategory(newCategoryName.trim());
    setCategory(newCategoryName.trim()); // Automatisch auswählen
    setNewCategoryName("");
    setShowAddCategory(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData: EventFormData = {
      title,
      category,
      startDateTime,
      endDateTime,
      people: peopleInput
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
    };

    if( lectureId) {
      formData.lectureId= lectureId;
    }

    if (hasRecurrence && recurrenceWeekdays.length > 0 && recurrenceEndDate) {
      formData.recurrence = {
        weekdays: recurrenceWeekdays,
        endDate: recurrenceEndDate,
      };
    }

    onSubmit(formData);
  }

  const isValid = title.trim() && category.trim() && startDateTime && endDateTime;

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
            <div className="cv-formLabelRow">
              <label htmlFor="category" className="cv-formLabel">
                Kategorie *
              </label>
              <button
                type="button"
                className="cv-addBtn"
                onClick={() => setShowAddCategory(!showAddCategory)}
              >
                {showAddCategory ? "−" : "+"} Neue Kategorie
              </button>
            </div>

            {showAddCategory && (
              <div className="cv-addSection">
                <input
                  type="text"
                  className="cv-formInput"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Kategorienamen eingeben"
                />
                <button
                  type="button"
                  className="cv-formBtn cv-formBtnSubmit"
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                >
                  Hinzufügen
                </button>
              </div>
            )}

            <select
              id="category"
              className="cv-formSelect"
              value={category}
              onChange={(e) => setCategory(e.target.value as EventKind)}
              required
            >
              <option value="">Bitte wählen...</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="cv-formGroup">
            <div className="cv-formLabelRow">
              <label htmlFor="lecture" className="cv-formLabel">
                Vorlesung (optional)
              </label>
              <button
                type="button"
                className="cv-addBtn"
                onClick={() => setShowAddLecture(!showAddLecture)}
              >
                {showAddLecture ? "−" : "+"} Neue Vorlesung
              </button>
            </div>

            {showAddLecture && (
              <div className="cv-addSection">
                <input
                  type="text"
                  className="cv-formInput"
                  value={newLectureName}
                  onChange={(e) => setNewLectureName(e.target.value)}
                  placeholder="Vorlesungsname eingeben"
                />
                 <div className="cv-formLabel" style={{ marginBottom: "8px" }}>
                  Farbe wählen:
                </div>
                <div className="cv-colorPicker" style={{ marginBottom: "8px" }}>
                  {COLOR_PALETTE.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`cv-colorBtn ${
                        newLectureColor === color ? "active" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewLectureColor(color)}
                      aria-label={`Farbe ${color}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="cv-formBtn cv-formBtnSubmit"
                  onClick={handleAddLecture}
                  disabled={!newLectureName.trim()}
                >
                  Hinzufügen
                </button>
              </div>
            )}

            <select
              id="lecture"
              className="cv-formSelect"
              value={lectureId}
              onChange={(e) => setLectureId(e.target.value)}
            >
              <option value="">Keine Zuordnung</option>
              {lectures.map((lec) => (
                <option key={lec.id} value={lec.id}>
                  {lec.name}
                </option>
              ))}
            </select>
          </div>


          <div className="cv-formGroup">
            <label htmlFor="startDateTime" className="cv-formLabel">
              Start (Datum & Uhrzeit) *
            </label>
            <input
              id="startDateTime"
              type="datetime-local"
              className="cv-formInput"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              required
            />
          </div>

           <div className="cv-formGroup">
            <label htmlFor="endDateTime" className="cv-formLabel">
              Ende (Datum & Uhrzeit) *
            </label>
            <input
              id="endDateTime"
              type="datetime-local"
              className="cv-formInput"
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
              required
            />
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