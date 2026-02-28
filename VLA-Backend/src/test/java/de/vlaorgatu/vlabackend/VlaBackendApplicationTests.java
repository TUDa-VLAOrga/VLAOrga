package de.vlaorgatu.vlabackend;

import com.fasterxml.jackson.core.JsonProcessingException;
import de.vlaorgatu.vlabackend.controller.sse.SseController;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class VlaBackendApplicationTests {

    @Test
    void contextLoads() {
    }

    @Test
    void sseReturnTimeFormat() throws JsonProcessingException {
        String converted = SseController.convertObjectToJson(LocalDateTime.of(
            2026,
            3,
            1,
            12,
            34,
            56)
        );

        Assertions.assertEquals("\"2026-03-01T12:34:56\"", converted);
    }
}
