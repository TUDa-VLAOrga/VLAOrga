import { useState } from "react";
import ColorPicker from "../ColorPicker";
import {createPortal} from "react-dom";
import AddPeopleSection from "./AddPeopleSection";
import type {Lecture, Person} from "@/lib/databaseTypes";
import {getNotSynchronisedId} from "@/lib/utils.ts";

type AddLectureFormProps = {
  onSubmit: (lecture: Lecture) => void;
  onCancel: () => void;
  people?: Person[];
  onAddPerson: (person: Person) => Promise<Person | void>;
};

/**
 * Ersetzt das inline-Formular in AddLectureSection durch ein vollständiges Modal.
 * Ermöglicht das Erstellen von Vorlesungen mit:
 * - Name
 * - Semester
 * - Farbe
 * - Zugeordnete Personen (verschoben von EventForm)
 */
export default function AddLectureForm({
  onSubmit,
  onCancel,
  people = [],
  onAddPerson,
}: AddLectureFormProps) {
  const [lectureName, setLectureName] = useState("");
  const [semester, setSemester] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [selectedPeople, setSelectedPeople] = useState<Person[]>([]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!lectureName.trim()) return;

    
    const newLecture: Lecture = {
      id: getNotSynchronisedId(),  // negative ID to signal not-yet-created entity
      name: lectureName.trim(),
      semester: semester.trim(),
      color: color.trim(),
      persons: selectedPeople,
    };

    onSubmit(newLecture);
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
        <h2 className="cv-formTitle">Neue Vorlesung</h2>

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
              Vorlesung erstellen
            </button>
          </div>
        </form>
      </div>
    </div>);

  return createPortal(modalContent, document.body);
}
