package de.vlaorgatu.vlabackend;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;

import de.vlaorgatu.vlabackend.model.User;
import de.vlaorgatu.vlabackend.repository.UserRepository;

@SpringBootApplication
public class VlaBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(VlaBackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner init(UserRepository userRepository, Environment env) {
        return args -> {
            if (userRepository.count() == 0) { // Only create admin user if no users exist

                String email = env.getProperty("VLA_ADMIN_EMAIL");
                String password = env.getProperty("VLA_ADMIN_PASSWORD");

                if (password == null) {
                    throw new IllegalStateException("VLA_ADMIN_PASSWORD must be set");
                }

                User user = new User();
                user.setEmail(email);
                user.setPassword(password);
                userRepository.save(user);

            }
        };
    }


}
