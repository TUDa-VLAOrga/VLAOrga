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

    // CRUD Mesages for all entities
    GLOBALNOTECREATED("GLOBALNOTECREATED"),
    GLOBALNOTEUPDATED("GLOBALNOTEUPDATED"),
    GLOBALNOTEDELETED("GLOBALNOTEDELETED"),

    APPOINTMENTCATEGORYCREATED("APPOINTMENTCATEGORYCREATED"),
    APPOINTMENTCATEGORYUPDATED("APPOINTMENTCATEGORYUPDATED"),
    APPOINTMENTCATEGORYDELETED("APPOINTMENTCATEGORYDELETED"),

    PERSONCREATED("PERSONCREATED"),
    PERSONUPDATED("PERSONUPDATED"),
    PERSONDELETED("PERSONDELETED"),

    LECTURECREATED("LECTURECREATED"),
    LECTUREUPDATED("LECTUREUPDATED"),
    LECTUREDELETED("LECTUREDELETED"),

    APPOINTMENTSERIESCREATED("APPOINTMENTSERIESCREATED"),
    APPOINTMENTSERIESUPDATED("APPOINTMENTSERIESUPDATED"),
    APPOINTMENTSERIESDELETED("APPOINTMENTSERIESDELETED"),

    APPOINTMENTCREATED("APPOINTMENTCREATED"),
    APPOINTMENTUPDATED("APPOINTMENTUPDATED"),
    APPOINTMENTDELETED("APPOINTMENTDELETED"),

    /**
     * Used for sending Debug messages to the frontend.
     */
    DEBUG("DEBUG");

    /**
     * The actual value of the enum object.
     */
    private final String value;
}
