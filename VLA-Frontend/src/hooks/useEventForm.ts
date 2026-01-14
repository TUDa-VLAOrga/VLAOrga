import { useState } from "react";
import type { EventKind } from "../components/calendar/CalendarTypes";

export function useEventForm(initialDate?: string) {
  const [formData, setFormData] = useState({
    title: "",
    category: "Vorlesung" as EventKind,
    lectureId: "",
    startDateTime: initialDate ? `${initialDate}T09:00` : "",
    endDateTime: initialDate ? `${initialDate}T10:00` : "",
    peopleInput: "",
  });

  const [recurrence, setRecurrence] = useState({
    enabled: false,
    weekdays: [] as number[],
    endDate: "",
  });

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