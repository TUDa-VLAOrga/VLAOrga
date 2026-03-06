import GlobalNoteContainer from "@/components/globalNotes/GlobalNoteContainer";
import CalendarView from "../components/calendar/CalendarView";
import SSEComponent from "@/components/sse/SseComponent";
import "@/styles/zIndexes.css";


export default function CalendarPage() {
  return (
    <>
      <div>
        <CalendarView />
      </div>
      <SSEComponent></SSEComponent>
      <GlobalNoteContainer></GlobalNoteContainer>
    </>
  );
}
