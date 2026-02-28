/* eslint-disable */
// This is only a demonstration and should not be used

import useSseConnectionWithInitialFetch from "@/hooks/useSseConnectionWithInitialFetch";
import { SseMessageType } from "@/lib/databaseTypes";

export default function SseFetchTestComponent(){
  const eventHandlers = new Map<SseMessageType, (event: MessageEvent) => {message: string}>();
  eventHandlers.set(SseMessageType.SSEDEBUG, (event) => {console.log(event); return {message: event.data};});

  const [debugMessage, _] = useSseConnectionWithInitialFetch<{message: string}>({message: "You won't see this secret message, when I am around with my friend backend, I do not know what to say without him.."}, "/sse/getTestData", eventHandlers);

  return (
    debugMessage.message && <div style={{position: "absolute", width: "100%", height: "10%", backgroundColor: "green", top: "10%"}}>
      {debugMessage.message}
    </div>
  );
}
