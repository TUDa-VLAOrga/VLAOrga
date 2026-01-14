import { useState } from "react";
import type { EventKind } from "../components/calendar/CalendarTypes";

export function useCategories() {
  const [categories, setCategories] = useState<EventKind[]>([]);

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