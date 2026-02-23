package de.vlaorgatu.vlabackend.controller.linusdb;

import de.vlaorgatu.vlabackend.entities.linusdb.LinusUser;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusUserRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/api/linusUsers")
public class LinusUserController implements
    defaultGettingForReadonlyReposInterface<LinusUser, LinusUserRepository> {

    private LinusUserRepository linusUserRepository;

    @Override
    public LinusUserRepository getRepository() {
        return linusUserRepository;
    }
}
