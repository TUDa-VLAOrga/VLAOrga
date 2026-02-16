package de.vlaorgatu.vlabackend.controller.security;

import de.vlaorgatu.vlabackend.exceptions.InvalidParameterException;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Manages methods that may be exposed to an unsecured endpoint.
 * This Controller focuses especially on userManagement
 */
@AllArgsConstructor
@RestController
@RequestMapping("/userManagement/unauthenticated/")
public class UnauthenticatedUserManagementController {
    /**
     * The password encode used by spring security.
     */
    private PasswordEncoder passwordEncoder;

    /**
     * Endpoint for encrypting a password using the configured encoder.
     *
     * @param password The password to encode in plain text
     * @return The encrypted password
     */
    @PostMapping("passwordConversion")
    public ResponseEntity<String> generateBcryptPassword(@RequestParam String password) {

        if (password.isEmpty()) {
            throw new InvalidParameterException("Passwords may not be empty");
        }

        return ResponseEntity.ok(passwordEncoder.encode(password));
    }
}
