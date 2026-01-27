import { useEffect, useState } from "react";
import type { EventKind, EventStatus , Lecture } from "../CalendarTypes";
import AddLectureSection from "./AddLectureSection";
import AddCategorySection from "./AddCategorySection";
import RecurrenceSection from "./RecurrenceSection";
import { addMinutesToDateTime } from "../dateUtils";
import AddPeopleSection, {type Person} from "./AddPeopleSection";

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sunday to Saturday

export type RecurrencePattern = {
  weekdays: Weekday[];
  endDate: string;
};

export type EventFormData = {
  title: string;
  lectureId?: string;
  category: EventKind;
  startDateTime: string;
  endDateTime: string;
  recurrence?: RecurrencePattern;
  people: string[] | Person[];
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
  people?: Person[];
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
  initialDate,
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
  const [category, setCategory] = useState<EventKind>("Vorlesung");
  const [lectureId, setLectureId] = useState("");
  const [startDateTime, setStartDateTime] = useState(initialDate ? `${initialDate}T09:00` : "");
  const [endDateTime, setEndDateTime] = useState(  initialDate ? `${initialDate}T10:00` : "");
  const [selectedPeople,setSelectedPeople] = useState<string[]>([]);
  const [recurrence, setRecurrence] = useState({enabled: false, weekdays: [] as Weekday[], endDate: ""});
  
  useEffect(() => {
  // Wenn startDateTime gesetzt ist, aber endDateTime fehlt oder davor liegt
    if (startDateTime ) {
      setEndDateTime(addMinutesToDateTime(startDateTime, 100));
    }
  }, [startDateTime]);
  /**
   * When a new lecture is created inside AddLectureSection:
   * - forward it to the parent (so it ends up in the lecture list)
   * - auto-select it for the current event
   */

  const handleAddLecture = (lecture: Lecture) => {
    onAddLecture?.(lecture);
    setLectureId(lecture.id); 
  };
  
  /**
   * When a new category is created inside AddCategorySection:
   * - forward it to the parent (so it ends up in the category list)
   * - auto-select it for the current event
   */
  const handleAddCategory = (categoryName: string) => {
    onAddCategory?.(categoryName);
    setCategory(categoryName);
  };

  const handleAddPerson = (person: Person) => {
    onAddPerson?.(person);
    setSelectedPeople([...selectedPeople, person.id]);
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
      people: selectedPeople
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
  // Used to disable submit when required fields are missing
  const hasTitle = title.trim() !== "";
  const hasCategory = category.trim() !== "";
  const hasStartDateTime = startDateTime !== "";
  const hasEndDateTime = endDateTime !== "";
  const isValidTimeRange = endDateTime > startDateTime;
  const isValid = hasTitle && hasCategory && hasStartDateTime && hasEndDateTime && isValidTimeRange;

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
              onChange={(e) => {
                setStartDateTime(e.target.value);
              }}
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

          <AddPeopleSection
            people={people}
            selectedPeople={selectedPeople}
            onPeopleChange={setSelectedPeople}
            onAddPerson={handleAddPerson}
          />

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
