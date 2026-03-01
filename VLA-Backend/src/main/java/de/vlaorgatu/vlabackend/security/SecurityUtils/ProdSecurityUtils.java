package de.vlaorgatu.vlabackend.security.SecurityUtils;

import de.vlaorgatu.vlabackend.entities.vladb.User;
import lombok.NoArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

@NoArgsConstructor
public class ProdSecurityUtils implements SecurityUtils {
    @Override
    public boolean checkUserIsSessionUser(User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        return userDetails.getUsername().equals(user.getId().toString());
    }
}
