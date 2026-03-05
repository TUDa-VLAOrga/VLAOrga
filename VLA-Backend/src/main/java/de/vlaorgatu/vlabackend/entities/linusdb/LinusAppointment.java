package de.vlaorgatu.vlabackend.entities.linusdb;

import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Represents a single appointment.
 */
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Entity
// table and column names are taken from https://git.rwth-aachen.de/datenbank-physik/datenbank-physik/-/blob/master/src/Entity/Reservation.php
// Integer is used for nullable columns and int for non-null ones.
@Table(name = "reservation")
public class LinusAppointment {
    /**
     * Primary key.
     */
    @Id
    private int id;

    /**
     * Linus user id.
     */
    // TODO: possible candidate for @JoinColumn
    @Column(name = "user_id")
    private int linusUserId;

    /**
     * Date and time when the reservation of the appointment was made in linus.
     */
    @Column(name = "ordertime")
    @Nullable
    private LocalDateTime orderTime;

    // TODO: enum for status?
    /**
     * Status of the appointment.
     */
    @Column(name = "status")
    private int status;

    /**
     * Date and time when the appointment takes place.
     */
    @Column(name = "lecture_date")
    @Nullable
    private LocalDateTime appointmentTime;

    /**
     * Comment from the linus order.
     */
    @Column(name = "comment")
    @Nullable
    private String comment;

    /**
     * Name of the person/lecture.
     */
    @Column(name = "name")
    @Nullable
    private String name;
}
