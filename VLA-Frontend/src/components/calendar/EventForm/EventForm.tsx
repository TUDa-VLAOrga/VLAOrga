import {  useState } from "react";
import type {CalendarDay, EventStatus} from "../CalendarTypes";
import AddLectureSection from "./AddLectureSection";
import AddCategorySection from "./AddCategorySection";
import RecurrenceSection from "./RecurrenceSection";
import TimeRangeInput from "./TimeRangeInput";
import type {AppointmentCategory, Lecture, Person} from "@/lib/databaseTypes";
import {verifyValidTimeRange} from "@/components/calendar/eventUtils.ts";


export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sunday to Saturday

export type RecurrencePattern = {
  weekdays: Weekday[];
  endDay?: CalendarDay;
};

export type EventFormData = {
  title: string;
  lecture?: Lecture;
  category?: AppointmentCategory;
  startDateTime?: Date;
  endDateTime?: Date;
  recurrence?: RecurrencePattern;
  status?: EventStatus;
  notes?: string;
};

type EventFormProps = {
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  lectures: Lecture[];
  categories: AppointmentCategory[];
  onAddLecture: (lecture: Lecture) => void;
  onAddCategory: (category: AppointmentCategory) => void;
  people: Person[];
  onAddPerson?: (person: Person) => void;
};

/**
 * EventForm collects all user inputs needed to create a calendar event.
 * It supports:
 * - selecting/adding categories
 * - selecting/adding lectures (with color)
 * - start/end datetime
 * - optional recurrence
 * - optional people list
 */
export default function EventForm({
  onSubmit,
  onCancel,
  lectures= [],
  categories=[],
  onAddLecture,
  onAddCategory,
  people= [],
  onAddPerson,
}: EventFormProps) {
  // Basic form fields.
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<AppointmentCategory>();
  const [lecture, setLecture] = useState<Lecture>();
  const [startDateTime, setStartDateTime] = useState<Date | undefined>();
  const [endDateTime, setEndDateTime] = useState<Date | undefined>();
  const [notes, setNotes] = useState("");
  const [recurrence, setRecurrence] = useState(
    {enabled: false, weekdays: [] as Weekday[], endDay: undefined as CalendarDay | undefined});
  
  /**
   * When a new lecture is created inside AddLectureSection:
   * - forward it to the parent (so it ends up in the lecture list)
   * - auto-select it for the current event
   */

  const handleAddLecture = (lecture: Lecture) => {
    onAddLecture?.(lecture);
    setLecture(lecture);
  };
  
  /**
   * When a new category is created inside AddCategorySection:
   * - forward it to the parent (so it ends up in the category list)
   * - auto-select it for the current event
   */
  const handleAddCategory = (category: AppointmentCategory) => {
    onAddCategory?.(category);
    setCategory(category);
  };

  /**
   * Transform UI state into EventFormData and submit to parent.
   * - Parses peopleInput into a string array
   * - Adds lectureId only if selected
   * - Adds recurrence only if enabled and complete
   */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData: EventFormData = {
      title,
      category,
      startDateTime,
      endDateTime,
    };

    if( lecture) {
      formData.lecture= lecture;
    }

    if (recurrence.enabled && recurrence.weekdays.length > 0 && recurrence.endDay) {
      formData.recurrence = {
        weekdays: recurrence.weekdays,
        endDay: recurrence.endDay,
      };
    }

    if (notes.trim() !== "") {
      formData.notes = notes.trim();
    }
    onSubmit(formData);
  }
  // Used to disable submit when required fields are missing
  const hasTitle = (title.trim() !== "") || Boolean(lecture);
  const isValid =
    hasTitle && category && startDateTime && endDateTime && verifyValidTimeRange(startDateTime, endDateTime);

  return (
    <div className="cv-formOverlay">
      <div className="cv-formBox" >
        <h2 className="cv-formTitle">Neuer Termin</h2>

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
              placeholder="z.B. Vorlesung Physik I"
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
            autoCalculateEnd={true}
          />

          <RecurrenceSection
            isEnabled={recurrence.enabled}
            onToggle={(enabled) => setRecurrence({ ...recurrence, enabled })}
            weekdays={recurrence.weekdays}
            onWeekdaysChange={(weekdays) => setRecurrence({ ...recurrence, weekdays })}
            endDay={recurrence.endDay}
            onEndDayChange={(endDay) => setRecurrence({ ...recurrence, endDay })}
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
              Erstellen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
