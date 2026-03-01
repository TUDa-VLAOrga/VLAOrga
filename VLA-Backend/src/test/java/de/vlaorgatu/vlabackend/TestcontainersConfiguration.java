package de.vlaorgatu.vlabackend;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.DynamicPropertyRegistrar;
import org.testcontainers.containers.MariaDBContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

@TestConfiguration(proxyBeanMethods = false)
class TestcontainersConfiguration {

    @Bean
    @ServiceConnection
    PostgreSQLContainer<?> postgresContainer() {
        return new PostgreSQLContainer<>(DockerImageName.parse("postgres:latest"));
    }

    @Bean
    @ServiceConnection
    MariaDBContainer<?> mariaDbContainer() {
        return new MariaDBContainer<>(DockerImageName.parse("mariadb:10.5.29"));
    }

    // TODO: move to config?
    @Bean
    public DynamicPropertyRegistrar databaseProperties(
        MariaDBContainer<?> mariadbContainer, PostgreSQLContainer<?> postgreSqlContainer) {
        return (properties) -> {
            // Connect our Spring application to our Testcontainers instances
            properties.add("spring.datasource.vla.url", postgreSqlContainer::getJdbcUrl);
            properties.add("spring.datasource.vla.username", postgreSqlContainer::getUsername);
            properties.add("spring.datasource.vla.password", postgreSqlContainer::getPassword);
            properties.add("spring.flyway.vla.url", postgreSqlContainer::getJdbcUrl);
            properties.add("spring.flyway.vla.user", postgreSqlContainer::getUsername);
            properties.add("spring.flyway.vla.password", postgreSqlContainer::getPassword);
            properties.add("spring.flyway.enabled", () -> true);

            properties.add("spring.datasource.linus.url", mariadbContainer::getJdbcUrl);
            properties.add("spring.datasource.linus.username", mariadbContainer::getUsername);
            properties.add("spring.datasource.linus.password", mariadbContainer::getPassword);

            // disable schema validation for tests
            // TODO: replace with insertion of linus dummy dataset
            properties.add("spring.jpa.hibernate.ddl-auto", () -> "update");
        };
    }
}
