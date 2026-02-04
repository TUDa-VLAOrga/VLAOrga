package de.vlaorgatu.vlabackend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

/**
 * This class configures the basic authentication schema.
 * The retrieval of the object that is used for password checking in prod
 * can be found at {@link VlaUserDetailsService}.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    // BCrypt seems to be the accepted default, so we are choosing it here as well.
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Creates the security mechanism behind our authentication in all secured profiles.
     * Any unauthenticated request will be forwarded to the static login.html.
     * Authentication is CSRF protected.
     * Forces a forward to /calendar on successful authentication.
     */
    @Bean
    @Profile({"prod", "dev"})
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(Customizer.withDefaults())
            .authorizeHttpRequests(requests -> requests
                .requestMatchers("/csrf").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login.html")
                .permitAll()
                .defaultSuccessUrl("/", true)
            );

        return http.build();
    }

    /**
     * This is an insecure profile for testing.
     * Only the user dev with password dev can authenticate in this profile.
     */
    @Bean
    @Profile("dev")
    UserDetailsService userDetailsServiceDevelopment(PasswordEncoder passwordEncoder) {
        return new InMemoryUserDetailsManager(User.builder()
            .username("dev")
            .password(passwordEncoder.encode("dev"))
            .build()
        );
    }

    /**
     * This is an unsecure profile that may be used for debugging.
     * It disables all authentication and security measures!
     */
    @Bean
    @Profile("unsecure")
    SecurityFilterChain securityFilterChainUnsecure(HttpSecurity http) throws Exception {
        http
            /*
            Do not use this in production!
            This disables **all** authentication and authorization
            */
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            );
        return http.build();
    }
}
