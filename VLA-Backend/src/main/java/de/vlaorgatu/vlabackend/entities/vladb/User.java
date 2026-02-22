package de.vlaorgatu.vlabackend.entities.vladb;

import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Represents a user in the system.
 */
@Setter
@Getter
@Entity
@Table(name = "users")
public class User {

    /**
     * Primary key.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * Name of the user.
     */
    @Column(name = "name", nullable = false)
    private String name;

    /**
     * Email address of the user.
     */
    @Nullable
    @Column(name = "email")
    private String email;
}
