package de.vlaorgatu.vlabackend.linusconnection;

import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;


/**
 * REST endpoints for managing {@link LinusAppointment} entities.
 */
@Controller
@RequestMapping("/api/linus/appointment")
@AllArgsConstructor
class LinusAppointmentController {

    private final LinusAppointmentRepository appointmentRepository;

    /**
     * List all appointments.
     */
    @GetMapping()
    public List<LinusAppointment> listAppointments() {
        return appointmentRepository.findAll();
    }

    /**
     * Get an appointment by id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<LinusAppointment> getAppointmentById(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
