import useSseConnection from "@/hooks/useSseConnection";
import { SseMessageType } from "./SseMessageType";

export default function SseTestComponent(){
    const eventHandlers = new Map<SseMessageType, (event: MessageEvent) => string>();
    eventHandlers.set(SseMessageType.SSEDEBUG, (event) => event.data); 

    const [debugMessage, _] = useSseConnection<string>("", eventHandlers);

    return (
        debugMessage && <div style={{position: "absolute", width: "100%", height: "10%", backgroundColor: "red", top: 0}}>
            {debugMessage}
        </div>
    )
}