package de.vlaorgatu.vlabackend.linus_connection;

import java.util.List;
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
class LinusAppointmentController {

    private final LinusAppointmentRepository appointmentRepository;

    public LinusAppointmentController(LinusAppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    /**
     * List all lectures.
     */
    @GetMapping()
    public List<LinusAppointment> listAppointments() {
        return appointmentRepository.findAll();
    }

    /**
     * Get a lecture by id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<LinusAppointment> getAppointmentById(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
