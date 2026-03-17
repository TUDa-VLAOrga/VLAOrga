package de.vlaorgatu.vlabackend.controller.vladb;

import de.vlaorgatu.vlabackend.controller.sse.SseController;
import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import de.vlaorgatu.vlabackend.entities.vladb.ExperimentBooking;
import de.vlaorgatu.vlabackend.enums.calendar.experimentbooking.ExperimentPreparationStatus;
import de.vlaorgatu.vlabackend.enums.sse.SseMessageType;
import de.vlaorgatu.vlabackend.exceptions.EntityNotFoundException;
import de.vlaorgatu.vlabackend.exceptions.InvalidParameterException;
import de.vlaorgatu.vlabackend.exceptions.InvalidRequestInCurrentServerState;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.ExperimentBookingRepository;
import de.vlaorgatu.vlabackend.services.ExperimentBookingService;
import java.util.Objects;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
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
    implements
    DefaultGettingForJpaReposInterface<ExperimentBooking, ExperimentBookingRepository> {
    /**
     * Repository used for experiment booking persistence operations.
     */
    private final ExperimentBookingRepository experimentBookingRepository;

    private final AppointmentRepository appointmentRepository;

    private final ExperimentBookingService experimentBookingService;

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
        if (!experimentBookingRepository.existsById(id)) {
            throw new EntityNotFoundException(
                "Experiment booking with ID " + id + " not found.");
        }

        ExperimentBooking updatedExperimentBooking =
            experimentBookingRepository.save(experimentBooking);

        SseController.notifyAllOfObject(SseMessageType.EXPERIMENTBOOKINGUPDATED,
            updatedExperimentBooking);

        return ResponseEntity.ok(updatedExperimentBooking);
    }

    /**
     * Updates the state of a ExperimentBooking.
     *
     * @param id                          id of the experimentBooking
     * @param experimentPreparationStatus The ordinal of the preparation enum
     * @return The updated booking
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ExperimentBooking> updateExperimentBooking(
        @PathVariable Long id,
        @RequestBody Integer experimentPreparationStatus
    ) {
        int experimentPreparationStatusIndex = -1;

        for (ExperimentPreparationStatus status : ExperimentPreparationStatus.values()) {
            if (status.ordinal() == experimentPreparationStatus) {
                experimentPreparationStatusIndex = status.ordinal();
            }
        }

        if (experimentPreparationStatusIndex == -1) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        ExperimentBooking toUpdate = experimentBookingRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(
                    "Experiment booking with ID " + id + " not found."
                )
            );

        toUpdate.setStatus(ExperimentPreparationStatus.values()[experimentPreparationStatusIndex]);

        ExperimentBooking updatedExperimentBooking =
            experimentBookingRepository.save(toUpdate);

        SseController.notifyAllOfObject(
            SseMessageType.EXPERIMENTBOOKINGUPDATED, updatedExperimentBooking
        );

        SseController.notifyAllOfObject(
            SseMessageType.APPOINTMENTUPDATED, toUpdate.getAppointment()
        );

        return ResponseEntity.ok(updatedExperimentBooking);
    }

    /**
     * Moves an {@link ExperimentBooking} to the next {@link Appointment} in a sequence.
     *
     * @param id The experimentBooking to update
     * @return 200 with booking iff. experimentBooking could be moved
     */
    @PutMapping("/{id}/moveNext")
    public ResponseEntity<ExperimentBooking> updateExperimentBookingNextAppointment(
        @PathVariable Long id
    ) {
        ExperimentBooking experimentBooking = experimentBookingRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(
                "No valid experiment booking with ID " + id + " found."
            ));

        Appointment originalAppointment = experimentBooking.getAppointment();

        Appointment targetAppointment;

        if (originalAppointment.getSeries().getLecture() != null) {
            targetAppointment = appointmentRepository
                .findFirstAppointmentBySeriesLectureIdAndStartTimeGreaterThanOrderByStartTimeAsc(
                    originalAppointment.getSeries().getLecture().getId(),
                    originalAppointment.getStartTime())
                .orElseThrow(() -> new InvalidRequestInCurrentServerState(
                    "No next appointment in lecture to move experimentBooking to"
                ));
        } else {
            targetAppointment = appointmentRepository
                .findFirstAppointmentBySeriesIdAndStartTimeGreaterThanOrderByStartTimeAsc(
                    originalAppointment.getSeries().getId(),
                    originalAppointment.getStartTime())
                .orElseThrow(() -> new InvalidRequestInCurrentServerState(
                    "No next appointment in series to move experimentBooking to"
                ));
        }

        // Handles SSE updating
        ExperimentBooking updatedExperimentBooking =
            experimentBookingService.moveExperimentBooking(experimentBooking, targetAppointment);

        return ResponseEntity.ok(updatedExperimentBooking);
    }

    /**
     * Moves an {@link ExperimentBooking} to the previous {@link Appointment} in a sequence.
     *
     * @param id The experimentBooking to update
     * @return 200 with booking iff. experimentBooking could be moved
     */
    @PutMapping("/{id}/movePrevious")
    public ResponseEntity<ExperimentBooking> updateExperimentBookingPreviousAppointment(
        @PathVariable Long id
    ) {
        ExperimentBooking experimentBooking = experimentBookingRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(
                "No valid experiment booking with ID " + id + " found."
            ));

        Appointment originalAppointment = experimentBooking.getAppointment();

        Appointment targetAppointment;

        if (originalAppointment.getSeries().getLecture() != null) {
            targetAppointment = appointmentRepository
                .findFirstAppointmentBySeriesLectureIdAndEndTimeLessThanOrderByEndTimeDesc(
                    originalAppointment.getSeries().getLecture().getId(),
                    originalAppointment.getEndTime())
                .orElseThrow(() -> new InvalidRequestInCurrentServerState(
                    "No previous appointment in lecture to move experimentBooking to"
                ));
        } else {
            targetAppointment = appointmentRepository
                .findFirstAppointmentBySeriesIdAndEndTimeLessThanOrderByEndTimeDesc(
                    originalAppointment.getSeries().getId(),
                    originalAppointment.getEndTime())
                .orElseThrow(() -> new InvalidRequestInCurrentServerState(
                    "No previous appointment in series to move experimentBooking to"
                ));
        }

        // Handles SSE updating
        ExperimentBooking updatedExperimentBooking =
            experimentBookingService.moveExperimentBooking(experimentBooking, targetAppointment);

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
        ExperimentBooking deletedExperimentBooking =
            experimentBookingRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(
                    "Experiment booking with ID " + id + " not found."
                )
            );

        Appointment toUpdateAppointment = deletedExperimentBooking.getAppointment();

        toUpdateAppointment.getBookings().remove(deletedExperimentBooking);
        toUpdateAppointment = appointmentRepository.save(toUpdateAppointment);

        SseController.notifyAllOfObject(SseMessageType.APPOINTMENTUPDATED, toUpdateAppointment);

        experimentBookingRepository.deleteById(id);
        SseController.notifyAllOfObject(
            SseMessageType.EXPERIMENTBOOKINGDELETED,
            deletedExperimentBooking
        );
        return ResponseEntity.ok(deletedExperimentBooking);
    }

    /**
     * Retrieves the repository ot this controller instance.
     *
     * @return The JPARepository used by this controller
     */
    @Override
    public ExperimentBookingRepository getRepository() {
        return experimentBookingRepository;
    }
}
