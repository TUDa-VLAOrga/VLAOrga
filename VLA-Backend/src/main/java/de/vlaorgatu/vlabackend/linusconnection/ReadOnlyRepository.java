package de.vlaorgatu.vlabackend.linusconnection;

import java.util.List;
import java.util.Optional;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.Repository;

/**
 * Represents Repositories that can only be read.
 * Subset of {@link org.springframework.data.repository.CrudRepository}
 *
 * @param <T> the domain type the repository manages
 * @param <I> the type of the id of the entity the repository manages
 */
@NoRepositoryBean
public interface ReadOnlyRepository<T, I> extends Repository<T, I> {
    /**
     * Tries to find an entity of type T in the repository with the specified id.
     *
     * @param id The id to search for
     * @return The entity if present
     */
    Optional<T> findById(I id);

    /**
     * Used for getting all entities of type T in the repository.
     *
     * @return List of all entities of type T
     */
    List<T> findAll();
}
