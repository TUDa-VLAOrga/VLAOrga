package de.vlaorgatu.vlabackend.entities;

import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.metamodel.Type;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

/**
 * Configuration for the postgres db. Affects all repository classes in the package.
 */
@Configuration
@EnableJpaRepositories(
        basePackages = "de.vlaorgatu.vlabackend.entities",
        entityManagerFactoryRef = "entitiesEntityManagerFactory",
        transactionManagerRef = "entitiesTransactionManager")
public class EntityAutoConfiguration {
    /**
     * Constructs the datasource with the (first) datasource configuration.
     */
    @Primary
    @Bean (name = "entitiesDataSource")
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource entitiesDataSource() {
        return DataSourceBuilder.create().build();
    }

    /**
     * Constructs the EntityManagerFactory with the provided datasource.
     */
    @Primary
    @Bean (name = "entitiesEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean entitiesEntityManager(
            @Qualifier("entitiesDataSource") DataSource dataSource) {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource);
        em.setPackagesToScan("de.vlaorgatu.vlabackend.entities");
        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        em.setJpaVendorAdapter(vendorAdapter);
        return em;
    }

    /**
     * Constructs the TransactionManager with the provided EntityManagerFactory.
     */
    @Primary
    @Bean (name = "entitiesTransactionManager")
    public PlatformTransactionManager entitiesTransactionManager(
            @Qualifier("entitiesEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }

    /**
     * Exposes entity IDs in REST endpoints.
     */
    @Bean
    public RepositoryRestConfigurer repositoryRestConfigurer(
        @Qualifier("entitiesEntityManagerFactory") EntityManagerFactory entityManager
    ) {
        // source: https://stackoverflow.com/a/70604872
        return RepositoryRestConfigurer.withConfig(config -> config.exposeIdsFor(
            entityManager.getMetamodel().getEntities().stream().map(Type::getJavaType)
                .toArray(Class[]::new)));
    }
}

