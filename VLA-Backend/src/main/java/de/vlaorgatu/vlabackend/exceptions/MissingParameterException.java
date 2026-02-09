package de.vlaorgatu.vlabackend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.web.server.ResponseStatusException;

public class MissingParameterException extends ResponseStatusException {
    public MissingParameterException(@NonNull String parameterName) {
        super(HttpStatus.NOT_ACCEPTABLE, "The required parameter" + parameterName + "was not specified in the request");
    }
}
