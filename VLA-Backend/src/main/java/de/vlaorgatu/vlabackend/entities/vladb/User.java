package de.vlaorgatu.vlabackend.entities.vladb;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents a user in the system.
 */
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "users")
public class User {

    /**
     * Primary key.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Name of the user.
     */
    @Column(name = "name", unique = true, nullable = false)
    private String name;

    /**
     * Email address of the user.
     */
    @Column(name = "email", unique = true)
    private String email;

    /**
     * Represents the *hashed* password of the user.
     */
    @Column(name = "password")
    private String password;
}
