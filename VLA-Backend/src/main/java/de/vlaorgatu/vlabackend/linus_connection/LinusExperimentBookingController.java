package de.vlaorgatu.vlabackend.linus_connection;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;


/**
 * REST endpoints for managing {@link LinusExperimentBooking} entities.
 */
@Controller
@RequestMapping("/api/linus/experiment-booking")
class LinusExperimentBookingController {

    private final LinusExperimentBookingRepository bookingRepository;

    public LinusExperimentBookingController(LinusExperimentBookingRepository experimentBookingRepository) {
        this.bookingRepository = experimentBookingRepository;
    }

    /**
     * List all experiment bookings.
     */
    @GetMapping()
    public List<LinusExperimentBooking> listExperimentBookings() {
        return bookingRepository.findAll();
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
