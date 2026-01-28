package de.vlaorgatu.vlabackend.user;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import javax.sql.DataSource;

@Configuration
@PropertySource({"classpath:application.properties"})
@EnableJpaRepositories(
        basePackages = "de.vlaorgatu.vlabackend.user",
        entityManagerFactoryRef = "userEntityManagerFactory",
        transactionManagerRef = "userTransactionManager")
public class UserAutoConfiguration {
    @Primary
    @Bean (name = "userDataSource")
    @ConfigurationProperties(prefix="spring.datasource")
    public DataSource userDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Primary
    @Bean (name = "userEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean userEntityManager(@Qualifier("userDataSource") DataSource dataSource) {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource);
        em.setPackagesToScan("de.vlaorgatu.vlabackend.user");
        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        em.setJpaVendorAdapter(vendorAdapter);
        return em;
    }

    @Primary
    @Bean (name = "userTransactionManager")
    public PlatformTransactionManager userTransactionManager(@Qualifier("userEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}

