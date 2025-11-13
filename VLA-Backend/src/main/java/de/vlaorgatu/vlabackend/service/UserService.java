package de.vlaorgatu.vlabackend.service;

import org.springframework.stereotype.Service;

import de.vlaorgatu.vlabackend.model.User;
import de.vlaorgatu.vlabackend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUser() {
        return userRepository.findById(1).orElse(null);
    }

    public User updateUser(User user) {
        user.setId(1);
        return userRepository.save(user);
    }
}
