import type { Dispatch, RefObject, SetStateAction } from "react";
import { SSEMessage } from "./SseMessage";

/**
 * Class for notification of components
 * Handles the SSE connection to our backend
 */
export class SSEHandler {
    private static eventSource: EventSource;
    private static setComponentStatus: RefObject<Dispatch<SetStateAction<boolean>>>;

    static initialize(setComponentStatus: RefObject<Dispatch<SetStateAction<boolean>>>) {
        if(this.eventSource) return;

        this.setComponentStatus = setComponentStatus;

        this.eventSource = new EventSource(`/sse/connect`);
        this.eventSource.addEventListener("error", SSEHandler.handleSseError);
        
        this.addEventSourceEventHandlers();

        window.addEventListener("beforeunload", SSEHandler.closeConnection);
    }

    private static addEventSourceEventHandlers(){
        SSEHandler.eventSource.addEventListener(SSEMessage.DEBUG, SSEHandler.handleDebugEvent);
    }

    private static handleSseError(_: Event){
        SSEHandler.setComponentStatus.current(true);
    }

    private static closeConnection(){
        SSEHandler.eventSource.close();
    }

    private static handleDebugEvent(e: MessageEvent){
        alert(e.data);
    }
}