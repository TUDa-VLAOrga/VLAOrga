package de.vlaorgatu.vlabackend.entities.vladb;

import de.vlaorgatu.vlabackend.UtilityFunctions;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

/**
 * Represents a note that is displayed for everyone to see in the frontend.
 */
@Getter
@Setter
@Entity
@Table(name = "globalNotes")
public class GlobalNote {
    /**
     * Unique identifier of an event.
     */
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;

    /**
     * The accent color of the note.
     * The format should follow the standard HTML notation with 7 characters
     * E.g #FF0000 for Red
     */
    @NonNull
    @Column(name = "noteColor", nullable = false)
    private String noteColor;

    /**
     * Represents the non-empty title of a global note.
     * At most 255 characters are allowed.
     */
    @NonNull
    @Column(name = "title", nullable = false)
    private String title;

    /**
     * Represents the textual content of a global note.
     * At most 4096 characters are allowed.
     */
    @NonNull
    @Column(name = "content", nullable = false, length = 4096)
    private String content;

    public boolean hasInvalidTitle(){
        return !this.title.isEmpty();
    }

    public boolean hasInvalidColor(){
        return UtilityFunctions.checkColorFormatHtml7CharsNotation(this.getNoteColor());
    }
}
