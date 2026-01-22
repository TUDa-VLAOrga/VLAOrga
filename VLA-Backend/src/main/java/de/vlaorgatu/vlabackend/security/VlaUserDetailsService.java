package de.vlaorgatu.vlabackend.security;

import de.vlaorgatu.vlabackend.user.User;
import de.vlaorgatu.vlabackend.user.UserRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Profile("prod")
public class VlaUserDetailsService implements UserDetailsService {
    private final Logger log = LoggerFactory.getLogger(VlaUserDetailsService.class);
    private final UserRepository userRepository;

    public VlaUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        long userId;

        try {
            userId = Long.parseLong(username);
        } catch (NumberFormatException e) {
            log.error("Invalid username format provided");
            throw new UsernameNotFoundException(
                "Username must be convertable to a long, id: " + username
            );
        }

        Optional<User> loginUser = userRepository.findById(userId);

        if (loginUser.isEmpty()) {
            log.error("User not found");
        }

        loginUser.orElseThrow(() -> new UsernameNotFoundException(
            "Username not found: " + username)
        );

        return org.springframework.security.core.userdetails.User.builder()
            .username(loginUser.get().getId() + "")
            .password(loginUser.get().getPassword())
            .build();
    }
}
