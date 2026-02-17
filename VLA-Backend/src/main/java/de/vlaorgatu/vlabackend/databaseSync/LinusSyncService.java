package de.vlaorgatu.vlabackend.databaseSync;

import de.vlaorgatu.vlabackend.entities.linusdb.LinusExperimentBooking;
import de.vlaorgatu.vlabackend.entities.vladb.ExperimentBooking;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusExperimentBookingRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.ExperimentBookingRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
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
