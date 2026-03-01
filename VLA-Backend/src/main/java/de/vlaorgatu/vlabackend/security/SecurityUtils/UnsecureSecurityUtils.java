package de.vlaorgatu.vlabackend.security.SecurityUtils;

import de.vlaorgatu.vlabackend.entities.vladb.User;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class UnsecureSecurityUtils implements SecurityUtils {
    @Override
    public boolean checkUserIsSessionUser(User user) {
        return true;
    }
}
