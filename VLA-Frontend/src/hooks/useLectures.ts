import { useState } from "react";
import type { Lecture } from "../components/calendar/CalendarTypes";

// TODO: move to some central file
const BASE_URL = "http://localhost:8080/api";
const API_URL = `${BASE_URL}/lectures`;

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
  // TODO: refactor this, probably to a central helper method
  function handleAddLecture(lecture: Lecture) {
    // unset ID, backend will generate one
    
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
