package de.vlaorgatu.vlabackend.entities.vladb;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;
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
    @JsonIgnore
    @Column(name = "password")
    private String password;

    @Nullable
    @OneToMany
    @JsonBackReference
    @JsonIgnore
    private List<Appointment> appointments;
}
