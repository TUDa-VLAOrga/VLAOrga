package de.vlaorgatu.vlabackend;

import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.Type;
import lombok.AllArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;

/**
 * Main Application class.
 */
@AllArgsConstructor
@SpringBootApplication
public class VlaBackendApplication {

    /**
     * Necessary for exposing entity IDs in REST endpoints.
     * See Method {@link #repositoryRestConfigurer()} below.
     */
    private final EntityManager entityManager;

    /**
     * Run the spring boot application.
     *
     * @param args arguments passed through to the spring application.
     */
    public static void main(final String[] args) {
        System.out.println("Hello World!");
        SpringApplication.run(VlaBackendApplication.class, args);
    }

    /**
     * Exposes entity IDs in REST endpoints.
     */
    // TODO: move this method into a separate config class
    @Bean
    public RepositoryRestConfigurer repositoryRestConfigurer() {
        // source: https://stackoverflow.com/a/70604872
        return RepositoryRestConfigurer.withConfig(config -> config.exposeIdsFor(
            entityManager.getMetamodel().getEntities().stream().map(Type::getJavaType)
                .toArray(Class[]::new)));
    }

}

