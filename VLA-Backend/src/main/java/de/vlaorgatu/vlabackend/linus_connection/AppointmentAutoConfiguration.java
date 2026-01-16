package de.vlaorgatu.vlabackend.linus_connection;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import javax.sql.DataSource;

@Configuration
@PropertySource({"classpath:application.properties"})
@EnableJpaRepositories(
        basePackages = "de.vlaorgatu.vlabackend.linus_connection",
        entityManagerFactoryRef = "appointmentEntityManager",
        transactionManagerRef = "appointmentTransactionManager")
public class AppointmentAutoConfiguration {
    @Bean
    @ConfigurationProperties(prefix="spring.second-datasource")
    public DataSource productDataSource() {
        return DataSourceBuilder.create().build();
    }

    // productEntityManager bean

    // productTransactionManager bean
}
