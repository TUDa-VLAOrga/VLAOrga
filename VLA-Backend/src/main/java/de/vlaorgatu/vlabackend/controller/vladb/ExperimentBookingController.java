package de.vlaorgatu.vlabackend.controller.vladb;

import de.vlaorgatu.vlabackend.controller.sse.SseController;
import de.vlaorgatu.vlabackend.entities.vladb.ExperimentBooking;
import de.vlaorgatu.vlabackend.exceptions.EntityNotFoundException;
import de.vlaorgatu.vlabackend.exceptions.InvalidParameterException;
import de.vlaorgatu.vlabackend.repositories.vladb.ExperimentBookingRepository;
import java.util.Objects;
import lombok.AllArgsConstructor;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Rest controller for experiment booking-related endpoints.
 * <br>
 * Mainly needed to trigger SSE events on update operations.
 */
@AllArgsConstructor
@RestController
@RequestMapping("/api/experimentBookings")
public class ExperimentBookingController
    implements GetAndGetByIdDefaultInterface<ExperimentBooking, ExperimentBookingRepository> {
    /**
     * Repository used for experiment booking persistence operations.
     */
    private final ExperimentBookingRepository repository;

    /**
     * Creates a new experiment booking.
     *
     * @param experimentBooking The dataset for creation. Must not contain an ID (auto-generated).
     * @return OK response with the created experiment booking, Error response otherwise.
     */
    @PostMapping
    public ResponseEntity<?> createExperimentBooking(
        @RequestBody ExperimentBooking experimentBooking) {
        if (Objects.nonNull(experimentBooking.getId())) {
            throw new InvalidParameterException(
                "Received experiment booking with ID " + experimentBooking.getId() +
                    " when creating a new experiment booking.");
        }
        ExperimentBooking savedExperimentBooking = repository.save(experimentBooking);
        // TODO: use a better method here instead of debug message
        SseController.notifyDebugTest("Experiment booking created: " + savedExperimentBooking);
        return ResponseEntity.ok(savedExperimentBooking);
    }

    /**
     * Updates an existing experiment booking.
     *
     * @param id                ID of the experiment booking to update.
     * @param experimentBooking Dataset of the experiment booking to update. Must contain all keys,
     *                          ID may be omitted.
     * @return OK response with the updated experiment booking, Error response otherwise.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateExperimentBooking(
        @PathVariable Long id, @RequestBody ExperimentBooking experimentBooking
    ) {
        if (Objects.isNull(experimentBooking.getId())) {
            experimentBooking.setId(id);
        } else if (!experimentBooking.getId().equals(id)) {
            throw new InvalidParameterException(
                "Received inconsistent IDs on experiment booking update. ID from url: " + id +
                    " vs. ID from body data: " + experimentBooking.getId() + ".");
        }
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException(
                "Experiment booking with ID " + id + " not found.");
        }

        ExperimentBooking updatedExperimentBooking = repository.save(experimentBooking);
        // TODO: use a better method here instead of debug message
        SseController.notifyDebugTest("Experiment booking updated: " + updatedExperimentBooking);
        return ResponseEntity.ok(updatedExperimentBooking);
    }

    /**
     * Deletes an experiment booking by its ID.
     *
     * @param id ID of the experiment booking to delete.
     * @return OK response with the deleted experiment booking, Error response otherwise.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExperimentBooking(@PathVariable Long id) {
        ExperimentBooking deletedExperimentBooking = repository.findById(id).orElseThrow(
            () -> new EntityNotFoundException(
                "Experiment booking with ID " + id + " not found."));
        repository.deleteById(id);
        // TODO: use a better method here instead of debug message
        SseController.notifyDebugTest("Experiment booking deleted: " + deletedExperimentBooking);
        return ResponseEntity.ok(deletedExperimentBooking);
    }
}
