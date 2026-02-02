package de.vlaorgatu.vlabackend.linusconnection;

import jakarta.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;


/**
 * Configuration for the linus-db. Affects all repository classes in the package.
 */
@Configuration
@EnableJpaRepositories(
        basePackages = "de.vlaorgatu.vlabackend.linusconnection",
        entityManagerFactoryRef = "linusEntityManagerFactory",
        transactionManagerRef = "linusTransactionManager")
public class LinusAutoConfiguration {
    /**
     * Constructs the datasource with the second-datasource configuration.
     */
    @Bean (name = "linusDataSource")
    @ConfigurationProperties(prefix = "spring.second-datasource")
    public DataSource linusDataSource() {
        return DataSourceBuilder.create().build();
    }

    /**
     * Constructs the EntityManagerFactory with the provided datasource.
     */
    @Bean (name = "linusEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean linusEntityManager(
            @Qualifier("linusDataSource") DataSource dataSource) {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource);
        em.setPackagesToScan("de.vlaorgatu.vlabackend.linus_connection");
        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        em.setJpaVendorAdapter(vendorAdapter);
        return em;
    }

    /**
     * Constructs the TransactionManager with the provided EntityManagerFactory.
     */
    @Bean (name = "linusTransactionManager")
    public PlatformTransactionManager linusTransactionManager(
            @Qualifier("linusEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}
