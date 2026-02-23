package de.vlaorgatu.vlabackend.controller.linusdb;

import de.vlaorgatu.vlabackend.entities.linusdb.LinusExperimentBooking;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusExperimentBookingRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for retrieving {@link LinusExperimentBooking}s.
 */
@AllArgsConstructor
@RestController
@RequestMapping("/api/linusExperimentBookings")
public class LinusExperimentBookingController implements
    DefaultGettingForReadonlyReposInterface
        <
            LinusExperimentBooking,
            LinusExperimentBookingRepository
        > {

    /**
     * Repository containing all {@link LinusExperimentBooking}s.
     */
    private LinusExperimentBookingRepository linusExperimentBookingRepository;

    /**
     * Retrieves the repository from the controller instance.
     *
     * @return The read-only repository used by the controller
     */
    @Override
    public LinusExperimentBookingRepository getRepository() {
        return linusExperimentBookingRepository;
    }
}
