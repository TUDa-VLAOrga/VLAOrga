package de.vlaorgatu.vlabackend.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Enumeration for MessageEvents that are sent to the frontend.
 * Make sure that this list is always up-to-date!
 */
@Getter
@AllArgsConstructor
public enum SseMessageType {
    /**
     * Used for sending Debug messages to the frontend.
     */
    DEBUG("DEBUG"),

    // TODO: Decide on important SseMessageTypes and think of the syncing events in more detail
    /**
     * TODO.
     */
    EXPERIMENT("experiment"),

    /**
     * TODO.
     */
    CALENDAR("calendar"),

    /**
     * TODO.
     */
    APPROVEDELETION("approveDeletion");

    /**
     * The actual value of the enum object.
     */
    private final String value;
}
