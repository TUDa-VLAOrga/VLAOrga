package de.vlaorgatu.vlabackend.controller.vladb;

import de.vlaorgatu.vlabackend.controller.sse.SseController;
import de.vlaorgatu.vlabackend.databasesync.Linussyncservice;
import de.vlaorgatu.vlabackend.entities.vladb.Appointment;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentMatching;
import de.vlaorgatu.vlabackend.enums.sse.SseMessageType;
import de.vlaorgatu.vlabackend.exceptions.EntityNotFoundException;
import de.vlaorgatu.vlabackend.helperclasses.requestbodytemplates.TimeFrame;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentMatchingRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for handling {@link AppointmentMatching} endpoints.
 * This also includes triggering matching routines via /match/*
 */
@AllArgsConstructor
@RestController
@RequestMapping("/api/appointmentMatchings")
public class AppointmentMatchingController implements
    DefaultGettingForJpaReposInterface<AppointmentMatching, AppointmentMatchingRepository> {

    /**
     * Repository containing {@link AppointmentMatching}s.
     */
    private final AppointmentMatchingRepository appointmentMatchingRepository;

    /**
     * Repository containing {@link Appointment}s.
     */
    private final AppointmentRepository appointmentRepository;

    /**
     * Provided LinusSyncService.
     */
    private final Linussyncservice linusSyncService;

    /**
     * Returns all appointmentMatchings without an assigned Appointment in a time frame.
     *
     * @param startDate The start of the time frame in the iso format
     * @param endDate   The end of the time frame in the iso format
     * @return {@link AppointmentMatching}s without an assigned {@link Appointment}
     */
    @GetMapping("/nulledAppointments")
    public ResponseEntity<List<AppointmentMatching>> getUnmatchedAppointmentsInTimeFrame(
        @RequestParam("commence")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
        @RequestParam("terminate")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {

        List<AppointmentMatching> appointmentMatchings =
            appointmentMatchingRepository
                .findAppointmentMatchingsByAppointmentNullAndLinusAppointmentTimeBetween(
                    startDate,
                    endDate
                );

        return ResponseEntity.ok(appointmentMatchings);
    }

    @PostMapping("/{matchingId}")
    public ResponseEntity<AppointmentMatching> changeAppointmentMatchingAssignment(
        @PathVariable Long matchingId,
        @RequestBody Long appointmentId
    ) {
        AppointmentMatching currentMatching = appointmentMatchingRepository.findById(matchingId)
            .orElseThrow(() -> new EntityNotFoundException(
                    "No valid appointment matching with id " + matchingId + " could be found"
                )
            );

        Appointment referencedAppointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new EntityNotFoundException(
                    "No valid appointment with id " + appointmentId + " could be found"
                )
            );

        currentMatching.setAppointment(referencedAppointment);
        AppointmentMatching savedMatching = appointmentMatchingRepository.save(currentMatching);

        SseController.notifyAllOfObject(SseMessageType.APPOINTMENTMATCHINGUPDATE, savedMatching);

        return ResponseEntity.ok(savedMatching);
    }

    /**
     * Matches all reservations in linus in a given time frame to an {@link AppointmentMatching}.
     *
     * @param timeFrame The {@link TimeFrame} to look at
     * @return Status Ok (200)
     */
    @Transactional("vlaTransactionManager")
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
