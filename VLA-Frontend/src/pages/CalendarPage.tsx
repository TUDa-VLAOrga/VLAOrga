import CalendarView from "../components/calendar/CalendarView";

import SSEComponent from "@/components/sse/SseComponent";
import Calendar from "../components/calendar/Calendar";

export default function CalendarPage() {
  return (
    <>
    <div>
      <CalendarView />
    </div>
    <SSEComponent></SSEComponent>
    </>
  );
}
