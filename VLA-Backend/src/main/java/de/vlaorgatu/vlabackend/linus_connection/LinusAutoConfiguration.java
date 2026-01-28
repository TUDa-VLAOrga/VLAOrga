package de.vlaorgatu.vlabackend.linus_connection;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import javax.sql.DataSource;


@Configuration
@EnableJpaRepositories(
        basePackages = "de.vlaorgatu.vlabackend.linus_connection",
        entityManagerFactoryRef = "linusEntityManagerFactory",
        transactionManagerRef = "linusTransactionManager")
public class LinusAutoConfiguration {
    @Bean (name = "linusDataSource")
    @ConfigurationProperties(prefix="spring.second-datasource")
    public DataSource linusDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean (name = "linusEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean linusEntityManager(@Qualifier("linusDataSource") DataSource dataSource) {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource);
        em.setPackagesToScan("de.vlaorgatu.vlabackend.linus_connection");
        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        em.setJpaVendorAdapter(vendorAdapter);
        return em;
    }

    @Bean (name = "linusTransactionManager")
    public PlatformTransactionManager linusTransactionManager(@Qualifier("linusEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}