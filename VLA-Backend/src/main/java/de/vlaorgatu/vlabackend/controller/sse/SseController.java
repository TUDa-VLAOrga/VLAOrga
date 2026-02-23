package de.vlaorgatu.vlabackend.controller.sse;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.vlaorgatu.vlabackend.enums.sse.SseMessageType;
import java.io.IOException;
import java.util.concurrent.CopyOnWriteArrayList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
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
public class SseController {
    /**
     * Logger for this class.
     */
    static Logger logger = LoggerFactory.getLogger(SseController.class);

    /**
     * List of all connected SSE Clients.
     */
    // TODO: Think about synchronization of methods
    private static final CopyOnWriteArrayList<SseEmitter> sseHandlers =
        new CopyOnWriteArrayList<>();

    /**
     * Sends a Debug message with specified text to all connected clients.
     *
     * @param message the text to include in the message.
     */
    public static void notifyDebugTest(final String message) {
        for (SseEmitter connection : sseHandlers) {
            try {
                connection.send(SseEmitter.event().name(SseMessageType.DEBUG.getValue())
                        .data("! Change Notification ! Message: " + message));
            } catch (IOException e) {
                // Broken Pipe Error
                sseHandlers.remove(connection);
            }
        }
    }

    /**
     * Sends an SSE message with the JSON representation of an object to all connected clients.
     * TODO: Narrow Object type to an abstract entity type
     *
     * @param sseMessageType The kind of the SSE event
     * @param eventObject The object to be sent
     */
    public static void notifyAllOfObject(SseMessageType sseMessageType, Object eventObject) {
        for (SseEmitter connection : sseHandlers) {
            ObjectMapper jsonMapper = new ObjectMapper();
            String eventData;

            try {
                eventData = jsonMapper.writeValueAsString(eventObject);
            } catch (JsonProcessingException e) {
                // This should never happen as we should only input Entities
                logger.error("Object could not be serialized as JSON");
                return;
            }

            try {
                connection.send(SseEmitter.event()
                        .name(sseMessageType.getValue())
                        .data(eventData));
            } catch (IOException e) {
                // Broken Pipe Error
                sseHandlers.remove(connection);
            }
        }
    }

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
        connectionHandler.onCompletion(() -> {
            sseHandlers.remove(connectionHandler);
            logger.info("A connection to the SSE endpoint has closed intentionally");
        });

        connectionHandler.onTimeout(() -> {
            sseHandlers.remove(connectionHandler);
            logger.info("A connection to the SSE endpoint timed out");
        });

        connectionHandler.onError((e) -> {
            sseHandlers.remove(connectionHandler);
            logger.info("A connection to the SSE endpoint threw an error: {}", e.toString());
        });

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
                connection.send(SseEmitter.event().name(SseMessageType.DEBUG.getValue())
                    .data("SSE Update to all registered connections!"));
                connection.send(SseEmitter.event().name(SseMessageType.SSEDEBUG.getValue())
                    .data("Breaking news! We have received a SSEDEBUG event"));
            } catch (IOException e) {
                // Broken Pipe Error
                sseHandlers.remove(connection);
            }
        }
        return "Sent message to all connections!";
    }

    @GetMapping("/getTestData")
    public String getTestData() {
        return "{\"message\":\"Something incredible has happened with this SSE request\"}";
    }
}
