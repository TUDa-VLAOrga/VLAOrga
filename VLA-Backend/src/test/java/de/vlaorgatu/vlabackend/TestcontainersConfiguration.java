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

    @Bean
    public DynamicPropertyRegistrar databaseProperties(
            MariaDBContainer<?> mariadbContainer, PostgreSQLContainer<?> postgreSqlContainer) {
        return (properties) -> {
            // Connect our Spring application to our Testcontainers instances
            properties.add("spring.second-datasource.jdbcUrl", mariadbContainer::getJdbcUrl);
            properties.add("spring.second-datasource.username", mariadbContainer::getUsername);
            properties.add("spring.second-datasource.password", mariadbContainer::getPassword);
            properties.add("spring.datasource.jdbcUrl", postgreSqlContainer::getJdbcUrl);
            properties.add("spring.datasource.username", postgreSqlContainer::getUsername);
            properties.add("spring.datasource.password", postgreSqlContainer::getPassword);
        };
    }
}
