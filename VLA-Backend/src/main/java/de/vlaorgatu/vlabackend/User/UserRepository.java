package de.vlaorgatu.vlabackend.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for accessing and managing {@link User} entities.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

}