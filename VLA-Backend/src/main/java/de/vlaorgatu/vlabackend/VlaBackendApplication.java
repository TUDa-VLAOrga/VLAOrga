package de.vlaorgatu.vlabackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Application class.
 */
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

