package de.vlaorgatu.vlabackend.controller.vladb;

import de.vlaorgatu.vlabackend.exceptions.EntityNotFoundException;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Interface with default GET implementations for controllers.
 * This assumes that the id of a given entity of T is of type {@link Long}.
 * The base path of the controller will serve a list of all stored entities
 * The base path appended with /id return the according entity from the repo
 *
 * @param <T> The type of entity inside the repository with id of type {@link Long}
 * @param <R> The type of the repository, which may not be extended upon
 */
public interface DefaultGettingForJpaReposInterface<T, R extends JpaRepository<T, Long>> {
    /**
     * Retrieves the repository R from the controller instance.
     *
     * @return The JPARepository used by the controller
     */
    R getRepository();

    /**
     * Endpoint for GETting all entities of type T in a repo type R.
     *
     * @return All entities of type T in repo of type R
     */
    @GetMapping
    default ResponseEntity<List<T>> getAll() {
        List<T> entities = getRepository().findAll();
        return ResponseEntity.ok(entities);
    }

    /**
     * Endpoint for GETting an entity by id.
     *
     * @param id The id of the entity
     * @return The specified entity if exists
     */
    @GetMapping("/{id}")
    default ResponseEntity<T> getById(@PathVariable Long id) {
        T entity = getRepository().findById(id)
            .orElseThrow(() -> new EntityNotFoundException(
                    "No entity with id " + id + " was found"
                )
            );

        return ResponseEntity.ok(entity);
    }
}
