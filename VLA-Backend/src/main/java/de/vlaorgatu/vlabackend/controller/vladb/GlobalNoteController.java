package de.vlaorgatu.vlabackend.controller.vladb;

import de.vlaorgatu.vlabackend.controller.sse.SseController;
import de.vlaorgatu.vlabackend.entities.vladb.GlobalNote;
import de.vlaorgatu.vlabackend.enums.sse.SseMessageType;
import de.vlaorgatu.vlabackend.exceptions.EntityNotFoundException;
import de.vlaorgatu.vlabackend.exceptions.InvalidParameterException;
import de.vlaorgatu.vlabackend.repositories.vladb.GlobalNoteRepository;
import de.vlaorgatu.vlabackend.repositories.vladb.UserRepository;
import java.net.URI;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

/**
 * Controller handling globalNote CRUD operations.
 */
@AllArgsConstructor
@RestController
@RequestMapping("/api/globalNotes")
public class GlobalNoteController
    implements GetAndGetByIdDefaultInterface<GlobalNote, GlobalNoteRepository> {
    /**
     * Repository that contains all globalNote entities.
     */
    private final GlobalNoteRepository globalNoteRepository;

    /**
     * Endpoint for creating a new global note.
     *
     * @param note The note to create (parameter id is optional and will be overwritten)
     * @return The saved global note
     */
    @PostMapping
    ResponseEntity<GlobalNote> createGlobalNote(@RequestBody GlobalNote note) {
        note.setId(null);

        if (note.hasInvalidTitle()) {
            throw new InvalidParameterException("Note titles may not be empty");
        }

        if (note.hasInvalidColor()) {
            throw new InvalidParameterException("Color does not match 7 char HTML notation");
        }

        GlobalNote savedNote = globalNoteRepository.save(note);

        SseController.notifyAllOfObject(SseMessageType.GLOBALNOTECREATED, savedNote);

        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(savedNote.getId())
            .toUri();

        return ResponseEntity.created(location).body(savedNote);
    }

    /**
     * Endpoint for updating a globalNote.
     *
     * @param id           The id of the note
     * @param proposedNote The updated view of the node
     * @return The updated and saved note
     */
    @PutMapping("/{id}")
    ResponseEntity<GlobalNote> updateGlobalNote(@PathVariable Long id,
                                                @RequestBody GlobalNote proposedNote) {
        if (proposedNote.getId() == null) {
            proposedNote.setId(id);
        }

        if (!proposedNote.getId().equals(id)) {
            throw new InvalidParameterException("Id mismatch between URL and proposed note id");
        }

        if (proposedNote.hasInvalidTitle()) {
            throw new InvalidParameterException("Note titles may not be empty");
        }

        if (proposedNote.hasInvalidColor()) {
            throw new InvalidParameterException("Color does not match 7 char HTML notation");
        }

        GlobalNote note = globalNoteRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(
                    "No globalNote with id " + id + " was found"
                )
            );

        note.setNoteColor(proposedNote.getNoteColor());
        note.setTitle(proposedNote.getTitle());
        note.setContent(proposedNote.getContent());

        GlobalNote savedNote = globalNoteRepository.save(note);

        SseController.notifyAllOfObject(SseMessageType.GLOBALNOTEUPDATED, savedNote);

        return ResponseEntity.ok(savedNote);
    }

    /**
     * Endpoint for deleting a globalNote.
     *
     * @param id The id of the node
     * @return The deleted note
     */
    @DeleteMapping("/{id}")
    ResponseEntity<GlobalNote> deleteGlobalNote(@PathVariable Long id) {
        GlobalNote note = globalNoteRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(
                    "No globalNote with id " + id + " was found"
                )
            );

        globalNoteRepository.delete(note);

        SseController.notifyAllOfObject(SseMessageType.GLOBALNOTEDELETED, note);

        return ResponseEntity.ok(note);
    }

    /**
     * Retrieves the repository ot this controller instance.
     *
     * @return The JPARepository used by this controller
     */
    @Override
    public GlobalNoteRepository getRepository() {
        return globalNoteRepository;
    }
}
