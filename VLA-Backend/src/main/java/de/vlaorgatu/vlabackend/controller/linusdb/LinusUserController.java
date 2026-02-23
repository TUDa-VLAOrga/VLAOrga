package de.vlaorgatu.vlabackend.controller.linusdb;

import de.vlaorgatu.vlabackend.entities.linusdb.LinusUser;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusUserRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for retrieving {@link LinusUser}s.
 */
@AllArgsConstructor
@RestController
@RequestMapping("/api/linusUsers")
public class LinusUserController implements
    DefaultGettingForReadonlyReposInterface<LinusUser, LinusUserRepository> {

    /**
     * Repository containing all {@link LinusUser}s.
     */
    private LinusUserRepository linusUserRepository;

    /**
     * Retrieves the repository from the controller instance.
     *
     * @return The read-only repository used by the controller
     */
    @Override
    public LinusUserRepository getRepository() {
        return linusUserRepository;
    }
}
