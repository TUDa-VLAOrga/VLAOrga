package de.vlaorgatu.vlabackend.enums.sse;

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
     * Used for sending Debug messages to the frontend for SSE.
     */
    SSEDEBUG("SSEDEBUG"),

    GLOBALNOTECREATED("GLOBALNOTECREATED"),
    GLOBALNOTEUPDATED("GLOBALNOTEUPDATED"),
    GLOBALNOTEDELETED("GLOBALNOTEDELETED"),

    APPOINTMENTCATEGORYCREATED("APPOINTMENTCATEGORYCREATED"),
    APPOINTMENTCATEGORYUPDATED("APPOINTMENTCATEGORYUPDATED"),
    APPOINTMENTCATEGORYDELETED("APPOINTMENTCATEGORYDELETED"),

    /**
     * Used for sending Debug messages to the frontend.
     */
    DEBUG("DEBUG");

    /**
     * The actual value of the enum object.
     */
    private final String value;
}
