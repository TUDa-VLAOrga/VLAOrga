import { useState } from "react";
import type { CalendarEvent, EventKind, Lecture } from "../CalendarTypes";
import type { Person } from "../EventForm/AddPeopleSection";
import AddLectureSection from "../EventForm/AddLectureSection";
import AddCategorySection from "../EventForm/AddCategorySection";
import AddPeopleSection from "../EventForm/AddPeopleSection";
import TimeRangeInput from "../EventForm/TimeRangeInput";

type EventEditFormProps = {
  event: CalendarEvent;
  lectures?: Lecture[];
  people?: Person[];
  categories?: string[];
  onSave: (updates: Partial<CalendarEvent>) => void;
  onCancel: () => void;
  onAddCategory?: (category: string) => void;
  onAddPerson?: (person: Person) => void;
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
}: EventEditFormProps) {
  const [title, setTitle] = useState(event.title);
  const [category, setCategory] = useState<EventKind>(event.kind);
  const [lectureId, setLectureId] = useState(event.lectureId || "");
  const [notes, setNotes] = useState(event.notes || "");
  
  // Extract datetime from event
  const getStartDateTime = () => {
    if (event.displayedStartTime) {;
      return `${event.dateISO}T${event.displayedStartTime}`;
    }
    return `${event.dateISO}T09:00`;
  };

  const getEndDateTime = () => {
    if (event.displayedEndTime) {
      return `${event.dateISO}T${event.displayedEndTime}`;
    }
    return `${event.dateISO}T10:00`;
  };

  const [startDateTime, setStartDateTime] = useState(getStartDateTime());
  const [endDateTime, setEndDateTime] = useState(getEndDateTime());

  // Extract selected people IDs
  const getSelectedPeopleIds = (): string[] => {
    if (!event.people) return [];
    return event.people.map(p => typeof p === "string" ? p : p.id);
  };

  const [selectedPeople, setSelectedPeople] = useState<string[]>(getSelectedPeopleIds());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Extract date and time from datetime-local inputs
    const dateISO = startDateTime.split('T')[0];
    const displayedStartTime = startDateTime.split('T')[1];
    const displayedEndTime = endDateTime.split('T')[1];

    const updates: Partial<CalendarEvent> = {
      title,
      kind: category,
      lectureId: lectureId || undefined,
      dateISO,
      displayedStartTime,
      displayedEndTime,
      people: selectedPeople,
      notes,
    };

    onSave(updates);
  };

  const hasTitle = title.trim() !== "";
  const hasCategory = category.trim() !== "";
  const hasStartDateTime = startDateTime !== "";
  const hasEndDateTime = endDateTime !== "";
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
            onAddCategory={onAddCategory || ((cat) => setCategory(cat))}
          />

          <AddLectureSection
            lectures={lectures}
            selectedLectureId={lectureId}
            onLectureChange={setLectureId}
            onAddLecture={(lecture) => setLectureId(lecture.id)}
          />

            <TimeRangeInput
              startDateTime={startDateTime}
              endDateTime={endDateTime}
              onStartChange={setStartDateTime}
              onEndChange={setEndDateTime}
              durationMinutes={100}
            />

          <AddPeopleSection
            people={people}
            selectedPeople={selectedPeople}
            onPeopleChange={setSelectedPeople}
            onAddPerson={(person) => {
              if (onAddPerson) {
                onAddPerson(person);
              }
              setSelectedPeople([...selectedPeople, person.id])}
            }  
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