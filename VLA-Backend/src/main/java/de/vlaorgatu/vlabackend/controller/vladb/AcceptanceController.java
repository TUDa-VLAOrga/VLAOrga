package de.vlaorgatu.vlabackend.controller.vladb;

import de.vlaorgatu.vlabackend.entities.vladb.Acceptance;
import de.vlaorgatu.vlabackend.exceptions.EntityNotFoundException;
import de.vlaorgatu.vlabackend.exceptions.InvalidParameterException;
import de.vlaorgatu.vlabackend.controller.sse.SseController;
import de.vlaorgatu.vlabackend.repositories.vladb.AcceptanceRepository;
import java.util.Objects;
import lombok.AllArgsConstructor;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Rest controller for acceptance-related endpoints.
 * <br>
 * Mainly needed to trigger SSE events on update operations.
 */
@AllArgsConstructor
@RepositoryRestController
public class AcceptanceController {
    /**
     * Repository used for acceptance persistence operations.
     */
    private final AcceptanceRepository acceptanceRepository;

    /**
     * Creates a new acceptance.
     *
     * @param acceptance Acceptance to create, must not contain an ID (auto-generated).
     * @return OK response with the created acceptance, Error response otherwise.
     */
    @PostMapping("/acceptances")
    public ResponseEntity<?> createAcceptance(@RequestBody Acceptance acceptance) {
        if (Objects.nonNull(acceptance.getId())) {
            throw new InvalidParameterException(
                "Received acceptance with ID " + acceptance.getId() +
                    " when creating a new acceptance.");
        }
        Acceptance savedAcceptance = acceptanceRepository.save(acceptance);
        // TODO: use a better method here instead of debug message
        SseController.notifyDebugTest("Acceptance created: " + savedAcceptance);
        return ResponseEntity.ok(savedAcceptance);
    }

    /**
     * Updates an existing acceptance.
     *
     * @param id         ID of the acceptance to update.
     * @param acceptance Acceptance to update. Must contain all keys, ID may be omitted.
     * @return OK response with the updated acceptance, Error response otherwise.
     */
    @PutMapping("/acceptances/{id}")
    public ResponseEntity<?> updateAcceptance(@PathVariable Long id,
                                              @RequestBody Acceptance acceptance) {
        if (Objects.isNull(acceptance.getId())) {
            acceptance.setId(id);
        } else if (!acceptance.getId().equals(id)) {
            throw new InvalidParameterException(
                "Received inconsistent IDs on acceptance modification. ID from url: " + id +
                    " vs. ID from body data: " + acceptance.getId() + ".");
        }
        if (!acceptanceRepository.existsById(id)) {
            throw new EntityNotFoundException(
                "Acceptance with ID " + id + " not found for update.");
        }
        Acceptance updatedAcceptance = acceptanceRepository.save(acceptance);
        // TODO: use a better method here instead of debug message
        SseController.notifyDebugTest("Acceptance updated: " + updatedAcceptance);
        return ResponseEntity.ok(updatedAcceptance);
    }

    /**
     * Deletes an acceptance by its ID.
     *
     * @param id ID of the acceptance to delete.
     * @return OK response with the deleted acceptance, Error response otherwise.
     */
    @DeleteMapping("/acceptances/{id}")
    public ResponseEntity<?> deleteAcceptance(@PathVariable Long id) {
        Acceptance deletedAcceptance = acceptanceRepository.findById(id).orElseThrow(
            () -> new EntityNotFoundException(
                "Acceptance with ID " + id + " not found for deletion."));
        acceptanceRepository.deleteById(id);
        // TODO: use a better method here instead of debug message
        SseController.notifyDebugTest("Acceptance deleted: " + deletedAcceptance);
        return ResponseEntity.ok(deletedAcceptance);
    }
}
