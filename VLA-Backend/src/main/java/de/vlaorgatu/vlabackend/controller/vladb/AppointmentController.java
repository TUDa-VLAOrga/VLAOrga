package de.vlaorgatu.vlabackend.controller.vladb;

import de.vlaorgatu.vlabackend.controller.sse.SseController;
import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import de.vlaorgatu.vlabackend.exceptions.EntityNotFoundException;
import de.vlaorgatu.vlabackend.exceptions.InvalidParameterException;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentRepository;
import java.util.Objects;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
    implements DefaultGettingForJPAReposInterface<Appointment, AppointmentRepository> {

    /**
     * Repository used for appointment persistence operations.
     */
    private final AppointmentRepository appointmentRepository;

    /**
     * Creates a new appointment.
     *
     * @param appointment Appointment to create, must not contain an ID (auto-generated).
     * @return OK response with the created appointment, Error response otherwise.
     */
    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody Appointment appointment) {
        if (Objects.nonNull(appointment.getId())) {
            throw new InvalidParameterException(
                "Received appointment with ID " + appointment.getId() +
                    " when creating a new appointment.");
        }
        Appointment savedAppointment = appointmentRepository.save(appointment);
        // TODO: use a better method here instead of debug message
        SseController.notifyDebugTest("Appointment created: " + savedAppointment);
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
    public ResponseEntity<?> updateAppointment(@PathVariable Long id,
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
        // TODO: use a better method here instead of debug message
        SseController.notifyDebugTest("Appointment updated: " + updated);
        return ResponseEntity.ok(updated);
    }

    /**
     * Deletes an appointment by its ID.
     *
     * @param id ID of the appointment to delete.
     * @return OK response with the deleted appointment, Error response otherwise.
     */
    @PostMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        Appointment deletedAppointment = appointmentRepository.findById(id).orElseThrow(
            () -> new EntityNotFoundException(
                "Appointment with ID " + id + " not found."));
        appointmentRepository.deleteById(id);
        // TODO: use a better method here instead of debug message
        SseController.notifyDebugTest("Appointment deleted: " + deletedAppointment);
        return ResponseEntity.ok(deletedAppointment);
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
