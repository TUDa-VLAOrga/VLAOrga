package de.vlaorgatu.vlabackend.databaseSync;

import de.vlaorgatu.vlabackend.entities.calendar.experimentbooking.ExperimentBooking;
import de.vlaorgatu.vlabackend.entities.calendar.experimentbooking.ExperimentBookingRepository;
import de.vlaorgatu.vlabackend.linusconnection.LinusExperimentBooking;
import de.vlaorgatu.vlabackend.linusconnection.LinusExperimentBookingRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class LinusSyncService {
    private final ExperimentBookingRepository vlaExperimentsDb;
    private final LinusExperimentBookingRepository linusExperimentsDb;

    @Transactional
    public void syncBookings() {
        List<LinusExperimentBooking> linusExperiments = linusExperimentsDb.findAll();

        linusExperiments.stream().filter( linusExperimentBooking ->
        {
            return vlaExperimentsDb
                .findExperimentBookingsByLinusExperimentBookingId(linusExperimentBooking.getId()).isEmpty();
        }).forEach(toBeSavedBooking -> {
            ExperimentBooking newEntry = new ExperimentBooking();
            newEntry.setLinusExperimentBookingId(toBeSavedBooking.getId());
            newEntry.setLinusExperimentId(toBeSavedBooking.getLinusExperimentId());
            vlaExperimentsDb.save(newEntry);
        });
    }

    // @EventListener(ApplicationReadyEvent.class)
    public void synchronizeBookings() {
        this.syncBookings();
    }
}
