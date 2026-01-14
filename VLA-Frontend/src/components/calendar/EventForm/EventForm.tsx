import { useState } from "react";
import type { EventKind, EventStatus , Lecture } from "../CalendarTypes";
import AddLectureSection from "./AddLectureSection";
import AddCategorySection from "./AddCategorySection";
import RecurrenceSection from "./RecurrenceSection";

export type RecurrencePattern = {
  weekdays: number[];
  endDate: string;
};

export type EventFormData = {
  title: string;
  lectureId?: string;
  category: EventKind;
  startDateTime: string;
  endDateTime: string;
  recurrence?: RecurrencePattern;
  people: string[];
  status?: EventStatus;
};

type EventFormProps = {
  initialDate?: string;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  lectures?: Lecture[];
  categories?: EventKind[];
  onAddLecture?: (lecture: Lecture) => void;
  onAddCategory?: (category: EventKind) => void;
};

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
  const [peopleInput, setPeopleInput] = useState("");
  const [recurrence, setRecurrence] = useState({enabled: false, weekdays: [] as number[], endDate: ""});
  
  const handleAddLecture = (lecture: Lecture) => {
    onAddLecture?.(lecture);
    setLectureId(lecture.id); 
  };

  const handleAddCategory = (categoryName: string) => {
    onAddCategory?.(categoryName);
    setCategory(categoryName);
  };

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

    if (recurrence.enabled && recurrence.weekdays.length > 0 && recurrence.endDate) {
      formData.recurrence = {
        weekdays: recurrence.weekdays,
        endDate: recurrence.endDate,
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
              placeholder="z.B. Vorlesung Physik I"
              required
            />
          </div>

          <AddCategorySection
            categories={categories}
            selectedCategory={category}
            onCategoryChange={setCategory}
            onAddCategory={handleAddCategory}
          />

          <AddLectureSection
            lectures={lectures}
            selectedLectureId={lectureId}
            onLectureChange={setLectureId}
            onAddLecture={handleAddLecture}
          />

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

          <RecurrenceSection
            isEnabled={recurrence.enabled}
            onToggle={(enabled) => setRecurrence({ ...recurrence, enabled })}
            weekdays={recurrence.weekdays}
            onWeekdaysChange={(weekdays) => setRecurrence({ ...recurrence, weekdays })}
            endDate={recurrence.endDate}
            onEndDateChange={(endDate) => setRecurrence({ ...recurrence, endDate })}
          />

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