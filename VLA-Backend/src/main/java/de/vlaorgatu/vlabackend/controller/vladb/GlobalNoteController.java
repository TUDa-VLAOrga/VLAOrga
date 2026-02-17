package de.vlaorgatu.vlabackend.controller.vladb;

import de.vlaorgatu.vlabackend.entities.vladb.GlobalNote;
import de.vlaorgatu.vlabackend.exceptions.EntityNotFoundException;
import de.vlaorgatu.vlabackend.exceptions.InvalidColorParameterException;
import de.vlaorgatu.vlabackend.exceptions.InvalidParameterException;
import de.vlaorgatu.vlabackend.repositories.vladb.GlobalNoteRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/globalNotes")
public class GlobalNoteController {
    private final GlobalNoteRepository globalNoteRepository;

    @GetMapping
    ResponseEntity<List<GlobalNote>> getAllGlobalNotes(){
        return ResponseEntity.ok(globalNoteRepository.findAll());
    }

    @GetMapping("/{id}")
    ResponseEntity<GlobalNote> getGlobalNoteById(@PathVariable Long id){
        GlobalNote note = globalNoteRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(
                "No globalNote with id " + id + " was found"
            )
        );

        return ResponseEntity.ok(note);
    }

    @PostMapping
    ResponseEntity<GlobalNote> createGlobalNote(@RequestBody GlobalNote note){
        if(note.hasInvalidTitle())
            throw new InvalidParameterException("Note titles may not be empty");

        if(note.hasInvalidColor())
            throw new InvalidColorParameterException("Color does not match 7 char HTML notation");

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
        if(proposedNote.hasInvalidTitle())
            throw new InvalidParameterException("Note titles may not be empty");

        if(proposedNote.hasInvalidColor())
            throw new InvalidColorParameterException("Color does not match 7 char HTML notation");

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
}
