import { useState } from "react";
import type {AppointmentCategory} from "@/lib/databaseTypes";

/**
 * useEventForm centralizes form state for EventForm.
 * This hook can be used to keep EventForm component lean and focused on UI rendering.
 */
export function useEventForm(initialDate?: Date) {
  // Main form fields (excluding recurrence fields).
  const [formData, setFormData] = useState<{
    title: string;
    category: AppointmentCategory | undefined;
    lectureId: string;
    startDateTime: Date | undefined;
    endDateTime: Date | undefined;
    peopleInput: string;
  }>({
    title: "",
    category: undefined,
    lectureId: "",
    startDateTime: initialDate,
    endDateTime: initialDate,
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
                  formData.category &&
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
