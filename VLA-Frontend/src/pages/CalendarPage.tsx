import SSEComponent from "@/components/sse/SseComponent";
import Calendar from "../components/calendar/Calendar";

export default function CalendarPage() {
  return (
    <>
    <div>
      <Calendar />
    </div>
    <SSEComponent></SSEComponent>
    </>
  );
}
