import CalendarView from "../components/calendar/CalendarView";

import SSEComponent from "@/components/sse/SseComponent";
import SseFetchTestComponent from "@/components/sse/SseFetchTestComponent";
import SseTestComponent from "@/components/sse/SseTestComponent";


export default function CalendarPage() {
  return (
    <>
      <div>
        <CalendarView />
      </div>
      <SseTestComponent></SseTestComponent>
      <SseFetchTestComponent></SseFetchTestComponent>
      <SSEComponent></SSEComponent>
    </>
  );
}
