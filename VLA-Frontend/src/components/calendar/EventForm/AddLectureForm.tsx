import { useState } from "react";
import type { Lecture, Person } from "../CalendarTypes";
import ColorPicker from "../ColorPicker";
import AddPeopleSection from "./AddPeopleSection";

type AddLectureFormProps = {
  onSubmit: (lecture: Lecture) => void;
  onCancel: () => void;
  people?: Person[];
  onAddPerson?: (person: Person) => void;
};

/**
 * ============================================================================
 * NEUE KOMPONENTE: AddLectureForm
 * ============================================================================
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
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!lectureName.trim()) return;

    // ========== ÄNDERUNG: Lecture enthält jetzt people array ==========
    const newLecture: Lecture = {
      id: `lecture-${Date.now()}`,
      name: lectureName.trim(),
      semester: semester.trim() || "",
      color: color.trim(),
      people: selectedPeople, // Personen-IDs werden hier gespeichert
    };

    onSubmit(newLecture);
  };

  const handleAddPerson = (person: Person) => {
    onAddPerson?.(person);
    setSelectedPeople([...selectedPeople, person.id]);
  };

  const isValid = lectureName.trim() !== "";

  return (
    // ========== MODAL OVERLAY (ähnlich wie EventForm) ==========
    <div className="cv-formOverlay">
      <div className="cv-formBox">
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

          {/* ========== ÄNDERUNG: Semester-Feld hinzugefügt ========== */}
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

          {/* ========== ÄNDERUNG: Personen-Sektion von EventForm hierher verschoben ========== */}
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
    </div>
  );
}