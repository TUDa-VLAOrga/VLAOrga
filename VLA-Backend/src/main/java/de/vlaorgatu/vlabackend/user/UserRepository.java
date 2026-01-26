package de.vlaorgatu.vlabackend.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;

/**
 * Repository for accessing and managing {@link User} entities.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findUserByName(String name);
}
