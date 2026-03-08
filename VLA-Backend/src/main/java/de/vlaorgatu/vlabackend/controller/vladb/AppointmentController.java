package de.vlaorgatu.vlabackend.controller.vladb;

import de.vlaorgatu.vlabackend.controller.sse.SseController;
import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import de.vlaorgatu.vlabackend.entities.vladb.ExperimentBooking;
import de.vlaorgatu.vlabackend.entities.vladb.User;
import de.vlaorgatu.vlabackend.enums.sse.SseMessageType;
import de.vlaorgatu.vlabackend.exceptions.EntityNotFoundException;
import de.vlaorgatu.vlabackend.exceptions.InvalidParameterException;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.ExperimentBookingRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.UserRepository;
import de.vlaorgatu.vlabackend.security.securityutils.SecurityUtils;
import de.vlaorgatu.vlabackend.services.ExperimentBookingService;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Rest controller for appointment-related endpoints.
 * <br>
 * Mainly needed to trigger SSE events on update operations.
 */
@AllArgsConstructor
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController
    implements DefaultGettingForJpaReposInterface<Appointment, AppointmentRepository> {

    /**
     * Repository used for appointment persistence operations.
     */
    private final AppointmentRepository appointmentRepository;

    /**
     * Repository used for ExperimentBooking persistence operations.
     */
    private final ExperimentBookingRepository experimentBookingRepository;

    /**
     * Repository managing all {@link UserRepository}.
     */
    private final UserRepository userRepository;

    /**
     * Service for managing {@link ExperimentBooking}s.
     */
    private final ExperimentBookingService experimentBookingService;

    /**
     * Utility function for security related features.
     */
    private final SecurityUtils securityUtils;

    /**
     * Returns all appointments where eventTime is in their timeframe.
     *
     * @param eventTime The specified time as an ISO string
     * @return All appointments that contain the eventTime
     */
    @GetMapping("/includeTime")
    public ResponseEntity<List<Appointment>> getAppointmentsDuringTime(
        @RequestParam("eventTime")
        LocalDateTime eventTime
    ) {
        List<Appointment> appointmentsInTimeFrame = appointmentRepository
            .findAppointmentsByStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
                eventTime, eventTime
            );

        return ResponseEntity.ok(appointmentsInTimeFrame);
    }

    /**
     * Creates a new appointment.
     *
     * @param appointment Appointment to create, must not contain an ID (auto-generated).
     * @return OK response with the created appointment, Error response otherwise.
     */
    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) {
        if (Objects.nonNull(appointment.getId())) {
            if (appointment.getId() < 0) {
                appointment.setId(null);
            } else {
                throw new InvalidParameterException(
                    "Received appointment with ID " + appointment.getId() +
                        " when creating a new appointment.");
            }
        }
        Appointment savedAppointment = appointmentRepository.save(appointment);
        SseController.notifyAllOfObject(SseMessageType.APPOINTMENTCREATED, savedAppointment);
        return ResponseEntity.ok(savedAppointment);
    }

    /**
     * Updates an existing appointment.
     *
     * @param id          ID of the appointment to update.
     * @param appointment Dataset of the appointment to update.
     *                    Must contain all keys, ID may be omitted.
     * @return OK response with the updated appointment, Error response otherwise.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id,
                                                         @RequestBody Appointment appointment) {
        if (Objects.isNull(appointment.getId())) {
            appointment.setId(id);
        } else if (!appointment.getId().equals(id)) {
            throw new InvalidParameterException(
                "Received inconsistent IDs on appointment modification. ID from url: " + id +
                    " vs. ID from body data: " + appointment.getId() + ".");
        }
        if (!appointmentRepository.existsById(id)) {
            throw new EntityNotFoundException(
                "Appointment with ID " + id + " not found.");
        }

        Appointment updated = appointmentRepository.save(appointment);
        SseController.notifyAllOfObject(SseMessageType.APPOINTMENTUPDATED, updated);
        return ResponseEntity.ok(updated);
    }

    /**
     * Creates multiple appointments.
     *
     * @param appointmentList List of datasets for creation.
     * @return OK response with the created appointment list, Error response otherwise.
     */
    @PostMapping("/multi")
    public ResponseEntity<Appointment[]> createAppointmentsMulti(
        @RequestBody Appointment[] appointmentList) {
        if (Arrays.stream(appointmentList).map(Appointment::getId).filter(Objects::nonNull)
            .anyMatch(id -> id > 0)) {
            throw new InvalidParameterException(
                "Received appointment with ID > 0 when bulk-creating appointments.");
        }
        Arrays.stream(appointmentList).forEach((appointment) -> {
            appointment.setId(null);
        });

        List<Appointment> saved = appointmentRepository.saveAll(Arrays.asList(appointmentList));
        saved.forEach((appointment) -> {
            SseController.notifyAllOfObject(SseMessageType.APPOINTMENTCREATED, appointment);
        });
        return ResponseEntity.ok(saved.toArray(Appointment[]::new));
    }

    /**
     * Deletes an appointment by its ID.
     *
     * @param id ID of the appointment to delete.
     * @return OK response with the deleted appointment, Error response otherwise.
     */
    @DeleteMapping("/{id}")
    public synchronized ResponseEntity<Appointment> deleteAppointment(
        @PathVariable Long id
    ) {
        Appointment toDeleteAppointment = appointmentRepository.findById(id).orElseThrow(
            () -> new EntityNotFoundException(
                "Appointment with ID " + id + " not found.")
        );

        User deletetingIntentionUser = securityUtils.getCurrentUser();

        if (!securityUtils.checkUserIsSessionUser(deletetingIntentionUser)) {
            throw new InvalidParameterException(
                HttpStatus.FORBIDDEN,
                "Appointment deletion requested from a user that is not the sender of the request!"
            );
        }

        // At least two should agree that an appointment should be deleted
        if (toDeleteAppointment.getDeletingIntentionUser() == null) {
            toDeleteAppointment.setDeletingIntentionUser(deletetingIntentionUser);
            final Appointment updatedAppointment = appointmentRepository.save(toDeleteAppointment);

            SseController.notifyAllOfObject(SseMessageType.APPOINTMENTUPDATED, updatedAppointment);

            return ResponseEntity.accepted().body(updatedAppointment);
        }

        if (deletetingIntentionUser.equals(toDeleteAppointment.getDeletingIntentionUser())) {
            // User may not delete appointments by themselves
            throw new InvalidParameterException(
                "User (id=" + deletetingIntentionUser.getId() +
                    ") has already requested deletion of " +
                    " appointment (id=" + toDeleteAppointment.getId() + ")."
            );
        }

        experimentBookingService.moveExperimentBookingsBeforeAppointmentDeletion(
            toDeleteAppointment
        );

        appointmentRepository.deleteById(id);

        SseController.notifyAllOfObject(SseMessageType.APPOINTMENTDELETED, toDeleteAppointment);

        return ResponseEntity.ok(toDeleteAppointment);
    }

    /**
     * Retrieves the repository ot this controller instance.
     *
     * @return The JPARepository used by this controller
     */
    @Override
    public AppointmentRepository getRepository() {
        return appointmentRepository;
    }
}
