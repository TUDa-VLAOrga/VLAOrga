package de.vlaorgatu.vlabackend.controller.vladb;

import de.vlaorgatu.vlabackend.databaseSync.LinusSyncService;
import de.vlaorgatu.vlabackend.helperClasses.requestBodyTemplates.TimeFrame;
import de.vlaorgatu.vlabackend.entities.vladb.AppointmentMatching;
import de.vlaorgatu.vlabackend.repositories.vladb.AppointmentMatchingRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/api/appointmentMatchings")
public class AppointmentMatchingController implements
    GetAllAndGetByIdDefaultInterface<AppointmentMatching, AppointmentMatchingRepository> {

    private final AppointmentMatchingRepository appointmentMatchingRepository;
    private final LinusSyncService linusSyncService;

    @PostMapping("/match/appointments")
    public ResponseEntity<String> matchAppointments(@RequestBody TimeFrame timeFrame) {
        linusSyncService.matchAppointments(timeFrame.getCommence(), timeFrame.getTerminate());
        return ResponseEntity.ok("");
    }

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
