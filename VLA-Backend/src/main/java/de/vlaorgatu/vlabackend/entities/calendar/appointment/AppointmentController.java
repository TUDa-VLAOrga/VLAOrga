package de.vlaorgatu.vlabackend.entities.calendar.appointment;

import de.vlaorgatu.vlabackend.exceptions.EntityNotFoundException;
import de.vlaorgatu.vlabackend.exceptions.InvalidParameterException;
import de.vlaorgatu.vlabackend.sse.SseController;
import java.util.Objects;
import lombok.AllArgsConstructor;
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

    private final AppointmentRepository appointmentRepository;

    /**
     * Creates a new appointment.
     *
     * @param appointment Appointment to create, must not contain an ID (auto-generated).
     * @return OK response with the created appointment, Error response otherwise.
     */
    @PostMapping("/appointments")
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
    @PutMapping("/appointments/{id}")
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
                "Appointment with ID " + id + " not found for update.");
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
        Appointment deletedAppointment = appointmentRepository.findById(id).orElseThrow(
            () -> new EntityNotFoundException(
                "Appointment with ID " + id + " not found for deletion."));
        appointmentRepository.deleteById(id);
        // TODO: use a better method here instead of debug message
        SseController.notifyDebugTest("Appointment deleted: " + deletedAppointment);
        return ResponseEntity.ok(deletedAppointment);
    }
}
