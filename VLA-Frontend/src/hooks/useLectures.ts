import { useState } from "react";
import type { Lecture } from "../components/calendar/CalendarTypes";

/**
 * useLectures stores and manages the list of lectures that can be assigned to events.
 * Currently local-only state; later this can be replaced with backend persistence.
// TODO: Backend - integrate with API 
*/

export function useLectures() {
  const [lectures, setLectures] = useState<Lecture[]>([]);

   /**
   * Add a new lecture to the list.
   */
  function handleAddLecture(lecture: Lecture) {
    setLectures((prev) => [...prev, lecture]);
  }
    /**
   * Remove a lecture by id.
   */
  function handleDeleteLecture(id: string) {
    setLectures((prev) => prev.filter((lec) => lec.id !== id));
  }

  return {
    lectures,
    handleAddLecture,
    handleDeleteLecture,
  };
}