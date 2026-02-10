package de.vlaorgatu.vlabackend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.web.server.ResponseStatusException;

/**
 * Exception to be thrown when a parameter does not meet a specification.
 */
public class InvalidParameterException extends ResponseStatusException {
    /**
     * Constructor of InvalidParameterException.
     *
     * @param message The message to display and send to the fronted
     */
    public InvalidParameterException(@NonNull String message) {
        super(HttpStatus.BAD_REQUEST, message);
    }
}
