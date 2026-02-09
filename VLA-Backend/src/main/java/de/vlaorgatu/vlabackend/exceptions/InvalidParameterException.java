package de.vlaorgatu.vlabackend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.web.server.ResponseStatusException;

public class InvalidParameterException extends ResponseStatusException {
    public InvalidParameterException(@NonNull String message) {
        super(HttpStatus.BAD_REQUEST, message);
    }
}
