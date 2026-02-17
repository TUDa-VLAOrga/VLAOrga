package de.vlaorgatu.vlabackend.controller.linusdb;

import de.vlaorgatu.vlabackend.entities.linusdb.LinusExperimentBooking;
import de.vlaorgatu.vlabackend.exceptions.EntityNotFoundException;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusExperimentBookingRepository;
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
// TODO: after merging with entities/lecture: adjust to use RepositoryRestController
//  and path relative to the basePath (/api) specified in application.properties
@Controller
@RequestMapping("/api/linus/experiment-booking")
@AllArgsConstructor
class LinusExperimentBookingController {

    /**
     * Repository used for experiment booking persistence operations.
     */
    private final LinusExperimentBookingRepository bookingRepository;

    /**
     * List all experiment bookings.
     */
    @GetMapping()
    public ResponseEntity<List<LinusExperimentBooking>> listExperimentBookings() {
        List<LinusExperimentBooking> all = bookingRepository.findAll();
        return ResponseEntity.ok(all);
    }

    /**
     * Get an experiment booking by id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<LinusExperimentBooking> getExperimentBookingById(@PathVariable Long id) {
        return bookingRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElseThrow(() ->
                new EntityNotFoundException(
                    "The linus experiment booking with id=" + id + "could not be found"
                )
            );
    }
}
