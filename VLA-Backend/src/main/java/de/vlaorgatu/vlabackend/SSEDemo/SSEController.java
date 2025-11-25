package de.vlaorgatu.vlabackend.SSEDemo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.CopyOnWriteArrayList;

/*
* This is just a quick demo and should not be part of production
* Open http://localhost:8080/sse/conpage in **new** tabs
* In a terminal: curl -X POST localhost:8080/sse/notifyAll
* All opened tabs should give you an alert
* When tabs are left open, they will break as client side disconnection has not
* been implemented in this demo
* */

@RestController()
@RequestMapping("/sse")
public class SSEController {
    private final CopyOnWriteArrayList<SseEmitter> sseHandlers = new CopyOnWriteArrayList<>();

    @GetMapping("/connect")
    public SseEmitter connect() {
        // Set timeout to never occur automatically
        SseEmitter connectionHandler = new SseEmitter(Long.MAX_VALUE);

        sseHandlers.add(connectionHandler);
        connectionHandler.onCompletion(() -> sseHandlers.remove(connectionHandler));
        connectionHandler.onTimeout(() -> sseHandlers.remove(connectionHandler));
        connectionHandler.onError((e) -> sseHandlers.remove(connectionHandler));

        return connectionHandler;
    }

    @PostMapping("/notifyAll")
    public String notifyAllSSE(){
        for(SseEmitter connection : sseHandlers){
            try {
                connection.send(SseEmitter.event()
                        .name("update")
                        .data("Someone posted again!")
                );
            } catch (IOException e) {
                // Broken Pipe Error
                sseHandlers.remove(connection);
            }
        }
        return "Sent message to all connections!";
    }

    @GetMapping("/conpage")
    public String conpage(){
        return "<!DOCTYPE html><html><body>Waiting for event<script>" +
                "const eventSource = new EventSource('http://localhost:8080/sse/connect');" +
                "eventSource.addEventListener('update', (e) => {\n" +
                "        alert(e.data)\n" +
                "    });" +
                "</script></body></html>";
    }

}