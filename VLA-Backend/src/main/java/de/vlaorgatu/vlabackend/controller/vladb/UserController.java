package de.vlaorgatu.vlabackend.controller.vladb;

import de.vlaorgatu.vlabackend.entities.vladb.User;
import de.vlaorgatu.vlabackend.exceptions.UserNotFoundException;
import de.vlaorgatu.vlabackend.repositories.vladb.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for user-related endpoints.
 */
@AllArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController implements GetAndGetByIdDefaultInterface<User, UserRepository> {

    /**
     * Repository used for user persistence operations.
     */
    private final UserRepository userRepository;


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
     * @return updated user if found
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        User existingUser = userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));

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
            throw new UserNotFoundException(id);
        }

        userRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    /**
     * Retrieves the repository ot this controller instance.
     *
     * @return The JPARepository used by this controller
     */
    @Override
    public UserRepository getRepository() {
        return userRepository;
    }
}
