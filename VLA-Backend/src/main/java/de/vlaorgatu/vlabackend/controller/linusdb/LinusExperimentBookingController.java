package de.vlaorgatu.vlabackend.controller.linusdb;

import de.vlaorgatu.vlabackend.entities.linusdb.LinusExperimentBooking;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusExperimentBookingRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/api/linusExperimentBookings")
public class LinusExperimentBookingController implements
    DefaultGettingForReadonlyReposInterface<LinusExperimentBooking, LinusExperimentBookingRepository> {

    private LinusExperimentBookingRepository linusExperimentBookingRepository;

    @Override
    public LinusExperimentBookingRepository getRepository() {
        return linusExperimentBookingRepository;
    }
}
