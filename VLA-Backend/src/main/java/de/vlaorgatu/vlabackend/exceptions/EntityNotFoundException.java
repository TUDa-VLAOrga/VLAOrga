package de.vlaorgatu.vlabackend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * Custom exception signaling that an entity was not found.
 */
public class EntityNotFoundException extends ResponseStatusException {
    /**
     * Constructor that sets a custom error message.
     *
     * @param reason The error message.
     */
    public EntityNotFoundException(String reason) {
        super(HttpStatus.NOT_FOUND, reason);
    }
}
