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
    lecture.id = "";

    const headers: Headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");

    const request: RequestInfo = new Request(API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(lecture),
    });
    fetch(request).then(res => {
      console.log("response from adding lecture:");
      // TODO: this misses error handling if the backend fails
      res.json().then(data => {
        console.log(data);
        setLectures((prev) => [...prev, data as Lecture]);
      });
    });
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
