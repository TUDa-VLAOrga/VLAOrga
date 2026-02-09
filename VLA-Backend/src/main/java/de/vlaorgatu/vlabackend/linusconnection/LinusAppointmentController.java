package de.vlaorgatu.vlabackend.linusconnection;

import java.util.List;

import de.vlaorgatu.vlabackend.exceptions.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;


/**
 * REST endpoints for managing {@link LinusAppointment} entities.
 */
// TODO: after merging with entities/lecture: adjust to use RepositoryRestController
//  and path relative to the basePath (/api) specified in application.properties
@Controller
@RequestMapping("/api/linus/appointment")
@AllArgsConstructor
class LinusAppointmentController {

    private final LinusAppointmentRepository appointmentRepository;

    /**
     * List all appointments.
     */
    @GetMapping()
    public ResponseEntity<List<LinusAppointment>> listAppointments() {
        List<LinusAppointment> all = appointmentRepository.findAll();
        return ResponseEntity.ok(all);
    }

    /**
     * Get an appointment by id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<LinusAppointment> getAppointmentById(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new EntityNotFoundException("Could not find a linus appointment with the id="+id));
    }
}
