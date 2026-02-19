import {type FormEvent, useState} from "react";
import AddLectureSection from "../EventForm/AddLectureSection";
import AddCategorySection from "../EventForm/AddCategorySection";
import TimeRangeInput from "../EventForm/TimeRangeInput";
import type {Appointment, AppointmentCategory, AppointmentSeries, Lecture, Person} from "@/lib/databaseTypes";
import {verifyValidTimeRange} from "@/components/calendar/eventUtils.ts";

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
  const [title, setTitle] = useState(event.series.name);
  const [category, setCategory] = useState<AppointmentCategory>(event.series.category);
  const [lecture, setLecture] = useState<Lecture | undefined>(event.series.lecture);
  const [notes, setNotes] = useState(event.notes || "");

  const [startDateTime, setStartDateTime] = useState(event.start);
  const [endDateTime, setEndDateTime] = useState(event.end);

  function handleAddCategory(category: AppointmentCategory) {
    onAddCategory?.(category);
    setCategory(category);
  };

  function handleAddLecture(lecture: Lecture) {
    onAddLecture?.(lecture);
    setLecture(lecture);
  };
 
  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const updatedSeries: AppointmentSeries = {
      ...event.series,
      name: title,
      category: category,
      lecture: lecture,
    };
    const updatedEvent: Partial<Appointment> = {
      start: startDateTime,
      end: endDateTime,
      notes: notes.trim(),
      series: updatedSeries,
    };

    onSave(updatedEvent);
  };

  const hasTitle = (title.trim() !== "") || Boolean(lecture);
  const hasCategory = category;
  const isValidTimeRange = verifyValidTimeRange(startDateTime, endDateTime);
  const isValid = hasTitle && hasCategory && isValidTimeRange;

  return (
    <div className="cv-formOverlay">
      <div className="cv-formBox">
        <h2 className="cv-formTitle">Termin bearbeiten</h2>

        <form onSubmit={handleSubmit} className="cv-form">
          <div className="cv-formGroup">
            <label htmlFor="title" className="cv-formLabel">
              Titel (für Vorlesungen optional)
            </label>
            <input
              id="title"
              type="text"
              className="cv-formInput"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              title={isValid ? "" : "Beginn und Ende müssen am selben Tag liegen"}
            >
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
