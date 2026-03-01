package de.vlaorgatu.vlabackend.security.securityutils;

import de.vlaorgatu.vlabackend.entities.vladb.User;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * Implementation of {@link SecurityUtils} for no security.
 */
@Component
@Profile("unsecure")
@AllArgsConstructor
public class UnsecureSecurityUtils implements SecurityUtils {
    /**
     * Checks if the provided user is the same as the user in the current session.
     *
     * @param user The proposed User
     * @return true iff. the users are equal
     */
    @Override
    public boolean checkUserIsSessionUser(User user) {
        return true;
    }

    /**
     * Gets a user based on the session.
     *
     * @return The user based on the session
     */
    @Override
    public User getCurrentUser() {
        return User.builder()
            .id(-1L)
            .name("Unsecured User")
            .email("unsecure@unsecure.unsecure")
            .password("UNSECURE")
            .appointmentsWithDeletionIntention(null)
            .build();
    }
}
