package de.vlaorgatu.vlabackend.controller.linusdb;

import de.vlaorgatu.vlabackend.entities.linusdb.LinusExperiment;
import de.vlaorgatu.vlabackend.repositories.linusdb.LinusExperimentRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/api/linusExperiments")
public class LinusExperimentController implements
    defaultGettingForReadonlyReposInterface<LinusExperiment, LinusExperimentRepository> {

    private LinusExperimentRepository linusExperimentRepository;

    @Override
    public LinusExperimentRepository getRepository() {
        return linusExperimentRepository;
    }
}
