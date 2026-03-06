package de.vlaorgatu.vlabackend.security.securityutils;

import de.vlaorgatu.vlabackend.entities.vladb.User;
import de.vlaorgatu.vlabackend.exceptions.UserNotFoundException;
import de.vlaorgatu.vlabackend.repositories.vladb.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

/**
 * Implementation of {@link SecurityUtils} for production-level security.
 */
@Component
@Primary
@Profile("!unsecure")
@AllArgsConstructor
public class ProdSecurityUtils implements SecurityUtils {
    /**
     * Repository of {@link User} entities.
     */
    private final UserRepository userRepository;

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

    /**
     * Gets a user based on the session.
     *
     * @return The user based on the session
     */
    @Override
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        Long id = Long.parseLong(userDetails.getUsername());

        User user = userRepository.findById(id).orElseThrow(() ->
            new UserNotFoundException(
                "THIS SHOULD NEVER HAPPEN!" +
                    "User with id=" + id + " was not found."
            )
        );

        return user;
    }
}
