package de.vlaorgatu.vlabackend.calendar.acceptance;

import de.vlaorgatu.vlabackend.sse.SseController;
import java.util.Objects;
import java.util.Optional;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
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
    private static final Logger LOGGER =
        org.slf4j.LoggerFactory.getLogger(AcceptanceController.class);
    private final AcceptanceRepository acceptanceRepository;

    /**
     * Creates a new acceptance.
     *
     * @param acceptance Acceptance to create.
     * @return OK response with the created acceptance, Error response otherwise.
     */
    @PostMapping("/acceptances")
    public ResponseEntity<?> createAcceptance(@RequestBody Acceptance acceptance) {
        if (Objects.nonNull(acceptance.getId())) {
            LOGGER.warn("Received acceptance with ID {} when creating a new acceptance.",
                acceptance.getId());
            return ResponseEntity.badRequest().build();
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
            LOGGER.warn("Received inconsistent IDs on acceptance modification." +
                " ID from url: {} vs. ID from body data: {}.", id, acceptance.getId());
            return ResponseEntity.badRequest().build();
        }
        if (!acceptanceRepository.existsById(id)) {
            LOGGER.warn("Received acceptance update for non-existing acceptance with ID {}.", id);
            return ResponseEntity.notFound().build();
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
        Optional<Acceptance> acceptanceOptional = acceptanceRepository.findById(id);
        if (acceptanceOptional.isEmpty()) {
            LOGGER.warn("Received acceptance deletion for non-existing acceptance with ID {}.", id);
            return ResponseEntity.notFound().build();
        }
        acceptanceRepository.deleteById(id);
        // TODO: use a better method here instead of debug message
        SseController.notifyDebugTest("Acceptance deleted: " + acceptanceOptional.get());
        return ResponseEntity.ok(acceptanceOptional.get());
    }
}
