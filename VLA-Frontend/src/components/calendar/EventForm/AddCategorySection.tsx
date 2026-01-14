import { useState } from "react";
import type { EventKind } from "../CalendarTypes";

type AddCategorySectionProps = {
  categories: EventKind[];
  selectedCategory: EventKind;
  onCategoryChange: (category: EventKind) => void;
  onAddCategory: (categoryName: string) => void;
};

export default function AddCategorySection({
  categories,
  selectedCategory,
  onCategoryChange,
  onAddCategory,
}: AddCategorySectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAdd = () => {
    if (!newCategoryName.trim()) return;

    onAddCategory(newCategoryName.trim());
    setNewCategoryName("");
    setShowAddForm(false);
  };

  return (
    <div className="cv-formGroup">
      <div className="cv-formLabelRow">
        <label htmlFor="category" className="cv-formLabel">
          Kategorie *
        </label>
        <button
          type="button"
          className="cv-addBtn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "−" : "+"} Neue Kategorie
        </button>
      </div>

      {showAddForm && (
        <div className="cv-addSection">
          <input
            type="text"
            className="cv-formInput"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Kategorienamen eingeben"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
          <button
            type="button"
            className="cv-formBtn cv-formBtnSubmit"
            onClick={handleAdd}
            disabled={!newCategoryName.trim()}
          >
            Hinzufügen
          </button>
        </div>
      )}

      <select
        id="category"
        className="cv-formSelect"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value as EventKind)}
        required
      >
        <option value="">Bitte wählen...</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}