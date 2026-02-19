package de.vlaorgatu.vlabackend.entities.linusdb;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

/**
 * Represents a linus user.
 */
@Getter
@Entity
// table and column names are taken from https://git.rwth-aachen.de/datenbank-physik/datenbank-physik/-/blob/master/src/Entity/User.php
// Integer is used for nullable columns and int for non-null ones.
@Table(name = "user")
public class LinusUser {
    /**
     * Primary key.
     */
    @Id
    private int id;

    /**
     * Name of the user.
     */
    @Column(name = "name")
    private String name;

    /**
     * Roles of the user, json format.
     */
    @Column(name = "roles")
    private String roles;

    /**
     * Hashed Password of the user.
     */
    @Column(name = "password")
    private String password;

    /**
     * Email address of the user.
     */
    @Column(name = "email")
    private String email;
}
