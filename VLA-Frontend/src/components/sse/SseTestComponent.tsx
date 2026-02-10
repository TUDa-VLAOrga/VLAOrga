import useSseConnection from "@/hooks/useSseConnection";
import { SseMessageType } from "./SseMessageType";

export default function SseTestComponent(){
    const eventHandlers = new Map<SseMessageType, (event: MessageEvent) => string>();
    eventHandlers.set(SseMessageType.SSEDEBUG, (event) => event.data); 

    const defaultMessage = "I will turn red, when I realized that you posted to via curl -X POST localhost:8080/sse/manualNotification"
    const [debugMessage, _] = useSseConnection<string>(defaultMessage, eventHandlers);

    return (
        <div style={{position: "absolute", width: "100%", height: "10%", backgroundColor: defaultMessage == debugMessage ? "gray" : "red", top: 0}}>
            {debugMessage}
        </div>
    )
}