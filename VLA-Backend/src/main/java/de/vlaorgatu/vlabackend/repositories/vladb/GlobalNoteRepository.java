package de.vlaorgatu.vlabackend.repositories.vladb;

import de.vlaorgatu.vlabackend.entities.vladb.GlobalNote;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for accessing and managing {@link GlobalNote} entities.
 */
public interface GlobalNoteRepository extends JpaRepository<GlobalNote, Long> {
}
