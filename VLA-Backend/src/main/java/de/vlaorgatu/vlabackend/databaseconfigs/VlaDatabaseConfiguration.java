package de.vlaorgatu.vlabackend.databaseconfigs;

import jakarta.persistence.metamodel.Type;
import java.util.Objects;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Configuration for the postgres vla db.
 * Affects all repository classes in the package entities.
 */
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
    basePackages = "de.vlaorgatu.vlabackend.entities",
    entityManagerFactoryRef = "vlaEntityManagerFactory",
    transactionManagerRef = "vlaTransactionManager")
public class VlaDatabaseConfiguration {
    /**
     * Enables Configuration of vla via spring.datasource.vla.*.
     *
     * @return An object representing the configuration
     */
    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource.vla")
    public DataSourceProperties vlaDataSourceProperties() {
        return new DataSourceProperties();
    }

    /**
     * Creates the DataSource bean for the vla db.
     *
     * @return Datasource object representing the connection to the db of vla
     */
    @Bean
    @Primary
    public DataSource vlaDataSource() {
        return vlaDataSourceProperties()
            .initializeDataSourceBuilder()
            .build();
    }

    /**
     * Creates the Bean that manages VLA db entity creation.
     *
     * @param dataSource The vla db data source
     * @param builder    A factory builder (usually injected by the spring boot)
     * @return An object that manages entity creation
     */
    @Bean
    @Primary
    public LocalContainerEntityManagerFactoryBean vlaEntityManagerFactory(
        @Qualifier("vlaDataSource") DataSource dataSource,
        EntityManagerFactoryBuilder builder) {
        return builder
            .dataSource(dataSource)
            .packages("de.vlaorgatu.vlabackend.entities")
            .build();
    }

    /**
     * Creates an object that manages transactional db interaction with the vla db.
     *
     * @param vlaEntityManagerFactory The factory that manages db entites
     * @return Object that manages transactional interactions with the vla db
     */
    @Bean
    @Primary
    public PlatformTransactionManager vlaTransactionManager(
        @Qualifier("vlaEntityManagerFactory")
        LocalContainerEntityManagerFactoryBean vlaEntityManagerFactory) {
        return new JpaTransactionManager(
            Objects.requireNonNull(vlaEntityManagerFactory.getObject())
        );
    }


    /**
     * Exposes entity IDs in REST endpoints.
     */
    @Bean
    public RepositoryRestConfigurer repositoryRestConfigurer(
        @Qualifier("vlaEntityManagerFactory") LocalContainerEntityManagerFactoryBean entityManager
    ) {
        // source: https://stackoverflow.com/a/70604872
        return RepositoryRestConfigurer.withConfig(config -> {
            assert entityManager.getObject() != null;
            config.exposeIdsFor(
                entityManager.getObject().getMetamodel().getEntities().stream()
                    .map(Type::getJavaType).toArray(Class[]::new));
        });
    }
}

