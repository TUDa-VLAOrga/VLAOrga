import { useState } from "react";
import type { EventKind } from "../components/calendar/CalendarTypes";

/**
 * useCategories stores and manages the list of event categories (kinds).
 * It prevents duplicates to keep the select options clean.
 */
export function useCategories() {
  const [categories, setCategories] = useState<EventKind[]>([]);
    /**
   * Adds a category if it doesn't exist yet.
   */
  function handleAddCategory(category: EventKind) {
    if (!categories.includes(category)) {
      setCategories((prev) => [...prev, category]);
    }
  }

  return {
    categories,
    handleAddCategory,
  };
}