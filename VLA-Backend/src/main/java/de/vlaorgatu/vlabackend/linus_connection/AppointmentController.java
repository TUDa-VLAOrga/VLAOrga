package de.vlaorgatu.vlabackend.linus_connection;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;


/**
 * REST endpoints for managing {@link Appointment} entities.
 */
@Controller
@RequestMapping("/api/linus/appointment")
class AppointmentController {

    private final AppointmentRepository appointmentRepository;

    public AppointmentController(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    /**
     * List all lectures.
     */
    @GetMapping()
    public List<Appointment> listAppointments() {
        return appointmentRepository.findAll();
    }

    /**
     * Get a lecture by id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
