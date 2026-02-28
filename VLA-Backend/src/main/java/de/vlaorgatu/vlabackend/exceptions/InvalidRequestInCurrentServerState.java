package de.vlaorgatu.vlabackend.exceptions;

import lombok.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * Should be thrown when a request is not processable in the current state of the server.
 */
public class InvalidRequestInCurrentServerState extends ResponseStatusException {
    public InvalidRequestInCurrentServerState(@NonNull String message) {
        super(HttpStatus.CONFLICT, message);
    }
}
