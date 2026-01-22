package de.vlaorgatu.vlabackend.linus_connection;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import java.util.HashMap;

@Configuration
@PropertySource({"classpath:application.properties"})
@EnableJpaRepositories(
        basePackages = "de.vlaorgatu.vlabackend.linus_connection",
        entityManagerFactoryRef = "linusAppointmentEntityManager",
        transactionManagerRef = "linusAppointmentTransactionManager")
public class LinusAppointmentAutoConfiguration {
    /*@Autowired
    private Environment env;*/

    @Bean
    @ConfigurationProperties(prefix="spring.second-datasource")
    public DataSource linusAppointmentDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean linusAppointmentEntityManager() {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(linusAppointmentDataSource());
        //stuff from the tutorial https://www.baeldung.com/spring-data-jpa-multiple-databases that I think is optional
        /*HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        em.setJpaVendorAdapter(vendorAdapter);
        HashMap<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", env.getProperty("hibernate.hbm2ddl.auto"));
        properties.put("hibernate.dialect", env.getProperty("hibernate.dialect"));
        em.setJpaPropertyMap(properties);*/
        return em;
    }

    @Bean
    public PlatformTransactionManager linusAppointmentTransactionManager() {
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(linusAppointmentEntityManager().getObject());
        return transactionManager;
    }
}
