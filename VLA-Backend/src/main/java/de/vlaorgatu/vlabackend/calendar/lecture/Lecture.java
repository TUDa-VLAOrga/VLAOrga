package de.vlaorgatu.vlabackend.calendar.lecture;

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
@Table(name = "lectures")
class Lecture {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * title of the lecture, e.g. "Physik I"
     */
    @Column(name = "title")
    private String title;

    /**
     * semester of the lecture, e.g. "WS 25/26"
     */
    @Column(name = "semester")
    private String semester;

    /**
     * Color to represent appointments in the calendar view, RGB string.
     */
    @Column(name = "color")
    private String color;

    // getters and setters

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
