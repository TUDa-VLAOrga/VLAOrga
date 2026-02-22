package de.vlaorgatu.vlabackend.repositories.vladb;

import de.vlaorgatu.vlabackend.entities.vladb.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for accessing and managing {@link Person} entities.
 */
@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    List<Person> findByLinusUserId(int linusUserId);
}
