import { useState } from "react";
import type { EventKind } from "../components/calendar/CalendarTypes";

const DEFAULT_START_TIME = "09:00";
const DEFAULT_END_TIME = "10:00";

/**
 * useEventForm centralizes form state for EventForm.
 * This hook can be used to keep EventForm component lean and focused on UI rendering.
 */

export function useEventForm(initialDate?: string) {
    // Main form fields (excluding recurrence fields).
  const [formData, setFormData] = useState<{
  title: string;
  category: EventKind | ""; 
  lectureId: string;
  startDateTime: string;
  endDateTime: string;
  peopleInput: string;
}>({
  title: "",
  category: "", 
  lectureId: "",
  startDateTime: initialDate ? `${initialDate}T${DEFAULT_START_TIME}` : "",
  endDateTime: initialDate ? `${initialDate}T${DEFAULT_END_TIME}` : "",
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