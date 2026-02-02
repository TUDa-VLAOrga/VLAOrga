package de.vlaorgatu.vlabackend.error;

import de.vlaorgatu.vlabackend.error.exceptions.UserNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    String generateLogMessage(final String displayMessage, final Exception e) {
        return String.format("%s: %s",
            e.getClass().getSimpleName(),
            e.getMessage() == null ? displayMessage : e.getMessage()
        );
    }

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
}
