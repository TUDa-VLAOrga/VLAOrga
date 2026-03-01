package de.vlaorgatu.vlabackend.security.securityutils;

import de.vlaorgatu.vlabackend.entities.vladb.User;
import lombok.NoArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * Implementation of {@link SecurityUtils} for production-level security.
 */
@NoArgsConstructor
public class ProdSecurityUtils implements SecurityUtils {
    /**
     * Checks if the provided user is the same as the user in the current session.
     *
     * @param user The proposed User
     * @return true iff. the users are equal
     */
    @Override
    public boolean checkUserIsSessionUser(User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        return userDetails.getUsername().equals(user.getId().toString());
    }
}
