import { useState } from "react";
import type {AppointmentCategory} from "@/lib/databaseTypes";

/**
 * useCategories stores and manages the list of event categories (kinds).
 * It prevents duplicates to keep the select options clean.
 */
export function useCategories() {
  const [categories, setCategories] = useState<AppointmentCategory[]>([]);
  /**
   * Adds a category if it doesn't exist yet.
   */
  function handleAddCategory(category: AppointmentCategory) {
    if (!categories.includes(category)) {
      setCategories((prev) => [...prev, category]);
    }
  }

  return {
    categories,
    handleAddCategory,
  };
}
