import { useState } from "react";
import type { Lecture } from "../components/calendar/CalendarTypes";

export function useLectures() {
  const [lectures, setLectures] = useState<Lecture[]>([]);

  function handleAddLecture(lecture: Lecture) {
    setLectures((prev) => [...prev, lecture]);
  }

  function handleDeleteLecture(id: string) {
    setLectures((prev) => prev.filter((lec) => lec.id !== id));
  }

  return {
    lectures,
    handleAddLecture,
    handleDeleteLecture,
  };
}