import {type Lecture, SseMessageType} from "@/lib/databaseTypes";
import useSseConnectionWithInitialFetch from "@/hooks/useSseConnectionWithInitialFetch.ts";

const API_URL = `/api/lectures`;

function handleLectureCreated(event: MessageEvent, currentValue: Lecture[]) {
  const newLecture = JSON.parse(event.data) as Lecture;
  return [...currentValue, newLecture];
}

function handleLectureDeleted(event: MessageEvent, currentValue: Lecture[]) {
  const deletedLecture = JSON.parse(event.data) as Lecture;
  return currentValue.filter((lecture) => lecture.id !== deletedLecture.id);
}

function handleLectureUpdated(event: MessageEvent, currentValue: Lecture[]) {
  const updatedLecture = JSON.parse(event.data) as Lecture;
  return currentValue.map((lecture) => (lecture.id === updatedLecture.id ? updatedLecture : lecture));
}

/**
 * useLectures stores and manages the list of lectures that can be assigned to events.
 * It synchronizes with the server via SSE.
*/
export function useLectures() {
  const sseHandlers = new Map<SseMessageType, (event: MessageEvent, currentValue: Lecture[]) => Lecture[]>();
  sseHandlers.set(SseMessageType.LECTURECREATED, handleLectureCreated);
  sseHandlers.set(SseMessageType.LECTUREDELETED, handleLectureDeleted);
  sseHandlers.set(SseMessageType.LECTUREUPDATED, handleLectureUpdated);
  const [lectures, _setLectures] = useSseConnectionWithInitialFetch<Lecture[]>(
    [], API_URL, sseHandlers
  );

  /**
   * Add a new lecture to the list.
   */
  async function handleAddLecture(lecture: Lecture) {
    return fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lecture),
    }).then((response) => response.json()).then((newLecture) => newLecture as Lecture);
  }

  /**
   * Remove a lecture.
   */
  async function handleDeleteLecture(lecture: Lecture) {
    return fetch(`${API_URL}/${lecture.id}`, {
      method: "DELETE",
    }).then((response) => response.json()).then((deletedLecture) => deletedLecture as Lecture);
  }

  return {
    lectures,
    handleAddLecture,
    handleDeleteLecture,
  };
}
