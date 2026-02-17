package de.vlaorgatu.vlabackend.databaseSync;

import de.vlaorgatu.vlabackend.entities.linusdb.LinusExperimentBooking;
import de.vlaorgatu.vlabackend.entities.vladb.ExperimentBooking;
import de.vlaorgatu.vlabackend.entities.vladb.Person;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusExperimentBookingRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.ExperimentBookingRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.PersonRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class LinusSyncService {
    private final ExperimentBookingRepository vlaExperimentsDb;
    private final LinusExperimentBookingRepository linusExperimentsDb;
    private final PersonRepository vlaPersonDb;

    @Transactional
    public void syncBookings() {
        List<LinusExperimentBooking> linusExperiments = linusExperimentsDb.findAll();

        linusExperiments.stream().filter( linusExperimentBooking ->
        {
            return vlaExperimentsDb
                .findByLinusExperimentBookingId(linusExperimentBooking.getId()).isEmpty();
        }).forEach(toBeSavedBooking -> {
            ExperimentBooking newEntry = new ExperimentBooking();
            newEntry.setLinusExperimentBookingId(toBeSavedBooking.getId());
            newEntry.setLinusExperimentId(toBeSavedBooking.getLinusExperimentId());
            List<Person> person = vlaPersonDb.findByLinusUserId(toBeSavedBooking.getLinusUserId());
            // TODO: make new person if there is no person with linusUserId (linusUser needed)
            if(!person.isEmpty()){
                newEntry.setPerson(person.getFirst());
            }
            // TODO: appointment
            // no notes here because in linus notes are attached to the appointment
            vlaExperimentsDb.save(newEntry);
        });
    }

    // TODO: make method for syncing appointment notes.

    // @EventListener(ApplicationReadyEvent.class)
    public void synchronizeBookings() {
        this.syncBookings();
    }
}
