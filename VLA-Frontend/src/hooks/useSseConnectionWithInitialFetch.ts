import type { SseMessageType } from "@/components/sse/SseMessageType";
import { useEffect, useState } from "react";
import useSseConnection from "./useSseConnection";

export default function useSseConnectionWithInitialFetch<T extends object>(defaultValue: T, apiResourceURL : string, eventHandlers: Map<SseMessageType, (event: MessageEvent) => T>){
    const [sseDefaultValue, setsseDefaultValue] = useSseConnection<T>(defaultValue, eventHandlers);

    useEffect(() => {
        let mounted = true;

        fetch(apiResourceURL)
        .then(res => {if(!res.ok) throw new Error() ;return res.json();})
        .then(parsedObj => {
            if (mounted){
                console.log(parsedObj);
                setsseDefaultValue(parsedObj);
            }
        })
        .catch(_ => console.log("Could not fetch data"));

        return () => {mounted = false;}
    }, []);

    

    return sseDefaultValue;
}