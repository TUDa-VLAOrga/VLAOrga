package de.vlaorgatu.vlabackend.sse;

import java.io.IOException;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * Handles all logic for the SSE communication to the frontend.
 */
@RestController()
@RequestMapping("/sse")
@CrossOrigin("*") // TODO: Configure to ensure security of application
public class SseController {
    private final CopyOnWriteArrayList<SseEmitter> sseHandlers = new CopyOnWriteArrayList<>();

    /**
     * Configures the SSE Connection to the frontend.
     *
     * @return The SSE Connection for the frontend
     */
    @GetMapping(value = "/connect", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter connect() {
        // Set timeout to never occur automatically
        SseEmitter connectionHandler = new SseEmitter(Long.MAX_VALUE);

        sseHandlers.add(connectionHandler);
        connectionHandler.onCompletion(() -> sseHandlers.remove(connectionHandler));
        connectionHandler.onTimeout(() -> sseHandlers.remove(connectionHandler));
        connectionHandler.onError((e) -> sseHandlers.remove(connectionHandler));

        return connectionHandler;
    }

    /**
     * Calls all connected sseHandlers with a Debug call.
     *
     * @return Confirmation that methods was called
     */
    @PostMapping("/manualNotification")
    // TODO: Remove this endpoint after testing stage
    public String notifyAllSse() {
        for (SseEmitter connection : sseHandlers) {
            try {
                connection.send(SseEmitter.event()
                        .name(SseMessageType.DEBUG)
                        .data("SSE Update to all registered connections!")
                );
            } catch (IOException e) {
                // Broken Pipe Error
                sseHandlers.remove(connection);
            }
        }
        return "Sent message to all connections!";
    }
}
