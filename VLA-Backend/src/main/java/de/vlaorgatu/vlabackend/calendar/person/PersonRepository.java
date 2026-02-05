package de.vlaorgatu.vlabackend.calendar.person;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for accessing and managing {@link Person} entities.
 */
@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
}
