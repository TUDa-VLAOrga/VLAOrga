/**
 * Implementing this interface enables you to receive
 * Server Side Events when registered in the
 * SseHandler
 */
export interface SseObserver {
    /**
     * Called when Observer is registered and SSEHandler receives a new MessageEvent
     * @param event The event to be handled, types to deal with can be infered by SseMessage
     */
    update(event: MessageEvent): void;
}
