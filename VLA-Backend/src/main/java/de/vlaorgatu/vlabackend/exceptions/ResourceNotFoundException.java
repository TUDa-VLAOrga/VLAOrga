package de.vlaorgatu.vlabackend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.web.server.ResponseStatusException;

/**
 * Exception to be thrown when a resource is not found but expected to exist.
 */
public class ResourceNotFoundException extends ResponseStatusException {
    /**
     * Constructor that sets a custom error message.
     *
     * @param reason The error message.
     */
    ResourceNotFoundException(@NonNull String reason){
        super(HttpStatus.NOT_FOUND, reason);
    }
}
