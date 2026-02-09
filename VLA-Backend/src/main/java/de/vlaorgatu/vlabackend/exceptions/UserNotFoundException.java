package de.vlaorgatu.vlabackend.exceptions;

/**
 * Custom exception signaling that an entity was not found.
 */
public class UserNotFoundException extends ResourceNotFoundException {
    /**
     * Constructor that sets a custom error message.
     *
     * @param reason The error message.
     */
    public UserNotFoundException(String reason) {
        super(reason);
    }

    public UserNotFoundException(Long id) {
        super("User with id=" + id + " was not found");
    }
}
