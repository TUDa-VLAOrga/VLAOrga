package de.vlaorgatu.vlabackend.entities.linusdb;

import jakarta.annotation.Nullable;
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
// table and column names are taken from https://git.rwth-aachen.de/datenbank-physik/datenbank-physik/-/blob/master/src/Entity/Experiment.php
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
    @Column(name = "category_id", nullable = false)
    private int categoryId;

    /**
     * Name of the experiment.
     */
    @Column(name = "name", nullable = false)
    private String name;

    /**
     * Description of the experiment.
     */
    @Nullable
    @Column(name = "description")
    private String description;

    /**
     * Comment on the experiment.
     */
    @Nullable
    @Column(name = "comment")
    private String comment;

    /**
     * Preparation time of the experiment in minutes.
     */
    @Nullable
    @Column(name = "preparation_time")
    private Integer preparationTime;

    /**
     * Status of the experiment.
     */
    @Column(name = "status", nullable = false)
    private String status;

    /**
     * Execution time of the experiment in minutes.
     */
    @Nullable
    @Column(name = "execution_time")
    private Integer executionTime;

    /**
     * Safety signs of the experiment, json format.
     */
    @Nullable
    @Column(name = "safety_signs")
    private String safetySigns;

    /**
     * Number of the experiment.
     * Can be seen as the last Number of the path when navigating through linus.
     * Example: Experiment with id 124 "Magische Glühlampen" with path M.A.1.3 has number 3
     */
    @Column(name = "experiment_number", nullable = false)
    private int experimentNumber;
}
