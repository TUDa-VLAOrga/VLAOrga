import type { Dispatch, RefObject, SetStateAction } from "react";
import { SseMessage } from "./SseMessage";
import type { SseObserver } from "./SseObserver";

/**
 * Class for notification of components
 * Handles the SSE connection to our backend
 */
export class SSEHandler {
    private static eventSource: EventSource;
    private static setComponentStatus: RefObject<Dispatch<SetStateAction<boolean>>>;
    private static registeredObservers: SseObserver[] = [];

    static initialize(setComponentStatus: RefObject<Dispatch<SetStateAction<boolean>>>) {
        if(this.eventSource) return;

        this.setComponentStatus = setComponentStatus;

        this.eventSource = new EventSource(`/sse/connect`);
        this.eventSource.addEventListener("error", SSEHandler.handleSseError);
        
        this.addEventSourceEventHandlers();

        window.addEventListener("beforeunload", SSEHandler.closeConnection);
    }

    private static addEventSourceEventHandlers(){
        SSEHandler.eventSource.addEventListener(SseMessage.DEBUG, SSEHandler.handleDebugEvent);
    }

    private static handleSseError(_: Event){
        SSEHandler.setComponentStatus.current(true);
    }

    private static closeConnection(){
        SSEHandler.eventSource.close();
    }

    public static registerObserver(observer: SseObserver){
        SSEHandler.registeredObservers.push(observer);
    }

    public static removeObserver(observer: SseObserver){
        const index = SSEHandler.registeredObservers.findIndex(element => element == observer);

        if(index == -1) return

        SSEHandler.registeredObservers.splice(index, 1);
    }

    private static notifyAllObserver(e: MessageEvent){
        SSEHandler.registeredObservers.forEach(obs => obs.update(e));
    }

    private static handleDebugEvent(e: MessageEvent){
        alert(e.data);
    }
}