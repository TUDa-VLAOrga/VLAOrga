package de.vlaorgatu.vlabackend.controller.vladb;

import de.vlaorgatu.vlabackend.entities.vladb.GlobalNote;
import de.vlaorgatu.vlabackend.exceptions.EntityNotFoundException;
import de.vlaorgatu.vlabackend.exceptions.InvalidParameterException;
import de.vlaorgatu.vlabackend.repositories.vladb.GlobalNoteRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@AllArgsConstructor
@RepositoryRestController
@RequestMapping("/global_notes")
public class GlobalNoteController {
    private final GlobalNoteRepository globalNoteRepository;

    @PostMapping
    ResponseEntity<GlobalNote> createGlobalNote(@RequestBody GlobalNote note){
        if(note.hasInvalidTitle())
            throw new InvalidParameterException("Note titles may not be empty");

        if(note.hasInvalidColor())
            throw new InvalidParameterException("Color does not match 7 char HTML notation");

        GlobalNote savedNote = globalNoteRepository.save(note);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedNote.getId())
                .toUri();

        return ResponseEntity.created(location).body(savedNote);
    }

    @PutMapping("/{id}")
    ResponseEntity<GlobalNote> updateGlobalNote(@PathVariable Long id, @RequestBody GlobalNote proposedNote){
        if(proposedNote.getId() == null){
            proposedNote.setId(id);
        }

        if(!proposedNote.getId().equals(id)) {
            throw new InvalidParameterException("Id mismatch between URL and proposed note id");
        }

        if(proposedNote.hasInvalidTitle())
            throw new InvalidParameterException("Note titles may not be empty");

        if(proposedNote.hasInvalidColor())
            throw new InvalidParameterException("Color does not match 7 char HTML notation");

        GlobalNote note = globalNoteRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(
                "No globalNote with id " + id + " was found"
            )
        );

        note.setNoteColor(proposedNote.getNoteColor());
        note.setTitle(proposedNote.getTitle());
        note.setContent(proposedNote.getContent());

        GlobalNote savedNote = globalNoteRepository.save(note);
        return ResponseEntity.ok(savedNote);
    }

    @DeleteMapping("/{id}")
    ResponseEntity<GlobalNote> deleteGlobalNote(@PathVariable Long id){
        GlobalNote note = globalNoteRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(
                        "No globalNote with id " + id + " was found"
                )
        );

        globalNoteRepository.delete(note);

        return ResponseEntity.ok(note);
    }
}
