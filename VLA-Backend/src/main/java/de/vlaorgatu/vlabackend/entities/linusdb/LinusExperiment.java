package de.vlaorgatu.vlabackend.entities.linusdb;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

/**
 * Represents a linus experiment.
 */
@Getter
@Entity
// table and column names are taken from https://git.rwth-aachen.de/datenbank-physik/datenbank-physik/-/blob/master/src/Entity/Reservation.php
// Integer is used for nullable columns and int for non-null ones.
@Table(name = "experiment")
public class LinusExperiment {
    /**
     * Primary key.
     */
    @Id
    private int id;

    /**
     * Category of the experiment.
     */
    @Column(name = "category_id")
    private int categoryId;

    /**
     * Name of the experiment.
     */
    @Column(name = "name")
    private String name;

    /**
     * Description of the experiment.
     */
    @Column(name = "description")
    private String description;

    /**
     * Comment on the experiment.
     */
    @Column(name = "comment")
    private String comment;

    /**
     * Preperation time of the experiment.
     */
    @Column(name = "preparation_time")
    private Integer preparationTime;

    /**
     * Status of the experiment.
     */
    @Column(name = "status")
    private String status;

    /**
     * Execution time of the experiment.
     */
    @Column(name = "execution_time")
    private Integer executionTime;

    /**
     * Safety signs of the experiment, json format.
     */
    @Column(name = "safety_signs")
    private String safetySigns;

    /**
     * Number of the experiment.
     */
    @Column(name = "experiment_number")
    private int experimentNumber;
}
