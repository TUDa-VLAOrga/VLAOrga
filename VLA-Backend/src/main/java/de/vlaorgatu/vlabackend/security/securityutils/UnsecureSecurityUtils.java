package de.vlaorgatu.vlabackend.security.securityutils;

import de.vlaorgatu.vlabackend.entities.vladb.User;
import lombok.NoArgsConstructor;

/**
 * Implementation of {@link SecurityUtils} for no security.
 */
@NoArgsConstructor
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
}
