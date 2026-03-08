package de.vlaorgatu.vlabackend.security;

import de.vlaorgatu.vlabackend.entities.vladb.User;
import de.vlaorgatu.vlabackend.repositories.vladb.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Interacts with the database to generate an object that is used for authentication.
 */
@Service
@RequiredArgsConstructor()
@Profile("prod")
public class VlaUserDetailsService implements UserDetailsService {
    /**
     * Logging.
     */
    private final Logger log = LoggerFactory.getLogger(VlaUserDetailsService.class);

    /**
     * The repositories the users are stored in.
     */
    private final UserRepository userRepository;

    /**
     * Interacts with the database and creates a {@link UserDetails}.
     * This object is used for checking the authentication credentials.
     * The "username" is the stringified id of the user.
     *
     * @param username The username of the user
     * @return The {@link UserDetails} for Spring Boot Security
     */
    @Override
    public UserDetails loadUserByUsername(String username) {
        User loginUser = userRepository.findUserByName(username)
            .orElseThrow(() -> new UsernameNotFoundException("Username not found: " + username));

        return org.springframework.security.core.userdetails.User.builder()
            .username(loginUser.getId().toString())
            .password(loginUser.getPassword())
            .build();
    }
}
