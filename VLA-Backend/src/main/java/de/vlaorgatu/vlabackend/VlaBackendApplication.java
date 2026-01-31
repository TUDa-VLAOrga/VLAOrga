package de.vlaorgatu.vlabackend;

import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.Type;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;

/**
 * Main Application class.
 */
@SpringBootApplication
public class VlaBackendApplication {

    private final EntityManager entityManager;

    /**
     * Constructor.
     *
     * @param entityManager needed for exposing entity IDs in REST endpoints,
     *                     see {@link #repositoryRestConfigurer()}
     */
    public VlaBackendApplication(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

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
    @Bean
    public RepositoryRestConfigurer repositoryRestConfigurer() {
        return RepositoryRestConfigurer.withConfig(config -> config.exposeIdsFor(
            entityManager.getMetamodel().getEntities().stream().map(Type::getJavaType)
                .toArray(Class[]::new)));
    }

}

