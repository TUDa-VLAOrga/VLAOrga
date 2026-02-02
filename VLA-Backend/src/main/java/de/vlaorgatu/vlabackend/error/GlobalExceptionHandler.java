package de.vlaorgatu.vlabackend.error;

import de.vlaorgatu.vlabackend.error.exceptions.UserNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFound(UserNotFoundException e) {
        final String defaultMessage = "Requested user could not be found\n";

        final String message = e.getMessage() == null ? defaultMessage : e.getMessage();
        logger.error(message);

        return new ResponseEntity<>(
            e.getMessage(),
            HttpStatus.NOT_FOUND
        );
    }
}
