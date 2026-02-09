package de.vlaorgatu.vlabackend.security;

import de.vlaorgatu.vlabackend.user.User;
import de.vlaorgatu.vlabackend.user.UserRepository;
import java.util.Optional;
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
    private final Logger log = LoggerFactory.getLogger(VlaUserDetailsService.class);
    private final UserRepository userRepository;

    /**
     * Interacts with the database and creates a {@link UserDetails}.
     * This object is used for checking the authentication credentials.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> loginUser = userRepository.findUserByName(username);

        // TODO: after merging the PR with global exception handling, refactor this exception
        //  (logging should be done centrally, then)
        if (loginUser.isEmpty()) {
            log.error("User not found");
        }

        loginUser.orElseThrow(() -> new UsernameNotFoundException(
            "Username not found: " + username)
        );

        return org.springframework.security.core.userdetails.User.builder()
            .username(loginUser.get().getId().toString())
            .password(loginUser.get().getPassword())
            .build();
    }
}
