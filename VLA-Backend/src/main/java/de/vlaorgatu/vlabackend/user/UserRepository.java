package de.vlaorgatu.vlabackend.user;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for accessing and managing {@link User} entities.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    /**
     * Retrieve a user by their username.
     * @param name The unique name to search for
     * @return The User (if exists) based on the name that is provided
     */
    Optional<User> findUserByName(String name);
}
