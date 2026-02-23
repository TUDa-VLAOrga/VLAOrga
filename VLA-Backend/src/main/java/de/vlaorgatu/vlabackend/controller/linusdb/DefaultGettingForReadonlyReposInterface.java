package de.vlaorgatu.vlabackend.controller.linusdb;

import de.vlaorgatu.vlabackend.exceptions.EntityNotFoundException;
import de.vlaorgatu.vlabackend.repositories.linusdb.ReadOnlyRepository;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Interface with default GET implementations for controllers.
 * This assumes that the id of a given entity of T is of type {@link Integer}.
 * The base path of the controller will serve a list of all stored entities
 * The base path appended with /id return the according entity from the repo
 *
 * @param <T> The type of entity inside the repository with id of type {@link Integer}
 * @param <R> The type of the repository, which may not be extended upon
 */
public interface DefaultGettingForReadonlyReposInterface
    <T, R extends ReadOnlyRepository<T, Integer>> {
    /**
     * Retrieves the repository R from the controller instance.
     *
     * @return The read-only repository used by the controller
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
    default ResponseEntity<T> getById(@PathVariable Integer id) {
        T entity = getRepository().findById(id)
            .orElseThrow(() -> new EntityNotFoundException(
                    "No entity with id " + id + " was found"
                )
            );

        return ResponseEntity.ok(entity);
    }
}
