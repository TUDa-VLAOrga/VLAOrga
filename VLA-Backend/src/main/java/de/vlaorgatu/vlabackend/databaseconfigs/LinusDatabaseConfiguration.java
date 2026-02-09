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
    basePackages = "de.vlaorgatu.vlabackend.linusconnection",
    entityManagerFactoryRef = "linusEntityManagerFactory",
    transactionManagerRef = "linusTransactionManager")
public class LinusDatabaseConfiguration {
    @Bean
    @ConfigurationProperties("spring.datasource.linus")
    public DataSourceProperties linusDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    public DataSource linusDataSource() {
        return linusDataSourceProperties()
            .initializeDataSourceBuilder()
            .build();
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean linusEntityManagerFactory(
        @Qualifier("linusDataSource") DataSource dataSource,
        EntityManagerFactoryBuilder builder) {
        return builder
            .dataSource(dataSource)
            .packages("de.vlaorgatu.vlabackend.linusconnection")
            .build();
    }

    @Bean
    public PlatformTransactionManager linusTransactionManager(
        @Qualifier("linusEntityManagerFactory")
        LocalContainerEntityManagerFactoryBean linusEntityManagerFactory) {
        return new JpaTransactionManager(
            Objects.requireNonNull(linusEntityManagerFactory.getObject())
        );
    }
}