package de.vlaorgatu.vlabackend.linusconnection;

import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;


/**
 * REST endpoints for managing {@link LinusExperimentBooking} entities.
 */
// TODO after merging with entities/lecture: adjust to use RepositoryRestController and path relative to the basePath (/api) specified in application.properties
@Controller
@RequestMapping("/api/linus/experiment-booking")
@AllArgsConstructor
class LinusExperimentBookingController {

    private final LinusExperimentBookingRepository bookingRepository;
    
    /**
     * List all experiment bookings.
     */
    @GetMapping()
    public ResponseEntity<List<LinusExperimentBooking>> listExperimentBookings() {
        List<LinusExperimentBooking> all = bookingRepository.findAll();
        if (all.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(all);
    }

    /**
     * Get an experiment booking by id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<LinusExperimentBooking> getExperimentBookingById(@PathVariable Long id) {
        return bookingRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
