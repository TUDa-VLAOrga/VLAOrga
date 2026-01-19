package de.vlaorgatu.vlabackend.calendar.person;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a person, that e.g. holds a lecture, in our calendar.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor(force = true)
@Entity
@Table(name = "personas")
public class Person {
    /**
     * Primary key.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * Personal notes, specifying e.g. equipment preferences of this lecturer.
     */
    @Column(name = "notes", nullable = false)
    private String notes = "";

    /**
     * ID of this user in Linus, if a corresponding user exists there.
     */
    @Column(name = "linus_user_id")
    private Long linusUserId;
}
