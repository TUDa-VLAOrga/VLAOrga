import { Logger } from "@/components/logger/Logger";
import { SSEHandler } from "@/components/sse/SseHandler";
import SseHookObserver from "@/components/sse/SseHookObserver";
import type { SseMessageType } from "@/components/sse/SseMessageType";
import { useEffect, useState } from "react";

export default function useSseConnection<T>(initialValue: T, eventHandlers: Map<SseMessageType, (event: MessageEvent) => T>){
    const [value, setValue] = useState<T>(initialValue);

    function handleSseMessage(event: MessageEvent){
        Logger.info("Received event");
        if(!eventHandlers.has(event.type as SseMessageType)) return;

        setValue(eventHandlers.get(event.type as SseMessageType)!(event));
    }

    useEffect(() => {
        const obs: SseHookObserver = new SseHookObserver(handleSseMessage);
        SSEHandler.registerObserver(obs);

        return () => SSEHandler.removeObserver(obs);
    }, []);

    console.log(value)
    return [value, setValue] as const;
}