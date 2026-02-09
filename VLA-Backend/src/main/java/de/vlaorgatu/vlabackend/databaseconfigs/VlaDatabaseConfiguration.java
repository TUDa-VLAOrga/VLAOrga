package de.vlaorgatu.vlabackend.databaseconfigs;

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
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Configuration for the postgres db. Affects all repository classes in the package.
 */
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
    basePackages = "de.vlaorgatu.vlabackend.entities",
    entityManagerFactoryRef = "vlaEntityManagerFactory",
    transactionManagerRef = "vlaTransactionManager")
public class VlaDatabaseConfiguration {
    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource.vla")
    public DataSourceProperties vlaDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    @Primary
    public DataSource vlaDataSource() {
        return vlaDataSourceProperties()
            .initializeDataSourceBuilder()
            .build();
    }

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

    @Bean
    @Primary
    public PlatformTransactionManager vlaTransactionManager(
        @Qualifier("vlaEntityManagerFactory")
        LocalContainerEntityManagerFactoryBean vlaEntityManagerFactory) {
        return new JpaTransactionManager(
            Objects.requireNonNull(vlaEntityManagerFactory.getObject())
        );
    }
}

