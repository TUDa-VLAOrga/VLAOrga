import { SseMessageType } from "./SseMessageType";
import useSseConnectionWithInitialFetch from "@/hooks/useSseConnectionWithInitialFetch";

export default function SseTestComponent(){
    const eventHandlers = new Map<SseMessageType, (event: MessageEvent) => {message: string}>();
    eventHandlers.set(SseMessageType.SSEDEBUG, (event) => event.data);

    const debugMessage = useSseConnectionWithInitialFetch<{message: string}>({message: "This is just a plain default message"}, "/sse/getTestData", eventHandlers);

    return (
        debugMessage.message && <div style={{position: "absolute", width: "100%", height: "10%", backgroundColor: "green", top: "10%"}}>
            {debugMessage.message}
        </div>
    )
}