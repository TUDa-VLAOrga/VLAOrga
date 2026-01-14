import { useState } from "react";
import type { Lecture } from "../CalendarTypes";
import ColorPicker from "../ColorPicker";

type AddLectureSectionProps = {
  lectures: Lecture[];
  selectedLectureId: string;
  onLectureChange: (lectureId: string) => void;
  onAddLecture: (lecture: Lecture) => void;
};

export default function AddLectureSection({
  lectures,
  selectedLectureId,
  onLectureChange,
  onAddLecture,
}: AddLectureSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLectureName, setNewLectureName] = useState("");
  const [newLectureColor, setNewLectureColor] = useState("#3b82f6");

  const handleAdd = () => {
    if (!newLectureName.trim()) return;

    const newLecture: Lecture = {
      id: `lecture-${Date.now()}`,
      name: newLectureName.trim(),
      color: newLectureColor,
    };

    onAddLecture(newLecture);
    setNewLectureName("");
    setNewLectureColor("#3b82f6");
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
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "−" : "+"} Neue Vorlesung
        </button>
      </div>

      {showAddForm && (
        <div className="cv-addSection">
          <input
            type="text"
            className="cv-formInput"
            value={newLectureName}
            onChange={(e) => setNewLectureName(e.target.value)}
            placeholder="Vorlesungsname eingeben"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
          <div className="cv-formLabel" style={{ marginBottom: "8px" }}>
            Farbe wählen:
          </div>
          <ColorPicker
            selectedColor={newLectureColor}
            onColorChange={setNewLectureColor}
          />
          <button
            type="button"
            className="cv-formBtn cv-formBtnSubmit"
            onClick={handleAdd}
            disabled={!newLectureName.trim()}
            style={{ marginTop: "8px" }}
          >
            Hinzufügen
          </button>
        </div>
      )}

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