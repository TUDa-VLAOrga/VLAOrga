import SseTestComponent from "@/components/sse/SseTestComponent";
import CalendarView from "../components/calendar/CalendarView";

import SSEComponent from "@/components/sse/SseComponent";


export default function CalendarPage() {
  return (
    <>
      <div>
        <CalendarView />
      </div>
      <SseTestComponent></SseTestComponent>
      <SSEComponent></SSEComponent>
    </>
  );
}
