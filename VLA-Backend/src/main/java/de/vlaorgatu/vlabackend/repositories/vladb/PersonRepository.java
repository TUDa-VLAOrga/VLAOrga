package de.vlaorgatu.vlabackend.repositories.vladb;

import de.vlaorgatu.vlabackend.entities.vladb.Person;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for accessing and managing {@link Person} entities.
 */
@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    /**
     * Finds a Person by their user id in linus.
     *
     * @param linusUserId The id of the user in linus
     * @return The Person with the proper id
     */
    List<Person> findByLinusUserId(int linusUserId);
}
