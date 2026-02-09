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
     * Run the spring boot application.
     *
     * @param args arguments passed through to the spring application.
     */
    public static void main(final String[] args) {
        System.out.println("Hello World!");
        SpringApplication.run(VlaBackendApplication.class, args);
    }
}

