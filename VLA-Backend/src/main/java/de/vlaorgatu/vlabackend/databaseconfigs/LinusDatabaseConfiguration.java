package de.vlaorgatu.vlabackend.databaseconfigs;

import java.util.Objects;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Configuration for the linus_db.
 * Affects all repository classes in the package linusconnection.
 */
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
    basePackages = "de.vlaorgatu.vlabackend.linusconnection",
    entityManagerFactoryRef = "linusEntityManagerFactory",
    transactionManagerRef = "linusTransactionManager")
public class LinusDatabaseConfiguration {
    /**
     * Enables Configuration of linus via spring.datasource.linus.*.
     *
     * @return An object representing the configuration
     */
    @Bean
    @ConfigurationProperties("spring.datasource.linus")
    public DataSourceProperties linusDataSourceProperties() {
        return new DataSourceProperties();
    }

    /**
     * Creates the DataSource bean for linus.
     *
     * @return Datasource object representing the connection to the linus-db
     */
    @Bean
    public DataSource linusDataSource() {
        return linusDataSourceProperties()
            .initializeDataSourceBuilder()
            .build();
    }

    /**
     * Creates the Bean that manages Linus entity creation.
     *
     * @param dataSource The linus data source
     * @param builder    A factory builder (usually injected by the spring boot)
     * @return An object that manages entity creation
     */
    @Bean
    public LocalContainerEntityManagerFactoryBean linusEntityManagerFactory(
        @Qualifier("linusDataSource") DataSource dataSource,
        EntityManagerFactoryBuilder builder) {
        return builder
            .dataSource(dataSource)
            .packages("de.vlaorgatu.vlabackend.linusconnection")
            .build();
    }

    /**
     * Creates an object that manages transactional db interaction with the linus_db.
     *
     * @param linusEntityManagerFactory The factory that manages linus entites
     * @return Object that manages transactional interactions with linus_db
     */
    @Bean
    public PlatformTransactionManager linusTransactionManager(
        @Qualifier("linusEntityManagerFactory")
        LocalContainerEntityManagerFactoryBean linusEntityManagerFactory) {
        return new JpaTransactionManager(
            Objects.requireNonNull(linusEntityManagerFactory.getObject())
        );
    }
}
