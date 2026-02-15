import { useState } from "react";
import type { Lecture, Person } from "../CalendarTypes";
import AddLectureForm from "./AddLectureForm";

type AddLectureSectionProps = {
  lectures: Lecture[];
  selectedLectureId: string;
  onLectureChange: (lectureId: string) => void;
  onAddLecture: (lecture: Lecture) => void;
  people?: Person[];
  onAddPerson?: (person: Person) => void; 
};

/**
 * AddLectureSection lets the user:
 * - select an existing lecture (dropdown)
 * - optionally create a new lecture with a custom color 
 * The actual storage of lectures happens in the parent (via onAddLecture).
 */
export default function AddLectureSection({
  lectures,
  selectedLectureId,
  onLectureChange,
  onAddLecture,
  people = [],
  onAddPerson,
}: AddLectureSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
 

  /**
   * Creates a new Lecture object and sends it to the parent.
   * Afterwards, resets the local form state and closes the add-form UI.
   */
  const handleAdd = (lecture: Lecture) => {
    onAddLecture(lecture);
    
    setShowAddForm(false);
  };

  return (
    <div className="cv-formGroup">
      <div className="cv-formLabelRow">
        <label htmlFor="lecture" className="cv-formLabel">
          Vorlesung (optional)
        </label>
        <button
          type="button"
          className="cv-addBtn"
          onClick={() => setShowAddForm(true)}
        >
          + Neue Vorlesung
        </button>
      </div>

      {/* Inline section for creating a new lecture */}
      {showAddForm && (
        <AddLectureForm
          onSubmit={handleAdd}
          onCancel={() => setShowAddForm(false)}
          people={people}
          onAddPerson={onAddPerson}
        />
      )}
        
      {/* Dropdown to select an existing lecture */}
      <select
        id="lecture"
        className="cv-formSelect"
        value={selectedLectureId}
        onChange={(e) => onLectureChange(e.target.value)}
      >
        <option value="">Keine Zuordnung</option>
        {lectures.map((lec) => (
          <option key={lec.id} value={lec.id}>
            {lec.name}
          </option>
        ))}
      </select>
    </div>
  );
}
