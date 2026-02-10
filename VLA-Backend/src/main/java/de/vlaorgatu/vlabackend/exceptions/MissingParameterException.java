package de.vlaorgatu.vlabackend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.web.server.ResponseStatusException;

/**
 * Exception that should be thrown when a Parameter is missing in a CRUD operation.
 * Returns a NOT_ACCEPTABLE HTTP response
 */
public class MissingParameterException extends ResponseStatusException {
    /**
     * Constructor that sets a custom error message.
     *
     * @param parameterName The name of the erroneous parameter.
     */
    public MissingParameterException(@NonNull String parameterName) {
        super(
                HttpStatus.NOT_ACCEPTABLE,
                "The required parameter" + parameterName + "was not specified in the request"
        );
    }
}
