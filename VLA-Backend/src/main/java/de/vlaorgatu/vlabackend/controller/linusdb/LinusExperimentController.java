package de.vlaorgatu.vlabackend.controller.linusdb;

import de.vlaorgatu.vlabackend.entities.linusdb.LinusExperiment;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusExperimentRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for retrieving {@link LinusExperiment}s.
 */
@AllArgsConstructor
@RestController
@RequestMapping("/api/linusExperiments")
public class LinusExperimentController implements
    DefaultGettingForReadonlyReposInterface<LinusExperiment, LinusExperimentRepository> {

    /**
     * Repository containing all {@link LinusExperiment}s.
     */
    private LinusExperimentRepository linusExperimentRepository;

    /**
     * Retrieves the repository from the controller instance.
     *
     * @return The read-only repository used by the controller
     */
    @Override
    public LinusExperimentRepository getRepository() {
        return linusExperimentRepository;
    }
}
