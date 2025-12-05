import { SSEMessage } from "./SSEMessage";



/**
 * Class for notification of components
 * Handles the SSE connection to our backend
 */
export class SSEHandler {
    private static eventSource: EventSource;

    static initialize() {
        if(this.eventSource) return;

        this.eventSource = new EventSource(`/sse/connect`);
        
        this.configureEventSource();

        window.addEventListener("close", SSEHandler.closeConnection);
    }

    private static configureEventSource(){
        this.eventSource.addEventListener(SSEMessage.DEBUG, this.handleDebugEvent);
    }

    private static closeConnection(){
        this.eventSource.close();
    }

    private static handleDebugEvent(e: MessageEvent){
        alert(e.data);
    }
}