package de.vlaorgatu.vlabackend.entities.linusdb;

import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;

/**
 * Represents a linus user.
 */
@Getter
@Entity
// table and column names are taken from a production SQL dump.
// Integer is used for nullable columns and int for non-null ones.
@Table(name = "accounts_user")
public class LinusUser {
    /**
     * Primary key.
     */
    @Id
    private int id;

    /**
     * Hashed Password of the user.
     */
    @Column(name = "password", nullable = false)
    private String password;

    /**
     * Username of the user.
     */
    @Column(name = "username", nullable = false, unique = true)
    private String name;

    /**
     * First name of the user.
     */
    @Column(name = "first_name", nullable = false)
    private String firstName;

    /**
     * Last name of the user.
     */
    @Column(name = "last_name", nullable = false)
    private String lastName;

    /**
     * Email address of the user.
     */
    @Column(name = "email", nullable = false)
    private String email;

    /**
     * Timestamp of the last login.
     */
    @Column(name = "last_login")
    @Nullable
    private LocalDateTime lastLogin;

    /**
     * Timestamp of account creation.
     */
    private LocalDateTime dateJoined;

    /**
     * Whether the user is a superuser.
     */
    @Column(name = "is_superuser", nullable = false)
    private boolean isSuperuser;

    /**
     * Whether the user is a staff member.
     */
    @Column(name = "is_staff", nullable = false)
    private boolean isStaff;

    /**
     * Whether this account is active.
     */
    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    /**
     * Foreign key to some labels_color table.
     */
    @Column(name = "color_id")
    @Nullable
    private Integer colorId;

    /**
     * Foreign key to some accounts_permissionpreset table.
     */
    @Column(name = "preset_id")
    @Nullable
    private Integer presetId;
}
