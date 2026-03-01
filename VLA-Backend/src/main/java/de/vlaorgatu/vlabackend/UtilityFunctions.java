package de.vlaorgatu.vlabackend;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import de.vlaorgatu.vlabackend.entities.vladb.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

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

    public static boolean checkUserIsSessionUser(User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        return userDetails.getUsername().equals(user.getId().toString());
    }
}
