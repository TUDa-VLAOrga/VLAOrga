package de.vlaorgatu.vlabackend.repositories.vladb;

import de.vlaorgatu.vlabackend.entities.vladb.Person;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for accessing and managing {@link Person} entities.
 */
@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    /**
     * Finds a {@link Person} by the given linusUserid.
     *
     * @param linusUserId The linus user id to search for
     * @return Person with the linusUserId if existent
     */
    Optional<Person> findPersonByLinusUserId(int linusUserId);
}
