package de.vlaorgatu.vlabackend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.vlaorgatu.vlabackend.model.User;
import de.vlaorgatu.vlabackend.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) { // Constructor injection
        this.userService = userService;
    }

    @GetMapping
    public User getUser() {
        return userService.getUser();
    }

    @PostMapping
    public User updateUser(@RequestBody User user) { // Update the singleton user
        return userService.updateUser(user);
    }
}
