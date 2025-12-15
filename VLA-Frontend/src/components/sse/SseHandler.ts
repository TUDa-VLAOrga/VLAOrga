import type { Dispatch, RefObject, SetStateAction } from "react";
import { SseMessageType } from "./SseMessageType";
import type { SseObserver } from "./SseObserver";

/**
 * Class for notification of components
 * Handles the SSE connection to our backend
 */
export class SSEHandler {
    /**
     * Singleton eventSource
     */
    private static eventSource: EventSource;

    /**
     * Setter reference for state in another component
     */
    private static setComponentStatus: RefObject<Dispatch<SetStateAction<boolean>>>;

    /**
     * List of currently registered objects interested in MessageEvents from the EventSource
     */
    private static registeredObservers: SseObserver[] = [];

    /**
     * Initializes the SseHandler, only executed exactly once
     * @param setComponentStatus Setter reference for state in another component
     */
    static initialize(setComponentStatus: RefObject<Dispatch<SetStateAction<boolean>>>) {
        if(this.eventSource) return;

        this.setComponentStatus = setComponentStatus;

        this.eventSource = new EventSource(`/sse/connect`);
        this.eventSource.addEventListener("error", SSEHandler.handleSseError);
        
        this.addEventSourceEventHandlers();

        window.addEventListener("beforeunload", SSEHandler.closeConnection);
    }

    /**
     * Function for registering handlers for given SseMessageEvents
     * Do not forget to add a new handler if SseMessage is changed!
     */
    private static addEventSourceEventHandlers(){
        SSEHandler.eventSource.addEventListener(SseMessageType.DEBUG, SSEHandler.handleDebugEvent);
    }

    /**
     * Changes the status of component waiting for SSEStatus
     * @param _ Received Errorevent
     */
    private static handleSseError(_: Event){
        SSEHandler.setComponentStatus.current(true);
    }

    /**
     * Closes the eventSource
     * Cannot be reopened without a reload
     */
    private static closeConnection(){
        SSEHandler.eventSource.close();
    }

    /**
     * Register an observer for receiving MessageEvents from the backend
     * @param observer The {@link SseObserver} to register
     */
    public static registerObserver(observer: SseObserver){
        SSEHandler.registeredObservers.push(observer);
    }

    /**
     * Unregister an observer for receiving MessageEvents from the backend
     * @param observer The {@link SseObserver} to register
     */
    public static removeObserver(observer: SseObserver){
        const index = SSEHandler.registeredObservers.findIndex(element => element == observer);

        if(index == -1) return

        SSEHandler.registeredObservers.splice(index, 1);
    }

    /**
     * Notify all registered {@link SseObserver}s of new MessageEvent
     * @param e The Event to propagate
     */
    // @ts-expect-error method will be used in future feature implementations
    private static notifyAllObserver(e: MessageEvent){
        SSEHandler.registeredObservers.forEach(obs => obs.update(e));
    }

    /**
     * Handle for the SseMessage.DEBUG event
     * @param e DEBUG Event from Backend
     */
    private static handleDebugEvent(e: MessageEvent){
        alert(e.data);
    }
}