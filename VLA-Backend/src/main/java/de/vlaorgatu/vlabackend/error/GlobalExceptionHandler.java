package de.vlaorgatu.vlabackend.error;

import de.vlaorgatu.vlabackend.error.exceptions.UserNotFoundException;
import de.vlaorgatu.vlabackend.error.exceptions.UserNotFoundByIdException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Handler that manages all exceptions that are thrown in CRUD operation contexts.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Generates the message that will be displayed in the log.
     *
     * @param defaultMessage The default Message of the error defined in this handler
     * @param e              The exception to log
     * @return Loggable formatted String of the error
     */
    String generateLogMessage(final String defaultMessage, final Exception e) {
        return String.format("%s: %s",
            e.getClass().getSimpleName(),
            e.getMessage() == null ? defaultMessage : e.getMessage()
        );
    }

    /**
     * Handles logging and displaying of {@link UserNotFoundException}.
     *
     * @param e The {@link UserNotFoundException} to log
     * @return Entity that will be sent to the client if error occurs
     */
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFound(UserNotFoundException e) {
        final String defaultDisplayMessage =
            "User could not be found with the provided credentials\n";

        final String message = e.getMessage() == null ? defaultDisplayMessage : e.getMessage();
        logger.error(generateLogMessage(defaultDisplayMessage, e));

        return new ResponseEntity<>(
            message,
            HttpStatus.NOT_FOUND
        );
    }

    /**
     * Handles logging and displaying of {@link UserNotFoundByIdException}.
     *
     * @param e The {@link UserNotFoundByIdException} to log
     * @return Entity that will be sent to the client if error occurs
     */
    @ExceptionHandler(UserNotFoundByIdException.class)
    public ResponseEntity<String> handleUserNotFoundById(UserNotFoundException e) {
        final String defaultDisplayMessage =
            "The provided Id did not map to a valid user\n";

        final String message = e.getMessage() == null ? defaultDisplayMessage : e.getMessage();
        logger.error(generateLogMessage(defaultDisplayMessage, e));

        return new ResponseEntity<>(
            message,
            HttpStatus.NOT_FOUND
        );
    }
}
