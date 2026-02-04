package de.vlaorgatu.vlabackend.user;

import de.vlaorgatu.vlabackend.exceptions.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for user-related endpoints.
 */
@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserRepository userRepository;

    /**
     * Creates a new {@code UserController}.
     *
     * @param userRepository repository used for user persistence operations
     */
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Returns a list of all users.
     *
     * @return list of users
     */
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Returns a user by its ID.
     *
     * @param id user ID
     * @return the user if found, otherwise 404
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id).map(ResponseEntity::ok)
            .orElseThrow(() -> new EntityNotFoundException("User with ID " + id + " not found."));
    }

    /**
     * Creates a new user.
     *
     * @param user user to create
     * @return created user
     */
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    /**
     * Updates an existing user.
     *
     * @param id   user ID
     * @param user updated user data
     * @return updated user if found, otherwise 404
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        Optional<User> existingOpt = userRepository.findById(id);
        if (existingOpt.isEmpty()) {
            throw new EntityNotFoundException("User with ID " + id + " not found.");
        }

        User existingUser = existingOpt.get();
        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());

        return ResponseEntity.ok(userRepository.save(existingUser));
    }

    /**
     * Deletes a user by its ID.
     *
     * @param id user ID
     * @return 204 if deleted, otherwise 404
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User with ID " + id + " not found.");
        }

        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
