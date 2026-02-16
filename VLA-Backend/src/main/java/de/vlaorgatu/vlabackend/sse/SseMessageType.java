package de.vlaorgatu.vlabackend.sse;

/**
 * Enumeration for MessageEvents that are sent to the frontend.
 * Make sure that this list is always up-to-date!
 */
public class SseMessageType {
    /**
     * Used for sending Debug messages to the frontend.
     */
    public static final String DEBUG = "DEBUG";
    /**
     * Used for sending SSE Debug messages to the frontend.
     */
    public static final String SSEDEBUG = "SSEDEBUG";

    // TODO: Decide on important SseMessageTypes and think of the syncing events in more detail
    /**
     * TODO.
     */
    public static final String EXPERIMENT = "experiment";

    /**
     * TODO.
     */
    public static final String CALENDAR = "calendar";

    /**
     * TODO.
     */
    public static final String APPROVEDELETION = "approveDeletion";
}
