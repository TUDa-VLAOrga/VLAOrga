package de.vlaorgatu.vlabackend;

import org.springframework.boot.SpringApplication;

public class TestVlaBackendApplication {

    public static void main(String[] args) {
        SpringApplication.from(VlaBackendApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}
