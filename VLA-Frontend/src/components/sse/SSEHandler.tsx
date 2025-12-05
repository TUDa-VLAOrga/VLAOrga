import { useEffect } from "react";
import { SSEMessage } from "./SSEMessage";

function SSEHandler(){
    useEffect(() => {
        const eventSource = new EventSource('http://localhost:8080/sse/connect');
        eventSource.addEventListener('update', (e) => {alert(e.data)});

        
    });
    
    return "Waiting for an event..."
}

export default SSEHandler;