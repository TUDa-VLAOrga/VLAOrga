package de.vlaorgatu.vlabackend.calendar.person;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for accessing and managing {@link Person} entities.
 */
@Repository
public interface PersonRepository extends CrudRepository<Person, Long> {
}
