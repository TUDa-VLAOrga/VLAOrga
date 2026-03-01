package de.vlaorgatu.vlabackend.security.SecurityUtils;

import de.vlaorgatu.vlabackend.entities.vladb.User;

public interface SecurityUtils {
    boolean checkUserIsSessionUser(User user);
}
