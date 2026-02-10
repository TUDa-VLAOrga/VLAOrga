import type { SseObserver } from "./SseObserver";

export default class SseHookObserver implements SseObserver {
    
    private sseMessageHandler: (event: MessageEvent) => void;

    constructor(sseMessageHandler: (event: MessageEvent) => void){
        this.sseMessageHandler = sseMessageHandler;
    }
    
    update(event: MessageEvent): void {
        this.sseMessageHandler(event);
    }

}