import { useState } from "react";
import ColorPicker from "../ColorPicker";
import {createPortal} from "react-dom";
import AddPeopleSection from "../EventForm/AddPeopleSection";
import type {Lecture, Person} from "@/lib/databaseTypes";

type LectureEditFormProps = {
  lecture: Lecture;
  onSubmit: (lecture: Lecture) => void;
  onCancel: () => void;
  people?: Person[];
  onAddPerson: (person: Person) => Promise<Person | void>;
};

/**
 * LectureEditForm allows editing all properties of an existing lecture.
 */
export default function LectureEditForm({
  lecture,
  onSubmit,
  onCancel,
  people = [],
  onAddPerson,
}: LectureEditFormProps) {
  const [lectureName, setLectureName] = useState(lecture.name);
  const [semester, setSemester] = useState(lecture.semester);
  const [color, setColor] = useState(lecture.color);
  const [selectedPeople, setSelectedPeople] = useState<Person[]>(lecture.persons);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!lectureName.trim()) return;

    
    const editedLecture: Lecture = {
      id: lecture.id,
      name: lectureName.trim(),
      semester: semester.trim(),
      color: color.trim(),
      persons: selectedPeople,
    };

    onSubmit(editedLecture);
  };

  function handleAddPerson(person: Person) {
    onAddPerson(person).then(person => {
      if (person) {
        setSelectedPeople([...selectedPeople, person]);
      }
    });
  }

  const isValid = lectureName.trim() !== "";

  const modalContent = (
    <div className="cv-formOverlay" onClick={(e)=> e.stopPropagation()}>
      <div className="cv-formBox" onClick={(e)=> e.stopPropagation()}>
        <h2 className="cv-formTitle">Vorlesung bearbeiten</h2>

        <form onSubmit={handleSubmit} className="cv-form">
          {/* Vorlesungsname */}
          <div className="cv-formGroup">
            <label htmlFor="lectureName" className="cv-formLabel">
              Vorlesungsname *
            </label>
            <input
              id="lectureName"
              type="text"
              className="cv-formInput"
              value={lectureName}
              onChange={(e) => setLectureName(e.target.value)}
              placeholder="z.B. Physik I"
              required
            />
          </div>
          {/* Semester */}
          <div className="cv-formGroup">
            <label htmlFor="semester" className="cv-formLabel">
              Semester (optional)
            </label>
            <input
              id="semester"
              type="text"
              className="cv-formInput"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="z.B. WiSe 2024/25"
            />
          </div>

          {/* Farbauswahl */}
          <div className="cv-formGroup">
            <label className="cv-formLabel">Farbe wählen:</label>
            <ColorPicker
              selectedColor={color}
              onColorChange={setColor}
            />
          </div>


          <AddPeopleSection
            people={people}
            selectedPeople={selectedPeople}
            onPeopleChange={setSelectedPeople}
            onAddPerson={handleAddPerson}
          />

          {/* Action Buttons */}
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
              Änderungen speichern
            </button>
          </div>
        </form>
      </div>
    </div>);

  return createPortal(modalContent, document.body);
}
