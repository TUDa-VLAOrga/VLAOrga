package de.vlaorgatu.vlabackend.linus_connection;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Represents a lecture in a certain semester. For example "Physik I, WS 25/26".
 */
@Entity
@Table(name = "reservation")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * linus-user id
     */
    @Column(name = "user_id")
    private Long user_id;

    /**
     * time when the reservation of the appointment was made in linus
     */
    @Column(name = "ordertime")
    private String ordertime;

    /**
     * status of the appointment
     */
    @Column(name = "status")
    private Long status;

    /**
     * Linus-user id
     */
    @Column(name = "lecture_date")
    private String date_time; //todo datentyp

    /**
     * comment from the linus order
     */
    @Column(name = "comment")
    private String comment;

    /**
     * todo
     */
    @Column(name = "name")
    private String name;

    //getters and setters

    public Long getId() {
        return id;
    }

    public Long getUser_id() {
        return user_id;
    }

    public String getOrdertime() {
        return ordertime;
    }

    public Long getStatus() {
        return status;
    }

    public String getDate_time() {
        return date_time;
    }

    public String getName() {
        return name;
    }

    public String getComment() {
        return comment;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    public void setOrdertime(String ordertime) {
        this.ordertime = ordertime;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public void setDate_time(String date_time) {
        this.date_time = date_time;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public void setName(String name) {
        this.name = name;
    }
}
