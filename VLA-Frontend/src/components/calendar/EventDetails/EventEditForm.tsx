import {type FormEvent, useState} from "react";
import AddLectureSection from "../EventForm/AddLectureSection";
import AddCategorySection from "../EventForm/AddCategorySection";
import TimeRangeInput from "../EventForm/TimeRangeInput";
import type {Appointment, AppointmentCategory, Lecture, Person} from "@/lib/databaseTypes";
import {DEFAULT_DURATION, getEventTitle} from "@/components/calendar/eventUtils.ts";

type EventEditFormProps = {
  event: Appointment;
  lectures?: Lecture[];
  people?: Person[];
  categories?: AppointmentCategory[];
  onSave: (updates: Partial<Appointment>) => void;
  onCancel: () => void;
  onAddCategory?: (category: AppointmentCategory) => void;
  onAddPerson?: (person: Person) => void;
  onAddLecture?: (lecture: Lecture) => void;
};

/**
 * EventEditForm allows editing all properties of an existing event
 */
export default function EventEditForm({
  event,
  lectures = [],
  categories = [],
  people = [],
  onSave,
  onCancel,
  onAddCategory,
  onAddPerson,
  onAddLecture,
}: EventEditFormProps) {
  // TODO: proper copying, do not modify existing entity
  const [title, setTitle] = useState(getEventTitle(event));
  const [category, setCategory] = useState<AppointmentCategory | undefined>(event.series.category);
  const [lecture, setLecture] = useState<Lecture | undefined>(event.series.lecture);
  const [notes, setNotes] = useState(event.notes || "");

  const [startDateTime, setStartDateTime] = useState(event.start);
  const [endDateTime, setEndDateTime] = useState(event.end);

  const handleAddCategory = (category: AppointmentCategory) => {
    onAddCategory?.(category);
    setCategory(category);
  };

  const handleAddLecture = (lecture: Lecture) => {
    onAddLecture?.(lecture);
    setLecture(lecture);
  };
 
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const updates: Partial<Appointment> = {
      // TODO: series modification with category & lecture
      start: startDateTime,
      end: endDateTime,
      notes: notes.trim(),
    };

    onSave(updates);
  };

  const hasTitle = title.trim() !== "";
  const hasCategory = category;
  const hasStartDateTime = startDateTime;
  const hasEndDateTime = endDateTime;
  const isValidTimeRange = endDateTime > startDateTime;
  const isValid = hasTitle && hasCategory && hasStartDateTime && hasEndDateTime && isValidTimeRange;

  return (
    <div className="cv-formOverlay">
      <div className="cv-formBox">
        <h2 className="cv-formTitle">Termin bearbeiten</h2>

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
            selectedLecture={lecture}
            onLectureChange={setLecture}
            onAddLecture={handleAddLecture}
            people={people}
            onAddPerson={onAddPerson}
          />

          <TimeRangeInput
            startDateTime={startDateTime}
            endDateTime={endDateTime}
            onStartChange={setStartDateTime}
            onEndChange={setEndDateTime}
            durationMinutes={DEFAULT_DURATION}
          />

          <div className="cv-formGroup">
            <label htmlFor="eventNotes" className="cv-formLabel">
              Notizen zum Termin
            </label>
            <textarea
              id="eventNotes"
              className="cv-formInput cv-eventNotesTextarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notizen zu diesem Termin..."
              rows={4}
            />
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
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
