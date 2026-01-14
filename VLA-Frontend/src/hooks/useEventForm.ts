import { useState } from "react";
import type { EventKind } from "../components/calendar/CalendarTypes";

/**
 * useEventForm centralizes form state for EventForm.
 * This hook can be used to keep EventForm component lean and focused on UI rendering.
 */

export function useEventForm(initialDate?: string) {
    // Main form fields (excluding recurrence fields).
  const [formData, setFormData] = useState({
    title: "",
    category: "" as EventKind,
    lectureId: "",
    startDateTime: initialDate ? `${initialDate}T09:00` : "",
    endDateTime: initialDate ? `${initialDate}T10:00` : "",
    peopleInput: "",
  });
  // Recurrence configuration is stored separately to keep concerns split.
  const [recurrence, setRecurrence] = useState({
    enabled: false,
    weekdays: [] as number[],
    endDate: "",
  });
  // Basic validation used to disable the submit button.
  const isValid = formData.title.trim() && 
                  formData.category.trim() && 
                  formData.startDateTime && 
                  formData.endDateTime;

  return {
    formData,
    setFormData,
    recurrence,
    setRecurrence,
    isValid,
  };
}