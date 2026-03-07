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
     * @param message The error message
     */
    public InvalidParameterException(@NonNull String message) {
        super(HttpStatus.BAD_REQUEST, message);
    }

    /**
     * Constructor of InvalidParameterException.
     *
     * @param status  The HTTP status that should be returned
     * @param message The error message
     */
    public InvalidParameterException(@NonNull HttpStatus status, @NonNull String message) {
        super(status, message);
    }
}
