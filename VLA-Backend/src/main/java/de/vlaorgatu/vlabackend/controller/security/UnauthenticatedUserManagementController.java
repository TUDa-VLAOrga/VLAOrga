package de.vlaorgatu.vlabackend.controller.security;

import de.vlaorgatu.vlabackend.exceptions.InvalidParameterException;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/userManagement/unauthenticated/")
public class UnauthenticatedUserManagementController {
    private PasswordEncoder passwordEncoder;

    @PostMapping("passwordConversion")
    public ResponseEntity<String> generateBCryptPassword(@RequestBody String password){
        if(password.isEmpty())
            throw new InvalidParameterException("Passwords may not be empty");

        return ResponseEntity.ok(passwordEncoder.encode(password));
    }
}
