import {type Lecture, SseMessageType} from "@/lib/databaseTypes";
import useSseConnectionWithInitialFetch from "@/hooks/useSseConnectionWithInitialFetch.ts";
import {API_URL_LECTURES} from "@/lib/api.ts";
import {Logger} from "@/components/logger/Logger.ts";


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
    [], API_URL_LECTURES, sseHandlers
  );

  /**
   * Add a new lecture to the list.
   */
  async function handleAddLecture(lecture: Lecture) {
    return fetch(API_URL_LECTURES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lecture),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Error during lecture creation: " + response.statusText + ".");
      }
      return response.json();
    }).then((newLecture) => newLecture as Lecture)
      .catch((error) => {
        Logger.error("Error during lecture creation: " + error);
        return;
      });
  }

  /**
   * Remove a lecture.
   */
  async function handleDeleteLecture(lecture: Lecture) {
    return fetch(`${API_URL_LECTURES}/${lecture.id}`, {
      method: "DELETE",
    }).then((response) => response.json()).then((deletedLecture) => deletedLecture as Lecture);
  }

  return {
    lectures,
    handleAddLecture,
    handleDeleteLecture,
  };
}
