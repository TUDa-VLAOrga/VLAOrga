package de.vlaorgatu.vlabackend.linusconnection;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

/**
 * Represents a single appointment.
 */
@Getter
@Entity
@Table(name = "reservation")
public class LinusAppointment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * Linus user id.
     */
    @Column(name = "user_id")
    private Long linusUserId;

    /**
     * Date and time when the reservation of the appointment was made in linus.
     */
    @Column(name = "ordertime")
    private String orderTime;

    /**
     * Status of the appointment.
     */
    @Column(name = "status")
    private Long status;

    /**
     * Date and time when the appointment takes place.
     */
    @Column(name = "lecture_date")
    private String appointmentTime;

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
