package de.vlaorgatu.vlabackend.exceptions;

import lombok.NonNull;

public class InvalidColorParameterException extends InvalidParameterException {
    /**
     * Constructor of InvalidColorException.
     *
     * @param message The message to display and send to the fronted
     */
    public InvalidColorParameterException(@NonNull String message) {
        super(message);
    }
}
