package de.vlaorgatu.vlabackend.controller.vladb;

import de.vlaorgatu.vlabackend.databasesync.Linussyncservice;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentMatching;
import de.vlaorgatu.vlabackend.helperclasses.requestbodytemplates.TimeFrame;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentMatchingRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for handling {@link AppointmentMatching} endpoints.
 * This also includes triggering matching routines via /match/*
 */
@AllArgsConstructor
@RestController
@RequestMapping("/api/appointmentMatchings")
public class AppointmentMatchingController implements
    GetAllAndGetByIdDefaultInterface<AppointmentMatching, AppointmentMatchingRepository> {

    /**
     * Repository containing {@link AppointmentMatching}s.
     */
    private final AppointmentMatchingRepository appointmentMatchingRepository;

    /**
     * Provided LinusSyncService.
     */
    private final Linussyncservice linusSyncService;

    /**
     * Matches all reservations in linus in a given time frame to an {@link AppointmentMatching}.
     *
     * @param timeFrame The {@link TimeFrame} to look at
     * @return Status Ok (200)
     */
    @PostMapping("/match/appointments")
    public ResponseEntity<String> matchAppointments(@RequestBody TimeFrame timeFrame) {
        linusSyncService.matchAppointments(timeFrame.getCommence(), timeFrame.getTerminate());
        return ResponseEntity.ok("");
    }

    /**
     * Matches all experiments in linus to appointments linked via an {@link AppointmentMatching}.
     * This requires that a non-null appointment must be linked to the {@link AppointmentMatching}.
     *
     * @param timeFrame The {@link TimeFrame} to look at
     * @return Status Ok (200)
     */
    @PostMapping("/match/experimentBookings")
    public ResponseEntity<String> matchExperimentBookings(@RequestBody TimeFrame timeFrame) {
        linusSyncService.matchAppointments(timeFrame.getCommence(), timeFrame.getTerminate());
        linusSyncService.syncMatchedAppointmentsExperimentBookings(
            timeFrame.getCommence(),
            timeFrame.getTerminate()
        );
        return ResponseEntity.ok("");
    }

    /**
     * Retrieves the repository ot this controller instance.
     *
     * @return The JPARepository used by this controller
     */
    @Override
    public AppointmentMatchingRepository getRepository() {
        return appointmentMatchingRepository;
    }
}
