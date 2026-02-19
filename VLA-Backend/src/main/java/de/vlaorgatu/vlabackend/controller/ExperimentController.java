package de.vlaorgatu.vlabackend.controller;

import de.vlaorgatu.vlabackend.entities.linusdb.LinusExperiment;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusExperimentBookingRepository;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusExperimentRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.ExperimentBookingRepository;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * TODO.
 */
@AllArgsConstructor
@RepositoryRestController
@RequestMapping("/experiments")
public class ExperimentController {
    /**
     * TODO.
     */
    private AppointmentRepository appointmentRepository;
    /**
     * TODO.
     */
    private ExperimentBookingRepository experimentBookingRepository;
    /**
     * TODO.
     */
    private LinusExperimentBookingRepository linusExperimentBookingRepository;
    /**
     * TODO.
     */
    private LinusExperimentRepository linusExperimentRepository;

    @GetMapping("/inAppointment/{id}")
    public ResponseEntity<List<LinusExperiment>> getAllExperimentsOnAppointment(
        @PathVariable Long id) {

    }
}
