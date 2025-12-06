export interface SseObserver {
    update(event: MessageEvent): void;
}