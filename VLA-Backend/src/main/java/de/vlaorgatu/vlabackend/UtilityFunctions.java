package de.vlaorgatu.vlabackend;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import de.vlaorgatu.vlabackend.entities.vladb.Acceptance;
import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import java.time.ZoneOffset;

/**
 * Class for frequently reusable functions.
 */
public class UtilityFunctions {

    /**
     * String containing all hex characters of the hexadecimal number system.
     */
    static final String validHexChars = "0123456789ABCDEFabcdef";

    /**
     * Checks if a string matches the standard html color notation.
     * E.g. #FF0000 for red
     *
     * @param colorString The string to check
     * @return True iff. string matches pattern #RRGGBB
     */
    public static boolean checkColorFormatHtml7CharsNotation(String colorString) {
        if (colorString == null) {
            return false;
        }

        if (colorString.length() != 7) {
            return false;
        }

        if (colorString.charAt(0) != '#') {
            return false;
        }

        for (int i = 1; i < 7; i++) {
            // Check if each char corresponds to a valid hex char
            if (validHexChars.indexOf(colorString.charAt(i)) == -1) {
                return false;
            }
        }

        return true;
    }

    /**
     * Truncates a string to a specified length if neccessary.
     *
     * @param string    The string to possibly truncate
     * @param maxLength The maximum length the string may have
     * @return A string with limited length, ending in "..." if truncated
     */
    public static String truncateStringIfNeccessary(String string, int maxLength) {
        if (string == null) {
            return "";
        }

        if (string.length() <= maxLength) {
            return string;
        }

        return string.substring(0, maxLength - 4) + "...";
    }

    /**
     * Converts an object to JSON.
     *
     * @param object An object that should be processable by {@link ObjectMapper}
     * @return The JSON of the object
     * @throws JsonProcessingException if object is not processable
     */
    public static String convertObjectToJson(Object object) throws JsonProcessingException {
        ObjectMapper jsonMapper = new ObjectMapper();
        jsonMapper.registerModule(new JavaTimeModule());
        jsonMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return jsonMapper.writeValueAsString(object);
    }

    /**
     * Time from 00:00.0000 - 23:59:00.0000 (or later) representing whole day events.
     */
    private static final int wholeDaySecondsMinimum = 24 * 60 * 60 - 60;

    /**
     * Checks if an event may be considered as an event that takes place the entire day.
     *
     * @param appointment The appointment to check
     * @return true iff appointment is a whole day events
     */
    public static boolean isWholeDayEvent(Appointment appointment) {
        return
            appointment.getEndTime().toEpochSecond(ZoneOffset.UTC) -
            appointment.getStartTime().toEpochSecond(ZoneOffset.UTC) >=
            wholeDaySecondsMinimum;
    }

    /**
     * Checks if an event may be considered as an event that takes place the entire day.
     *
     * @param acceptance The acceptance to check
     * @return true iff acceptance is a whole day events
     */
    public static boolean isWholeDayEvent(Acceptance acceptance) {
        return
            acceptance.getEndTime().toEpochSecond(ZoneOffset.UTC) -
            acceptance.getStartTime().toEpochSecond(ZoneOffset.UTC) >=
            wholeDaySecondsMinimum;
    }
}
