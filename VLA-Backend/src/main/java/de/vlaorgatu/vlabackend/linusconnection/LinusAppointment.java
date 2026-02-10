package de.vlaorgatu.vlabackend.linusconnection;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;

/**
 * Represents a single appointment.
 */
@Getter
@Entity
// table and column names are taken from https://git.rwth-aachen.de/datenbank-physik/datenbank-physik/-/blob/master/src/Entity/Reservation.php
// Integer is used for nullable columns and int for non-null ones.
@Table(name = "reservation")
public class LinusAppointment {
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
    private LocalDateTime orderTime;

    // TODO: enum for status?
    /**
     * Status of the appointment.
     */
    @Column(name = "status")
    private Integer status;

    /**
     * Date and time when the appointment takes place.
     */
    @Column(name = "lecture_date")
    private LocalDateTime appointmentTime;

    /**
     * Comment from the linus order.
     */
    @Column(name = "comment")
    private String comment;

    /**
     * Name of the person/lecture.
     */
    @Column(name = "name")
    private String name;
}
