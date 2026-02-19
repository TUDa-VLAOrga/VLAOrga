import { useState } from "react";
import type {AppointmentCategory} from "@/lib/databaseTypes";

type AddCategorySectionProps = {
  categories: AppointmentCategory[];
  selectedCategory?: AppointmentCategory;
  onCategoryChange: (category: AppointmentCategory) => void;
  onAddCategory: (category: AppointmentCategory) => void;
};


/**
 * AddCategorySection lets the user:
 * - select an existing category (dropdown)
 * - optionally add a new category
 * The section does not store categories itself; it forwards changes to the parent.
 */
export default function AddCategorySection({
  categories,
  selectedCategory,
  onCategoryChange,
  onAddCategory,
}: AddCategorySectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  function handleAdd() {
    if (newCategoryName.trim() === "") return;

    const newCategory: AppointmentCategory = {
      id: -Date.now(),  // negative ID signals not-yet-saved entity
      title: newCategoryName.trim(),
    };
    onAddCategory(newCategory);
    setNewCategoryName("");
    setShowAddForm(false);
  }

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
        value={selectedCategory ? selectedCategory.id : ""}
        onChange={(e) => {
          const newCategory = categories.find((cat) => cat.id === Number(e.target.value));
          if (newCategory) onCategoryChange(newCategory);
        }}
        required
      >
        <option value="">Bitte wählen...</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.title}
          </option>
        ))}
      </select>
    </div>
  );
}
