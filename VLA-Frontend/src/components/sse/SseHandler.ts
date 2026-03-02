import type { Dispatch, RefObject, SetStateAction } from "react";
import type { SseObserver } from "./SseObserver";
import { Logger } from "../logger/Logger";
import { SseMessageType } from "@/lib/databaseTypes";

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
    Logger.info("Sse is initializing...");

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
    //SSEHandler.eventSource.addEventListener(SseMessageType.DEBUG, SSEHandler.handleDebugEvent);
    
    Object.values(SseMessageType).forEach((SseMessage) => {
      SSEHandler.eventSource.addEventListener(SseMessage, SSEHandler.notifyAllObserver);
    });
  }

  /**
     * Changes the status of component waiting for SSEStatus
     * @param _ Received Window event
     */
  private static handleSseError(_: unknown){
    Logger.error("Sse has errored");
    SSEHandler.setComponentStatus.current(true);
  }

  /**
     * Closes the eventSource
     * Cannot be reopened without a reload
     */
  private static closeConnection(){
    Logger.warn("Sse connection was closed");
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

    if(index == -1) return;

    SSEHandler.registeredObservers.splice(index, 1);
  }

  /**
     * Notify all registered {@link SseObserver}s of new MessageEvent
     * @param e The Event to propagate
  */
  private static notifyAllObserver(event: MessageEvent){
    SSEHandler.registeredObservers.forEach(obs => obs.update(event));
  }

  /**
     * Handle for the SseMessage.DEBUG event
     * @param e DEBUG Event from Backend
     */
  // @ts-expect-error Only for testing while developing
  private static handleDebugEvent(e: MessageEvent){
    alert(e.data);
  }
}
