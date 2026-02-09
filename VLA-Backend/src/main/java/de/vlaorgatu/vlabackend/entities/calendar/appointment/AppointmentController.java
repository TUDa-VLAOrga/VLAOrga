package de.vlaorgatu.vlabackend.entities.calendar.appointment;

import de.vlaorgatu.vlabackend.sse.SseController;
import java.util.Objects;
import java.util.Optional;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Rest controller for appointment-related endpoints.
 * <br>
 * Mainly needed to trigger SSE events on update operations.
 */
@AllArgsConstructor
@RepositoryRestController
public class AppointmentController {
    private static final Logger LOGGER =
        org.slf4j.LoggerFactory.getLogger(AppointmentController.class);
    private final AppointmentRepository appointmentRepository;

    /**
     * Creates a new appointment.
     *
     * @param appointment Appointment to create.
     * @return OK response with the created appointment, Error response otherwise.
     */
    @PostMapping("/appointments")
    public ResponseEntity<?> createAppointment(@RequestBody Appointment appointment) {
        if (Objects.nonNull(appointment.getId())) {
            LOGGER.warn("Received appointment with ID {} when creating a new appointment.",
                appointment.getId());
            return ResponseEntity.badRequest().build();
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
     *                   Must contain all keys, ID may be omitted.
     * @return OK response with the updated appointment, Error response otherwise.
     */
    @PutMapping("/appointments/{id}")
    public ResponseEntity<?> updateAppointment(@PathVariable Long id,
                                               @RequestBody Appointment appointment) {
        if (Objects.isNull(appointment.getId())) {
            appointment.setId(id);
        } else if (!appointment.getId().equals(id)) {
            LOGGER.warn("Received inconsistent IDs on appointment modification." +
                " ID from url: {} vs. ID from body data: {}.", id, appointment.getId());
            return ResponseEntity.badRequest().build();
        }
        if (!appointmentRepository.existsById(id)) {
            LOGGER.warn(
                "Received appointment modification for non-existing appointment with ID {}.", id);
            return ResponseEntity.notFound().build();
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
    @PostMapping("/appointments/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        Optional<Appointment> appointmentOptional = appointmentRepository.findById(id);
        if (appointmentOptional.isEmpty()) {
            LOGGER.warn("Received appointment deletion for non-existing appointment with ID {}.",
                id);
            return ResponseEntity.notFound().build();
        }
        appointmentRepository.deleteById(id);
        // TODO: use a better method here instead of debug message
        SseController.notifyDebugTest("Appointment deleted: " + appointmentOptional.get());
        return ResponseEntity.ok(appointmentOptional.get());
    }
}
