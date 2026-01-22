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

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    // BCrypt seems to be the accepted default, so we are choosing it here as well.
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

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
                .defaultSuccessUrl("/calendar", true)
            );

        return http.build();
    }

    // dev user with password dev
    @Bean
    @Profile("dev")
    UserDetailsService userDetailsServiceDevelopment(PasswordEncoder passwordEncoder) {
        return new InMemoryUserDetailsManager(User.builder()
            .username("dev")
            .password(passwordEncoder.encode("dev")).build()
        );
    }

    // Unsecure Profile for testing
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
