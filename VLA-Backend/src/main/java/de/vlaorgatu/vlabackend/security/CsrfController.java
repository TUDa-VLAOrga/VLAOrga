package de.vlaorgatu.vlabackend.security;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * This class makes the CSRF endpoint available via the controller.
 */
@RestController
public class CsrfController {

    /**
     * Sends the internally generated CSRF JSON to the requesting process.
     */
    @GetMapping("/csrf")
    public CsrfToken csrf(CsrfToken csrfToken) {
        return csrfToken;
    }
}
