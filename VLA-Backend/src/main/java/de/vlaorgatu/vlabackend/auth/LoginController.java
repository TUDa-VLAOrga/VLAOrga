package de.vlaorgatu.vlabackend.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for User authentication.
 * <br>
 * Built along the example at
 * https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/index.html#customize-global-authentication-manager
 */
@RestController
public class LoginController {

    private final AuthenticationManager authenticationManager;

    /**
     * Constructor of our custom login controller.
     *
     * @param authenticationManager AuthenticationManager to use.
     */
    public LoginController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    /**
     * Just for testing, if at least GET requests work.
     *
     * @return a hello world response
     */
    @GetMapping("/login")
    public ResponseEntity<String> login() {
        // the folllowing error would be correctly thrown and visible in the logs...
        // ... in contrast to the throw in the POST endpoint below :shrug:
        // throw new RuntimeException("Here I am at login bean!");
        return ResponseEntity.ok("Hello, world!");
    }

    /**
     * Log in a user. HOWEVER THIS METHOD SEEMS TO BE NEVER CALLED, THE ERROR IS NOT THROWN?!
     *
     * @param loginRequest containing username and password
     * @return an error, to see if this works.
     */
    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody LoginRequest loginRequest) {
        throw new RuntimeException("Here I am at login bean!");
        /*
        Authentication authenticationRequest =
            UsernamePasswordAuthenticationToken.unauthenticated(
                loginRequest.username(), loginRequest.password());
        Authentication authenticationResponse =
            this.authenticationManager.authenticate(authenticationRequest);
        // ...
        return ResponseEntity.ok("hello and welcome, you're now authenticated!");
         */
    }

    /**
     * Simple container for username and password.
     */
    public record LoginRequest(String username, String password) {
    }
}
