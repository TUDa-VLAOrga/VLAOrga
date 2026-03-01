package de.vlaorgatu.vlabackend.security.securityutils;

import de.vlaorgatu.vlabackend.entities.vladb.User;

/**
 * Interface for commong functionality when dealing with security-related features.
 */
public interface SecurityUtils {
    /**
     * Checks if the provided user is the same as the user in the current session.
     *
     * @param user The proposed User
     * @return true iff. the users are equal
     */
    boolean checkUserIsSessionUser(User user);
}
