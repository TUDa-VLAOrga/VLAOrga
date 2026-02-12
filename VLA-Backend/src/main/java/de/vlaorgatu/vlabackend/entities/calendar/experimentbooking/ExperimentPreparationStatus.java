package de.vlaorgatu.vlabackend.entities.calendar.experimentbooking;

/**
 * Progress of an experiment preparation.
 */
public enum ExperimentPreparationStatus {
    /**
     * Preparation has not started yet.
     */
    PENDING,

    /**
     * Preparation in progress.
     */
    IN_PROGRESS,

    /**
     * Preparation finished. This experiment can be demonstrated.
     */
    FINISHED
}
